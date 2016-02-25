var channel = "twitchplayspokemon";
pico.load("messages", function(module){
     module.getCurrentChats(channel);
});
var emoticons = [];

// getting twitch and bttv emoticons
getEmoticons();

function getEmoticons() {
  $.getJSON("https://api.twitch.tv/kraken/chat/emoticon_images").done(
    function( data ) {
      if ( "emoticons" in data ) {
          for (var i in data.emoticons) {
          emoticons[data.emoticons[i].code] = 'http://static-cdn.jtvnw.net/emoticons/v1/'+data.emoticons[i].id+'/1.0';
        }
      }
      else {
        setTimeout( function() { getEmoticons(); }, 5*1000 );
      }
    }
  );

}

function writeEmoticons( message ) {
  var output = "";
  var text = message.split(" ");
  // for each word, check if it's an emoticon and if it is, output the url instead of the text
  for( var i = 0; i < text.length; i++ ) {
    var word = text[i];
    if ( emoticons[word] ) {
      output += '<span style="display: none;">'+word+'</span><img src='+emoticons[word]+' data-emoticon='+word+'>';
    }
    else {
      if(i == 0) {
        output += word;
      } else {
        output += ' '+word;
      }
      
    }
  }

  return output;
}

var chatsLink = 'https://j0n89v2391.firebaseio.com/' + channel;
var wordsLink = 'https://freq-word-cnt.firebaseio.com/'+ channel;
var chats = new Firebase(chatsLink);
var rankedWords = new Firebase(wordsLink);
var numOfMessages = 200;
var messages = [];
var selectedName;
var options = {
 width: 800,
 height: 500,
 channel: channel, 
 //video: "{VIDEO_ID}"       
};
var player = new Twitch.Player("video", options);
player.setVolume(0.5);


$(document).ready(function() {
  $.getJSON("../json/extracted_streams.json", function(obj) {
    $.each(obj.streams, function(key, value){
      $("#dropDownNames").append($('<option></option>').val(value.name).html(value.displayName)); 
    })
  });

  $('#dropDownNames').change(function () {
    selectedName = $(this).val();
    link = "http://www.twitch.tv/"+selectedName+"/chat";
    $("#chat").attr("src", link);
    player.setChannel(selectedName);
  });
  
  var max = 0;
  var counter = 0;
  rankedWords.limitToFirst(trend_count).on('child_added', function(snapShot) { 
      var rankedList = $('#trends');
      
      if (counter == trend_count){
        counter = 0;
        $("#trends li").remove();
      }
      //GET DATA
      var data = snapShot.val();
      var word = data.word;
      var count = data.count;
      
      if (count > max) {
        max = count;
      }

      var percentage = (parseInt(count) / max) * 100;
      var transformedMessage = "<li style=\"width:" + percentage + "%;\" class=\"trend\">" + writeEmoticons(word) + "</li>";

      //ADD message
      rankedList.append(transformedMessage)

      //SCROLL TO BOTTOM OF MESSAGE LIST
      rankedList[0].scrollTop = rankedList[0].scrollHeight;
      counter++;
  });
  
  // Add a callback that is triggered for each chat message.
  chats.limitToLast(numOfMessages).on('child_added', function (snapShot) {
    var messageList = $('#long-tails');
    //GET DATA
    var data = snapShot.val();
    var message = data.message;
  
    var transformedMessage = "<div class=\"spacer\"></div><li class=\"message\">" + writeEmoticons(message) + "</li>";

    //ADD message
    messageList.append(transformedMessage)

    //SCROLL TO BOTTOM OF MESSAGE LIST
    messageList[0].scrollTop = messageList[0].scrollHeight;
    messages.push(message);
  });


  var currentFilter = '';

  $("#trends li").live('click', function(){
    $(".trend").removeClass("active");
    if(currentFilter == $(this).text() || currentFilter == $(this).find('img').data("emoticon")) {
      $("#long-tails li").show();
    } else {
      if ($(this).find('img').length) {
        currentFilter = $(this).find('img').data("emoticon");
      } else {
        currentFilter = $(this).text();
      }
      $(this).addClass("active");
      var regExp = new RegExp(currentFilter);

      $("#long-tails li").each( function() {
        var sentence = $(this).html();
        if(regExp.test(sentence)){
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    }
  });
}); 
/* Thanks Simen Echholt for alsoResizeReverse! http://stackoverflow.com/a/3371412 */
$.ui.plugin.add("resizable", "alsoResizeReverse", {

    start: function() {
        var that = $(this).resizable( "instance" ),
            o = that.options;

        $(o.alsoResizeReverse).each(function() {
            var el = $(this);
            el.data("ui-resizable-alsoresizeReverse", {
                width: parseInt(el.width(), 10), height: parseInt(el.height(), 10),
                left: parseInt(el.css("left"), 10), top: parseInt(el.css("top"), 10)
            });
        });
    },

    resize: function(event, ui) {
        var that = $(this).resizable( "instance" ),
            o = that.options,
            os = that.originalSize,
            op = that.originalPosition,
            delta = {
                height: (that.size.height - os.height) || 0,
                width: (that.size.width - os.width) || 0,
                top: (that.position.top - op.top) || 0,
                left: (that.position.left - op.left) || 0
            };

        $(o.alsoResizeReverse).each(function() {
            var el = $(this), start = $(this).data("ui-resizable-alsoresize-reverse"), style = {},
                css = el.parents(ui.originalElement[0]).length ?
                    [ "width", "height" ] :
                    [ "width", "height", "top", "left" ];

            $.each(css, function(i, prop) {
                var sum = (start[prop] || 0) - (delta[prop] || 0);
                if (sum && sum >= 0) {
                    style[prop] = sum || null;
                }
            });

            el.css(style);
        });
    },

    stop: function() {
        $(this).removeData("resizable-alsoresize-reverse");
    }
});

var trend_height = 36,
    trend_count = 10,
    divider_height = 6;

$(function() {
  $( "#topsection" ).resizable({
    alsoResizeReverse: "#botsection",
    containment: "parent",
    grid: trend_height,
    handles: {'s': $("#divider")},
    stop: function(event, ui) {
      trend_count = ui.size.height / trend_height;
      console.log(ui.size.height / trend_height);
    }
  });
});

$(function() {
  $( "#botsection" ).resizable({
    containment: "parent",
    grid: trend_height,
    handles: ""
  });
});

$("#topsection").css({
  height: trend_count * trend_height + "px"
});

$(function() {
  $(".trend").css({
    height: trend_height - 10 + "px",
    lineHeight: trend_height - 10 + "px"
  });
  console.log($(".trend").css("lineHeight"));
});

$("#divider").css({
  height: divider_height + "px"
});

var topsection_height = $("#topsection").css("height"),
    divider_height = $("#divider").css("height");

$("#botsection").css({
  height: "calc(100vh - " + topsection_height + " - " + divider_height + ")"
});

$(window).resize(function() {
  topsection_height = $("#topsection").css("height");
  divider_height = $("#divider").css("height");
  $("#botsection").css({
    height: "calc(100vh - " + topsection_height + " - " + divider_height + ")"
  });
});

// $(".spacer").insertBefore(".message");


// when a new message is received
  // add the message to the DOM
  // calculate trends
  // update trend bar length
  // filter messages


// when bar is adjusted
  // remove/display trends

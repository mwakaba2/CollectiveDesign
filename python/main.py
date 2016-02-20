# Citation
# Source code: http://www.wituz.com/tutorial-make-your-own-twitch-plays-stream.html


#Define the imports
import twitch
t = twitch.Twitch();

#Enter your twitch username and oauth-key below, and the app connects to twitch with the details.
#Your oauth-key can be generated at http://twitchapps.com/tmi/
username = "mgw917";
key = "oauth:edcnnrpfb9j4xi3l5twrxj26g3qai4";
channel = "geekygoonsquad";
t.twitch_connect(username, key, channel);

#The main loop
while True:
    #Check for new mesasages
    new_messages = t.twitch_recieve_messages();

    if not new_messages:
        #No new messages...
        continue
    else:
        for message in new_messages:
            #Wuhu we got a message. Let's extract some details from it
            msg = message['message'].lower()
            username = message['username'].lower()
            print(username + ": " + msg);
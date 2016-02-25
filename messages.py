# Citation
# Source code: http://www.wituz.com/tutorial-make-your-own-twitch-plays-stream.html
import pico
from firebase import firebase
import twitch
import query

database_link = "https://j0n89v2391.firebaseio.com/"
fb = firebase.FirebaseApplication(database_link, None)

def getCurrentChats(channel):
    #Enter your twitch username and oauth-key below, and the app connects to twitch with the details.
    #Your oauth-key can be generated at http://twitchapps.com/tmi/
    username = "Snowager"
    key = "oauth:i8toc6nn173v4kxneqh2cup0563dbk"
    t = twitch.Twitch()
    t.twitch_connect(username, key, channel)
    #The main loop
    count = 0
    while True:
    #Check for new mesasages
        new_messages = t.twitch_recieve_messages()

        if count == 50:
            count = 0
            query.retrieveAndCount(channel, None)

        if not new_messages:
            #No new messages...
            continue
        else:
            for message in new_messages:
                #Wuhu we got a message. Let's extract some details from it
                msg = message['message']
                username = message['username']
                
                result = fb.post(
                    channel,
                    {   
                        "name": username,
                        "message": msg,
                    })

                
                print "%s inserted to database" % msg
        count += 1

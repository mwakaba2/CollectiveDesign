# Citation
# Source code: http://www.wituz.com/tutorial-make-your-own-twitch-plays-stream.html
import re
from firebase import firebase

#Enter your twitch username and oauth-key below, and the app connects to twitch with the details.
#Your oauth-key can be generated at http://twitchapps.com/tmi/

word_dict = {}

firebase = firebase.FirebaseApplication('https://j0n89v2391.firebaseio.com/', None)
chat_result = firebase.get('/geekygoonsquad', None)
print len(chat_result)
# read_lines = 100
for elem in chat_result:
	# if read_lines < 0:
	# 	break
	# read_lines-=1
	q1 = firebase.get('/geekygoonsquad', elem)
	print q1['message']

	counted = False
	# for w in q1['message'].split():
	test_string = ":D Hey this is a test!!!! "
	# print re.split("(\W+)", test_string)
	# print re.split("[\W+']+|[.,!?;]", test_string)
	print re.findall(r"[\w']+|[.,!?;]", test_string)
	for w in test_string:

		if w not in word_dict:
			word_dict[w] =1
		else:
			if (not counted):
				word_dict[w] +=1
		counted = True
	break

print
print "======Cnt======"
word_freq_list = sorted(word_dict, key = word_dict.get) 
for elem in word_freq_list:
	print elem, word_dict[elem]
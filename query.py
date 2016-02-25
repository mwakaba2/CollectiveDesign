# Citation
# Source code: http://www.wituz.com/tutorial-make-your-own-twitch-plays-stream.html
import re
from firebase import firebase
import Queue

def doCount(stream_array):
	word_dict = {}

	while not stream_array.empty():
		msg = stream_array.get()
		# print "msg: ", msg
		counted = False
		# for w in q1['message'].split():
		# test_string = ":D Hey this is a test!!!! "
		# test_string = re.split("(\W+)", msg)
		test_string = msg.split()
		
		# print re.split("^[':D'](\W+)", test_string)

		# print re.split("[\W+']+|[.,!?;]", test_string)
		# print re.findall(r"[\w']+|[.,!?;]", test_string)
		for w in test_string:
			# if ' ' or '\t' in w:
			# 	continue

			if w not in word_dict:
				word_dict[w] =1
			else:
				if (not counted):
					word_dict[w] +=1
			counted = True
	# break
	return word_dict

def retrieveAndCount():
	firebaseGet = firebase.FirebaseApplication('https://j0n89v2391.firebaseio.com/', None)
	all_chat_result = firebaseGet.get('/geekygoonsquad_large/', None)

	print "No of result:", len(all_chat_result)
	# print all_chat_result
	# read_lines = 100
	for chat_id in all_chat_result:
		# if read_lines < 0:
		# 	break
		# read_lines-=1
		msg = all_chat_result[chat_id]['message']
		# print "msg here:", msg
		stream_array.put(msg)
		if stream_array.full():
			print "Queue is full!!!"
			word_dict = doCount(stream_array)
			saveToDB("geekygoonsquad_large", word_dict)
			# break


def saveToDB(channel, word_dict, topK = 20):
	firebasePost = firebase.FirebaseApplication('https://freq-word-cnt.firebaseio.com/', None)
	firebasePost.delete(channel, None)
	word_freq_list = sorted(word_dict, key = word_dict.get, reverse = True) 
	print "============================"
	print "Top %d words", topK
	for elem in word_freq_list[0:topK]:
		print elem, word_dict[elem]
		result = firebasePost.post(
			channel,
			{   
				"word": elem,
				"count": word_dict[elem],
			})
        # print "%s inserted to database" % result
		# print "%s inserted to database" % result

def main():
	word_dict = retrieveAndCount()
	# saveToDB("geekygoonsquad_large", word_dict)
	# print
	# print "======Cnt======"
	# word_freq_list = sorted(word_dict, key = word_dict.get, reverse = False) 
	# for elem in word_freq_list:
	# 	print elem, word_dict[elem]

stream_array = Queue.Queue(500)
main()




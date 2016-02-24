import json

# Reading data
with open('../json/raw_featured_streams.json', 'r') as f:
	data = json.load(f)
	streamsDict = {}
	listOfNames = []
	featured_streams = data["featured"]

	for featured in featured_streams:
		featureDict = {}
		displayName = featured["stream"]["channel"]["display_name"]
		name = featured["stream"]["channel"]["name"]

		featureDict["displayName"] = displayName
		featureDict["name"] = name
		listOfNames.append(featureDict)
    
	streamsDict["streams"] = listOfNames
	with open('../json/extracted_streams.json', 'w') as f:
		json.dump(streamsDict, f)

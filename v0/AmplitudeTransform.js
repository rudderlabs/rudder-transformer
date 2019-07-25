//Library references
var jsonQ = require('jsonq');
var fs = require('fs');
var http = require('http');
var qs = require('querystring');


//Load and parse configurations for different messages

var identifyConfigFile = fs.readFileSync('data/AmplitudeIdentifyConfig.json');
var identifyConfigJson = JSON.parse(identifyConfigFile);

var pageConfigFile = fs.readFileSync('data/AmplitudePageConfig.json');
var pageConfigJson = JSON.parse(pageConfigFile);

var screenConfigFile = fs.readFileSync('data/AmplitudeScreenConfig.json');
var screenConfigJson = JSON.parse(screenConfigFile);

var promotionViewedConfigFile = fs.readFileSync('data/AmplitudePromotionViewedConfig.json');
var promotionViewedConfigJson = JSON.parse(promotionViewedConfigFile);


var promotionClickedConfigFile = fs.readFileSync('data/AmplitudePromotionClickedConfig.json');
var promotionClickedConfigJson = JSON.parse(promotionClickedConfigFile);

var productActionsConfigFile 
= fs.readFileSync('data/AmplitudeProductActionsConfig.json');
var productActionsConfigJson = JSON.parse(productActionsConfigFile);

//Load customer credentials
var customerCredentialsConfig = fs.readFileSync('data/AmplitudeCredentialsConfig.json');
var customerCredentialsConfigJson = JSON.parse(customerCredentialsConfig);

//Helper function for generating desired JSON from Map
const mapToObj = m => {
	return Array.from(m).reduce((obj, [key, value]) => {
	  obj[key] = value;
	  return obj;
	}, {});
  };

//Build response for Amplitude. In this case, endpoint will be different depending 
//on the event type being sent to Amplitude 
//Also, the payload will be a complex JSON and not just key-value pairs
function responseBuilderSimple (parameterMap, rootElementName, jsonQobj, amplitudeEventType, mappingJson, credsJson){
	
	//Create a final map to be used for response and populate the static parts first
	var responseMap = new Map();	
	responseMap.set("request-format","PARAMS");

	//User Id for internal routing purpose needs to be set
	var anonId = jsonQobj.find("rl_anonymous_id");
	anonId.each(function (index, path, value){
		responseMap.set("user_id", String(value));
	});

	
	//Amplitude HTTP API calls take two parameters
	//First one is a api_key and the second one is a complete JSON
	jsonQ.each(credsJson, function(key,value){
		parameterMap.set("api_key",String(value));
	});

	//We would need to maintain a map of RHS objects in order to 
	//be able to add properties to the same without ending up with
	//multiple objects of same type
	var objMap = new Map(); 

	//Add fixed-logic fields to objMap
	var libraryName = jsonQobj.find("rl_library").find("rl_name");

	libraryName.each(function(index, path, value){
		objMap.set("platform",String(value).split(".")[2]);
	});


	jsonQ.each(mappingJson, function(sourceKey, destinationKey){
		console.log(destinationKey);
		//Reset reference point to root
		var tempObj = jsonQobj.find('rl_context').parent();

		//console.log(tempObj.length)

		var pathElements = sourceKey.split('.');
		//console.log(loopCounter++);

		//Now take each path element and traverse the structure
		for (var i=0; i<pathElements.length; i++) {
			//console.log(pathElements[i]);
			tempObj = tempObj.find(pathElements[i]);	
		}

		
		//Once the entry for the source key has been found, the value needs to be mapped 
		//to the destination key

		//There might be multiple entries for multiple levels of the same structure
		//or for multiple elements at same level in the structure. Hence the root
		//should be initialized outside
		var rootObj = {};
				
		tempObj.each(function (index, path, value){
			//Destination key can also be part of a structure
			var destinationPathElements = destinationKey.split('.');
			//Construct the object hierarchy, checking for existence at each step
			var parent = {};
	
			//to be directly added to root level
			if (destinationPathElements.length<2){ 

				objMap.set(destinationPathElements[0],value);

			} else { //multi-level hierarchy

				for (var level=0; level<destinationPathElements.length; level++){
				
					//Now there can be 3 situations - the root, intermediate branch, 
					//or leaf. If root, check if the root object exists, else create
					//if branch, check if root object has the branch, else add
					//for leaf - check if penultimate branch has leaf, else add
					
					switch(level){
						case 0: //root
							var tmp = objMap.get(destinationPathElements[0]);
							
							if (!tmp){ //root itself does not exist
								rootObj = {};
								objMap.set(destinationPathElements[0],rootObj);
								parent = rootObj; //for next calls
						
							} else { //root exits, set parent to root
								parent = tmp;
						
							}
							break;
						case destinationPathElements.length-1: //leaf
							
							//leaf will have value
							parent[destinationPathElements[level]]=value;
							break;
						default: //all other cases, i.e. intermediate branches
							//however this needs to be skipped for a.b cases
							if (destinationPathElements.length>2){
								var tmp = parent[destinationPathElements[level]];
								if (!tmp){ //level does not exists
						
									branchObj = {};
									parent[destinationPathElements[level]] = branchObj;
									parent = branchObj;
								} else {
						
									parent = tmp;
								}
			
							}
							
							break;
		
					}
					
				}
			}

		});
		
	});
	

	switch (amplitudeEventType){
		case "identify":
			responseMap.set("endpoint","https://api.amplitude.com/identify");
			break;
		default:
			responseMap.set("endpoint","https://api.amplitude.com/httpapi");
			objMap.set("event_type",amplitudeEventType);
			objMap.set("time",new Date(String(jsonQobj.find("rl_timestamp").value())).getTime());
			break;	
	}

	//Now add the entire object map to the parameter map against 
	//the designated root element name
	parameterMap.set(rootElementName, encodeURI(JSON.stringify(mapToObj(objMap))));

	//Assign parameter map against payload key
	responseMap.set("payload",mapToObj(parameterMap));

	//Convert response map to JSON
	var responseJson = JSON.stringify(mapToObj(responseMap));

	var events = []
	events.push(responseJson);
	return events;
}



//Generic process function which invokes specific handler functions depending on message type
//and event type where applicable
function processSingleMessage(jsonQobj){

	var parameterMap = new Map(); //map for holding reqwuest parameters
	var payloadObjectName = "";
	var configJson;
	var amplitudeEventType = "";
	var error = false;

	var events = []; //placeholder for events returned
	//Route to appropriate process depending on type of message received
	var messageType = String(jsonQobj.find('rl_type').value()).toLowerCase();
	console.log(String(messageType));
	switch (messageType){
		case 'identify':
			payloadObjectName = "identification";
			amplitudeEventType = "identify";
			configJson = identifyConfigJson; 
			break;
		case 'page':
			payloadObjectName = "event";
			amplitudeEventType = "pageview";
			configJson = pageConfigJson;
			break;
		case 'screen':
			payloadObjectName = "event";
			amplitudeEventType = "screenview";
			configJson = screenConfigJson;
			break;
		case 'track':
			var rlEventType = String(jsonQobj.find('rl_event').value());	
			payloadObjectName = "event";
			amplitudeEventType = rlEventType;
			switch(rlEventType.toLowerCase()){ //decide config to be used based on RL event
				case "promotion clicked":
					configJson = promotionClickedConfigJson;
					break;
				case "promotion viewed":
					configJson = promotionViewedConfigJson;
					break;
				case "product clicked":
				case "product viewed":	
				case "product added":
				case "product removed":
				case "product added to wishlist":
				case "product removed from wishlist":		
					configJson = productActionsConfigJson;
					break;		
			}
			break;
		default:
			console.log('could not determine type');
			error = true;
	}

	if (error){ // error has occurred, single error messge response
		events.push("{\"error\":\"message type not supported\"}");
	} else { //proper processing, return payload from processing function
		events = 
		responseBuilderSimple(parameterMap, payloadObjectName, jsonQobj, 
			amplitudeEventType, configJson, customerCredentialsConfigJson);
	}
	console.log(String(events));
	return events;

}


//Iterate over input batch and generate response for each message
function process (jsonQobj){
	var respList = [];
	var counter = 0;
	jsonQobj.find("rl_message").each(function (index, path, value){
		//console.log(++counter);
		result = processSingleMessage(jsonQ(value));
		respList.push(result);
		
	});
	return respList;
}

exports.process = process;
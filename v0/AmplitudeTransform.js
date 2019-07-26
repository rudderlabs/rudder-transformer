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

var coinsPurchasedConfigFile = fs.readFileSync('data/AmplitudeCoinsPurchasedEventConfig.json');
var coinsPurchasedConfigJson = JSON.parse(coinsPurchasedConfigFile);

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
	responseMap.set("user_id", String(jsonQobj.find("rl_anonymous_id").value()));
	
	
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

				objMap.set(destinationPathElements[0],String(value));

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
							parent[destinationPathElements[level]]=String(value);
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
			objMap.set("time",String(new Date(String(jsonQobj.find("rl_timestamp").value())).getTime()));
			break;	
	}

	//Add the user_id to the obj map
	objMap.set("user_id", String(jsonQobj.find("rl_anonymous_id").value()));

	//Also add insert_id, we're using rl_message_id for this
	objMap.set("insert_id", String(jsonQobj.find("rl_message_id").value()));

	
	//Now add the entire object map to the parameter map against 
	//the designated root element name
	parameterMap.set(rootElementName, JSON.stringify(mapToObj(objMap)));

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
				case "product list viewed":
				case "product list clicked":	
					configJson = productActionsConfigJson;
					break;		
				case "coins purchased":
					configJson = coinsPurchasedConfigJson;
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

//Method for handling product list actions
function processProductListAction(jsonQobj, respList){

	//We have to generate multiple Amplitude calls per product list event
	var productArray = jsonQobj.find("rl_properties").find("products").find("product_id").parent();
	

	//Now construct complete payloads for each product and 
	//get them processed through single message processing logic
	productArray.each(function (index, path, value){
			var tempObj = createSingleMessageBasicStructure(jsonQobj);			
			tempObj['rl_properties'] = value;
			result = processSingleMessage(jsonQ(tempObj));
			respList.push(result);

	});

	return respList;
}

//Utility method for creating the structure required for single message processing
//with basic fields populated
function createSingleMessageBasicStructure(jsonQobj){

	//placeholder for some common fields and structures that would be required
	var rl_type = String(jsonQobj.find("rl_type").value()[0]);
	var rl_event = String(jsonQobj.find("rl_event").value()[0]);
	var rl_context = jsonQobj.find("rl_context").value()[0];
	var rl_anonymous_id = String(jsonQobj.find("rl_anonymous_id").value()[0]);
	var rl_timestamp = String(jsonQobj.find("rl_timestamp").value()[0]);
	var rl_integrations = jsonQobj.find("rl_integrations").value()[0];
	
	
	var tempObj = {};
	tempObj['rl_type'] = rl_type;
	tempObj['rl_event'] = rl_event;
	tempObj['rl_context'] = rl_context;
	tempObj['rl_anonymous_id'] = rl_anonymous_id;
	tempObj['rl_timestamp'] = rl_timestamp;
	tempObj['rl_integrations'] = rl_integrations;
	
	return tempObj;
}

function processTransaction(jsonQobj, respList){

	//generate revenue calls for each revenue event - income, tax, discount, refund
	var tempObj = createSingleMessageBasicStructure(jsonQobj);

	//retrieve the income, tax and discount elements
	var rl_revenue = String(jsonQobj.find("rl_properties").find("revenue").value());
	var rl_tax = String(jsonQobj.find("rl_properties").find("tax").value());
	var rl_discount = String(jsonQobj.find("rl_properties").find("discount").value());

	//For order cancel or refund, amounts need to be made negative
	var transactionEvent = String(jsonQobj.find("rl_event").value()).toLowerCase();
	if(transactionEvent == "order cancelled" 
	|| transactionEvent == "order refunded") {}



	//generate call for each product
	processProductListAction(jsonQobj, respList);
}

//Iterate over input batch and generate response for each message
function process (jsonQobj){
	var respList = [];
	var counter = 0;
	jsonQobj.find("rl_message").each(function (index, path, value){
		var singleJsonQObj = jsonQ(value);
		var messageType = String(singleJsonQObj.find('rl_type').value()).toLowerCase();
		var rlEventType = String(singleJsonQObj.find('rl_event').value()).toLowerCase();
		//console.log(++counter);

		//special handling required for product list events and transaction events
		//which can require generation of multiple calls to Amplitude from a single
		//Rudderlabs call
		if (messageType == "track" 
			&& (rlEventType == "product list clicked" 
			|| rlEventType == "product list viewed")
		) {
			processProductListAction(singleJsonQObj, respList);
		} else if (messageType == "track"
					&& (rlEventType == "checkout started" 
					|| rlEventType == "order updayed"
					|| rlEventType == "order completed"
					|| rlEventType == "order cancelled")
		){
			processTransaction(jsonQobj, respList);

		} else {
			result = processSingleMessage(singleJsonQObj);
			respList.push(result);
		}
		
	});
	return respList;
}

exports.process = process;
exports.createSingleMessageBasicStructure = createSingleMessageBasicStructure;

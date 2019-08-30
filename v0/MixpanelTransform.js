var jsonQ = require('jsonq');
var fs = require('fs');
var http = require('http');
var qs = require('querystring');

var mPIdentifyConfigFile = fs.readFileSync('data/MPIdentifyConfig.json');
var mPIdentifyConfigJson = JSON.parse(mPIdentifyConfigFile);

function processEventTypeTrack(jsonQobj){
    console.log("in processEventTypeTrack")
    var eventType = String(jsonQobj.find('rl_event').value()).toLowerCase();
    var eventName = eventType;
    var response = []
            
    if(jsonQobj.find("rl_properties").find("revenue").length > 0){
        console.log("==tracking revenue===")
        var parameterMap = new Map()
        response.push(processRevenueEvents(parameterMap, jsonQobj));
    }
    var parameterMap = new Map()
    parameterMap.set("event", eventName);
    response.push(getEventValueForTrackEvent(parameterMap, jsonQobj));
    return response
}

function getEventValueForTrackEvent(parameterMap, jsonQobj){
    var prop = (jsonQobj.find("rl_properties").value())[0];
    var properties = {}
    properties['properties'] = prop
    jsonQobj.find("rl_destination").each((i, p, value) => {
        properties['token'] = String(value.Config.apiKey)
    });
    jsonQobj.find("rl_anonymous_id").each((i, p, value) => {
        properties['distinct_id'] = String(value)
    });
    jsonQobj.find("rl_timestamp").each((i, p, value) => {
        properties['time'] = String(value)
    });
    parameterMap.set("properties", properties);
    return responseBuilderSimple (parameterMap, jsonQobj, "track")
}

function processRevenueEvents(parameterMap, jsonQobj){
    var revenueValue = jsonQobj.find("rl_properties").find("revenue").value();
    var transactionMap = {}
    transactionMap['$time'] = jsonQobj.find("rl_timestamp").value();
    transactionMap['$amount'] = revenueValue;
    parameterMap['$append'] = JSON.stringify({'$transactions': transactionMap});
    jsonQobj.find("rl_destination").each((i, p, value) => {
        parameterMap['token'] = String(value.Config.apiKey)
    });
    jsonQobj.find("rl_anonymous_id").each((i, p, value) => {
        parameterMap['distinct_id'] = String(value)
    });
    return responseBuilderSimple (parameterMap, jsonQobj, "revenue")
}

function getEventValueForUnIdentifiedTrackEvent(parameterMap, jsonQobj){
    var properties = (jsonQobj.find("rl_properties").value())[0];
    //var parameterMap = new Map()
    parameterMap.set("properties", JSON.stringify(properties));
    return responseBuilderSimple (parameterMap, jsonQobj, "track")
}

//Helper function for generating desired JSON from Map
const mapToObj = m => {
	return Array.from(m).reduce((obj, [key, value]) => {
	  obj[key] = value;
	  return obj;
	}, {});
  };


function responseBuilderSimple (parameterMap, jsonQobj, eventType){

    var responseMap = new Map();
    if(eventType == 'track'){
        responseMap.set("endpoint", "http://api.mixpanel.com/track/");
    }else {
        responseMap.set("endpoint", "http://api.mixpanel.com/engage/");
    }
	

    var requestConfigMap = new Map();
    requestConfigMap.set("request-format","JSON");
    requestConfigMap.set("request_method","POST");

    responseMap.set("request_config", mapToObj(requestConfigMap));
    
    jsonQobj.find('rl_anonymous_id').each(function (index, path, value){
		responseMap.set("user_id",String(value));
    });
    responseMap.set("header", {});

    responseMap.set("payload",mapToObj(parameterMap));

    var responseJson = JSON.stringify(mapToObj(responseMap));
    console.log(responseJson)
	return responseJson;
}

function getEventValueMapFromMappingJson(propertiesMap, jsonQobj, mappingJson){

    var eventValueMap = new Map();

    var moreMappedJson = mappingJson

	// Adding mapping for free flowing rl_properties to appsFlyer.
	jsonQobj.find("rl_user_properties").each(function (index, path, value) {
		console.log('=============')
		console.log(value);
		var mappingJsonQObj = jsonQ(mappingJson)
		jsonQ.each(value, function(key, val) {
			console.log("==key==:: ", key)
			if (mappingJsonQObj.find("rl_user_properties." + key).length == 0) {
				console.log("===adding extra mapping===")
				moreMappedJson["rl_user_properties." + key] = key
			}
		})
	});

	jsonQ.each(moreMappedJson, function(sourceKey, destinationKey){
		var tempObj = jsonQobj.find('rl_context').parent();

		var pathElements = sourceKey.split('.');

		for (var i=0; i<pathElements.length; i++) {
			tempObj = tempObj.find(pathElements[i]);	
		}
				
		tempObj.each(function (index, path, value){
			propertiesMap.set(String(destinationKey),String(value));
        });
    });
    
    /* var eventValue = JSON.stringify(mapToObj(eventValueMap));
    if(eventValue == "{}"){
        eventValue = "";
    }
    console.log(eventValue);
    parameterMap.set("eventValue", eventValue); */
    console.log(propertiesMap);
    return JSON.stringify(mapToObj(propertiesMap))
}

function processIdentifyEvents(jsonQobj, eventName){
    var jsonConfig = mPIdentifyConfigJson;
    var parameterMap = new Map()
    jsonQobj.find("rl_destination").each((i, p, value) => {
        parameterMap.set("$token", String(value.Config.apiKey))
    });
    jsonQobj.find("rl_anonymous_id").each((i, p, value) => {
        parameterMap.set("$distinct_id", String(value))
    });
    var propertiesMap = new Map()
    propertiesMap = getEventValueMapFromMappingJson(propertiesMap, jsonQobj, jsonConfig);
    parameterMap.set("$set", propertiesMap)
    return responseBuilderSimple (parameterMap, jsonQobj, "identify")
}

function processPageOrScreenEvents(jsonQobj, eventName){
    
    var parameterMap = new Map()
    parameterMap.set("event", eventName);
    getEventValueForUnIdentifiedTrackEvent(parameterMap, jsonQobj);
    return responseBuilderSimple (parameterMap, jsonQobj, "track")
}

function processSingleMessage(jsonQobj){
    console.log("in processSingleMessage")
    var messageType = String(jsonQobj.find('rl_type').value()).toLowerCase();
    console.log("messageType = " + messageType)
    var parameterMap = new Map();
    var eventName = String(jsonQobj.find('rl_event').value());
    var eventType = "";
    var response = []
    switch (messageType){
        case 'track':
            response = processEventTypeTrack(jsonQobj);
            break;
        case 'screen':
            eventName = 'screen'
            response = processPageOrScreenEvents(jsonQobj, eventName);
            break;
        case 'page':
            eventName = 'page'
            response = processPageOrScreenEvents(jsonQobj, eventName);
            break;
        case 'identify':
            response = processIdentifyEvents(jsonQobj, eventName);
            break;
        default:
    }
    
    //response.push(responseBuilderSimple(parameterMap,jsonQobj, eventType)); 
    return response
}

function process (jsonQobj){
    var respList = [];
	jsonQobj.find("rl_message").each(function (index, path, value){
		result = processSingleMessage(jsonQ(value));
		respList.push(result);
		
    });
	return respList;
}

exports.process = process;
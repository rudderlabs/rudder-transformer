var ptr = require('json-ptr')
var fs = require('fs');

var mPIdentifyConfigFile = fs.readFileSync('data/MPIdentifyConfig.json');
var mPIdentifyConfigJson = JSON.parse(mPIdentifyConfigFile);

function processEventTypeTrack(requestMessage){
    console.log("in processEventTypeTrack")
    var eventType = ptr.get(requestMessage, '/rl_message/rl_event');
    var eventName = eventType;
    var response = []

    var revenue = ptr.get(requestMessage, '/rl_message/rl_properties/revenue');
    console.log("revenue: " + revenue)
            
    if(revenue){
        console.log("==tracking revenue===")
        response.push(processRevenueEvents(requestMessage));
    }
    response.push(getEventValueForTrackEvent(requestMessage));
    return response
}

function getEventValueForTrackEvent(requestMessage){

    parameterMap = {}
    var eventName = ptr.get(requestMessage, '/rl_message/rl_event');
    parameterMap['event'] = eventName;
    var prop = ptr.get(requestMessage, '/rl_message/rl_properties')
    var properties = {}
    properties['properties'] = prop
    properties['token'] = ptr.get(requestMessage, '/rl_message/rl_destination/Config/apiKey')
    properties['distinct_id'] = ptr.get(requestMessage, '/rl_message/rl_anonymous_id')
    properties['time'] = ptr.get(requestMessage, '/rl_message/rl_timestamp')
    parameterMap['properties'] = properties;
    return responseBuilderSimple (parameterMap, requestMessage, "track")
}

function processRevenueEvents(requestMessage){
    var revenueValue = ptr.get(requestMessage, '/rl_message/rl_properties/revenue');
    var transactionMap = {}
    var parameterMap = {}
    var properties = {}
    transactionMap['$time'] = ptr.get(requestMessage, '/rl_message/rl_timestamp')
    transactionMap['$amount'] = revenueValue;
    parameterMap['$append'] = JSON.stringify({'$transactions': transactionMap});
    properties['token'] = ptr.get(requestMessage, '/rl_message/rl_destination/Config/apiKey')
    properties['distinct_id'] = ptr.get(requestMessage, '/rl_message/rl_anonymous_id')
    return responseBuilderSimple (parameterMap, requestMessage, "revenue")
}

function getEventValueForUnIdentifiedTrackEvent(requestMessage){
    var properties = ptr.get(requestMessage, '/rl_message/rl_properties');
    var prop = ptr.get(requestMessage, '/rl_message/rl_properties')
    console.log("properties: " + prop)
    return properties
}

function responseBuilderSimple (parameterMap, requestMessage, eventType){

    var responseMap = {};
    if(eventType == 'track'){
        responseMap['endpoint'] = "http://api.mixpanel.com/track/";
    }else {
        responseMap['endpoint'] = "http://api.mixpanel.com/engage/";
    }
	

    var requestConfigMap = {};
    requestConfigMap['request-format'] = "JSON";
    requestConfigMap['request_method'] = "POST";

    responseMap['request_config'] = requestConfigMap;
    
	responseMap['user_id'] = ptr.get(requestMessage, '/rl_message/rl_anonymous_id');
    responseMap['header'] = {};

    responseMap['payload'] = parameterMap;

    var responseJson = JSON.stringify(responseMap);
    console.log(responseJson)
	return responseJson;
}

function getEventValueMapFromMappingJson(propertiesMap, requestMessage, mappingJson){

    for(var k in requestMessage["rl_message"]["rl_context"]["rl_user_properties"]){
        if(requestMessage["rl_message"]["rl_context"]["rl_user_properties"].hasOwnProperty(k)){

            console.log(k);
            var rudderPath = '/rl_message/rl_context/rl_user_properties/'+k;
            if(mappingJson[rudderPath]){
                console.log("in if")
                ptr.set(propertiesMap, mappingJson[rudderPath], requestMessage["rl_message"]["rl_context"]["rl_user_properties"][k], true)
            } else {
                console.log("in else")
                ptr.set(propertiesMap, "/"+k, requestMessage["rl_message"]["rl_context"]["rl_user_properties"][k], true)
            }
            
        }

    }
    console.log(propertiesMap)
    return propertiesMap
}

function processIdentifyEvents(requestMessage, eventName){
    var jsonConfig = mPIdentifyConfigJson;
    var parameterMap = {}
    parameterMap['token'] = ptr.get(requestMessage, '/rl_message/rl_destination/Config/apiKey')
    parameterMap['distinct_id'] = ptr.get(requestMessage, '/rl_message/rl_anonymous_id')
    var propertiesMap = {}
    propertiesMap = getEventValueMapFromMappingJson(propertiesMap, requestMessage, jsonConfig);
    parameterMap['$set'] = propertiesMap
    return responseBuilderSimple (parameterMap, requestMessage, "identify")
}

function processPageOrScreenEvents(requestMessage, eventName){
    
    var parameterMap = {}
    parameterMap['event'] = eventName;
    parameterMap['properties'] = getEventValueForUnIdentifiedTrackEvent(requestMessage);
    return responseBuilderSimple (parameterMap, requestMessage, "track")
}

function processSingleMessage(requestMessage){
    console.log("in processSingleMessage")
    var messageType = ptr.get(requestMessage, '/rl_message/rl_type');
    console.log("messageType = " + messageType)
    var eventName = ptr.get(requestMessage, '/rl_message/rl_event');
    var response = []
    switch (messageType){
        case 'track':
            response = processEventTypeTrack(requestMessage);
            break;
        case 'screen':
            eventName = 'screen'
            response = processPageOrScreenEvents(requestMessage, eventName);
            break;
        case 'page':
            eventName = 'page'
            response = processPageOrScreenEvents(requestMessage, eventName);
            break;
        case 'identify':
            response = processIdentifyEvents(requestMessage, eventName);
            break;
        default:
    }
    return response
}

function process (requestJsonArray){
    var respList = [];
	requestJsonArray.forEach(requestMessage => {
        result = processSingleMessage(requestMessage);
		respList.push(result);
    });
	return respList;
}

exports.process = process;
var ptr = require('json-ptr')
var fs = require('fs');

var mPIdentifyConfigFile = fs.readFileSync('data/MPIdentifyConfig.json');
var mPIdentifyConfigJson = JSON.parse(mPIdentifyConfigFile);

function getEventTime(requestMessage){
    var timeStamp = new Date(ptr.get(requestMessage, '/rl_message/rl_timestamp'))
    console.log("timestamp: " + timeStamp.toISOString())
    return timeStamp.toISOString()
}

function getEventEpochTime(requestMessage){
    var timeStamp = new Date(ptr.get(requestMessage, '/rl_message/rl_timestamp'))
    return timeStamp.getTime()/1000
}

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
    parameterMap['properties'] = properties//JSON.stringify(properties)
    return responseBuilderSimple (parameterMap, requestMessage, "track")
}

function processRevenueEvents(requestMessage){
    var revenueValue = ptr.get(requestMessage, '/rl_message/rl_properties/revenue');
    var transactionMap = {}
    var parameterMap = {}
    
    transactionMap['$time'] = getEventTime(requestMessage)//timeStamp.toISOString();
    transactionMap['$amount'] = revenueValue;
    parameterMap['$append'] = {'$transactions': transactionMap}//JSON.stringify({'$transactions': transactionMap});
    parameterMap['$token'] = ptr.get(requestMessage, '/rl_message/rl_destination/Config/apiKey')
    parameterMap['$distinct_id'] = ptr.get(requestMessage, '/rl_message/rl_anonymous_id')
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
    requestConfigMap['request-format'] = "PARAMS";
    requestConfigMap['request_method'] = "POST";

    responseMap['request_config'] = requestConfigMap;
    
	responseMap['user_id'] = ptr.get(requestMessage, '/rl_message/rl_anonymous_id');
    responseMap['header'] = {};

    console.log(parameterMap)
    var encodedData = Buffer.from(JSON.stringify(parameterMap)).toString('base64')
    responseMap['payload'] = {'data': encodedData};

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
    parameterMap['$token'] = ptr.get(requestMessage, '/rl_message/rl_destination/Config/apiKey')
    parameterMap['$distinct_id'] = ptr.get(requestMessage, '/rl_message/rl_anonymous_id')
    //parameterMap['$time'] = getEventTime(requestMessage)
    var propertiesMap = {}
    propertiesMap = getEventValueMapFromMappingJson(propertiesMap, requestMessage, jsonConfig);
    parameterMap['$set'] = propertiesMap
    return responseBuilderSimple (parameterMap, requestMessage, "identify")
}

function processPageOrScreenEvents(requestMessage, eventName){


    parameterMap = {}
    parameterMap['event'] = eventName;
    var prop = ptr.get(requestMessage, '/rl_message/rl_properties')
    var properties = {}
    properties['properties'] = prop
    properties['token'] = ptr.get(requestMessage, '/rl_message/rl_destination/Config/apiKey')
    properties['distinct_id'] = ptr.get(requestMessage, '/rl_message/rl_anonymous_id')
    properties['time'] = ptr.get(requestMessage, '/rl_message/rl_timestamp')
    parameterMap['properties'] = properties//JSON.stringify(properties)
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
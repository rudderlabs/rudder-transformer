var ptr = require('json-ptr')
var fs = require('fs');

var hSIdentifyConfigFile = fs.readFileSync('data/hSIdentifyConfig.json');
var hSIdentifyConfigJson = JSON.parse(hSIdentifyConfigFile);

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
    parameterMap = {}
    parameterMap['_a'] = ptr.get(requestMessage, '/rl_message/rl_destination/Config/hubid');
    var eventName = ptr.get(requestMessage, '/rl_message/rl_event');
    parameterMap['_n'] = eventName;
    var revenue = ptr.get(requestMessage, '/rl_message/rl_properties/revenue');
    console.log("revenue: " + revenue)

    if(revenue){
        console.log("==tracking revenue===")
        parameterMap['_m'] = revenue
    }
    var userPropertiesMap = getValueMapFromMappingJson(requestMessage, hSIdentifyConfigJson)
    for(k in  userPropertiesMap){
        parameterMap[k] = userPropertiesMap[k]
    }
    return responseBuilderSimple (parameterMap, requestMessage, "track")
}

function processIdentifyEvents(requestMessage){
    var jsonConfig = hSIdentifyConfigJson;
    var parameterMap = {}
    var userPropertiesMap = getValueMapFromMappingJson(requestMessage, jsonConfig);
    var properties = getPropertiesValueForIdentify(userPropertiesMap)
    parameterMap['properties'] = properties
    return responseBuilderSimple (parameterMap, requestMessage, "identify")
}

function responseBuilderSimple (parameterMap, requestMessage, eventType){

    var responseMap = {};
    var requestConfigMap = {};
    var apiKey = ptr.get(requestMessage, '/rl_message/rl_destination/Config/apiKey')
    if(eventType == 'track'){
        responseMap['endpoint'] = "https://track.hubspot.com/v1/event/";
        requestConfigMap['request_method'] = "GET";
        requestConfigMap['request-format'] = "PARAMS";
    }else {
        var userEmail = ptr.get(requestMessage, '/rl_message/rl_context/rl_traits/rl_email');

        if(userEmail){
            responseMap['endpoint'] = "https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/"+userEmail+"/?hapikey="+apiKey;
        } else {
            responseMap['endpoint'] = "https://api.hubapi.com/contacts/v1/contact/?hapikey="+apiKey;
        }
        requestConfigMap['request_method'] = "POST";
        requestConfigMap['request-format'] = "JSON";
    }
    
    responseMap['request_config'] = requestConfigMap;

	responseMap['user_id'] = ptr.get(requestMessage, '/rl_message/rl_context/rl_traits/rl_anonymous_id');
    responseMap['header'] = {};

    console.log(parameterMap)
    responseMap['payload'] = parameterMap;

    var responseJson = JSON.stringify(responseMap);
    console.log(responseJson)
	return responseJson;
}

function getPropertiesValueForIdentify(propMap){
    var properties = []
    for(var k in propMap){
        var property = {}
        property['property'] = k
        property['value'] = propMap[k]
        properties.push(property)
    }
    return properties
}

function getValueMap(propMap, mappingJson, basePath, returnMap){
    for(var k in propMap){
        if(propMap.hasOwnProperty(k)){
            var rudderPath = basePath+k
            if(mappingJson[rudderPath]){
                var mapKey = mappingJson[rudderPath]
                var mapValue = propMap[k]
                ptr.set(returnMap, mapKey, mapValue, true)
            } else if(typeof(propMap[k]) == "object"){
                var path = rudderPath + "/"
                getValueMap(propMap[k], mappingJson, path, returnMap)
            } else {
                if(k !== 'rl_anonymous_id'){
                    var mapKey = "/"+k
                    var mapValue = propMap[k]
                    ptr.set(returnMap, mapKey, mapValue, true)
                }
            }
        }
    }
}

function getValueMapFromMappingJson(requestMessage, mappingJson){
    var returnMap = {}
    var basePath = '/rl_message/rl_context/rl_traits/';
    getValueMap(requestMessage["rl_message"]["rl_context"]["rl_traits"], mappingJson, basePath, returnMap)
    for(var k in requestMessage["rl_message"]["rl_user_properties"]){
        returnMap[k] = ["rl_message"]["rl_user_properties"][k]
    }
    console.log(returnMap)
    return returnMap
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
        case 'identify':
            response = processIdentifyEvents(requestMessage);
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
var ptr = require('json-ptr')
var fs = require('fs');

var baseMappingFile = fs.readFileSync('data/FbAppBasicMapping.json');
var baseMapping = JSON.parse(baseMappingFile);

var eventNameMappingFile = fs.readFileSync('data/FbAppEventNameMapping.json');
var eventNameMapping = JSON.parse(eventNameMappingFile);

var eventPropsMappingFile = fs.readFileSync('data/FbAppEventPropsMapping.json');
var eventPropsMapping = JSON.parse(eventPropsMappingFile);

var eventPropsToPathFile = fs.readFileSync('data/FbAppEventPropPathMapping.json');
var eventPropsToPathMapping = JSON.parse(eventPropsToPathFile);




function process(requestJsonArray) {
    var respList = [];
    var counter = 0;
    try {
        requestJsonArray.forEach(requestMsg => {
            result = processSingleMessage(requestMsg);
            respList.push(result);
        })
    } catch (error) {
        console.log(error)
    }
    return respList;
}

function processSingleMessage(requestMsg) {
    var baseJson = {};
    var fbEventName = undefined
    buildBaseEvent(requestMsg, baseJson)

    var messageType = ptr.get(requestMsg, '/rl_message/rl_type');
    var eventName = ptr.get(requestMsg, '/rl_message/rl_event');

    switch (messageType) {
        case 'track':
            fbEventName = eventNameMapping[eventName]
            if (!fbEventName) {
                fbEventName = eventName
            }
            processEventTypeGeneric(requestMsg, baseJson, fbEventName);
            break;
        case 'screen':
            var screenName = ptr.get(requestMsg, '/rl_message/rl_properties/name');
            if (!screenName) {
                fbEventName = 'Viewed' + 'Screen'
            } else {
                fbEventName = 'Viewed ' + screenName + ' Screen'
            }
            processEventTypeGeneric(requestMsg, baseJson, fbEventName);
            break;
        case 'page':
            fbEventName = 'Viewed Page'
            processEventTypeGeneric(requestMsg, baseJson, fbEventName);
            break;

        default:
        /* parameterMap.set("eventName", eventName);
        parameterMap.set("eventValue", ""); */
    }
    
    return responseBuilderSimple(requestMsg, baseJson);

}


function buildBaseEvent(requestMsg, baseJson) {
    console.log("==building base message==")
    console.log("request===: ", requestMsg)


    // Fixed values
    ptr.set(baseJson, "/extinfo/0", "a2", true)

    for (var k in baseMapping) {
        if (baseMapping.hasOwnProperty(k)) {
            var inputVal = ptr.get(requestMsg, k)
            console.log("key: ", k, " val: ", inputVal)
            if (inputVal) {
                ptr.set(baseJson, baseMapping[k], inputVal, true)
            } else {
                ptr.set(baseJson, baseMapping[k], "", true)
            }
        }
    }

    console.log("==output base msg===", baseJson)
}

function processEventTypeGeneric(requestMsg, baseJson, fbEventName) {
    ptr.set(baseJson, "/CUSTOM_EVENTS/0/_eventName", fbEventName, true)

    for (var k in requestMsg["rl_message"]["rl_properties"]) {
        if (requestMsg["rl_message"]["rl_properties"].hasOwnProperty(k)) {
            console.log("key: ", k)
            if (eventPropsToPathMapping[k]) {
                var rudderEventPath = eventPropsToPathMapping[k]
                var fbEventPath = eventPropsMapping[rudderEventPath]

                console.log("rudderEventPath: ", rudderEventPath, " fbEventPath: ", fbEventPath)

                if (rudderEventPath.indexOf("sub") > -1) {
                    var prefixSlice = rudderEventPath.slice(0, rudderEventPath.indexOf("/sub"))
                    var suffixSlice = rudderEventPath.slice(rudderEventPath.indexOf("/sub") + 4, rudderEventPath.length)

                    console.log("prefixSlice: ", prefixSlice, " suffixSlice:", suffixSlice)

                    var parentArrayJson = ptr.get(requestMsg, prefixSlice)

                    var length = 0
                    var count = parentArrayJson.length
                    while (count > 0) {

                        var intendValue = ptr.get(requestMsg, prefixSlice + "/" + length + suffixSlice)
                        if (intendValue) {
                            ptr.set(baseJson, fbEventPath + length, intendValue, true)
                        } else {
                            ptr.set(baseJson, fbEventPath + length, "", true)
                        }


                        length++
                        count--

                    }
                } else {
                    var rudderEventPath = eventPropsToPathMapping[k]
                    var fbEventPath = eventPropsMapping[rudderEventPath]
                    var intendValue = ptr.get(requestMsg, rudderEventPath)
                    if (intendValue) {
                        ptr.set(baseJson, fbEventPath, intendValue, true)
                    } else {
                        ptr.set(baseJson, fbEventPath, "", true)
                    }
                }
            } else {
                ptr.set(baseJson, "/CUSTOM_EVENTS/0/" + k, requestMsg["rl_message"]["rl_properties"][k], true)
            }
        }
    }

    // Conversion required fields
    var dateTime = new Date(ptr.get(baseJson, "/CUSTOM_EVENTS/0/_logTime"))
    ptr.set(baseJson, "/CUSTOM_EVENTS/0/_logTime", dateTime.getTime()/1000)


    console.log("===outputJson==")
    console.log(JSON.stringify(baseJson))


}

function responseBuilderSimple(requestMsg, payload) {
    var response = {}
    
    
    var requestConfigMap = {};
    requestConfigMap["request-format"] = "FORM";
    requestConfigMap["request_method"] = "POST";

    var userId = ptr.get(requestMsg, "/rl_message/rl_anonymous_id")

    var appID = ptr.get(requestMsg, "/rl_message/rl_destination_props/Fb/app_id")

    var appSecret = ptr.get(requestMsg, "/rl_message/rl_destination_props/Fb/app_secret")

    //"https://graph.facebook.com/v3.3/644758479345539/activities?access_token=644758479345539|748924e2713a7f04e0e72c37e336c2bd"

    response["endpoint"] = "https://graph.facebook.com/v3.3/" + appID + "/activities?access_token=" + appID + "|" + appSecret
    response["request_config"] = requestConfigMap
    response["user_id"] = userId
    response["header"] = {}
    response["payload"] = payload

    var events = []
	events.push(JSON.stringify(response));
	return events;

}

exports.process = process;



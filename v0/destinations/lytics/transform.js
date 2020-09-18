const { EventType } = require("../../../constants");
const { CONFIG_CATEGORIES, MAPPING_CONFIG, ENDPOINT} = require("./config");
const {
    constructPayload,
    defaultPostRequestConfig,
    removeUndefinedAndNullValues,
    defaultRequestConfig
  } = require("../../util");
function responseBuilderSimple(message, category, destination) {
    const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
    const response = defaultRequestConfig();
    const stream = destination.Config.stream;
    const apiKey = destination.Config.apiKey;
    const timestamp = message.originalTimestamp;
    response.endpoint = `${ENDPOINT}/${stream}?timestamp_field=${timestamp}`;
    response.method = defaultPostRequestConfig.requestMethod;
    
    response.userId = message.anonymousId;
    const _e = payload["_e"];
    const user_id = payload["user_id"]
    let finalPayload;
    if(_e){
        finalPayload = {_e,...payload[""]}
    }else if(user_id){
        finalPayload = {user_id,...payload[""]}
    }
    else{
        finalPayload = payload[""]
    }
    response.body.JSON = removeUndefinedAndNullValues(finalPayload);
    response.headers = {
        "Content-Type": "application/json",
        Authorization: apiKey
      };
    return response;

}

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const messageType = message.type.toLowerCase();
  let category;
  switch (messageType) {
    case EventType.IDENTIFY:
        category = CONFIG_CATEGORIES.IDENTIFY;
        break;
    case EventType.PAGE:
    case EventType.SCREEN:
        category = CONFIG_CATEGORIES.PAGESCREEN;
        break;
    case EventType.TRACK:
        category = CONFIG_CATEGORIES.TRACK;
        break;
    default:
        throw new Error("Message type not supported");
    }
      // build the response
  return responseBuilderSimple(message, category, destination);
  }

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;

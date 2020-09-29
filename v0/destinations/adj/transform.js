const { EventType } = require("../../../constants");
const { CONFIG_CATEGORIES, MAPPING_CONFIG, baseEndpoint } = require("./config");
const {
  constructPayload,
  getHashFromArray,
  defaultPostRequestConfig,
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  flattenJson
} = require("../../util");

const rejectParams = ["revenue", "currency"];

function responseBuilderSimple(message, category, destination) {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  const { appToken, customMappings, environment } = destination.Config;
  if (
    !message.context.device ||
    !message.context.device.type ||
    !message.context.device.id
  ) {
    throw new Error("Device type/id  not present");
  }
  if (message.context.device.type.toLowerCase() === "android") {
    delete payload.idfv;
    delete payload.idfa;
  } else if (message.context.device.type.toLowerCase() === "ios") {
    delete payload.android_id;
    delete payload.gps_adid;
  } else {
    throw new Error("Device type not valid");
  }
  if (payload.revenue) {
    payload.currency = message.properties.currency || "USD";
  }
  const hashMap = getHashFromArray(customMappings, "from", "to", false);
  if (payload && message.event && hashMap[message.event]) {
    const response = defaultRequestConfig();
    response.headers = {
      Accept: "*/*"
    };
    if (payload.callback_params) {
      rejectParams.forEach(rejectParam => {
        delete payload.callback_params[rejectParam];
      });
    }
    payload.callback_params = JSON.stringify(
      flattenJson(payload.callback_params)
    );
    response.endpoint = baseEndpoint;
    response.method = defaultPostRequestConfig.requestMethod;
    response.userId = message.anonymousId;
    payload.s2s = 1;
    payload.app_token = appToken;
    payload.event_token = hashMap[message.event];
    payload.environment = environment ? "production" : "sandbox";
    response.params = removeUndefinedAndNullValues(payload);
    return response;
  }
  // fail-safety for developer error
  if (!message.event || !hashMap[message.event]) {
    throw new Error("No event token mapped for this event");
  } else {
    throw new Error("Payload could not be constructed");
  }
}

const processEvent = (message, destination) => {
  if (!message.type) {
    throw Error("Message Type is not present. Aborting message.");
  }
  const messageType = message.type.toLowerCase();
  let category;
  switch (messageType) {
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      break;
    default:
      throw new Error("Message type not supported");
  }

  // build the response
  return responseBuilderSimple(message, category, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};
exports.process = process;

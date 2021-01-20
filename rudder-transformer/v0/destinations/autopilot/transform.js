const { EventType } = require("../../../constants");
const { CONFIG_CATEGORIES, MAPPING_CONFIG } = require("./config");

const {
  constructPayload,
  defaultPostRequestConfig,
  defaultRequestConfig,
  getFieldValueFromMessage,
  removeUndefinedAndNullValues
} = require("../../util");

const identifyFields = [
  "email",
  "firstname",
  "firstName",
  "lastname",
  "lastName",
  "phone",
  "company",
  "status",
  "LeadSource"
];

function responseBuilderSimple(message, category, destination) {
  const payload = constructPayload(message, MAPPING_CONFIG[category.name]);
  if (payload) {
    const response = defaultRequestConfig();
    response.headers = {
      autopilotapikey: destination.Config.apiKey,
      "Content-Type": "application/json",
      Accept: "application/json"
    };
    let responseBody;
    let contactIdOrEmail;
    let customPayload;
    switch (message.type) {
      case EventType.IDENTIFY:
        customPayload = message.traits || message.context.traits;
        identifyFields.forEach(value => {
          delete customPayload[value];
        });
        if (Object.keys(customPayload).length) {
          responseBody = {
            contact: { ...payload, custom: customPayload }
          };
        } else {
          responseBody = {
            contact: { ...payload }
          };
        }
        response.endpoint = category.endPoint;
        break;
      case EventType.TRACK:
        responseBody = { ...payload };
        contactIdOrEmail = getFieldValueFromMessage(message, "email");
        if (contactIdOrEmail) {
          response.endpoint = `${category.endPoint}/${destination.Config.triggerId}/contact/${contactIdOrEmail}`;
        } else {
          throw new Error("Email is required for track calls");
        }
        break;
      default:
        break;
    }
    response.method = defaultPostRequestConfig.requestMethod;
    response.userId = message.anonymousId;
    response.body.JSON = removeUndefinedAndNullValues(responseBody);
    return response;
  }
  // fail-safety for developer error
  throw new Error("Payload could not be constructed");
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
    case EventType.TRACK:
      category = CONFIG_CATEGORIES.TRACK;
      break;
    default:
      throw new Error("Message  not supported");
  }

  // build the response
  return responseBuilderSimple(message, category, destination);
};

const process = event => {
  return processEvent(event.message, event.destination);
};
exports.process = process;

const get = require("get-value");
const { EventType } = require("../../../constants");
const {
  ConfigCategory,
  mappingConfig,
  BASE_URL,
  ENDPOINTS
} = require("./config");
const {
  defaultRequestConfig,
  getFieldValueFromMessage,
  constructPayload,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  getIntegrationsObj,
  CustomError,
  getErrorRespEvents,
  getSuccessRespEvents,
  getDestinationExternalID
} = require("../../util");

const responseBuilder = (payload, endpoint) => {
  if (payload) {
    const response = defaultRequestConfig();
    response.endpoint = `${BASE_URL}${endpoint}`;
    response.headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
  }
};

const populateDevicetype = (message, payload) => {
  const integrationsObj = getIntegrationsObj(message, "one_signal");
  const devicePayload = payload;
  if (integrationsObj && integrationsObj.deviceType) {
    devicePayload.device_type = integrationsObj.deviceType;
    devicePayload.identifier = integrationsObj.identifier;
  }
};
const getExternalIdentifiersMapping = message => {
  // Data Structure expected:
  // context.externalId: [ {type: playerId, id: __id}]
  const externalId = get(message, "context.externalId");
  let playerId;
  if (externalId && Array.isArray(externalId)) {
    externalId.forEach(id => {
      if (id.type === "playerId") {
        playerId = getDestinationExternalID(message, id.type);
      }
    });
  }
  return playerId;
};

const identifyResponseBuilder = (message, { Config }) => {
  const { appId, emailDeviceType, smsDeviceType } = Config;

  let { endpoint } = ENDPOINTS.IDENTIFY;

  const playerId = getExternalIdentifiersMapping(message);
  const tags = {};

  const traits = getFieldValueFromMessage(message, "traits");
  const traitsKey = Object.keys(traits);
  traitsKey.forEach(key => {
    tags[key] = traits[key];
  });
  if (message.anonymousId) {
    tags.anonymousId = message.anonymousId;
  }
  const payload = constructPayload(
    message,
    mappingConfig[ConfigCategory.IDENTIFY.name]
  );
  if (playerId) {
    endpoint = `${endpoint}/${playerId}`;
    payload.tags = tags;
    payload.app_id = appId;
    return responseBuilder(payload, endpoint);
  }
  populateDevicetype(message, payload);
  const responseArray = [];
  payload.tags = tags;
  if (emailDeviceType) {
    const emailDevicePayload = { ...payload };
    emailDevicePayload.device_type = 11;
    emailDevicePayload.identifier = getFieldValueFromMessage(message, "email");
    responseArray.push(responseBuilder(emailDevicePayload, endpoint));
  }
  if (smsDeviceType) {
    const smsDevicePayload = { ...payload };
    smsDevicePayload.device_type = 14;
    smsDevicePayload.identifier = getFieldValueFromMessage(message, "phone");
    responseArray.push(responseBuilder(smsDevicePayload, endpoint));
  }
  if (payload.device_type) {
    responseArray.push(responseBuilder(payload, endpoint));
  }
  return responseArray;
};

const trackResponseBuilder = (message, { Config }) => {
  const { appId, eventAsTags, allowedProperties } = Config;
  const event = get(message, "event");
  let { endpoint } = ENDPOINTS.TRACK;
  const externalUserId = getFieldValueFromMessage(message, "userId");
  endpoint = `${endpoint}/${appId}/users/${externalUserId}`;
  const payload = {};
  const tags = {};
  if (event) {
    tags[event] = true;
  }
  const properties = get(message, "properties");
  allowedProperties.forEach(propertyName => {
    if (properties[propertyName] && eventAsTags && event) {
      tags[`${event}_${[propertyName]}`] = properties[propertyName];
    } else if (properties[propertyName]) {
      tags[propertyName] = properties[propertyName];
    }
  });
  payload.tags = tags;
  return responseBuilder(payload, endpoint);
};

// const groupResponseBuilder = (message, { Config }) => {
//   const { apiKey } = Config;
//   let endpoint;
//   return responseBuilder(payload, apiKey, endpoint);
// };

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = identifyResponseBuilder(message, destination);
      break;
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination);
      break;
    // case EventType.GROUP:
    //   response = groupResponseBuilder(message, destination);
    //   break;
    default:
      throw new CustomError("Message type not supported", 400);
  }
  return response;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const respList = Promise.all(
    inputs.map(async input => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          return getSuccessRespEvents(
            input.message,
            [input.metadata],
            input.destination
          );
        }
        // if not transformed
        return getSuccessRespEvents(
          process(input),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
          error.response
            ? error.response.status
            : error.code
            ? error.code
            : 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return respList;
};

module.exports = { process, processRouterDest };

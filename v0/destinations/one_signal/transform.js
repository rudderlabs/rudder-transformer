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
  CustomError,
  getErrorRespEvents,
  getSuccessRespEvents
} = require("../../util");
const {
  checkForPlayerId,
  populateDeviceType,
  populateTags
} = require("./util");

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

/**
 * This function is used for creating response for identify call, to create a new device or update an existing device.
 * If playerId is present in the input payload, a response for editing that device is being created.
 * If playerId is not present, a responseArray for creating new device is being prepared.
 * If the value of emailDeviceType/smsDeviceType(toggle in dashboard) is true, separate responses will also be created
 * for new device with email/sms as identifier
 * @param {*} message
 * @param {*} param1
 * @returns
 */
const identifyResponseBuilder = (message, { Config }) => {
  const { appId, emailDeviceType, smsDeviceType } = Config;

  if (!appId) {
    throw new CustomError(
      "[OneSignal]: appId is required for creating/adding a device",
      400
    );
  }

  let { endpoint } = ENDPOINTS.IDENTIFY;

  // checking if playerId is present in the payload
  const playerId = checkForPlayerId(message);
  // Populating the tags
  const tags = populateTags(message);

  const payload = constructPayload(
    message,
    mappingConfig[ConfigCategory.IDENTIFY.name]
  );

  // If playerId is present, creating Edit Device Response for Editing a devic using the playerId
  if (playerId) {
    endpoint = `${endpoint}/${playerId}`;
    payload.tags = tags;
    payload.app_id = appId;
    return responseBuilder(payload, endpoint);
  }
  // Creating response for creation of new device or updation of an existing device
  populateDeviceType(message, payload);
  const responseArray = [];
  payload.tags = tags;
  // Creating a device with email as asn identifier
  if (emailDeviceType) {
    const emailDevicePayload = { ...payload };
    emailDevicePayload.device_type = 11;
    emailDevicePayload.identifier = getFieldValueFromMessage(message, "email");
    responseArray.push(responseBuilder(emailDevicePayload, endpoint));
  }
  // Creating a device with phone as asn identifier
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

/**
 * This function is used to build the response for track call.
 * It is used to edit the OneSignal tags using external_user_id.
 * @param {*} message
 * @param {*} param1
 * @returns
 */
const trackResponseBuilder = (message, { Config }) => {
  const { appId, eventAsTags, allowedProperties } = Config;
  if (!appId) {
    throw new CustomError(
      "[OneSignal]: appId is required for creating/adding a device",
      400
    );
  }
  const event = get(message, "event");
  let { endpoint } = ENDPOINTS.TRACK;
  const externalUserId = getFieldValueFromMessage(message, "userId");
  if (!externalUserId) {
    throw new CustomError(
      "[OneSignal]: userId is required for track events/updating a device",
      400
    );
  }
  endpoint = `${endpoint}/${appId}/users/${externalUserId}`;
  const payload = {};
  const tags = {};
  /* If event is present, then populating event as true in tags.
  eg. tags: {
    "event_name": true
  }
  */
  if (event) {
    tags[event] = true;
  }
  // Populating tags using allowed properties(from dashboard)
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

/**
 * This function is used to build the response for group call.
 * @param {*} message
 * @param {*} param1
 * @returns
 */
const groupResponseBuilder = (message, { Config }) => {
  const { appId, emailDeviceType, smsDeviceType } = Config;
  let { endpoint } = ENDPOINTS.GROUP;

  if (!appId) {
    throw new CustomError(
      "[OneSignal]: appId is required for creating/adding a device",
      400
    );
  }
  // checking if playerId is present in the payload
  const playerId = checkForPlayerId(message);
  // Populating tags
  const tags = populateTags(message);

  const payload = constructPayload(
    message,
    mappingConfig[ConfigCategory.GROUP.name]
  );
  if (payload.groupId) {
    throw new CustomError(
      "[OneSignal]: groupId is required for group events",
      400
    );
  }
  if (playerId) {
    endpoint = `${endpoint}/${playerId}`;
    payload.tags = tags;
    payload.app_id = appId;
    return responseBuilder(payload, endpoint);
  }
  populateDeviceType(message, payload);
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
    case EventType.GROUP:
      response = groupResponseBuilder(message, destination);
      break;
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

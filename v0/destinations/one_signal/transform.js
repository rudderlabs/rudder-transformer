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
  getSuccessRespEvents,
  getDestinationExternalID,
  isDefinedAndNotNullAndNotEmpty,
  toUnixTimestamp
} = require("../../util");
const { populateDeviceType, populateTags } = require("./util");

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
  const playerId = getDestinationExternalID(message, "playerId");

  // Populating the tags
  const tags = populateTags(message);

  const payload = constructPayload(
    message,
    mappingConfig[ConfigCategory.IDENTIFY.name]
  );
  // update the timestamp to unix timeStamp
  if (payload.created_at) {
    payload.created_at = toUnixTimestamp(payload.created_at);
  }
  if (payload.last_active) {
    payload.last_active = toUnixTimestamp(payload.last_active);
  }

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
    if (!isDefinedAndNotNullAndNotEmpty(emailDevicePayload.identifier)) {
      throw new CustomError(
        "email is required for creating a device with email as identifier",
        400
      );
    }
    responseArray.push(responseBuilder(emailDevicePayload, endpoint));
  }
  // Creating a device with phone as asn identifier
  if (smsDeviceType) {
    const smsDevicePayload = { ...payload };
    smsDevicePayload.device_type = 14;
    smsDevicePayload.identifier = getFieldValueFromMessage(message, "phone");
    if (!isDefinedAndNotNullAndNotEmpty(smsDevicePayload.identifier)) {
      throw new CustomError(
        "phone_number is required for creating a device with phone_number as identifier",
        400
      );
    }
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
  if (!event) {
    throw new CustomError(
      "[OneSignal]: event is not present in the input payloads",
      400
    );
  }
  if (!externalUserId) {
    throw new CustomError(
      "[OneSignal]: userId is required for track events/updating a device",
      400
    );
  }
  endpoint = `${endpoint}/${appId}/users/${externalUserId}`;
  const payload = {};
  const tags = {};
  /* Populating event as true in tags.
  eg. tags: {
    "event_name": true
  }
  */
  tags[event] = true;
  // Populating tags using allowed properties(from dashboard)
  const properties = get(message, "properties");
  allowedProperties.forEach(propertyName => {
    if (properties[propertyName]) {
      if (eventAsTags && typeof properties[propertyName] === "string") {
        tags[`${event}_${[propertyName]}`] = properties[propertyName];
      } else if (typeof properties[propertyName] === "string") {
        tags[propertyName] = properties[propertyName];
      }
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
  const { appId, allowedProperties } = Config;
  const groupId = getFieldValueFromMessage(message, "groupId");
  if (!groupId) {
    throw new CustomError(
      "[OneSignal]: groupId is required for group events",
      400
    );
  }
  if (!appId) {
    throw new CustomError(
      "[OneSignal]: appId is required for group events",
      400
    );
  }
  let { endpoint } = ENDPOINTS.GROUP;
  const externalUserId = getFieldValueFromMessage(message, "userId");

  if (!externalUserId) {
    throw new CustomError(
      "[OneSignal]: userId is required for group events",
      400
    );
  }
  endpoint = `${endpoint}/${appId}/users/${externalUserId}`;
  const payload = {};
  const tags = {};
  tags.groupId = groupId;

  // Populating tags using allowed properties(from dashboard)
  const properties = getFieldValueFromMessage(message, "traits");
  allowedProperties.forEach(propertyName => {
    if (typeof properties[propertyName] === "string") {
      tags[propertyName] = properties[propertyName];
    }
  });
  payload.tags = tags;
  return responseBuilder(payload, endpoint);
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

const qs = require("qs");
const get = require("get-value");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const ErrorBuilder = require("../../util/error");
const { isHttpStatusSuccess } = require("../../util/index");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const { DESTINATION, CONFIG_CATEGORIES } = require("./config");
const { getHashFromArray, getFieldValueFromMessage } = require("../../util");
const { httpSend, prepareProxyRequest } = require("../../../adapters/network");

/**
 * Validation for userId and an email
 * @param {*} message
 * @returns
 */
const validatePayload = message => {
  const userId = getFieldValueFromMessage(message, "userIdOnly");
  const email = getFieldValueFromMessage(message, "email");
  if (!userId && !email) {
    throw new ErrorBuilder()
      .setMessage("[Refiner] :: at least one param userId or email is required")
      .setStatus(400)
      .setStatTags({
        destType: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_EVENT
      })
      .build();
  }
};

/**
 * Replace the attributes name using webapp configuration mapping
 * @param {*} attributesMap
 * @param {*} destinationPayload
 * @returns
 */
const replaceDestAttributes = (attributesMap, destinationPayload) => {
  const payload = destinationPayload;
  const keys = Object.keys(attributesMap);
  keys.forEach(key => {
    if (payload[key]) {
      const value = payload[key];
      payload[attributesMap[key]] = value;
      delete payload[key];
    }
  });
  return payload;
};

/**
 * Returns account object
 * ref : https://refiner.io/docs/api/#group-users
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const getAccountTraits = (message, destination) => {
  const { accountAttributesMapping } = destination.Config;
  // all the traits fields, that are not mapped in webapp are going as it is
  const traits = getFieldValueFromMessage(message, "groupTraits");
  const id = getFieldValueFromMessage(message, "groupId");
  let groupUsersPayload = {
    ...traits,
    id
  };
  const accountAttributesMap = getHashFromArray(
    accountAttributesMapping,
    "from",
    "to",
    false
  );
  groupUsersPayload = replaceDestAttributes(
    accountAttributesMap,
    groupUsersPayload
  );
  return groupUsersPayload;
};

/**
 * Returns identify event payload
 * ref : https://refiner.io/docs/api/#identify-user
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const identifyUserPayloadBuilder = (message, destination) => {
  const { userAttributesMapping } = destination.Config;
  // mapping refiner remote_id with userId
  const userId = getFieldValueFromMessage(message, "userIdOnly");
  const email = getFieldValueFromMessage(message, "email");
  // all the traits fields, that are not mapped in webapp are going as it is
  const traits = getFieldValueFromMessage(message, "traits");
  const contextTraits = get(message, "context.traits");
  let payload = {
    ...traits,
    ...contextTraits,
    userId,
    email
  };
  const userAttributesMap = getHashFromArray(
    userAttributesMapping,
    "from",
    "to",
    false
  );
  payload = replaceDestAttributes(userAttributesMap, payload);
  const { endpoint } = CONFIG_CATEGORIES.IDENTIFY_USER;
  return {
    payload,
    endpoint
  };
};

/**
 * Returns track event payload
 * ref : https://refiner.io/docs/api/#track-event
 * @param {*} message
 * @returns
 */
const trackEventPayloadBuilder = message => {
  const payload = {};
  const userId = getFieldValueFromMessage(message, "userIdOnly");
  const email = getFieldValueFromMessage(message, "email");
  const { event } = message;
  if (userId) {
    payload.id = userId;
  }
  if (email) {
    payload.email = email;
  }
  payload.event = event;
  const { endpoint } = CONFIG_CATEGORIES.TRACK_EVENT;
  return { payload, endpoint };
};

/**
 * Returns group event payload
 * ref : https://refiner.io/docs/api/#group-users
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const groupUsersPayloadBuilder = (message, destination) => {
  const payload = {};
  const userId = getFieldValueFromMessage(message, "userIdOnly");
  const email = getFieldValueFromMessage(message, "email");
  if (userId) {
    payload.id = userId;
  }
  if (email) {
    payload.email = email;
  }
  payload.account = getAccountTraits(message, destination);
  const { endpoint } = CONFIG_CATEGORIES.GROUP_USERS;
  return {
    payload,
    endpoint
  };
};

/**
 * Handles the destination Response and return it to rudder-server
 * @param {*} destinationResponse
 * @returns
 */
const responseHandler = destinationResponse => {
  const message = `[Refiner] - Request Processed Successfully`;
  const { status } = destinationResponse;
  if (isHttpStatusSuccess(status)) {
    // Mostly any error will not have a status of 2xx
    return {
      status,
      message,
      destinationResponse
    };
  }
  // else successfully return status, message and original destination response
  const { response } = destinationResponse;
  throw new ErrorBuilder()
    .setStatus(status)
    .setDestinationResponse(response)
    .setMessage(
      `Refiner: ${response.message} during Refiner response transformation`
    )
    .build();
};

/**
 * Making an api call to destination in appropriate format and returns the payload
 * @param {*} request
 * @returns
 */
const ProxyRequest = async request => {
  const { method, endpoint, headers, body } = request;
  const payload = body.FORM;
  // since content-type is x-www-form-urlencoded we are signifying the payload
  const data = qs.stringify(payload);
  const requestBody = {
    url: endpoint,
    data,
    headers,
    method
  };
  const response = await httpSend(requestBody);
  return response;
};

class networkHandler {
  constructor() {
    this.prepareProxy = prepareProxyRequest;
    this.proxy = ProxyRequest;
    this.processAxiosResponse = processAxiosResponse;
    this.responseHandler = responseHandler;
  }
}

module.exports = {
  validatePayload,
  identifyUserPayloadBuilder,
  trackEventPayloadBuilder,
  groupUsersPayloadBuilder,
  networkHandler
};

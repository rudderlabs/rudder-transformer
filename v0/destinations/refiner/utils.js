const get = require("get-value");
const ErrorBuilder = require("../../util/error");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const { DESTINATION, CONFIG_CATEGORIES } = require("./config");
const { getHashFromArray, getFieldValueFromMessage } = require("../../util");

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
 * Returns page event payload
 * ref : https://refiner.io/docs/api/#track-event
 * @param {*} message
 * @returns
 */
const pageEventPayloadBuilder = message => {
  const payload = {};
  let event;
  const userId = getFieldValueFromMessage(message, "userIdOnly");
  const email = getFieldValueFromMessage(message, "email");
  if (userId) {
    payload.id = userId;
  }
  if (email) {
    payload.email = email;
  }
  if (!message.name && !message.category) {
    event = `pageView`;
  } else if (!message.name && message.category) {
    event = `Viewed ${message.category} Page`;
  } else if (message.name && !message.category) {
    event = `Viewed ${message.name} Page`;
  } else {
    event = `Viewed ${message.category} ${message.name} Page`;
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
  const email = getFieldValueFromMessage(message, "context.traits.email");
  if (userId) {
    payload.id = userId;
  }
  if (email) {
    payload.email = email;
  }

  /**
   * converting an account object into destination structure format
   * example of a destination account object :
   * 'account[id]': 'group@123'
   * 'account[name]': 'rudder ventures',
   */
  const accountTraits = getAccountTraits(message, destination);
  const keys = Object.keys(accountTraits);
  keys.forEach(key => {
    payload[`account[${key}]`] = accountTraits[key];
  });

  const { endpoint } = CONFIG_CATEGORIES.GROUP_USERS;
  return {
    payload,
    endpoint
  };
};

module.exports = {
  validatePayload,
  identifyUserPayloadBuilder,
  trackEventPayloadBuilder,
  groupUsersPayloadBuilder,
  pageEventPayloadBuilder
};

const { set } = require("lodash");
const {
  defaultRequestConfig,
  constructPayload,
  removeUndefinedAndNullValues,
  getErrorRespEvents,
  getSuccessRespEvents,
  getFieldValueFromMessage,
  defaultPutRequestConfig,
  defaultDeleteRequestConfig
} = require("../../util");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const ErrorBuilder = require("../../util/error");
const { DESTINATION } = require("./config");
const { getDestinationExternalID } = require("../../util");

const { EventType } = require("../../../constants");
const { mappingConfig, ConfigCategories } = require("./config");
const { refinePayload, getUID, getEvent, getLists } = require("./utils");

const responseBuilder = (payload, endpoint, method, Config) => {
  if (!payload) {
    throw new ErrorBuilder()
      .setMessage("Parameters could not be found.")
      .setStatus(400)
      .setStatTags({
        destType: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_PARAM
      })
      .build();
  }
  const { publicKey, privateKey } = Config;
  const response = defaultRequestConfig();
  const basicAuth = Buffer.from(`${publicKey}:${privateKey}`).toString(
    "base64"
  );
  response.headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${basicAuth}`
  };
  response.body.JSON = removeUndefinedAndNullValues(payload);
  response.endpoint = endpoint;
  response.method = method;
  return response;
};

const identifyResponseBuilder = (message, Config) => {
  const payload = constructPayload(
    message,
    mappingConfig[ConfigCategories.IDENTIFY.name]
  );
  const { traits } = message;
  const uid = getUID(message);
  // LIST FOR NOW IS IN CONFIG BUT TODO
  const endpoint = `${ConfigCategories.IDENTIFY.endpoint.replace("uid", uid)}`;
  const refinedPayload = refinePayload(
    traits,
    ConfigCategories.IDENTIFY.genericFields
  );
  set(payload, "meta", refinedPayload);
  const listIds = getLists(message, Config);
  if (listIds.length > 0) {
    set(payload, "lists", listIds);
  }
  return responseBuilder(
    payload,
    endpoint,
    ConfigCategories.IDENTIFY.method,
    Config
  );
};

const trackResponseBuilder = (message, Config) => {
  if (!message.event) {
    throw new ErrorBuilder()
      .setMessage("Event Name can not be empty.")
      .setStatus(400)
      .setStatTags({
        destType: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_PARAM
      })
      .build();
  }
  const { properties } = message;
  const payload = {};
  const meta = refinePayload(properties, ConfigCategories.TRACK.genericFields);
  const uid = getUID(message);
  const endpoint = `${ConfigCategories.TRACK.endpoint.replace("uid", uid)}`;
  payload.properties = meta;
  payload.event = message.event;
  payload.timestamp = getFieldValueFromMessage(message, "timestamp");
  return responseBuilder(
    payload,
    endpoint,
    ConfigCategories.TRACK.method,
    Config
  );
};
const pageResponseBuilder = (message, Config) => {
  const uid = getUID(message);
  const endpoint = `${ConfigCategories.PAGE.endpoint.replace("uid", uid)}`;

  const { properties } = message;
  const payload = {};
  const meta = refinePayload(properties, ConfigCategories.PAGE.genericFields);
  const pagePayload = constructPayload(
    message,
    mappingConfig[ConfigCategories.PAGE.name]
  );
  const mergedPayload = { ...meta, ...pagePayload };
  payload.properties = mergedPayload;
  payload.timestamp = getFieldValueFromMessage(message, "timestamp");
  const name = getEvent(message);
  payload.event = name;
  return responseBuilder(
    payload,
    endpoint,
    ConfigCategories.PAGE.method,
    Config
  );
};

const groupResponseBuilder = (message, Config) => {
  const { groupId } = message;
  if (!groupId) {
    throw new ErrorBuilder()
      .setMessage("Group Id can not be empty.")
      .setStatus(400)
      .setStatTags({
        destType: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_PARAM
      })
      .build();
  }
  const uid = getDestinationExternalID(message, "engageId");
  // if (!uid) {
  //   uid = getFieldValueFromMessage(message, "userId");
  // }
  const traits = getFieldValueFromMessage(message, "traits");
  const operation = traits.operation ? traits.operation.toLowerCase() : "add";
  if (!uid && operation === "remove") {
    throw new ErrorBuilder()
      .setMessage("engageID is required for remove operation.")
      .setStatus(400)
      .setStatTags({
        destType: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_PARAM
      })
      .build();
  }
  let { method } = ConfigCategories.GROUP;
  let endpoint = `${ConfigCategories.GROUP.endpoint.replace("id", groupId)}`;
  const subscriberStatus = traits.subscriberStatus || true;
  let payload = { subscribed: subscriberStatus };
  if (uid) {
    endpoint = `${endpoint}/${uid}`;
    if (operation === "add") {
      method = defaultPutRequestConfig.requestMethod;
    } else {
      method = defaultDeleteRequestConfig.requestMethod;
    }
  } else {
    const userPayload = constructPayload(
      message,
      mappingConfig[ConfigCategories.GROUP.name]
    );
    payload = { ...payload, ...userPayload };

    const refinedPayload = refinePayload(
      traits,
      ConfigCategories.GROUP.genericFields
    );
    set(payload, "meta", refinedPayload);
  }
  return responseBuilder(payload, endpoint, method, Config);
};
const process = event => {
  const { message, destination } = event;
  const { Config } = destination;

  if (!message.type) {
    throw new ErrorBuilder()
      .setMessage("Message Type is not present. Aborting message.")
      .setStatus(400)
      .setStatTags({
        destType: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_PARAM
      })
      .build();
  }
  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = identifyResponseBuilder(message, Config);
      break;
    case EventType.TRACK:
      response = trackResponseBuilder(message, Config);
      break;
    case EventType.PAGE:
      response = pageResponseBuilder(message, Config);
      break;
    case EventType.GROUP:
      response = groupResponseBuilder(message, Config);
      break;
    default:
      throw new ErrorBuilder()
        .setMessage(`Message type ${(messageType, Config)} not supported.`)
        .setStatus(400)
        .setStatTags({
          destType: DESTINATION,
          stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
          scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
          meta:
            TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_PARAM
        })
        .build();
  }
  return response;
};
const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  return Promise.all(
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
          await process(input),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
          error.response ? error.response.status : error.code || 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
};

module.exports = { process, processRouterDest };

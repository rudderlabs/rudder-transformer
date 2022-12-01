const { set } = require("lodash");
const {
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  simpleProcessRouterDest,
  getDestinationExternalID
} = require("../../util");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const ErrorBuilder = require("../../util/error");
const { DESTINATION, configCategories } = require("./config");
const { buildLeadPayload, getIdentifyTraits } = require("./util");
const { EventType } = require("../../../constants");

const responseBuilder = (payload, endpoint, method, Config) => {
  const { apiKey } = Config;
  const response = defaultRequestConfig();
  response.headers = {
    "x-api-key": `${apiKey}`
  };
  response.body.JSON = removeUndefinedAndNullValues(payload);
  response.endpoint = endpoint;
  response.method = method;
  return response;
};

const identifyResponseBuilder = (message, Config, leadId) => {
  const traits = getIdentifyTraits(message);
  let endpoint;
  let method;
  const payload = {};
  const leadInfo = buildLeadPayload(message, traits, Config);
  if (!leadId) {
    // creating new Lead
    set(payload, "leads", [leadInfo]);

    // Adding some traits at root level of payload
    if (traits?.dup) {
      set(payload, "dup", traits.dup);
    }
    if (traits?.creator_id) {
      set(payload, "creator_id", traits.creator_id);
    }

    endpoint = configCategories.Create.endpoint;
    method = configCategories.Create.method;
  } else {
    // updating existing lead
    endpoint = `${configCategories.Update.endpoint.replace("leadId", leadId)}`;
    method = configCategories.Update.method;

    if (traits?.status) {
      set(payload, "status", traits.status);
    }

    set(payload, "data", leadInfo);
  }
  return responseBuilder(payload, endpoint, method, Config);
};

const groupResponseBuilder = (message, Config, leadId) => {
  const { groupId, traits } = message;
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
  if (!leadId) {
    throw new ErrorBuilder()
      .setMessage("Lead Id from externalId is not found.")
      .setStatus(400)
      .setStatTags({
        destType: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_PARAM
      })
      .build();
  }
  if (
    traits.operation &&
    traits.operation !== "remove" &&
    traits.operation !== "add"
  ) {
    throw new ErrorBuilder()
      .setMessage(
        `${traits.operation} is invalid for Operation field. Available are add or remove.`
      )
      .setStatus(400)
      .setStatTags({
        destType: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_PARAM
      })
      .build();
  }
  if (traits.operation === "remove") {
    const { method } = configCategories.Group.remove;
    let { endpoint } = configCategories.Group.remove;
    endpoint = endpoint
      .replace(":campaign_id", groupId)
      .replace(":lead_id", leadId);
    return responseBuilder({}, endpoint, method, Config);
  }
  const { method } = configCategories.Group.add;
  let { endpoint } = configCategories.Group.add;
  endpoint = endpoint.replace(":campaign_id", groupId);
  const payload = {};

  if (traits?.mailbox_id) {
    set(payload, "mailbox_id", traits.mailbox_id);
  }

  set(payload, "lead_id", leadId);
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
  const leadId = getDestinationExternalID(message, "persistIqLeadId");
  switch (messageType) {
    case EventType.IDENTIFY:
      response = identifyResponseBuilder(message, Config, leadId);
      break;
    case EventType.GROUP:
      response = groupResponseBuilder(message, Config, leadId);
      break;
    default:
      throw new ErrorBuilder()
        .setMessage(`Message type ${messageType} not supported.`)
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
  const respList = await simpleProcessRouterDest(inputs, "PERSISTIQ", process);
  return respList;
};

module.exports = { process, processRouterDest };

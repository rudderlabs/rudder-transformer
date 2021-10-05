const { EventType } = require("../../../constants");
const {
  CustomError,
  getValueFromMessage,
  getErrorRespEvents,
  getSuccessRespEvents,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  defaultPostRequestConfig,
  getIntegrationsObj,
  isEmptyObject,
  extractCustomFields
} = require("../../util");
const { ENDPOINT, TRACK_EXCLUSION_FIELDS } = require("./config");
const {
  payloadValidator,
  isValidEvent,
  createList,
  createContent,
  createAttachments,
  constructFields,
  createMailSettings,
  createTrackSettings
} = require("./util");

const trackResponseBuilder = async (message, { Config }) => {
  let event = getValueFromMessage(message, "event");
  if (!event) {
    throw new CustomError("event is required for track call", 400);
  }
  event = event.trim().toLowerCase();
  const flag = isValidEvent(Config, event);
  if (!flag) {
    throw new CustomError("event not configured on dashboard", 400);
  }
  let payload = {};
  const integrationsObj = getIntegrationsObj(message, "sendgrid");
  payload.personalizations = integrationsObj.personalizations;

  payload.subject = integrationsObj.subject || Config.subject;

  const attachments = createAttachments(Config);
  if (attachments.length > 0) {
    payload.attachments = attachments;
  }
  const content = createContent(Config);
  if (content.length > 0) {
    payload.content = content;
  }
  payload = constructFields(integrationsObj, payload);

  payload.reply_to = {};
  if (Config.replyToEmail) {
    payload.reply_to.email = Config.replyToEmail;
  }
  if (Config.replyToName) {
    payload.reply_to.name = Config.replyToName;
  }
  if (integrationsObj.replyTo) {
    if (integrationsObj.replyTo.email) {
      payload.reply_to.email = integrationsObj.replyTo.email;
    }
    if (integrationsObj.replyTo.name) {
      payload.reply_to.name = integrationsObj.replyTo.name;
    }
  }

  payload.asm = {};
  if (
    Config.group &&
    !Number.isNaN(Number(Config.group)) &&
    Number.isInteger(Number(Config.group))
  ) {
    payload.asm.group_id = Number(Config.group);
  }
  const groupsToDisplay = createList(Config);
  payload.asm.groups_to_display =
    groupsToDisplay.length > 0 ? groupsToDisplay : null;
  if (
    Config.IPPoolName &&
    Config.IPPoolName.length >= 2 &&
    Config.IPPoolName.length <= 64
  ) {
    payload.ip_pool_name = Config.IPPoolName;
  }

  payload = createMailSettings(payload, integrationsObj, Config);
  payload = createTrackSettings(payload, Config);
  payload.asm = removeUndefinedAndNullValues(payload.asm);
  if (isEmptyObject(payload.asm)) {
    delete payload.asm;
  }
  if (!payload.custom_args) {
    let customFields = {};
    customFields = extractCustomFields(
      message,
      customFields,
      ["integrations.sendgrid"],
      TRACK_EXCLUSION_FIELDS
    );
    if (!isEmptyObject(customFields)) {
      payload.custom_args = customFields;
    }
  }
  payload = payloadValidator(payload);
  payload = removeUndefinedAndNullValues(payload);

  const response = defaultRequestConfig();
  response.headers = {
    Authorization: `Bearer ${Config.apiKey}`,
    "Content-Type": "application/json"
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = ENDPOINT;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
};
const process = event => {
  const { message, destination } = event;
  if (!message.type) {
    throw new CustomError(
      "message Type is not present. Aborting message.",
      400
    );
  }

  if (!destination.Config.apiKey) {
    throw new CustomError("Invalid Api Key", 400);
  }
  const messageType = message.type.toLowerCase();

  let response;
  switch (messageType) {
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination);
      break;
    default:
      throw new CustomError(`message type ${messageType} not supported`, 400);
  }
  return response;
};

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const respList = await Promise.all(
    inputs.map(async input => {
      try {
        return getSuccessRespEvents(
          await process(input),
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

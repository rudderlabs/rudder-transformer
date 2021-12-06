/* eslint-disable object-shorthand */
const { EventType } = require("../../../constants");
const {
  CustomError,
  getValueFromMessage,
  getErrorRespEvents,
  getSuccessRespEvents,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  defaultPostRequestConfig,
  isEmptyObject,
  extractCustomFields,
  constructPayload
} = require("../../util");
const {
  ENDPOINT,
  TRACK_EXCLUSION_FIELDS,
  MIN_POOL_LENGTH,
  MAX_POOL_LENGTH,
  trackMapping
} = require("./config");
const {
  payloadValidator,
  isValidEvent,
  createList,
  createMailSettings,
  createTrackSettings,
  generatePayloadFromConfig,
  requiredFieldValidator
} = require("./util");

const trackResponseBuilder = (message, { Config }) => {
  let event = getValueFromMessage(message, "event");
  if (!event) {
    throw new CustomError("event is required for track call", 400);
  }
  event = event.trim().toLowerCase();
  if (!isValidEvent(Config, event)) {
    throw new CustomError("event not configured on dashboard", 400);
  }
  let payload = {};
  payload = constructPayload(message, trackMapping);
  if (!payload.personalizations) {
    if (Config.mailFromTraits) {
      // if enabled then we look for email in traits and if found we create personalizations object
      const email = getValueFromMessage(message, [
        "traits.email",
        "context.traits.email"
      ]);
      if (email) {
        payload.personalizations = [{ to: [{ email: email }] }];
      } else {
        throw new CustomError(
          "Either email not found in traits or personalizations field is missing/empty",
          400
        );
      }
    }
  }
  payload = generatePayloadFromConfig(payload, Config); // if fields present in config are not/empty in properties we override those properties with config values
  requiredFieldValidator(payload);
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
    Config.IPPoolName.length >= MIN_POOL_LENGTH &&
    Config.IPPoolName.length <= MAX_POOL_LENGTH
  ) {
    payload.ip_pool_name = Config.IPPoolName;
  }
  payload.reply_to = removeUndefinedAndNullValues(payload.reply_to);
  payload.asm = removeUndefinedAndNullValues(payload.asm);
  payload = createMailSettings(payload, message, Config); // we are sending message directly because we want this func to get called everytime, since it can take values from Config as well
  payload = createTrackSettings(payload, Config);
  if (!payload.custom_args) {
    let customFields = {};
    customFields = extractCustomFields(
      message,
      customFields,
      ["properties"],
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

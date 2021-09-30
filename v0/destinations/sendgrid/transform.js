const { EventType } = require("../../../constants");
const {
  CustomError,
  getValueFromMessage,
  constructPayload,
  getErrorRespEvents,
  getSuccessRespEvents,
  removeUndefinedAndNullValues,
  defaultRequestConfig,
  defaultPostRequestConfig,
  getDestinationExternalID
} = require("../../util");
const { ENDPOINT, trackMapping } = require("./config");
const { payloadValidator, eventValidity, createList } = require("./util");

const trackResponseBuilder = async (message, { Config }) => {
  let event = getValueFromMessage(message, "event");
  if (!event) {
    throw new CustomError("event is required for track call", 400);
  }
  event = event.trim().toLowerCase();
  eventValidity(Config, event);
  let payload = constructPayload(message, trackMapping);
  payload = payloadValidator(payload);

  payload.reply_to = {};
  payload.reply_to.email =
    getDestinationExternalID(message, "replyToEmail") || Config.replyToEmail;
  payload.reply_to.name =
    getDestinationExternalID(message, "replyToName") || Config.replyToName;

  payload.asm = {};
  payload.asm.group_id = Config.group;
  const groupsToDisplay = createList(Config);
  payload.asm.groups_to_display =
    groupsToDisplay.length > 0 ? groupsToDisplay : null;

  payload.ip_pool_name = Config.IPPoolName;
  payload.mail_settings = {
    bypass_list_management: {},
    footer: {},
    sandbox_mode: {}
  };
  payload.mail_settings.bypass_list_management.enable = Config.bypassList;
  payload.mail_settings.footer.enable = Config.footer;
  payload.mail_settings.sandbox_mode.enable = Config.sandboxMode;

  payload.tracking_settings = {
    click_tracking: {},
    open_tracking: {},
    subscription_tracking: {}
  };
  payload.tracking_settings.click_tracking.enable = Config.clickTracking;
  payload.tracking_settings.click_tracking.enable_text =
    Config.clickTrackingEnableText;

  payload.tracking_settings.open_tracking.enable = Config.openTracking;
  if (Config.openTrackingSubstitutionTag) {
    payload.tracking_settings.open_tracking.substitution_tag =
      Config.openTrackingSubstitutionTag;
  }
  payload.tracking_settings.subscription_tracking = {};
  payload.tracking_settings.subscription_tracking.enable =
    Config.subscriptionTracking;

  const response = defaultRequestConfig();
  response.headers = {
    Authorization: `Bearer ${Config.apiKey}`
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

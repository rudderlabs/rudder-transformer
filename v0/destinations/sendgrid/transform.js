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
  getIntegrationsObj
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
  const integrationsObj = getIntegrationsObj(message, "sendgrid");

  payload.personalizations = integrationsObj.personalizations;

  payload.reply_to = {};
  payload.reply_to.email = Config.replyToEmail;
  payload.reply_to.name = Config.replyToName;

  if (integrationsObj.replyTo) {
    if (integrationsObj.replyTo.email) {
      payload.reply_to.email = integrationsObj.replyTo.email;
    }
    if (integrationsObj.replyTo.name) {
      payload.reply_to.name = integrationsObj.replyTo.name;
    }
  }
  payload = payloadValidator(payload);

  payload.asm = {};
  payload.asm.group_id = Config.group;
  const groupsToDisplay = createList(Config);
  payload.asm.groups_to_display =
    groupsToDisplay.length > 0 ? groupsToDisplay : null;

  payload.ip_pool_name = Config.IPPoolName;
  if (integrationsObj.mailSettings) {
    const intObjMail = integrationsObj.mailSettings;
    payload.mail_settings = {
      bypass_list_management: {},
      bypass_spam_management: {},
      bypass_bounce_management: {},
      bypass_unsubscribe_management: {},
      footer: {},
      sandbox_mode: {}
    };
    if (intObjMail.bypassListManagement) {
      payload.mail_settings.bypass_list_management.enable =
        intObjMail.bypassListManagement;
    } else {
      if (intObjMail.bypassSpamManagement) {
        payload.bypass_spam_management.enable = intObjMail.bypassSpamManagement;
      }
      if (intObjMail.bypassBounceManagement) {
        payload.bypass_bounce_management.enable =
          intObjMail.bypassBounceManagement;
      }
      if (intObjMail.bypassUnsubscribeManagement) {
        payload.bypass_unsubscribe_management.enable =
          intObjMail.bypassUnsubscribeManagement;
      }
    }
    if (intObjMail.footer) {
      payload.mail_settings.footer.enable = intObjMail.footer;
    }
    if (intObjMail.sandboxMode) {
      payload.mail_settings.sandbox_mode.enable = intObjMail.sandboxMode;
    }
  }

  payload.tracking_settings = {
    click_tracking: {},
    open_tracking: {},
    subscription_tracking: {},
    ganalytics: {}
  };
  payload.tracking_settings.click_tracking.enable = Config.clickTracking;
  payload.tracking_settings.click_tracking.enable_text =
    Config.clickTrackingEnableText;

  payload.tracking_settings.open_tracking.enable = Config.openTracking;
  payload.tracking_settings.open_tracking.substitution_tag =
    Config.openTrackingSubstitutionTag;

  payload.tracking_settings.subscription_tracking = {};
  payload.tracking_settings.subscription_tracking.enable =
    Config.subscriptionTracking;
  payload.tracking_settings.subscription_tracking.text = Config.text;
  payload.tracking_settings.subscription_tracking.html = Config.html;
  payload.tracking_settings.subscription_tracking.substitution_tag =
    Config.substitutionTag;

  payload.tracking_settings.ganalytics.enable = Config.ganalytics;
  payload.tracking_settings.ganalytics.utm_source = Config.utmSource;
  payload.tracking_settings.ganalytics.utm_medium = Config.utmMedium;
  payload.tracking_settings.ganalytics.utm_term = Config.utmTerm;
  payload.tracking_settings.ganalytics.utm_content = Config.utmContent;
  payload.tracking_settings.ganalytics.utm_campaign = Config.utmCampaign;

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

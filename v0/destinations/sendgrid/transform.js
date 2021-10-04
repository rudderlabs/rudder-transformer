const logger = require("../../../logger");
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
  isEmptyObject
} = require("../../util");
const { ENDPOINT } = require("./config");
const {
  payloadValidator,
  eventValidity,
  createList,
  createContent,
  createAttachments,
  constructFields
} = require("./util");

const trackResponseBuilder = async (message, { Config }) => {
  let event = getValueFromMessage(message, "event");
  if (!event) {
    throw new CustomError("event is required for track call", 400);
  }
  event = event.trim().toLowerCase();
  eventValidity(Config, event);
  let payload = {};
  const integrationsObj = getIntegrationsObj(message, "sendgrid");
  if (!integrationsObj) {
    logger.error("integration object not found");
  }
  payload.personalizations = integrationsObj.personalizations;

  payload.subject = integrationsObj.subject
    ? integrationsObj.subject
    : Config.subject;
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
  payload = payloadValidator(payload);
  payload.asm = {};
  if (
    Config.group &&
    !isNaN(Number(Config.group)) &&
    Number.isInteger(Number(Config.group))
  ) {
    payload.asm.group_id = Number(Config.group);
  }
  const groupsToDisplay = createList(Config);
  payload.asm.groups_to_display =
    groupsToDisplay.length > 0 ? groupsToDisplay : null;
  if (
    Config.IPPoolName &&
    Config.IPPoolName.length > 2 &&
    Config.IPPoolName.length < 64
  ) {
    payload.ip_pool_name = Config.IPPoolName;
  }
  payload.mail_settings = {
    bypass_list_management: {},
    bypass_spam_management: {},
    bypass_bounce_management: {},
    bypass_unsubscribe_management: {},
    footer: {},
    sandbox_mode: {}
  };
  payload.mail_settings.footer.enable = Config.footer;
  payload.mail_settings.footer.text = Config.footerText;
  payload.mail_settings.footer.html = Config.footerHtml;
  payload.mail_settings.sandbox_mode.enable = Config.sandboxMode;
  if (integrationsObj.mailSettings) {
    const intObjMail = integrationsObj.mailSettings;
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
    if (intObjMail.footerText) {
      payload.mail_settings.footer.text = intObjMail.footerText;
    }
    if (intObjMail.footerHtml) {
      payload.mail_settings.footer.html = intObjMail.footerHtml;
    }
    if (intObjMail.sandboxMode) {
      payload.mail_settings.sandbox_mode.enable = intObjMail.sandboxMode;
    }
  }
  if (isEmptyObject(payload.mail_settings.bypass_list_management)) {
    delete payload.mail_settings.bypass_list_management;
  }

  if (isEmptyObject(payload.mail_settings.bypass_spam_management)) {
    delete payload.mail_settings.bypass_spam_management;
  }
  if (isEmptyObject(payload.mail_settings.bypass_bounce_management)) {
    delete payload.mail_settings.bypass_bounce_management;
  }
  if (isEmptyObject(payload.mail_settings.bypass_unsubscribe_management)) {
    delete payload.mail_settings.bypass_unsubscribe_management;
  }
  payload.mail_settings.footer = removeUndefinedAndNullValues(
    payload.mail_settings.footer
  );

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
    Config.subscriptionTracking || false;
  payload.tracking_settings.subscription_tracking.text = Config.text || null;
  payload.tracking_settings.subscription_tracking.html = Config.html || null;
  payload.tracking_settings.subscription_tracking.substitution_tag =
    Config.substitutionTag || null;

  payload.tracking_settings.ganalytics.enable = Config.ganalytics;
  payload.tracking_settings.ganalytics.utm_source = Config.utmSource || null;
  payload.tracking_settings.ganalytics.utm_medium = Config.utmMedium || null;
  payload.tracking_settings.ganalytics.utm_term = Config.utmTerm || null;
  payload.tracking_settings.ganalytics.utm_content = Config.utmContent || null;
  payload.tracking_settings.ganalytics.utm_campaign =
    Config.utmCampaign || null;

  payload.tracking_settings.ganalytics = removeUndefinedAndNullValues(
    payload.tracking_settings.ganalytics
  );
  payload.tracking_settings.subscription_tracking = removeUndefinedAndNullValues(
    payload.tracking_settings.subscription_tracking
  );
  payload.tracking_settings.ganalytics = removeUndefinedAndNullValues(
    payload.tracking_settings.ganalytics
  );
  payload.asm = removeUndefinedAndNullValues(payload.asm);
  if (isEmptyObject(payload.asm)) {
    delete payload.asm;
  }
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

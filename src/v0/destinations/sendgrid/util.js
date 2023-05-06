const get = require('get-value');
const logger = require('../../../logger');
const {
  isEmpty,
  isObject,
  isEmptyObject,
  getHashFromArray,
  constructPayload,
  isHttpStatusSuccess,
  getValueFromMessage,
  defaultPutRequestConfig,
  getFieldValueFromMessage,
  getDestinationExternalID,
  removeUndefinedAndNullValues,
  removeUndefinedAndNullAndEmptyValues,
} = require('../../util');
const tags = require('../../util/tags');
const Cache = require('../../util/cache');
const {
  getDynamicErrorType,
  processAxiosResponse,
} = require('../../../adapters/utils/networkUtils');
const { httpGET } = require('../../../adapters/network');
const { NetworkError, ConfigurationError, InstrumentationError } = require('../../util/errorTypes');
const { AUTH_CACHE_TTL, JSON_MIME_TYPE } = require('../../util/constant');
const { MAPPING_CONFIG, CONFIG_CATEGORIES } = require('./config');

const customFieldsCache = new Cache(AUTH_CACHE_TTL);

const isValidBase64 = (content) => {
  const re = /^(?:[\d+/A-Za-z]{4})*(?:[\d+/A-Za-z]{2}==|[\d+/A-Za-z]{3}=)?$/;
  return re.test(String(content));
};

const isValidEvent = (Config, event) => {
  let flag = false;
  Config.eventNamesSettings.some((eventName) => {
    if (
      eventName.event &&
      eventName.event.trim().length > 0 &&
      eventName.event.trim().toLowerCase() === event
    ) {
      flag = true;
      return true;
    }
    return false;
  });
  return flag;
};

/**
 * Validation for track call
 * @param {*} message
 * @returns
 */
const validateTrackPayload = (message, Config) => {
  let event = getValueFromMessage(message, 'event');
  if (!event) {
    throw new InstrumentationError('Event is required for track call');
  }
  event = event.trim().toLowerCase();
  if (!isValidEvent(Config, event)) {
    throw new ConfigurationError('Event not configured on dashboard');
  }
};

const requiredFieldValidator = (payload) => {
  if (!payload.template_id && (!payload.content || (payload.content && isEmpty(payload.content)))) {
    throw new InstrumentationError('Either template id or content is required');
  }
  if (!payload.personalizations || isEmpty(payload.personalizations)) {
    throw new InstrumentationError('Personalizations field cannot be missing or empty');
  }
  if (!payload.from) {
    throw new InstrumentationError('From is required field');
  }
  if (payload.from && !payload.from.email) {
    throw new InstrumentationError('Email inside from object is required');
  }
};

const payloadValidator = (payload) => {
  const updatedPayload = payload;

  // each item in personalizations array must have 'to' field
  if (payload.personalizations) {
    payload.personalizations.forEach((keys, index) => {
      const personalizationsArr = [];
      if (keys.to && (payload.subject || keys.subject)) {
        keys.to.forEach((keyto) => {
          if (keyto.email) {
            personalizationsArr.push(keyto);
          }
        });
      } else {
        logger.error(`item at index ${index} dropped. to field is mandatory`);
      }
      updatedPayload.personalizations[index].to = personalizationsArr;
    });
  }
  if (payload.attachments) {
    payload.attachments.forEach((attachment, index) => {
      if (!attachment.content || !attachment.filename) {
        updatedPayload.attachments[index] = null;
        logger.error('content and filename are required for attachments');
      }
      if (payload.attachments.content && !isValidBase64(payload.attachments.content)) {
        updatedPayload.attachments[index] = null;
        logger.error('content should be base64 encoded');
      }
    });
  }
  if (payload.categories) {
    payload.categories.forEach((category, index) => {
      if (typeof category !== 'string') {
        updatedPayload.categories[index] = JSON.stringify(category);
      }
    });
    payload.categories.splice(10); // categories can only have 10 items
  }
  if (payload.headers && !isObject(payload.headers)) {
    updatedPayload.headers = null;
  }
  if (payload.subject && payload.subject.length === 0) {
    delete updatedPayload.subject;
  }
  if (isEmptyObject(payload.reply_to)) {
    delete updatedPayload.reply_to;
  }
  if (payload.reply_to && !payload.reply_to.email) {
    logger.error('reply_to object requires email field');
    delete updatedPayload.reply_to;
  }
  if (payload.asm && payload.asm.groups_to_display && !payload.asm.group_id) {
    logger.error('group Id parameter is required in asm');
    delete updatedPayload.asm;
  }
  if (isEmptyObject(payload.asm)) {
    delete updatedPayload.asm;
  }
  return updatedPayload;
};

const createList = (Config) => {
  const asmList = [];
  if (Config.groupsToDisplay && Config.groupsToDisplay.length > 0) {
    Config.groupsToDisplay.forEach((groups) => {
      if (
        groups.groupId &&
        groups.groupId.trim() &&
        !Number.isNaN(Number(groups.groupId)) &&
        Number.isInteger(Number(groups.groupId))
      ) {
        asmList.push(Number(groups.groupId));
      }
    });
  }
  return asmList;
};

const createContent = (Config) => {
  const contentList = [];
  if (Config.contents && Config.contents.length > 0) {
    const len = Config.contents.length - 1;
    Config.contents.forEach((content, index) => {
      if (content.type && content.value) {
        contentList.push(content);
      } else if (index < len) {
        logger.error(`item at index ${index} dropped. type and value are required fields`);
      }
    });
  }
  return contentList;
};

const createAttachments = (Config) => {
  const attachmentList = [];
  if (Config.attachments && Config.attachments.length > 0) {
    const len = Config.attachments.length - 1;
    Config.attachments.forEach((attachment, index) => {
      if (attachment.content && attachment.filename) {
        attachmentList.push(removeUndefinedAndNullAndEmptyValues(attachment));
      } else if (index < len) {
        logger.error(`item at index ${index} dropped. content and type are required fields`);
      }
    });
  }
  return attachmentList;
};

const createMailSettings = (payload, message, Config) => {
  const updatedPayload = payload;
  updatedPayload.mail_settings = {
    bypass_list_management: {},
    bypass_spam_management: {},
    bypass_bounce_management: {},
    bypass_unsubscribe_management: {},
    footer: {},
    sandbox_mode: {},
  };
  updatedPayload.mail_settings.footer.enable = Config.footer;
  updatedPayload.mail_settings.footer.text = Config.footerText;
  updatedPayload.mail_settings.footer.html = Config.footerHtml;
  updatedPayload.mail_settings.sandbox_mode.enable = Config.sandboxMode;

  if (message.properties.mailSettings) {
    const mailObj = message.properties.mailSettings;
    if (mailObj.bypassListManagement) {
      updatedPayload.mail_settings.bypass_list_management.enable = mailObj.bypassListManagement;
    } else {
      if (mailObj.bypassSpamManagement) {
        updatedPayload.mail_settings.bypass_spam_management.enable = mailObj.bypassSpamManagement;
      }
      if (mailObj.bypassBounceManagement) {
        updatedPayload.mail_settings.bypass_bounce_management.enable =
          mailObj.bypassBounceManagement;
      }
      if (mailObj.bypassUnsubscribeManagement) {
        updatedPayload.mail_settings.bypass_unsubscribe_management.enable =
          mailObj.bypassUnsubscribeManagement;
      }
    }
    if (mailObj.footer) {
      updatedPayload.mail_settings.footer.enable = mailObj.footer;
    }
    if (mailObj.footerText) {
      updatedPayload.mail_settings.footer.text = mailObj.footerText;
    }
    if (mailObj.footerHtml) {
      updatedPayload.mail_settings.footer.html = mailObj.footerHtml;
    }
    if (mailObj.sandboxMode) {
      updatedPayload.mail_settings.sandbox_mode.enable = mailObj.sandboxMode;
    }
  }
  const list = [
    'bypass_list_management',
    'bypass_spam_management',
    'bypass_bounce_management',
    'bypass_unsubscribe_management',
  ];
  list.forEach((key) => {
    if (isEmptyObject(updatedPayload.mail_settings[key])) {
      delete updatedPayload.mail_settings[key];
    }
  });
  if (isEmpty(updatedPayload.mail_settings.footer.text)) {
    updatedPayload.mail_settings.footer.text = null;
  }
  if (isEmpty(updatedPayload.mail_settings.footer.html)) {
    updatedPayload.mail_settings.footer.html = null;
  }
  updatedPayload.mail_settings.footer = removeUndefinedAndNullValues(
    updatedPayload.mail_settings.footer,
  );
  updatedPayload.mail_settings = removeUndefinedAndNullValues(payload.mail_settings);
  if (!updatedPayload.mail_settings.footer.enable) {
    delete updatedPayload.mail_settings.footer;
  }
  if (!updatedPayload.mail_settings.sandbox_mode.enable) {
    delete updatedPayload.mail_settings.sandbox_mode;
  }
  if (isEmptyObject(updatedPayload.mail_settings)) {
    delete updatedPayload.mail_settings;
  }
  return updatedPayload;
};

const createTrackSettings = (payload, Config) => {
  const updatedPayload = payload;
  updatedPayload.tracking_settings = {
    click_tracking: {},
    open_tracking: {},
    subscription_tracking: {},
    ganalytics: {},
  };
  updatedPayload.tracking_settings.click_tracking.enable = Config.clickTracking;
  updatedPayload.tracking_settings.click_tracking.enable_text = Config.clickTrackingEnableText;

  updatedPayload.tracking_settings.open_tracking.enable = Config.openTracking;
  updatedPayload.tracking_settings.open_tracking.substitution_tag =
    Config.openTrackingSubstitutionTag || null;

  updatedPayload.tracking_settings.subscription_tracking = {};
  updatedPayload.tracking_settings.subscription_tracking.enable =
    Config.subscriptionTracking || false;
  updatedPayload.tracking_settings.subscription_tracking.text = Config.text || null;
  updatedPayload.tracking_settings.subscription_tracking.html = Config.html || null;
  updatedPayload.tracking_settings.subscription_tracking.substitution_tag =
    Config.substitutionTag || null;

  updatedPayload.tracking_settings.ganalytics.enable = Config.ganalytics;
  updatedPayload.tracking_settings.ganalytics.utm_source = Config.utmSource || null;
  updatedPayload.tracking_settings.ganalytics.utm_medium = Config.utmMedium || null;
  updatedPayload.tracking_settings.ganalytics.utm_term = Config.utmTerm || null;
  updatedPayload.tracking_settings.ganalytics.utm_content = Config.utmContent || null;
  updatedPayload.tracking_settings.ganalytics.utm_campaign = Config.utmCampaign || null;

  const list = ['ganalytics', 'subscription_tracking', 'open_tracking'];
  list.forEach((key) => {
    updatedPayload.tracking_settings[key] = removeUndefinedAndNullValues(
      payload.tracking_settings[key],
    );
  });

  updatedPayload.tracking_settings = removeUndefinedAndNullValues(payload.tracking_settings);
  // when not enabled then its any fields inside it are not required
  if (!updatedPayload.tracking_settings.subscription_tracking.enable) {
    delete updatedPayload.tracking_settings.subscription_tracking;
  }
  if (!updatedPayload.tracking_settings.open_tracking.enable) {
    delete updatedPayload.tracking_settings.open_tracking;
  }
  if (!updatedPayload.tracking_settings.ganalytics.enable) {
    delete updatedPayload.tracking_settings.ganalytics;
  }
  if (
    !updatedPayload.tracking_settings.click_tracking.enable &&
    !updatedPayload.tracking_settings.click_tracking.enable_text
  ) {
    delete updatedPayload.tracking_settings.click_tracking;
  }
  if (isEmptyObject(updatedPayload.tracking_settings)) {
    delete updatedPayload.tracking_settings;
  }
  return updatedPayload;
};

const generatePayloadFromConfig = (payload, Config) => {
  const updatedPayload = payload;
  if (!payload.from) {
    updatedPayload.from = {};
    updatedPayload.from.email = Config.fromEmail;
    updatedPayload.from.name = Config.fromName ? Config.fromName : null;
    updatedPayload.from = removeUndefinedAndNullValues(updatedPayload.from);
  }
  if (Config.templateId && !payload.template_id) {
    updatedPayload.template_id = Config.templateId;
  }
  if (!payload.attachments || (payload.attachments && isEmpty(payload.attachments))) {
    const attachments = createAttachments(Config);
    if (attachments.length > 0) {
      updatedPayload.attachments = attachments;
    } else {
      delete updatedPayload.attachments;
    }
  }

  if (!payload.content || (payload.content && isEmpty(payload.content))) {
    const content = createContent(Config);
    if (content.length > 0) {
      updatedPayload.content = content;
    } else {
      delete updatedPayload.content;
    }
  }
  if (!payload.subject || (payload.subject && isEmpty(payload.subject))) {
    updatedPayload.subject = Config.subject;
  }
  if (!payload.reply_to) {
    updatedPayload.reply_to = {};
    updatedPayload.reply_to.email = Config.replyToEmail ? Config.replyToEmail : null;
    updatedPayload.reply_to.name = Config.replyToName ? Config.replyToName : null;
  }
  return updatedPayload;
};

/**
 * Validation for an identify call
 * @param {*} message
 * @returns
 */
const validateIdentifyPayload = (message) => {
  const email = getFieldValueFromMessage(message, 'email');
  if (!email) {
    throw new InstrumentationError('Parameter mail is required');
  }
};

/**
 * Returns address in string format
 * @param {*} address
 * @returns
 */
const flattenAddress = (address) => {
  const addressType = typeof address;
  let companyAddress = '';
  if (addressType === 'object') {
    const keys = Object.keys(address);
    keys.forEach((key) => {
      companyAddress += `${address[key]} `;
    });
  } else {
    companyAddress = address;
  }
  return companyAddress.trim();
};

/**
 * Returns contactListIds in string format
 * contactListIds : it's a string created from an array
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const getContactListIds = (message, destination) => {
  const { Config } = destination;
  const contactListIds = [];
  const listIds = getDestinationExternalID(message, 'listIds');

  if (Config.listId) {
    contactListIds.push(Config.listId);
  }

  if (listIds && typeof listIds === 'string') {
    contactListIds.push(listIds);
  }

  if (listIds && Array.isArray(listIds)) {
    contactListIds.push(...listIds);
  }
  return contactListIds.sort().toString();
};

/**
 * Returns the list of custom_fields
 * @param {*} destination
 * @returns
 */
const fetchCustomFields = async (destination) => {
  const { apiKey } = destination.Config;
  return customFieldsCache.get(destination.ID, async () => {
    const requestOptions = {
      headers: {
        'Content-Type': JSON_MIME_TYPE,
        Authorization: `Bearer ${apiKey}`,
      },
    };
    const endpoint = 'https://api.sendgrid.com/v3/marketing/field_definitions';

    const resonse = await httpGET(endpoint, requestOptions);
    const processedResponse = processAxiosResponse(resonse);
    if (isHttpStatusSuccess(processedResponse.status)) {
      const { custom_fields: customFields } = processedResponse.response;
      return customFields;
    }

    const { message } = processedResponse.response.errors[0];
    const status = processedResponse.status || 400;
    throw new NetworkError(
      message,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      processedResponse.response,
    );
  });
};

/**
 * Returns customField object
 * @param {*} message
 * @param {*} destination
 * @param {*} contactDetails
 * @returns
 */
const getCustomFields = async (message, destination) => {
  const customFields = {};
  const payload = get(message, 'context.traits');
  const { customFieldsMapping } = destination.Config;
  const fieldsMapping = getHashFromArray(customFieldsMapping, 'from', 'to', false);
  const fields = Object.keys(fieldsMapping);
  if (fields.length > 0) {
    const destinationCustomFields = await fetchCustomFields(destination);
    const customFieldNameToIdMapping = {};
    const customFieldNamesArray = destinationCustomFields.map((destinationCustomField) => {
      const { id, name } = destinationCustomField;
      customFieldNameToIdMapping[name] = id;
      return name;
    });

    if (!isEmptyObject(payload)) {
      fields.forEach((field) => {
        if (payload[field]) {
          const customFieldName = fieldsMapping[field];
          if (customFieldNamesArray.includes(customFieldName)) {
            const customFieldId = customFieldNameToIdMapping[customFieldName];
            customFields[customFieldId] = payload[field];
          }
        }
      });
    }
  }
  return customFields;
};

/**
 * Returns Create Or Update Contact Payload
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const createOrUpdateContactPayloadBuilder = async (message, destination) => {
  const contactDetails = constructPayload(message, MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name]);
  if (contactDetails.address_line_1) {
    contactDetails.address_line_1 = flattenAddress(contactDetails.address_line_1);
  }
  const contactListIds = getContactListIds(message, destination);
  contactDetails.custom_fields = await getCustomFields(message, destination);
  const payload = { contactDetails, contactListIds };
  const { endpoint } = CONFIG_CATEGORIES.IDENTIFY;
  const method = defaultPutRequestConfig.requestMethod;
  return { payload, method, endpoint };
};

module.exports = {
  createList,
  isValidEvent,
  payloadValidator,
  createMailSettings,
  createTrackSettings,
  validateTrackPayload,
  requiredFieldValidator,
  validateIdentifyPayload,
  generatePayloadFromConfig,
  createOrUpdateContactPayloadBuilder,
};

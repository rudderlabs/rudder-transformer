/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
const { EventType } = require('../../../constants');
const {
  defaultRequestConfig,
  simpleProcessRouterDest,
  constructPayload,
  removeUndefinedAndNullValues,
  defaultPostRequestConfig,
  getFieldValueFromMessage,
  getDestinationExternalID,
  defaultPutRequestConfig,
  getIntegrationsObj,
  ErrorMessage,
} = require('../../util');
const { CONFIG_CATEGORIES, MAPPING_CONFIG, getUnlinkContactEndpoint } = require('./config');
const {
  prepareEmailFromPhone,
  checkIfEmailOrPhoneExists,
  validateEmailAndPhone,
  checkIfContactExists,
  prepareHeader,
  removeEmptyKey,
  transformUserTraits,
  prepareTrackEventData,
  getListIds,
} = require('./util');
const { TransformationError, InstrumentationError } = require('../../util/errorTypes');

const responseBuilder = (
  payload,
  endpoint,
  destination,
  trackerApi = false,
  method = defaultPostRequestConfig.requestMethod,
) => {
  if (payload) {
    const response = defaultRequestConfig();
    const { apiKey, clientKey } = destination.Config;
    response.endpoint = endpoint;
    response.headers = prepareHeader(apiKey, clientKey, trackerApi);
    response.method = method;
    response.body.JSON = removeUndefinedAndNullValues(removeEmptyKey(payload));
    return response;
  }
  // fail-safety for developer error
  throw new TransformationError(ErrorMessage.FailedToConstructPayload);
};

// ref:- https://developers.sendinblue.com/reference/removecontactfromlist
const unlinkContact = (message, destination, unlinkListIds) => {
  const returnValue = [];
  let payload;
  const email = getFieldValueFromMessage(message, 'emailOnly');
  let phone = getFieldValueFromMessage(message, 'phone');
  const contactId = getDestinationExternalID(message, 'sendinblueContactId');

  if (phone) {
    phone = prepareEmailFromPhone(phone);
  }
  if (email || phone) {
    payload = { emails: [email || phone] };
  } else if (contactId) {
    payload = { ids: [contactId] };
  } else {
    throw new InstrumentationError(
      'At least one of `email` or `phone` or `contactId` is required to unlink the contact from a given list',
    );
  }

  unlinkListIds.forEach((listId) => {
    const endpoint = getUnlinkContactEndpoint(listId);
    const response = responseBuilder(payload, endpoint, destination);
    returnValue.push(response);
  });
  return returnValue;
};

// ref:- https://developers.sendinblue.com/reference/createcontact
const createOrUpdateContactResponseBuilder = (message, destination) => {
  const { endpoint, name } = CONFIG_CATEGORIES.CREATE_OR_UPDATE_CONTACT;
  const payload = constructPayload(message, MAPPING_CONFIG[name]);

  checkIfEmailOrPhoneExists(payload.email, payload.attributes?.SMS);
  validateEmailAndPhone(payload.email, payload.attributes?.SMS);
  validateEmailAndPhone(payload.attributes?.EMAIL);

  // Can update a contact in the same request
  payload.updateEnabled = true;

  const listIds = getListIds(message, 'sendinblueIncludeListIds');

  if (listIds.length > 0) {
    payload.listIds = listIds;
  }

  const integrationsObj = getIntegrationsObj(message, 'sendinblue');
  payload.emailBlacklisted = integrationsObj?.emailBlacklisted;
  payload.smsBlacklisted = integrationsObj?.smsBlacklisted;

  const userTraits = transformUserTraits(
    payload.attributes,
    destination.Config.contactAttributeMapping,
  );

  payload.attributes = userTraits;

  return responseBuilder(payload, endpoint, destination);
};

// ref:- https://developers.sendinblue.com/reference/createdoicontact
const createDOIContactResponseBuilder = (message, destination) => {
  const { endpoint, name } = CONFIG_CATEGORIES.CREATE_DOI_CONTACT;
  const payload = constructPayload(message, MAPPING_CONFIG[name]);
  const { templateId, redirectionUrl, contactAttributeMapping } = destination.Config;
  let doiTemplateId = getDestinationExternalID(message, 'sendinblueDOITemplateId') || templateId;

  if (!doiTemplateId) {
    throw new InstrumentationError('templateId is required to create a contact using DOI');
  }

  doiTemplateId = parseInt(doiTemplateId, 10);

  if (Number.isNaN(doiTemplateId)) {
    throw new InstrumentationError('templateId must be an integer');
  }

  const listIds = getListIds(message, 'sendinblueIncludeListIds');
  if (listIds.length === 0) {
    throw new InstrumentationError(
      'sendinblueIncludeListIds is required to create a contact using DOI',
    );
  }

  payload.templateId = doiTemplateId;
  payload.redirectionUrl = redirectionUrl;
  payload.includeListIds = listIds;

  const userTraits = transformUserTraits(payload.attributes, contactAttributeMapping);

  payload.attributes = userTraits;

  return responseBuilder(payload, endpoint, destination);
};

// ref:- https://developers.sendinblue.com/reference/updatecontact
// identifier -> email or phone or contact id
const updateDOIContactResponseBuilder = (message, destination, identifier) => {
  let { endpoint } = CONFIG_CATEGORIES.UPDATE_DOI_CONTACT;
  const { name } = CONFIG_CATEGORIES.UPDATE_DOI_CONTACT;
  endpoint = endpoint.replace('<identifier>', identifier);
  const payload = constructPayload(message, MAPPING_CONFIG[name]);

  validateEmailAndPhone(payload.attributes?.EMAIL);

  const listIds = getListIds(message, 'sendinblueIncludeListIds');
  const unlinkListIds = getListIds(message, 'sendinblueUnlinkListIds');

  if (listIds.length > 0) {
    payload.listIds = listIds;
  }
  if (unlinkListIds.length > 0) {
    payload.unlinkListIds = unlinkListIds;
  }

  const integrationsObj = getIntegrationsObj(message, 'sendinblue');
  payload.emailBlacklisted = integrationsObj?.emailBlacklisted;
  payload.smsBlacklisted = integrationsObj?.smsBlacklisted;

  return responseBuilder(
    payload,
    endpoint,
    destination,
    false,
    defaultPutRequestConfig.requestMethod,
  );
};

const createOrUpdateDOIContactResponseBuilder = async (message, destination) => {
  let email = getFieldValueFromMessage(message, 'emailOnly');
  const phone = getFieldValueFromMessage(message, 'phone');

  validateEmailAndPhone(email, phone);

  if (email) {
    email = encodeURIComponent(email);
  }

  const contactId = getDestinationExternalID(message, 'sendinblueContactId');
  const identifier = email || contactId;

  if (!identifier) {
    throw new InstrumentationError(
      'At least one of `email` or `contactId` is required to update the contact using DOI',
    );
  }

  const { apiKey } = destination.Config;
  const contactExists = await checkIfContactExists(identifier, apiKey);

  if (contactExists) {
    return updateDOIContactResponseBuilder(message, destination, identifier);
  }

  return createDOIContactResponseBuilder(message, destination);
};

const identifyResponseBuilder = async (message, destination) => {
  const { doi } = destination.Config;
  if (!doi) {
    const unlinkListIds = getListIds(message, 'sendinblueUnlinkListIds');
    if (unlinkListIds.length > 0) {
      return unlinkContact(message, destination, unlinkListIds);
    }
    return createOrUpdateContactResponseBuilder(message, destination);
  }

  return createOrUpdateDOIContactResponseBuilder(message, destination);
};

// ref:- https://tracker-doc.sendinblue.com/reference/trackevent-3
const trackEventResponseBuilder = (message, destination) => {
  const { endpoint, name } = CONFIG_CATEGORIES.TRACK_EVENTS;
  const payload = constructPayload(message, MAPPING_CONFIG[name]);

  checkIfEmailOrPhoneExists(payload.email, payload.properties?.SMS);
  validateEmailAndPhone(payload.email, payload.properties?.SMS);

  if (!payload.email) {
    payload.email = prepareEmailFromPhone(payload.properties?.SMS);
  }

  const eventdata = prepareTrackEventData(message, payload);
  payload.eventdata = eventdata;
  delete payload.messageId;
  delete payload.data;

  if (!destination.Config.sendTraitsInTrack) {
    delete payload.properties;
    return responseBuilder(payload, endpoint, destination, true);
  }

  const userTraits = transformUserTraits(
    payload.properties,
    destination.Config.contactAttributeMapping,
  );

  payload.properties = userTraits;

  return responseBuilder(payload, endpoint, destination, true);
};

// ref:- https://tracker-doc.sendinblue.com/reference/tracklink-3
const trackLinkResponseBuilder = (message, destination) => {
  const { endpoint, name } = CONFIG_CATEGORIES.TRACK_LINK;
  const payload = constructPayload(message, MAPPING_CONFIG[name]);

  const phone = getFieldValueFromMessage(message, 'phone');
  checkIfEmailOrPhoneExists(payload.email, phone);
  validateEmailAndPhone(payload.email, phone);

  if (!payload.email) {
    payload.email = prepareEmailFromPhone(phone);
  }
  return responseBuilder(payload, endpoint, destination, true);
};

const trackResponseBuilder = (message, destination) => {
  const { event } = message;
  if (!event) {
    throw new InstrumentationError('Event name is required');
  }
  if (event.toLowerCase() === CONFIG_CATEGORIES.TRACK_LINK.eventName.toLowerCase()) {
    return trackLinkResponseBuilder(message, destination);
  }

  return trackEventResponseBuilder(message, destination);
};

// ref:- https://tracker-doc.sendinblue.com/reference/trackpage-3
const pageResponseBuilder = (message, destination) => {
  const { endpoint, name } = CONFIG_CATEGORIES.PAGE;
  let payload = constructPayload(message, MAPPING_CONFIG[name]);

  const phone = getFieldValueFromMessage(message, 'phone');

  checkIfEmailOrPhoneExists(payload.email, phone);

  if (!payload.email) {
    payload.email = prepareEmailFromPhone(phone);
  }

  const { ma_title, ma_path, ma_referrer, sib_name, properties, ...rest } = payload;

  const propertiesObject = {
    ma_title,
    ma_path,
    ma_referrer,
    sib_name,
    ...properties,
  };

  payload = { ...rest, properties: propertiesObject };

  return responseBuilder(payload, endpoint, destination, true);
};

const processEvent = async (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }

  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = await identifyResponseBuilder(message, destination);
      break;
    case EventType.TRACK:
      response = trackResponseBuilder(message, destination);
      break;
    case EventType.PAGE:
      response = pageResponseBuilder(message, destination);
      break;
    default:
      throw new InstrumentationError(`Event type "${messageType}" is not supported`);
  }
  return response;
};

const process = (event) => processEvent(event.message, event.destination);

const processRouterDest = async (inputs) => {
  const respList = await simpleProcessRouterDest(inputs, process, process);
  return respList;
};

module.exports = { process, processRouterDest };

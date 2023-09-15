const { EventType } = require('../../../constants');
const { ConfigCategory, ReservedUserAttributes, ReservedCompanyAttributes } = require('./config');
const {
  flattenJson,
  isDefinedAndNotNull,
  defaultRequestConfig,
  getFieldValueFromMessage,
  removeUndefinedAndNullValues,
} = require('../../util');
const {
  getHeaders,
  getPayload,
  validateTrack,
  fetchContactId,
  getLookUpField,
  getBaseEndpoint,
  validateIdentify,
  createOrUpdateCompany,
  filterCustomAttributes,
  separateReservedAndRestMetadata,
} = require('./util');
const { InstrumentationError, NetworkError } = require('../../util/errorTypes');

const responseBuilder = (payload, endpoint, requestMethod, destination) => {
  const response = defaultRequestConfig();
  response.method = requestMethod;
  response.endpoint = endpoint;
  response.headers = getHeaders(destination);
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
};

const identifyResponseBuilder = async (message, destination) => {
  const payload = getPayload(message, ConfigCategory.IDENTIFY);
  validateIdentify(payload);

  if (payload.name === undefined || payload.name === '') {
    const firstName = getFieldValueFromMessage(message, 'firstName');
    const lastName = getFieldValueFromMessage(message, 'lastName');
    if (firstName && lastName) {
      payload.name = `${firstName} ${lastName}`;
    } else {
      payload.name = firstName || lastName;
    }
  }

  payload.custom_attributes = filterCustomAttributes(payload, ReservedUserAttributes);

  let endpoint;
  let requestMethod;
  const lookupField = getLookUpField(message);
  const contactId = await fetchContactId(message, destination, lookupField);

  const baseEndPoint = getBaseEndpoint(destination);
  if (contactId) {
    requestMethod = 'PUT';
    endpoint = `${baseEndPoint}/${ConfigCategory.IDENTIFY.endpoint}/${contactId}`;
  } else {
    requestMethod = 'POST';
    endpoint = `${baseEndPoint}/${ConfigCategory.IDENTIFY.endpoint}`;
  }

  const { sendAnonymousId } = destination.Config;

  if (!payload.external_id && sendAnonymousId && message.anonymousId) {
    payload.external_id = message.anonymousId;
  }

  return responseBuilder(payload, endpoint, requestMethod, destination);
};

const trackResponseBuilder = (message, destination) => {
  let payload = getPayload(message, ConfigCategory.TRACK);
  validateTrack(payload);

  // pass only string, number, boolean properties
  if (payload.metadata) {
    // reserved metadata contains JSON objects that does not requires flattening
    const { reservedMetadata, restMetadata } = separateReservedAndRestMetadata(payload.metadata);
    payload = { ...payload, metadata: { ...reservedMetadata, ...flattenJson(restMetadata) } };
  }

  const baseEndPoint = getBaseEndpoint(destination);
  const endpoint = `${baseEndPoint}/${ConfigCategory.TRACK.endpoint}`;

  const { sendAnonymousId } = destination.Config;
  if (!payload.user_id && sendAnonymousId && message.anonymousId) {
    payload.user_id = message.anonymousId;
  }

  return responseBuilder(payload, endpoint, 'POST', destination);
};

const groupResponseBuilder = async (message, destination) => {
  const payload = getPayload(message, ConfigCategory.GROUP);
  payload.custom_attributes = filterCustomAttributes(payload, ReservedCompanyAttributes);
  const companyId = await createOrUpdateCompany(payload, destination);
  const lookupField = getLookUpField(message);
  const contactId = await fetchContactId(message, destination, lookupField);

  if (!isDefinedAndNotNull(contactId)) {
    throw new NetworkError(`Can't find any user with given lookupField : ${lookupField}`);
  }

  if (isDefinedAndNotNull(companyId) && isDefinedAndNotNull(contactId)) {
    const baseEndPoint = getBaseEndpoint(destination);
    let endpoint = `${baseEndPoint}/${ConfigCategory.GROUP.endpoint}`;
    endpoint = endpoint.replace('{id}', contactId);
    return responseBuilder({ id: companyId }, endpoint, 'POST', destination);
  }

  throw new InstrumentationError("Can't attach user with company");
};

const processSingleMessage = async (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message');
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
    case EventType.GROUP:
      response = await groupResponseBuilder(message, destination);
      break;
    default:
      throw new InstrumentationError(`Message type ${messageType} not supported`);
  }
  return response;
};

const process = async (event) => {
  const { message, destination } = event;
  const response = await processSingleMessage(message, destination);
  return response;
};

module.exports = { process };

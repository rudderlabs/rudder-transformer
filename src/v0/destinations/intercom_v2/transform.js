const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');
const {
  handleRtTfSingleEventError,
  getSuccessRespEvents,
  getEventType,
  constructPayload,
  getIntegrationsObj,
} = require('../../util');
const { EventType } = require('../../../constants');
const {
  getHeaders,
  searchContact,
  handleDetachUserAndCompany,
  getResponse,
  createOrUpdateCompany,
  attachContactToCompany,
  addOrUpdateTagsToCompany,
  getStatusCode,
  getBaseEndpoint,
  getRecordAction,
} = require('./utils');
const {
  getName,
  filterCustomAttributes,
  addMetadataToPayload,
} = require('../../../cdk/v2/destinations/intercom/utils');
const { MappingConfig, ConfigCategory, RecordAction } = require('./config');

const transformIdentifyPayload = (event) => {
  const { message, destination } = event;
  const category = ConfigCategory.IDENTIFY;
  const payload = constructPayload(message, MappingConfig[category.name]);
  const shouldSendAnonymousId = destination.Config.sendAnonymousId;
  if (!payload.external_id && shouldSendAnonymousId) {
    payload.external_id = message.anonymousId;
  }
  if (!(payload.external_id || payload.email)) {
    throw new InstrumentationError('Either email or userId is required for Identify call');
  }
  payload.name = getName(message);
  payload.custom_attributes = message.traits || message.context.traits || {};
  payload.custom_attributes = filterCustomAttributes(payload, 'user', destination, message);
  return payload;
};

const transformTrackPayload = (event) => {
  const { message, destination } = event;
  const category = ConfigCategory.TRACK;
  let payload = constructPayload(message, MappingConfig[category.name]);
  if (!payload.id) {
    const integrationsObj = getIntegrationsObj(message, 'INTERCOM');
    payload.id = integrationsObj?.id;
  }
  const shouldSendAnonymousId = destination.Config.sendAnonymousId;
  if (!payload.user_id && shouldSendAnonymousId) {
    payload.user_id = message.anonymousId;
  }
  if (!(payload.user_id || payload.email || payload.id)) {
    throw new InstrumentationError('Either email or userId or id is required for Track call');
  }
  payload = addMetadataToPayload(payload);
  return payload;
};

const transformGroupPayload = (event) => {
  const { message, destination } = event;
  const category = ConfigCategory.GROUP;
  const payload = constructPayload(message, MappingConfig[category.name]);
  payload.custom_attributes = message.traits || message.context.traits || {};
  payload.custom_attributes = filterCustomAttributes(payload, 'company', destination, message);
  return payload;
};

const constructIdentifyResponse = async (event) => {
  const { destination, metadata } = event;

  const payload = transformIdentifyPayload(event);

  let method = 'POST';
  let endpoint = `${getBaseEndpoint(destination)}/contacts`;
  const headers = getHeaders(metadata);

  // when contact is found in intercom
  const contactId = await searchContact(event);
  if (contactId) {
    method = 'PUT';
    endpoint += `/${contactId}`;

    // detach user and company if required
    await handleDetachUserAndCompany(contactId, event);
  }

  return getResponse(method, endpoint, headers, payload);
};

const constructTrackResponse = (event) => {
  const { destination, metadata } = event;
  const payload = transformTrackPayload(event);
  const method = 'POST';
  const endpoint = `${getBaseEndpoint(destination)}/events`;
  const headers = getHeaders(metadata);

  return getResponse(method, endpoint, headers, payload);
};

const constructGroupResponse = async (event) => {
  const { destination, metadata } = event;
  const payload = transformGroupPayload(event);

  const method = 'POST';
  let endpoint = `${getBaseEndpoint(destination)}/companies`;
  const headers = getHeaders(metadata);
  let finalPayload = payload;

  // create or update company
  const companyId = await createOrUpdateCompany(payload, destination, metadata);

  // when contact is found in intercom
  const contactId = await searchContact(event);
  if (contactId) {
    // attach user and company
    finalPayload = {
      id: companyId,
    };
    endpoint = `${getBaseEndpoint(destination)}/contacts/${contactId}/companies`;
    await attachContactToCompany(finalPayload, endpoint, destination, metadata);
  }

  // add tags to company
  await addOrUpdateTagsToCompany(companyId, event);

  return getResponse(method, endpoint, headers, finalPayload);
};

const constructRecordResponse = async (event) => {
  const { message, destination, metadata } = event;
  const { identifiers, fields } = message;

  let method = 'POST';
  let endpoint = `${getBaseEndpoint(destination)}/contacts`;
  let payload = {};

  const action = getRecordAction(message);
  const contactId = await searchContact(event);

  if ((action === RecordAction.UPDATE || action === RecordAction.DELETE) && !contactId) {
    throw new ConfigurationError('Contact is not present. Aborting.');
  }

  switch (action) {
    case RecordAction.INSERT:
      payload = { ...identifiers, ...fields };
      if (contactId) {
        endpoint += `/${contactId}`;
        payload = { ...fields };
        method = 'PUT';
      }
      break;
    case RecordAction.UPDATE:
      endpoint += `/${contactId}`;
      payload = { ...fields };
      method = 'PUT';
      break;
    case RecordAction.DELETE:
      endpoint += `/${contactId}`;
      method = 'DELETE';
      break;
    default:
      throw new InstrumentationError(`action ${action} is not supported.`);
  }
  return getResponse(method, endpoint, getHeaders(metadata), payload);
};

const processEvent = async (event) => {
  const { message } = event;
  const messageType = getEventType(message);
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = await constructIdentifyResponse(event);
      break;
    case EventType.TRACK:
      response = constructTrackResponse(event);
      break;
    case EventType.GROUP:
      response = await constructGroupResponse(event);
      break;
    case EventType.RECORD:
      response = constructRecordResponse(event);
      break;
    default:
      throw new InstrumentationError(`message type ${messageType} is not supported.`);
  }
  return response;
};

const process = async (event) => {
  const response = await processEvent(event);
  return response;
};

const processRouter = async (inputs, reqMetadata) => {
  const results = await Promise.all(
    inputs.map(async (event) => {
      try {
        const response = await process(event);
        return getSuccessRespEvents(
          response,
          [event.metadata],
          event.destination,
          false,
          getStatusCode(event),
        );
      } catch (error) {
        return handleRtTfSingleEventError(event, error, reqMetadata);
      }
    }),
  );
  return results;
};

const processRouterDest = async (inputs, reqMetadata) => {
  if (!inputs || inputs.length === 0) {
    return [];
  }
  const response = await processRouter(inputs, reqMetadata);
  return response;
};

module.exports = { processRouterDest };

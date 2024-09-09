const {
  InstrumentationError,
  removeUndefinedAndNullValues,
} = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../../constants');
const { JSON_MIME_TYPE } = require('../../../../v0/util/constant');
const {
  getFieldValueFromMessage,
  isHttpStatusSuccess,
  defaultRequestConfig,
} = require('../../../../v0/util');
const {HTTP_STATUS_CODES} = require('../../../../v0/util/constant');
const { SEARCH_CONTACT_ENDPOINT, CREATE_OR_UPDATE_COMPANY_ENDPOINT, TAGS_ENDPOINT } = require('../intercom/config');
const {
  intercomErrorHandler,
  getLookUpField,
  getBaseEndpoint,
} = require('../intercom/utils');
const { handleHttpRequest } = require('../../../../adapters/network');

const API_VERSIONS = {
  v2: '2.10',
};

const getStatusCode = (message)=> {
  let statusCode = HTTP_STATUS_CODES.OK;
  const messageType = message.type.toLowerCase();
  if (messageType === EventType.GROUP) {
    statusCode = HTTP_STATUS_CODES.SUPPRESS_EVENTS;
  }
  return statusCode;
}

const getResponse = (method, endpoint, headers, payload) => {
  const response = defaultRequestConfig();
  response.method = method;
  response.endpoint = endpoint;
  response.headers = headers;
  response.body.json = removeUndefinedAndNullValues(payload);
  return response;
};

const getHeaders = (metadata, apiVersion) => ({
  Authorization: `Bearer ${metadata.secret.accessToken}`,
  'Content-Type': JSON_MIME_TYPE,
  'Intercom-Version': API_VERSIONS[apiVersion],
});

const searchContact = async (message, destination, metadata) => {
  const lookupField = getLookUpField(message);
  const lookupFieldValue = getFieldValueFromMessage(message, lookupField);
  const data = JSON.stringify({
    query: {
      operator: 'AND',
      value: [
        {
          field: lookupField,
          operator: '=',
          value: lookupFieldValue,
        },
      ],
    },
  });

  const headers = getHeaders(metadata, destination.Config.apiVersion);
  const endpoint = `${getBaseEndpoint(destination)}/${SEARCH_CONTACT_ENDPOINT}`;
  const statTags = {
    destType: 'intercom',
    feature: 'transformation',
    endpointPath: '/contacts/search',
    requestMethod: 'POST',
    module: 'router',
    metadata,
  };

  const { processedResponse: response } = await handleHttpRequest(
    'POST',
    endpoint,
    data,
    {
      headers,
    },
    statTags,
  );

  if (!isHttpStatusSuccess(response.status)) {
    intercomErrorHandler('Unable to search contact due to', response);
  }
  return response.response?.data.length > 0 ? response.response?.data[0]?.id : null;
};

const getCompanyId = async (company, destination, metadata) => {
  if (!company.id && !company.name) return undefined;
  const { apiVersion } = destination.Config;
  const headers = getHeaders(metadata, apiVersion);

  const queryParam = company.id ? `company_id=${company.id}` : `name=${company.name}`;
  const endpoint = `${getBaseEndpoint(destination)}/companies?${queryParam}`;

  const statTags = {
    destType: 'intercom',
    feature: 'transformation',
    endpointPath: '/companies',
    requestMethod: 'GET',
    module: 'router',
  };

  const { processedResponse: response } = await handleHttpRequest(
    'GET',
    endpoint,
    {
      headers,
    },
    statTags,
  );

  if (isHttpStatusSuccess(response.status)) {
    return response.response.id;
  }
  intercomErrorHandler('Unable to get company id due to', response);
  return undefined;
};

const detachContactAndCompany = async (contactId, company, destination, metadata) => {
  const companyId = await getCompanyId(company, destination, metadata);
  if (!companyId) return;

  const headers = getHeaders(metadata, destination.Config.apiVersion);
  const endpoint = `${getBaseEndpoint(destination)}/contacts/${contactId}/companies/${companyId}`;

  const statTags = {
    destType: 'intercom',
    feature: 'transformation',
    endpointPath: 'contacts/companies',
    requestMethod: 'DELETE',
    module: 'router',
  };

  const { processedResponse: response } = await handleHttpRequest(
    'DELETE',
    endpoint,
    {
      headers,
    },
    statTags,
  );

  if (!isHttpStatusSuccess(response.status)) {
    intercomErrorHandler('Unable to detach contact and company due to', response);
  }
};

const handleDetachUserAndCompany = async (contactId, message, destination, metadata) => {
  const company = message.traits.company || message.context.traits.company;
  const shouldDetachUserAndCompany = company.remove;
  if (shouldDetachUserAndCompany) {
    await detachContactAndCompany(contactId, company, destination, metadata);
  }
};

const createOrUpdateCompany = async (payload, destination, metadata) => {
  const headers = getHeaders(metadata, destination.Config.apiVersion);
  const endpoint = `${getBaseEndpoint(destination)}/${CREATE_OR_UPDATE_COMPANY_ENDPOINT}`;

  const finalPayload = JSON.stringify(removeUndefinedAndNullValues(payload));

  const statTags = {
    metadata,
    destType: 'intercom',
    feature: 'transformation',
    endpointPath: '/companies',
    requestMethod: 'POST',
    module: 'router',
  };

  const { processedResponse: response } = await handleHttpRequest(
    'POST',
    endpoint,
    finalPayload,
    {
      headers,
    },
    statTags,
  );

  if (!isHttpStatusSuccess(response.status)) {
    intercomErrorHandler('Unable to Create or Update Company due to', response);
  }

  return response.response?.id;
};

const attachContactToCompany = async (payload, endpoint, destination, metadata ) => {
  const headers = getHeaders(metadata, destination.Config.apiVersion);
  const finalPayload = JSON.stringify(removeUndefinedAndNullValues(payload));

  const statTags = {
    metadata,
    destType: 'intercom',
    feature: 'transformation',
    endpointPath: '/contact/{id}/companies',
    requestMethod: 'POST',
    module: 'router',
  };

  const { processedResponse: response } = await handleHttpRequest(
    'POST',
    endpoint,
    finalPayload,
    {
      headers,
    },
    statTags,
  );

  if (!isHttpStatusSuccess(response.status)) {
    intercomErrorHandler('Unable to attach Contact or User to Company due to', response);
  }
};

const addOrUpdateTagsToCompany = async ( message, destination, metadata, id) => {
  const companyTags = message?.context?.traits?.tags;
  if (!companyTags) return;

  const headers = getHeaders(metadata, destination.Config.apiVersion);
  const endpoint = `${getBaseEndpoint(destination)}/${TAGS_ENDPOINT}`;

  const statTags = {
    destType: 'intercom',
    feature: 'transformation',
    endpointPath: '/tags',
    requestMethod: 'POST',
    module: 'router',
    metadata,
  };

  await Promise.all(
    companyTags.map(async (tag) => {
      const finalPayload = {
        name: tag,
        companies: [
          {
            id,
          },
        ],
      };
      const { processedResponse: response } = await handleHttpRequest(
        'POST',
        endpoint,
        finalPayload,
        {
          headers,
        },
        statTags,
      );

      if (!isHttpStatusSuccess(response.status)) {
        intercomErrorHandler(
          'Unable to Add or Update the Tag to Company due to',
          response,
        );
      }
    }),
  );
};

const constructIdentifyResponseApiVersionV2 = async (payload, message, destination, metadata) => {
  if (!(payload.external_id || payload.email)) {
    throw new InstrumentationError('Either email or userId is required for Identify call');
  }

  let method = 'POST';
  let endpoint = `${getBaseEndpoint(destination)}/contacts`;
  const headers = getHeaders(metadata, destination.Config.apiVersion);

  // when contact is found in intercom
  const contactId = await searchContact(message, destination, metadata);
  if (contactId) {
    method = 'PUT';
    endpoint += `/${contactId}`;

    // detach user and company if required
    await handleDetachUserAndCompany(contactId, message, metadata, destination);
  }

  return getResponse(method, endpoint, headers, payload);
};

const constructTrackResponseApiVersionV2 = async (payload, destination, metadata) => {
  if (!payload.event_name) {
    throw new InstrumentationError('Event name is required for track call');
  }
  if (!(payload.user_id || payload.email)) {
    throw new InstrumentationError('Either email or userId is required for Track call');
  }
  const method = 'POST';
  const endpoint = `${getBaseEndpoint(destination)}/events`;
  const headers = getHeaders(metadata, destination.Config.apiVersion);

  return getResponse(method, endpoint, headers, payload);
};

const constructGroupResponseApiVersionV2 = async (payload, message, destination, metadata) => {
  if (payload.company_id) {
    throw new InstrumentationError('groupId is required for group call');
  }

  const method = 'POST';
  let endpoint = `${getBaseEndpoint(destination)}/companies`;
  const headers = getHeaders(metadata, destination.Config.apiVersion);
  let finalPayload = payload;

  // create or update company
  const companyId = await createOrUpdateCompany(payload, destination, metadata);
  if (!companyId) {
    throw new InstrumentationError('Unable to create or update company');
  }

  // when contact is found in intercom
  const contactId = await searchContact(message, destination, metadata);
  if (contactId) {
    // attach user and company
    finalPayload = {
      id: companyId,
    };
    endpoint = `${getBaseEndpoint(destination)}/contacts/${contactId}/companies`;
    await attachContactToCompany(finalPayload, endpoint, metadata, destination);
  }

  // add tags to company
  await addOrUpdateTagsToCompany( message, destination, metadata, companyId);

  return getResponse(method, endpoint, headers, finalPayload);
};

const constructResponseApiVersionV2 = async (payload, message, destination, metadata) => {
  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = constructIdentifyResponseApiVersionV2(payload, message, destination, metadata);
      break;
    case EventType.TRACK:
      response = constructTrackResponseApiVersionV2(payload, destination, metadata);
      break;
    case EventType.GROUP:
      response = constructGroupResponseApiVersionV2(payload, message, destination, metadata);
      break;
    default:
      throw new InstrumentationError(`message type ${messageType} is not supported.`);
  }
  return response;
};

const constructResponse = async (payload, message, metadata, destination) => {
  let response;
  if (destination.Config.apiVersion === 'v2') {
    response = await constructResponseApiVersionV2(payload, message, destination, metadata);
  } else {
    throw new InstrumentationError(`apiVersion ${destination.Config.apiVersion} is not supported.`);
  }
  return response;
};

module.exports = { constructResponse, getStatusCode };

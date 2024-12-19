const {
  removeUndefinedAndNullValues,
  InstrumentationError,
  NetworkError,
  InvalidAuthTokenError,
} = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../constants');
const { JSON_MIME_TYPE } = require('../../util/constant');
const tags = require('../../util/tags');
const {
  getFieldValueFromMessage,
  isHttpStatusSuccess,
  defaultRequestConfig,
  getEventType,
} = require('../../util');
const { HTTP_STATUS_CODES } = require('../../util/constant');
const {
  SEARCH_CONTACT_ENDPOINT,
  CREATE_OR_UPDATE_COMPANY_ENDPOINT,
  TAGS_ENDPOINT,
  BASE_ENDPOINT,
  BASE_EU_ENDPOINT,
  BASE_AU_ENDPOINT,
} = require('../../../cdk/v2/destinations/intercom/config');
const { getLookUpField } = require('../../../cdk/v2/destinations/intercom/utils');
const { handleHttpRequest } = require('../../../adapters/network');
const { getAccessToken } = require('../../util');
const { ApiVersions, destType } = require('./config');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');

const getRecordAction = (message) => message?.action?.toLowerCase();

/**
 * method to handle error during api call
 * ref docs: https://developers.intercom.com/docs/references/rest-api/errors/http-responses/
 * e.g.
 * 400 - code: parameter_not_found (or parameter_invalid), message: company not specified
 * 401 - code: unauthorized, message: Access Token Invalid
 * 404 - code: company_not_found, message: Company Not Found
 * @param {*} message
 * @param {*} processedResponse
 */
const intercomErrorHandler = (message, processedResponse) => {
  const errorMessages = JSON.stringify(processedResponse.response);
  if (processedResponse.status === 400) {
    throw new InstrumentationError(`${message} : ${errorMessages}`);
  }
  if (processedResponse.status === 401) {
    throw new InvalidAuthTokenError(message, 400, errorMessages);
  }
  if (processedResponse.status === 404) {
    throw new InstrumentationError(`${message} : ${errorMessages}`);
  }
  throw new NetworkError(
    `${message} : ${errorMessages}`,
    processedResponse.status,
    {
      [tags]: getDynamicErrorType(processedResponse.status),
    },
    processedResponse,
  );
};

const getHeaders = (metadata) => ({
  Authorization: `Bearer ${getAccessToken(metadata, 'accessToken')}`,
  Accept: JSON_MIME_TYPE,
  'Content-Type': JSON_MIME_TYPE,
  'Intercom-Version': ApiVersions.v2,
});

const getBaseEndpoint = (destination) => {
  const { apiServer } = destination.Config;
  switch (apiServer) {
    case 'Europe':
      return BASE_EU_ENDPOINT;
    case 'Australia':
      return BASE_AU_ENDPOINT;
    default:
      return BASE_ENDPOINT;
  }
};

const getStatusCode = (event) => {
  const { message } = event;
  let statusCode = HTTP_STATUS_CODES.OK;
  const messageType = getEventType(message);
  if (messageType === EventType.GROUP) {
    statusCode = HTTP_STATUS_CODES.SUPPRESS_EVENTS;
  }
  return statusCode;
};

const getResponse = (method, endpoint, headers, payload) => {
  const response = defaultRequestConfig();
  response.method = method;
  response.endpoint = endpoint;
  response.headers = headers;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
};

const searchContact = async (event) => {
  const { message, destination, metadata } = event;

  const extractLookupFieldAndValue = () => {
    const messageType = getEventType(message);
    if (messageType === EventType.RECORD) {
      const { identifiers } = message;
      return Object.entries(identifiers || {})[0] || [null, null];
    }
    const lookupField = getLookUpField(message);
    const lookupFieldValue =
      getFieldValueFromMessage(message, lookupField) || message?.context?.traits?.[lookupField];
    return [lookupField, lookupFieldValue];
  };

  const [lookupField, lookupFieldValue] = extractLookupFieldAndValue();

  if (!lookupField || !lookupFieldValue) {
    throw new InstrumentationError('Missing lookup field or lookup field value for searchContact');
  }

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

  const headers = getHeaders(metadata);
  const endpoint = `${getBaseEndpoint(destination)}/${SEARCH_CONTACT_ENDPOINT}`;
  const statTags = {
    destType,
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
  const headers = getHeaders(metadata);

  const queryParam = company.id ? `company_id=${company.id}` : `name=${company.name}`;
  const endpoint = `${getBaseEndpoint(destination)}/companies?${queryParam}`;

  const statTags = {
    metadata,
    destType,
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

  if (!isHttpStatusSuccess(response.status)) {
    intercomErrorHandler('Unable to get company id due to', response);
  }

  return response?.response?.id;
};

const detachContactAndCompany = async (contactId, company, destination, metadata) => {
  const companyId = await getCompanyId(company, destination, metadata);
  if (!companyId) return;

  const headers = getHeaders(metadata);
  const endpoint = `${getBaseEndpoint(destination)}/contacts/${contactId}/companies/${companyId}`;

  const statTags = {
    metadata,
    destType,
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

const handleDetachUserAndCompany = async (contactId, event) => {
  const { message, destination, metadata } = event;
  const company = message?.traits?.company || message?.context?.traits?.company;
  const shouldDetachUserAndCompany = company?.remove;
  if (shouldDetachUserAndCompany) {
    await detachContactAndCompany(contactId, company, destination, metadata);
  }
};

const createOrUpdateCompany = async (payload, destination, metadata) => {
  const headers = getHeaders(metadata);
  const endpoint = `${getBaseEndpoint(destination)}/${CREATE_OR_UPDATE_COMPANY_ENDPOINT}`;

  const finalPayload = JSON.stringify(removeUndefinedAndNullValues(payload));

  const statTags = {
    metadata,
    destType,
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

const attachContactToCompany = async (payload, endpoint, destination, metadata) => {
  const headers = getHeaders(metadata);
  const finalPayload = JSON.stringify(removeUndefinedAndNullValues(payload));

  const statTags = {
    metadata,
    destType,
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

const addOrUpdateTagsToCompany = async (id, event) => {
  const { message, destination, metadata } = event;
  const companyTags = message?.traits?.tags || message?.context?.traits?.tags;
  if (!companyTags) return;

  const headers = getHeaders(metadata);
  const endpoint = `${getBaseEndpoint(destination)}/${TAGS_ENDPOINT}`;

  const statTags = {
    destType,
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
        intercomErrorHandler('Unable to Add or Update the Tag to Company due to', response);
      }
    }),
  );
};

module.exports = {
  getStatusCode,
  getHeaders,
  searchContact,
  handleDetachUserAndCompany,
  getResponse,
  createOrUpdateCompany,
  attachContactToCompany,
  addOrUpdateTagsToCompany,
  getBaseEndpoint,
  getRecordAction,
};

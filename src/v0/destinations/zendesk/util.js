const { ConfigurationError, NetworkError } = require('@rudderstack/integrations-lib');
const { handleHttpRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess, getEventType } = require('../../util');
const tags = require('../../util/tags');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const { HTTP_STATUS_CODES } = require('../../util/constant');
const { EventType } = require('../../../constants');

/**
 * Get source name from config or return 'Rudder' as default source name
 * @param {*} config
 * @returns
 */
const getSourceName = (config) => {
  const { sourceName } = config;
  if (sourceName?.trim()?.toLowerCase() === 'zendesk') {
    throw new ConfigurationError('Invalid source name. The source name `zendesk` is not allowed.');
  }
  return sourceName || 'Rudder';
};

const getStatusCode = ({ message }) =>
  getEventType(message) === EventType.IDENTIFY
    ? HTTP_STATUS_CODES.SUPPRESS_EVENTS
    : HTTP_STATUS_CODES.OK;

const getUserIdentities = async (endpoint, headers, metadata) => {
  const statTags = {
    metadata,
    destType: 'zendesk',
    endpointPath: 'users/userId/identities',
    feature: 'transformation',
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
    const { identities } = response?.response || {};
    return identities;
  }

  throw new NetworkError(
    '[Zendesk]: unable to get user identities',
    response.status,
    {
      [tags]: getDynamicErrorType(response.status),
    },
    response.response,
  );
};

const deleteEmailFromUser = async (endpoint, headers, metadata) => {
  const statTags = {
    metadata,
    destType: 'zendesk',
    endpointPath: '/users',
    feature: 'transformation',
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
    throw new NetworkError(
      '[Zendesk]: unable to remove email from user',
      response.status,
      {
        [tags]: getDynamicErrorType(response.status),
      },
      response.response,
    );
  }
};

const updatePrimaryEmailOfUser = async (endpoint, payload, headers, metadata) => {
  const statTags = {
    metadata,
    destType: 'zendesk',
    endpointPath: '/users',
    feature: 'transformation',
    requestMethod: 'PUT',
    module: 'router',
  };

  const { processedResponse: response } = await handleHttpRequest(
    'PUT',
    endpoint,
    payload,
    {
      headers,
    },
    statTags,
  );

  if (!isHttpStatusSuccess(response.status)) {
    throw new NetworkError(
      '[Zendesk]: unable to update primary email of the user',
      response.status,
      {
        [tags]: getDynamicErrorType(response.status),
      },
      response.response,
    );
  }
};

const createOrUpdateUser = async (payload, endpoint, headers, metadata) => {
  const statTags = {
    metadata,
    destType: 'zendesk',
    endpointPath: '/create_or_update.json',
    feature: 'transformation',
    requestMethod: 'POST',
    module: 'router',
  };

  const { processedResponse: response } = await handleHttpRequest(
    'POST',
    endpoint,
    payload,
    {
      headers,
    },
    statTags,
  );

  if (isHttpStatusSuccess(response.status)) {
    return response.response?.user?.id;
  }

  throw new NetworkError(
    '[Zendesk]: unable to create or update user',
    response.status,
    {
      [tags]: getDynamicErrorType(response.status),
    },
    response.response,
  );
};

const removeUserFromOrganizationMembership = async (endpoint, headers, metadata) => {
  const statTags = {
    metadata,
    destType: 'zendesk',
    endpointPath: '/membershipId.json',
    feature: 'transformation',
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
    throw new NetworkError(
      '[Zendesk]: unable to remove user from organization',
      response.status,
      {
        [tags]: getDynamicErrorType(response.status),
      },
      response.response,
    );
  }
};

module.exports = {
  getSourceName,
  getStatusCode,
  getUserIdentities,
  deleteEmailFromUser,
  updatePrimaryEmailOfUser,
  createOrUpdateUser,
  removeUserFromOrganizationMembership,
};

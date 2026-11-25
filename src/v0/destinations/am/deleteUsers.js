const btoa = require('btoa');
const { ConfigurationError, NetworkError } = require('@rudderstack/integrations-lib');
const { httpPOST } = require('../../../adapters/network');
const tags = require('../../util/tags');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { isHttpStatusSuccess } = require('../../util');
const { executeCommonValidations } = require('../../util/regulation-api');
const { DELETE_MAX_BATCH_SIZE } = require('./config');
const { getUserIdBatches } = require('../../util/deleteUserUtils');
const { JSON_MIME_TYPE } = require('../../util/constant');

const userDeletionHandler = async (userAttributes, config) => {
  if (!config) {
    throw new ConfigurationError('Config for deletion not present');
  }
  const { apiKey, apiSecret, residencyServer } = config;
  if (!apiKey || !apiSecret) {
    throw new ConfigurationError('api key/secret for deletion not present');
  }

  const headers = {
    'Content-Type': JSON_MIME_TYPE,
    Authorization: `Basic ${btoa(`${apiKey}:${apiSecret}`)}`,
  };
  // Ref : https://www.docs.developers.amplitude.com/analytics/apis/user-privacy-api/#response
  const batchEvents = getUserIdBatches(userAttributes, DELETE_MAX_BATCH_SIZE);
  const url =
    residencyServer === 'EU'
      ? 'https://analytics.eu.amplitude.com/api/2/deletions/users'
      : 'https://amplitude.com/api/2/deletions/users';
  const endpointPath = '/api/2/deletions/users';
  const requestIntervalMs = 1000; // Amplitude User Privacy API: at most one request per second.
  let previousRequestStart;
  for (const batch of batchEvents) {
    if (previousRequestStart !== undefined) {
      const remainingMs = requestIntervalMs - (Date.now() - previousRequestStart);
      if (remainingMs > 0) {
        // eslint-disable-next-line no-await-in-loop -- Amplitude limits request starts to one per second.
        await new Promise((resolve) => {
          setTimeout(resolve, remainingMs);
        });
      }
    }
    const data = {
      user_ids: batch,
      requester: 'RudderStack',
      ignore_invalid_id: 'true',
    };
    const requestOptions = {
      headers,
    };
    previousRequestStart = Date.now();
    // eslint-disable-next-line no-await-in-loop -- Stop immediately on a failed batch.
    const resp = await httpPOST(url, data, requestOptions, {
      destType: 'am',
      feature: 'deleteUsers',
      endpointPath,
      requestMethod: 'POST',
      module: 'deletion',
    });
    const handledDelResponse = processAxiosResponse(resp);
    if (!isHttpStatusSuccess(handledDelResponse.status)) {
      throw new NetworkError(
        'User deletion request failed',
        handledDelResponse.status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(handledDelResponse.status),
          [tags.TAG_NAMES.STATUS]: handledDelResponse.status,
        },
        handledDelResponse,
      );
    }
  }
  return { statusCode: 200, status: 'successful' };
};
const processDeleteUsers = async (event) => {
  const { userAttributes, config } = event;
  executeCommonValidations(userAttributes);
  const resp = await userDeletionHandler(userAttributes, config);
  return resp;
};

module.exports = { processDeleteUsers };

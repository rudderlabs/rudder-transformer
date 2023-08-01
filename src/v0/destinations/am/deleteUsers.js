const btoa = require('btoa');
const { httpPOST } = require('../../../adapters/network');
const tags = require('../../util/tags');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { isHttpStatusSuccess } = require('../../util');
const { ConfigurationError, NetworkError } = require('../../util/errorTypes');
const { executeCommonValidations } = require('../../util/regulation-api');
const { DELETE_MAX_BATCH_SIZE } = require('./config');
const { getUserIdBatches } = require('../../util/deleteUserUtils');
const { JSON_MIME_TYPE } = require('../../util/constant');

const userDeletionHandler = async (userAttributes, config) => {
  if (!config) {
    throw new ConfigurationError('Config for deletion not present');
  }
  const { apiKey, apiSecret } = config;
  if (!apiKey || !apiSecret) {
    throw new ConfigurationError('api key/secret for deletion not present');
  }

  const headers = {
    'Content-Type': JSON_MIME_TYPE,
    Authorization: `Basic ${btoa(`${apiKey}:${apiSecret}`)}`,
  };
  // Ref : https://www.docs.developers.amplitude.com/analytics/apis/user-privacy-api/#response
  const batchEvents = getUserIdBatches(userAttributes, DELETE_MAX_BATCH_SIZE);
  const url = 'https://amplitude.com/api/2/deletions/users';
  await Promise.all(
    batchEvents.map(async (batch) => {
      const data = {
        user_ids: batch,
        requester: 'RudderStack',
        ignore_invalid_id: 'true',
      };
      const requestOptions = {
        headers,
      };
      const resp = await httpPOST(url, data, requestOptions, {
        destType: 'am',
        feature: 'deleteUsers',
      });
      const handledDelResponse = processAxiosResponse(resp);
      if (!isHttpStatusSuccess(handledDelResponse.status)) {
        throw new NetworkError(
          'User deletion request failed',
          handledDelResponse.status,
          {
            [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(handledDelResponse.status),
          },
          handledDelResponse,
        );
      }
    }),
  );
  return { statusCode: 200, status: 'successful' };
};
const processDeleteUsers = async (event) => {
  const { userAttributes, config } = event;
  executeCommonValidations(userAttributes);
  const resp = await userDeletionHandler(userAttributes, config);
  return resp;
};

module.exports = { processDeleteUsers };

const { httpPOST } = require('../../../adapters/network');
const { getEndpoint, DEL_MAX_BATCH_SIZE } = require('./config');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { isHttpStatusSuccess } = require('../../util');
const { executeCommonValidations } = require('../../util/regulation-api');
const { NetworkError, ConfigurationError } = require('../../util/errorTypes');
const tags = require('../../util/tags');
const { getUserIdBatches } = require('../../util/deleteUserUtils');
const { JSON_MIME_TYPE } = require('../../util/constant');

/**
 * This function will help to delete the users one by one from the userAttributes array.
 * @param {*} userAttributes Array of objects with userId, email and phone
 * @param {*} config Destination.Config provided in dashboard
 * @returns
 */
const userDeletionHandler = async (userAttributes, config) => {
  const { accountId, passcode } = config;

  if (!accountId || !passcode) {
    throw new ConfigurationError('Project ID and Passcode is required for delete user');
  }

  const endpoint = getEndpoint(config, '/delete/profiles.json');
  const headers = {
    'X-CleverTap-Account-Id': accountId,
    'X-CleverTap-Passcode': passcode,
    'Content-Type': JSON_MIME_TYPE,
  };
  // userIdBatches = [[u1,u2,u3,...batchSize],[u1,u2,u3,...batchSize]...]
  // ref : https://developer.clevertap.com/docs/disassociate-api
  const userIdBatches = getUserIdBatches(userAttributes, DEL_MAX_BATCH_SIZE);
  // Note: The logic here intentionally avoided to use Promise.all
  // where all the batch deletion requests are parallelized as
  // simultaneous requests to CleverTap resulted in hitting API rate limits.
  // Also, the rate limit is not clearly documented.
  // eslint-disable-next-line no-restricted-syntax
  for (const curBatch of userIdBatches) {
    // eslint-disable-next-line no-await-in-loop
    const deletionResponse = await httpPOST(
      endpoint,
      {
        identity: curBatch,
      },
      {
        headers,
      },
    );
    const handledDelResponse = processAxiosResponse(deletionResponse);
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
  }

  return {
    statusCode: 200,
    status: 'successful',
  };
};

const processDeleteUsers = async (event) => {
  const { userAttributes, config } = event;
  executeCommonValidations(userAttributes);
  const resp = await userDeletionHandler(userAttributes, config);
  return resp;
};
module.exports = { processDeleteUsers };

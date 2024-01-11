const { NetworkError, ConfigurationError } = require('@rudderstack/integrations-lib');
const { httpPOST } = require('../../../adapters/network');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { isHttpStatusSuccess } = require('../../util');
const { executeCommonValidations } = require('../../util/regulation-api');
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
  const { apiKey } = config;

  if (!apiKey) {
    throw new ConfigurationError('Api Key is required for user deletion');
  }

  const endpoint = 'https://api.sprig.com/v2/purge/visitors';
  const headers = {
    Accept: JSON_MIME_TYPE,
    'Content-Type': JSON_MIME_TYPE,
    Authorization: `API-Key ${apiKey}`,
  };
  /**
   * userIdBatches = [[u1,u2,u3,...batchSize],[u1,u2,u3,...batchSize]...]
   * Ref doc : https://docs.sprig.com/reference/post-v2-purge-visitors-1
   */
  const userIdBatches = getUserIdBatches(userAttributes, 100);
  // Note: we will only get 400 status code when no user deletion is present for given userIds so we will not throw error in that case
  // eslint-disable-next-line no-restricted-syntax
  for (const curBatch of userIdBatches) {
    // eslint-disable-next-line no-await-in-loop
    const deletionResponse = await httpPOST(
      endpoint,
      {
        userIds: curBatch,
      },
      {
        headers,
      },
      {
        destType: 'sprig',
        feature: 'deleteUsers',
        endpointPath: 'api.sprig.com/v2/purge/visitors',
      },
    );
    const handledDelResponse = processAxiosResponse(deletionResponse);
    if (!isHttpStatusSuccess(handledDelResponse.status) && handledDelResponse.status !== 400) {
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

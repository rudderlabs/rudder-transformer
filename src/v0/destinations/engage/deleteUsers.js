const { httpDELETE } = require('../../../adapters/network');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { isHttpStatusSuccess } = require('../../util');
const tags = require('../../util/tags');
const { ConfigurationError, NetworkError } = require('../../util/errorTypes');
const { executeCommonValidations } = require('../../util/regulation-api');
const { JSON_MIME_TYPE } = require('../../util/constant');

/**
 * This function will help to delete the users one by one from the userAttributes array.
 * @param {*} userAttributes Array of objects with userId, email and phone
 * @param {*} config Destination.Config provided in dashboard
 * @returns
 */
// Engage Doc Ref: https://engage.so/docs/api/users
const userDeletionHandler = async (userAttributes, config) => {
  const { publicKey, privateKey } = config;
  if (!publicKey) {
    throw new ConfigurationError('Public key is a required field for user deletion');
  }
  if (!privateKey) {
    throw new ConfigurationError('Private key is a required field for user deletion');
  }
  const BASE_URL = 'https://api.engage.so/v1/users/uid';
  const basicAuth = Buffer.from(`${publicKey}:${privateKey}`).toString('base64');
  const headers = {
    'Content-Type': JSON_MIME_TYPE,
    Authorization: `Basic ${basicAuth}`,
  };

  await Promise.all(
    userAttributes.map(async (ua) => {
      if (ua.userId) {
        const endpoint = `${BASE_URL.replace('uid', ua.userId)}`;
        // eslint-disable-next-line no-await-in-loop
        const response = await httpDELETE(endpoint, { headers });
        const handledDelResponse = processAxiosResponse(response);
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
    }),
  );

  return { statusCode: 200, status: 'successful' };
};

const processDeleteUsers = (event) => {
  const { userAttributes, config } = event;
  executeCommonValidations(userAttributes);
  const resp = userDeletionHandler(userAttributes, config);
  return resp;
};
module.exports = { processDeleteUsers };

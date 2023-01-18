const { httpPOST } = require('../../../adapters/network');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');
const { isHttpStatusSuccess } = require('../../util');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const { NetworkError, ConfigurationError } = require('../../util/errorTypes');
const { executeCommonValidations } = require('../../util/regulation-api');
const tags = require('../../util/tags');

// Ref-> https://developers.intercom.com/intercom-api-reference/v1.3/reference/permanently-delete-a-user
const userDeletionHandler = async (userAttributes, config) => {
  if (!config) {
    throw new ConfigurationError('Config for deletion not present');
  }
  const { apiKey } = config;
  if (!apiKey) {
    throw new ConfigurationError('api key for deletion not present');
  }
  const validUserIds = [];
  userAttributes.forEach((userAttribute) => {
    // Dropping the user if userId is not present
    if (userAttribute.userId) {
      validUserIds.push(userAttribute.userId);
    }
  });
  const url = `https://api.intercom.io/user_delete_requests`;
  await Promise.all(
    validUserIds.map(async (uId) => {
      const data = {
        intercom_user_id: uId,
      };
      const requestOptions = {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'application/json',
        },
      };
      const resp = await httpPOST(url, data, requestOptions);
      const handledDelResponse = processAxiosResponse(resp);
      if (!isHttpStatusSuccess(handledDelResponse.status) && handledDelResponse.status !== 404) {
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

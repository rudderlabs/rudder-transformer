const { NetworkError, ConfigurationError } = require('@rudderstack/integrations-lib');
const { httpPOST } = require('../../../adapters/network');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');
const { isHttpStatusSuccess } = require('../../util');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const { executeCommonValidations } = require('../../util/regulation-api');
const tags = require('../../util/tags');
const { JSON_MIME_TYPE } = require('../../util/constant');

// Ref-> https://developers.intercom.com/intercom-api-reference/v1.3/reference/permanently-delete-a-user
const userDeletionHandler = async (userAttributes, config) => {
  if (!config) {
    throw new ConfigurationError('Config for deletion not present');
  }
  const { apiKey } = config;
  if (!apiKey) {
    throw new ConfigurationError('The access token is not available');
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
          Accept: JSON_MIME_TYPE,
        },
      };
      const resp = await httpPOST(url, data, requestOptions, {
        destType: 'intercom',
        feature: 'deleteUsers',
        endpointPath: '/user_delete_requests',
        requestMethod: 'POST',
        module: 'deletion',
      });
      const handledDelResponse = processAxiosResponse(resp);
      if (!isHttpStatusSuccess(handledDelResponse.status) && handledDelResponse.status !== 404) {
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

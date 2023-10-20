const { NetworkError, ConfigurationError } = require('@rudderstack/integrations-lib');
const { httpDELETE } = require('../../../adapters/network');
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
    throw new ConfigurationError('api key for deletion not present');
  }
  const validUserIds = [];
  userAttributes.forEach((userAttribute) => {
    // Dropping the user if userId is not present
    if (userAttribute.userId) {
      validUserIds.push(userAttribute.userId);
    }
  });
  const failedUserDeletions = [];
  await Promise.all(
    validUserIds.map(async (uId) => {
      const url = `https://api.iterable.com/api/users/byUserId/${uId}`;
      const requestOptions = {
        headers: {
          'Content-Type': JSON_MIME_TYPE,
          api_key: apiKey,
        },
      };
      const resp = await httpDELETE(url, requestOptions, {
        destType: 'iterable',
        feature: 'deleteUsers',
      });
      const handledDelResponse = processAxiosResponse(resp);
      if (!isHttpStatusSuccess(handledDelResponse.status) && handledDelResponse.status !== 404) {
        if (handledDelResponse.status !== 400) {
          // Generic errors such as invalid api key
          throw new NetworkError(
            `User deletion request failed : ${handledDelResponse.response.msg}`,
            handledDelResponse.status,
            {
              [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(handledDelResponse.status),
            },
            handledDelResponse,
          );
        } else {
          // Specific errors such as user is not found
          failedUserDeletions.push({ userId: uId, Reason: handledDelResponse.response.msg });
        }
      }
    }),
  );

  if (failedUserDeletions.length > 0) {
    throw new NetworkError(
      `User deletion request failed for userIds : ${JSON.stringify(failedUserDeletions)}`,
      400,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(400),
      },
      failedUserDeletions,
    );
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

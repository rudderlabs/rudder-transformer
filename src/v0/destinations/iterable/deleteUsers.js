const {
  ConfigurationError,
  NetworkError,
  forEachInBatches,
} = require('@rudderstack/integrations-lib');
const { DeleteUsersError } = require('../../util/errorTypes');
const { httpDELETE } = require('../../../adapters/network');
const { processAxiosResponse } = require('../../../adapters/utils/networkUtils');
const { isHttpStatusSuccess } = require('../../util');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const { executeCommonValidations } = require('../../util/regulation-api');
const tags = require('../../util/tags');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { constructEndpoint } = require('./config');

// Iterable returns absent users as HTTP 400 with msg like "User does not exist. Email:  UserId: <id>".
const USER_DOES_NOT_EXIST_MESSAGE = 'User does not exist';

const isAbsentUserResponse = (handledDelResponse) =>
  handledDelResponse.status === 400 &&
  typeof handledDelResponse.response?.msg === 'string' &&
  handledDelResponse.response.msg.includes(USER_DOES_NOT_EXIST_MESSAGE);

// Ref-> https://support.iterable.com/hc/en-us/articles/360032290032-Deleting-Users
const userDeletionHandler = async (userAttributes, config) => {
  if (!config) {
    throw new ConfigurationError('Config for deletion not present');
  }
  const { apiKey, dataCenter } = config;
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
  await forEachInBatches(
    validUserIds,
    async (uId) => {
      const endpointCategory = { endpoint: `users/byUserId/${uId}` };
      const url = constructEndpoint(dataCenter, endpointCategory);
      const requestOptions = {
        headers: {
          'Content-Type': JSON_MIME_TYPE,
          api_key: apiKey,
        },
      };
      const resp = await httpDELETE(url, requestOptions, {
        destType: 'iterable',
        feature: 'deleteUsers',
        endpointPath: '/users/byUserId/uId',
        requestMethod: 'DELETE',
        module: 'deletion',
      });
      const handledDelResponse = processAxiosResponse(resp);
      if (
        !isHttpStatusSuccess(handledDelResponse.status) &&
        handledDelResponse.status !== 404 &&
        !isAbsentUserResponse(handledDelResponse)
      ) {
        if (handledDelResponse.status !== 400) {
          // Generic errors such as invalid api key
          throw new NetworkError(
            `User deletion request failed : ${handledDelResponse.response.msg}`,
            handledDelResponse.status,
            {
              [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(handledDelResponse.status),
              [tags.TAG_NAMES.STATUS]: handledDelResponse.status,
            },
            handledDelResponse,
          );
        } else {
          // Specific 400 errors from Iterable such as invalid request parameters
          failedUserDeletions.push({ userId: uId, Reason: handledDelResponse.response.msg });
        }
      }
    },
    {
      batchSize: 10,
      sequentialProcessing: false,
    },
  );

  if (failedUserDeletions.length > 0) {
    const networkError = new NetworkError(
      `User deletion request failed for userIds : ${JSON.stringify(failedUserDeletions)}`,
      400,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(400),
      },
      failedUserDeletions,
    );
    throw new DeleteUsersError(
      networkError,
      `User deletion request failed. Reasons: ${failedUserDeletions.map((item) => item.Reason).join(', ')}`,
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

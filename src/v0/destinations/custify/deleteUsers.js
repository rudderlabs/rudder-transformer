const {
  ConfigurationError,
  InstrumentationError,
  NetworkError,
} = require('@rudderstack/integrations-lib');
const { httpDELETE } = require('../../../adapters/network');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { executeCommonValidations } = require('../../util/regulation-api');
const tags = require('../../util/tags');

const userDeletionHandler = async (userAttributes, config) => {
  if (!config) {
    throw new ConfigurationError('Config for deletion not present', 400);
  }

  const { apiKey } = config;

  if (!apiKey) {
    throw new ConfigurationError('api key for deletion not present', 400);
  }
  await Promise.all(
    userAttributes.map(async (userAttr) => {
      const { userId } = userAttr;
      if (!userId) {
        throw new InstrumentationError('User id for deletion not present', 400);
      }
      // Reference: https://docs.custify.com/#tag/People/paths/~1people/delete
      const requestUrl = `https://api.custify.com/people?user_id=${userId}`;
      const requestOptions = {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      };

      const deletionResponse = await httpDELETE(requestUrl, requestOptions, {
        destType: 'custify',
        feature: 'deleteUsers',
      });
      const processedDeletionRequest = processAxiosResponse(deletionResponse);
      if (processedDeletionRequest.status !== 200 && processedDeletionRequest.status !== 404) {
        throw new NetworkError(
          JSON.stringify(processedDeletionRequest.response) || 'Error while deleting user',
          processedDeletionRequest.status,
          {
            [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(processedDeletionRequest.status),
          },
          deletionResponse,
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

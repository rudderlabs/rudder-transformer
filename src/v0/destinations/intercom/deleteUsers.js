const { httpPOST } = require("../../../adapters/network");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const { isHttpStatusSuccess } = require("../../util");
const { getDynamicErrorType } = require("../../../adapters/utils/networkUtils");
const {
  NetworkError,
  InstrumentationError,
  ConfigurationError
} = require("../../util/errorTypes");
const { executeCommonValidations } = require("../../util/regulation-api");
const tags = require("../../util/tags");

const userDeletionHandler = async (userAttributes, config) => {
  if (!config) {
    throw new ConfigurationError("Config for deletion not present");
  }
  const { apiKey } = config;
  if (!apiKey) {
    throw new ConfigurationError("api key for deletion not present");
  }

  await Promise.all(
    userAttributes.map(async ua => {
      const uId = ua.userId;
      if (!uId) {
        throw new InstrumentationError(`No User id for deletion is present`);
      }
      const url = `https://api.intercom.io/user_delete_requests`;
      const data = {
        intercom_user_id: uId
      };
      const requestOptions = {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json"
        }
      };
      const resp = await httpPOST(url, data, requestOptions);
      const handledResponse = processAxiosResponse(resp);
      if (
        !isHttpStatusSuccess(handledResponse.status) &&
        handledResponse.status !== 404
      ) {
        throw new NetworkError(
          `user deletion request failed - error: ${JSON.stringify(
            handledResponse.response
          )}`,
          handledResponse.status,
          {
            [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(
              handledResponse.status
            )
          },
          handledResponse
        );
      }
    })
  );

  return { statusCode: 200, status: "successful" };
};
const processDeleteUsers = async event => {
  const { userAttributes, config } = event;
  executeCommonValidations(userAttributes);
  const resp = await userDeletionHandler(userAttributes, config);
  return resp;
};

module.exports = { processDeleteUsers };

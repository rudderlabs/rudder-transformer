const { httpSend } = require("../../../adapters/network");
const { getDynamicErrorType } = require("../../../adapters/utils/networkUtils");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const { isHttpStatusSuccess } = require("../../util");
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
        throw new InstrumentationError("User id for deletion not present");
      }
      const requestOptions = {
        method: "delete",
        url: `https://api.intercom.io/contacts/${uId}`,
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      };
      const resp = await httpSend(requestOptions);
      const handledDelResponse = processAxiosResponse(resp);
      if (
        !isHttpStatusSuccess(handledDelResponse.status) &&
        handledDelResponse.status !== 404
      ) {
        throw new NetworkError(
          "User deletion request failed",
          handledDelResponse.status,
          {
            [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(
              handledDelResponse.status
            )
          },
          handledDelResponse
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

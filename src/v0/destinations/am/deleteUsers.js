const btoa = require("btoa");
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
  const { apiKey, apiSecret } = config;
  if (!apiKey || !apiSecret) {
    throw new ConfigurationError("api key/secret for deletion not present");
  }

  await Promise.all(
    userAttributes.map(async ua => {
      const uId = ua.userId;
      if (!uId) {
        throw new InstrumentationError("User id for deletion not present");
      }
      const data = { user_ids: [uId], requester: "RudderStack" };
      const requestOptions = {
        method: "post",
        url: "https://amplitude.com/api/2/deletions/users",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${apiKey}:${apiSecret}`)}`
        },
        data
      };
      const resp = await httpSend(requestOptions);
      const handledDelResponse = processAxiosResponse(resp);
      if (!isHttpStatusSuccess(handledDelResponse.status)) {
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

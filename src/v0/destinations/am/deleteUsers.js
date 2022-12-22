const btoa = require("btoa");
const { httpSend } = require("../../../adapters/network");
const { getDynamicErrorType } = require("../../../adapters/utils/networkUtils");

const {
  NetworkError,
  RetryableError,
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

  for (let i = 0; i < userAttributes.length; i += 1) {
    const uId = userAttributes[i].userId;
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
    if (!resp || !resp.response) {
      throw new RetryableError("Could not get response");
    }
    if (
      resp &&
      resp.response &&
      resp.response?.response &&
      resp.response?.response?.status !== 200 // am sends 400 for any bad request or even if user id is not found. The text is also "Bad Request" so not handling user not found case
    ) {
      throw new NetworkError(
        resp.response?.response?.statusText || "Error while deleting user",
        resp.response?.response?.status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(
            resp.response?.response?.status
          )
        },
        resp
      );
    }
  }
  return { statusCode: 200, status: "successful" };
};
const processDeleteUsers = async event => {
  const { userAttributes, config } = event;
  executeCommonValidations(userAttributes);
  const resp = await userDeletionHandler(userAttributes, config);
  return resp;
};

module.exports = { processDeleteUsers };

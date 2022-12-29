const { httpSend } = require("../../../adapters/network");
const { getDynamicErrorType } = require("../../../adapters/utils/networkUtils");
const {
  RetryableError,
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

  for (let i = 0; i < userAttributes.length; i += 1) {
    const uId = userAttributes[i].userId;
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
    if (!resp || !resp.response) {
      throw new RetryableError("Could not get response");
    }
    if (
      resp &&
      resp.response &&
      resp.response?.response &&
      resp.response?.response?.status !== 200 &&
      resp.response?.response?.status !== 404 // this will be returned if user is not found. Will send successfull to server
    ) {
      throw new NetworkError(
        resp.response?.response?.statusText || "Error while deleting user",
        resp.response?.response?.status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(
            resp.response?.response?.status
          )
        },
        resp.response
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

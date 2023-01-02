const _ = require("lodash");
const btoa = require("btoa");
const { httpPOST } = require("../../../adapters/network");
const tags = require("../../util/tags");
const {
  processAxiosResponse,
  getDynamicErrorType
} = require("../../../adapters/utils/networkUtils");
const { isHttpStatusSuccess } = require("../../util");
const {
  ConfigurationError,
  NetworkError,
  InstrumentationError
} = require("../../util/errorTypes");
const { executeCommonValidations } = require("../../util/regulation-api");
const { DELETE_MAX_BATCH_SIZE } = require("./config");

const userDeletionHandler = async (userAttributes, config) => {
  if (!config) {
    throw new ConfigurationError("Config for deletion not present");
  }
  const { apiKey, apiSecret } = config;
  if (!apiKey || !apiSecret) {
    throw new ConfigurationError("api key/secret for deletion not present");
  }
  const identity = [];
  userAttributes.forEach(userAttribute => {
    // Dropping the user if userId is not present
    if (userAttribute.userId) {
      identity.push(userAttribute.userId);
    }
  });
  if (identity.length === 0) {
    throw new InstrumentationError(`No User id for deletion is present`);
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${btoa(`${apiKey}:${apiSecret}`)}`
  };
  const batchEvents = _.chunk(identity, DELETE_MAX_BATCH_SIZE);
  await Promise.all(
    batchEvents.map(async batch => {
      const data = {
        user_ids: batch,
        requester: "RudderStack",
        ignore_invalid_id: "true"
      };
      const url = "https://amplitude.com/api/2/deletions/users";
      const requestOptions = {
        headers
      };
      const resp = await httpPOST(url, data, requestOptions);
      const handledResponse = processAxiosResponse(resp);
      if (!isHttpStatusSuccess(handledResponse.status)) {
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

const { httpPOST } = require("../../../adapters/network");
const { getEndpoint, MAX_BATCH_SIZE } = require("./config");
const {
  processAxiosResponse,
  getDynamicErrorType
} = require("../../../adapters/utils/networkUtils");
const { isHttpStatusSuccess } = require("../../util");
const { executeCommonValidations } = require("../../util/regulation-api");
const { NetworkError, ConfigurationError } = require("../../util/errorTypes");
const tags = require("../../util/tags");
const { getUserIdBatches } = require("../../util/deleteUserUtils");

/**
 * This function will help to delete the users one by one from the userAttributes array.
 * @param {*} userAttributes Array of objects with userId, email and phone
 * @param {*} config Destination.Config provided in dashboard
 * @returns
 */
const userDeletionHandler = async (userAttributes, config) => {
  const { accountId, passcode } = config;

  if (!accountId || !passcode) {
    throw new ConfigurationError(
      "Project ID and Passcode is required for delete user"
    );
  }

  const endpoint = getEndpoint(config, "/delete/profiles.json");
  const headers = {
    "X-CleverTap-Account-Id": accountId,
    "X-CleverTap-Passcode": passcode,
    "Content-Type": "application/json"
  };
  // ref : https://developer.clevertap.com/docs/disassociate-api
  const batchEvents = getUserIdBatches(userAttributes, MAX_BATCH_SIZE);
  await Promise.all(
    batchEvents.map(async batchEvent => {
      const deletionResponse = await httpPOST(
        endpoint,
        {
          identity: batchEvent
        },
        {
          headers
        }
      );
      const handledDelResponse = processAxiosResponse(deletionResponse);
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

  return {
    statusCode: 200,
    status: "successful"
  };
};

const processDeleteUsers = event => {
  const { userAttributes, config } = event;
  executeCommonValidations(userAttributes);
  const resp = userDeletionHandler(userAttributes, config);
  return resp;
};
module.exports = { processDeleteUsers };

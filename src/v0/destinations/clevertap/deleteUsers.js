const _ = require("lodash");
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

/**
 * This function will help to delete the users one by one from the userAttributes array.
 * @param {*} userAttributes Array of objects with userId, emaail and phone
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
  const identity = [];
  userAttributes.forEach(userAttribute => {
    // Dropping the user if userId is not present
    if (userAttribute.userId) {
      identity.push(userAttribute.userId);
    }
  });

  // batchEvents = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
  // ref : https://developer.clevertap.com/docs/disassociate-api
  const batchEvents = _.chunk(identity, MAX_BATCH_SIZE);
  batchEvents.forEach(async batchEvent => {
    const deletionRespone = await httpPOST(
      endpoint,
      {
        identity: batchEvent
      },
      {
        headers
      }
    );
    const processedDeletionRespone = processAxiosResponse(deletionRespone);
    if (!isHttpStatusSuccess(processedDeletionRespone.status)) {
      throw new NetworkError(
        "[Clevertap]::Deletion Request is not successful",
        processedDeletionRespone.status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(
            processedDeletionRespone.status
          )
        },
        deletionRespone
      );
    }
  });

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

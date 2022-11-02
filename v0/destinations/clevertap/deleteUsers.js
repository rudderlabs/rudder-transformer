const { httpPOST } = require("../../../adapters/network");
const ErrorBuilder = require("../../util/error");
const { getEndpoint } = require("./config");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");

/**
 * This function will help to delete the users one by one from the userAttributes array.
 * @param {*} userAttributes Array of objects with userId, emaail and phone
 * @param {*} config Destination.Config provided in dashboard
 * @returns
 */
const userDeletionHandler = async (userAttributes, config) => {
  const { accountId, passcode } = config;
  if (!Array.isArray(userAttributes)) {
    throw new ErrorBuilder()
      .setMessage("userAttributes is not an array")
      .setStatus(400)
      .build();
  }

  if (!accountId || !passcode) {
    throw new ErrorBuilder()
      .setMessage("Project ID and Passcode is required for delete user")
      .setStatus(400)
      .build();
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
  const deletionRespone = await httpPOST(endpoint, { identity }, { headers });
  const processedDeletionRespone = processAxiosResponse(deletionRespone);
  if (processedDeletionRespone.status !== 200) {
    throw new ErrorBuilder()
      .setMessage("[Mixpanel]::Deletion Request is not successful")
      .setStatus(processedDeletionRespone.status)
      .build();
  }
  return { statusCode: 200, status: "successful" };
};

const processDeleteUsers = event => {
  const { userAttributes, config } = event;
  const resp = userDeletionHandler(userAttributes, config);
  return resp;
};
module.exports = { processDeleteUsers };

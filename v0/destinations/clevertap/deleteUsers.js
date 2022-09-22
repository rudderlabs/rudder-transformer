const { httpPOST } = require("../../../adapters/network");
const ErrorBuilder = require("../../util/error");
const { getEndpoint } = require("./config");

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
  for (let i = 0; i < userAttributes.length; i += 1) {
    const identity = [];
    if (userAttributes[i].userId) {
      identity.push(userAttributes[i].userId);
    } else
      throw new ErrorBuilder()
        .setMessage("User id for deletion not present")
        .setStatus(400)
        .build();
    // eslint-disable-next-line no-await-in-loop
    const response = await httpPOST(endpoint, { identity }, { headers });
    if (!response || !response.response) {
      throw new ErrorBuilder()
        .setMessage("Could not get response")
        .setStatus(500)
        .build();
    }
  }
  return { statusCode: 200, status: "successful" };
};

const processDeleteUsers = event => {
  const { userAttributes, config } = event;
  const resp = userDeletionHandler(userAttributes, config);
  return resp;
};
module.exports = { processDeleteUsers };

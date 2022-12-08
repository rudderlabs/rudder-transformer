const { httpDELETE } = require("../../../adapters/network");
const ErrorBuilder = require("../../util/error");
const { executeCommonValidations } = require("../../util/regulation-api");

/**
 * This function will help to delete the users one by one from the userAttributes array.
 * @param {*} userAttributes Array of objects with userId, emaail and phone
 * @param {*} config Destination.Config provided in dashboard
 * @returns
 */
// Engage Doc Ref: https://engage.so/docs/api/users
const userDeletionHandler = async (userAttributes, config) => {
  const { publicKey, privateKey } = config;
  if (!publicKey) {
    throw new ErrorBuilder()
      .setMessage("Public key is a required field for user deletion")
      .setStatus(400)
      .build();
  }
  if (!privateKey) {
    throw new ErrorBuilder()
      .setMessage("Private key is a required field for user deletion")
      .setStatus(400)
      .build();
  }
  const BASE_URL = "https://api.engage.so/v1/users/uid";
  const basicAuth = Buffer.from(`${publicKey}:${privateKey}`).toString(
    "base64"
  );
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${basicAuth}`
  };
  // eslint-disable-next-line no-restricted-syntax
  for (const element of userAttributes) {
    if (!element.userId) {
      throw new ErrorBuilder()
        .setMessage("User id for deletion not present")
        .setStatus(400)
        .build();
    }
    const endpoint = `${BASE_URL.replace("uid", element.userId)}`;
    // eslint-disable-next-line no-await-in-loop
    const response = await httpDELETE(endpoint, { headers });
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
  executeCommonValidations(userAttributes);
  const resp = userDeletionHandler(userAttributes, config);
  return resp;
};
module.exports = { processDeleteUsers };

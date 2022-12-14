const { httpDELETE } = require("../../../adapters/network");
const {
  RetryableError,
  InstrumentationError,
  ConfigurationError
} = require("../../util/errorTypes");
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
    throw new ConfigurationError(
      "Public key is a required field for user deletion"
    );
  }
  if (!privateKey) {
    throw new ConfigurationError(
      "Private key is a required field for user deletion"
    );
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
      throw new InstrumentationError("User id for deletion not present");
    }
    const endpoint = `${BASE_URL.replace("uid", element.userId)}`;
    // eslint-disable-next-line no-await-in-loop
    const response = await httpDELETE(endpoint, { headers });
    if (!response || !response.response) {
      throw new RetryableError("Could not get response");
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

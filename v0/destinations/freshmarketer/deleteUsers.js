const { httpDELETE } = require("../../../adapters/network");
const ErrorBuilder = require("../../util/error");
const { DELETE_ENDPOINT } = require("./config");

/**
 * This function will help to delete the users one by one from the userAttributes array.
 * @param {*}
 * @param {*} config Config provided in dashboard
 * @returns
 * Freshmarketer Doc Ref: https://developers.freshworks.com/crm/api/#delete_a_contact
 */
const userDeletionHandler = async (userAttributes, config) => {
  if (!Array.isArray(userAttributes)) {
    throw new ErrorBuilder()
      .setMessage("userAttributes is not an array")
      .setStatus(400)
      .build();
  }
  const { domain, apiKey } = config;
  if (!domain) {
    throw new ErrorBuilder()
      .setMessage("domain is a required field for user deletion")
      .setStatus(400)
      .build();
  }
  if (!apiKey) {
    throw new ErrorBuilder()
      .setMessage("apiKey is a required field for user deletion")
      .setStatus(400)
      .build();
  }
  const BASE_URL = `https://${domain}${DELETE_ENDPOINT}`;

  const headers = {
    Authorization: `Token token=${apiKey}`,
    "Content-Type": "application/json"
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
  const resp = userDeletionHandler(userAttributes, config);
  return resp;
};
module.exports = { processDeleteUsers };

const { httpPOST } = require("../../../adapters/network");
const ErrorBuilder = require("../../util/error");

/**
 * This function will help to delete the users one by one from the userAttributes array.
 * @param {*} userAttributes Array of objects with userId, emaail and phone
 * @param {*} config Destination.Config provided in dashboard
 * @returns
 */
const userDeletionHandler = async (userAttributes, config) => {
  if (!Array.isArray(userAttributes)) {
    throw new ErrorBuilder()
      .setMessage("userAttributes is not an array")
      .setStatus(400)
      .build();
  }
  if (!config?.token) {
    throw new ErrorBuilder()
      .setMessage("API Token is a required field for user deletion")
      .setStatus(400)
      .build();
  }
  const params = {
    data: {
      $token: `${config.token}`,
      $delete: null,
      $ignore_alias: true
    }
  };
  const endpoint =
    config.dataResidency === "eu"
      ? `https://api-eu.mixpanel.com/engage`
      : `https://api.mixpanel.com/engage`;
  for (let i = 0; i < userAttributes.length; i += 1) {
    if (!userAttributes[i].userId) {
      throw new ErrorBuilder()
        .setMessage("User id for deletion not present")
        .setStatus(400)
        .build();
    }
    params.data.$distinct_id = userAttributes[i].userId;
    // eslint-disable-next-line no-await-in-loop
    const response = await httpPOST(endpoint, null, { params });
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

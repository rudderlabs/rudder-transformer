const { httpPOST } = require("../../../adapters/network");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
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
  const endpoint = "https://api.mixpanel.com/engage#profile-delete";
  const data = [];
  userAttributes.forEach(userAttribute => {
    // Dropping the user if userId is not present
    if (userAttribute.userId) {
      data.push({
        $token: `${config.token}`,
        $distinct_id: userAttribute.userId,
        $delete: null,
        $ignore_alias: true
      });
    }
  });
  const headers = {
    accept: "text/plain",
    "content-type": "application/json"
  };
  const deletionRespone = await httpPOST(endpoint, data, headers);
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

const { httpSend } = require("../../../adapters/network");
const { CustomError } = require("../../util");

const userDeletionHandler = async (userAttributes, config) => {
  if (!config) {
    throw new CustomError("Config for deletion not present", 400);
  }
  const { apiKey } = config;
  if (!apiKey) {
    throw new CustomError("api key for deletion not present", 400);
  }

  for (let i = 0; i < userAttributes.length; i += 1) {
    const uId = userAttributes[i].userId;
    if (!uId) {
      throw new CustomError("User id for deletion not present", 400);
    }
    const requestOptions = {
      method: "delete",
      url: `https://api.custify.com/people?user_id=${uId}`,
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    };
    const resp = await httpSend(requestOptions);
    if (!resp || !resp.response) {
      throw new CustomError("Could not get response", 500);
    }
    if (
      resp &&
      resp.response &&
      resp.response.response &&
      resp.response.response.status !== 200 &&
      resp.response.response.status !== 404 // this will be returned if user is not found. Will be considered a success
    ) {
      throw new CustomError(
        resp.response.response.statusText || "Error while deleting user",
        resp.response.response.status
      );
    }
  }
  return { statusCode: 200, status: "successful" };
};
const processDeleteUsers = async event => {
  const { userAttributes, config } = event;
  const resp = await userDeletionHandler(userAttributes, config);
  return resp;
};

module.exports = { processDeleteUsers };

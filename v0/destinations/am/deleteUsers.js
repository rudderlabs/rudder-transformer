const btoa = require("btoa");
const { httpSend } = require("../../../adapters/network");
const { CustomError } = require("../../util");

const userDeletionHandler = async (userAttributes, config) => {
  if (!config) {
    throw new CustomError("Config for deletion not present", 400);
  }
  const { apiKey, apiSecret } = config;
  if (!apiKey || !apiSecret) {
    throw new CustomError("api key/secret for deletion not present", 400);
  }

  for (let i = 0; i < userAttributes.length; i++) {
    const uId = userAttributes[i].userId;
    if (!uId) {
      throw new CustomError("User id for deletion not present", 400);
    }
    const data = { user_ids: [uId], requester: "RudderStack" };
    const requestOptions = {
      method: "post",
      url: "https://amplitude.com/api/2/deletions/users",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${apiKey}:${apiSecret}`)}`
      },
      data
    };
    const resp = await httpSend(requestOptions);
    if (!resp || !resp.response) {
      throw new CustomError("Could not get response", 500);
    }
    if (
      resp &&
      resp.response &&
      resp.response.response &&
      resp.response.response.status !== 200 // am sends 400 for any bad request or even if user id is not found. The text is also "Bad Request" so not handling user not found case
    ) {
      throw new CustomError(
        resp.response.response.statusText || "Error while deleting user",
        resp.response.response.status
      );
    }
  }
  return { status: "successful" };
};
const processDeleteUsers = async event => {
  const { userAttributes, config } = event;
  const resp = await userDeletionHandler(userAttributes, config);
  return resp;
};

module.exports = { processDeleteUsers };

const { httpSend } = require("../../../adapters/network");
const { CustomError } = require("../../util");

const responseHandler = async (userAttributes, config) => {
  if (!config) {
    throw new CustomError("Config for deletion not present", 400);
  }
  const { dataCenter, restApiKey } = config;
  if (!dataCenter || !restApiKey) {
    throw new CustomError(
      "data center / api key for deletion not present",
      400
    );
  }
  for (let i = 0; i < userAttributes.length; i++) {
    const uId = userAttributes[i].userId;
    if (!uId) {
      throw new CustomError("User id for deletion not present", 400);
    }
    const data = JSON.stringify({ external_ids: [uId] });

    const requestOptions = {
      method: "post",
      url: `https://${dataCenter}.braze.com/users/delete`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${restApiKey}`
      },
      data
    };
    const resp = await httpSend(requestOptions);
    if (resp && !resp.success && !resp.response.response) {
      throw new CustomError(resp.response.code || "Could not delete user", 400);
    }
    if (!resp || !resp.response) {
      throw new CustomError("Could not get response", 500);
    }
    if (
      resp &&
      resp.response &&
      resp.response.response &&
      resp.response.response.status !== 200 &&
      resp.response.response.status !== 404
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
  const resp = await responseHandler(userAttributes, config);
  return resp;
};

module.exports = { processDeleteUsers };

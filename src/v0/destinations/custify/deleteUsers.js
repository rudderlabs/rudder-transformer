const { httpDELETE } = require("../../../adapters/network");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const { CustomError } = require("../../util");
const { executeCommonValidations } = require("../../util/regulation-api");

const userDeletionHandler = async (userAttributes, config) => {
  if (!config) {
    throw new CustomError("Config for deletion not present", 400);
  }

  const { apiKey } = config;
  const { userId } = userAttributes;

  if (!apiKey) {
    throw new CustomError("api key for deletion not present", 400);
  }
  if (!userId) {
    throw new CustomError("User id for deletion not present", 400);
  }
  const requestUrl = `https://api.custify.com/people?user_id=${userId}`;
  const requestOptions = {
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  };

  const deletionResponse = await httpDELETE(requestUrl, requestOptions);
  const processedDeletionRequest = processAxiosResponse(deletionResponse);
  if (
    processedDeletionRequest.status !== 200 &&
    processedDeletionRequest.status !== 404
  ) {
    throw new CustomError(
      JSON.stringify(processedDeletionRequest.response) ||
        "Error while deleting user",
      processedDeletionRequest.status
    );
  }

  return { statusCode: 200, status: "successful" };
};
const processDeleteUsers = async event => {
  const { userAttributes, config } = event;
  executeCommonValidations(userAttributes);
  const resp = await userDeletionHandler(userAttributes, config);
  return resp;
};

module.exports = { processDeleteUsers };

const { httpSend } = require("../../../adapters/network");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const { isHttpStatusSuccess } = require("../../util");
const ErrorBuilder = require("../../util/error");
const { executeCommonValidations } = require("../../util/regulation-api");

const userDeletionHandler = async (userAttributes, config) => {
  if (!config) {
    throw new ErrorBuilder()
      .setMessage("[Intercom]::Config for deletion not present")
      .setStatus(400)
      .build();
  }
  const { apiKey } = config;
  if (!apiKey) {
    throw new ErrorBuilder()
      .setMessage("[Intercom]::api key for deletion not present")
      .setStatus(400)
      .build();
  }

  await Promise.all(
    userAttributes.map(async ua => {
      const uId = ua.userId;
      if (!uId) {
        throw new ErrorBuilder()
          .setMessage("[Intercom]::User id for deletion not present")
          .setStatus(400)
          .build();
      }
      const requestOptions = {
        method: "delete",
        url: `https://api.intercom.io/contacts/${uId}`,
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      };
      const resp = await httpSend(requestOptions);
      const handledResponse = processAxiosResponse(resp);
      if (
        !isHttpStatusSuccess(handledResponse.status) &&
        handledResponse.status !== 404
      ) {
        throw new ErrorBuilder()
          .setMessage(
            `[Intercom]::user deletion request failed - error: ${JSON.stringify(
              handledResponse.response
            )}`
          )
          .setStatus(handledResponse.status)
          .build();
      }
    })
  );

  return { statusCode: 200, status: "successful" };
};
const processDeleteUsers = async event => {
  const { userAttributes, config } = event;
  executeCommonValidations(userAttributes);
  const resp = await userDeletionHandler(userAttributes, config);
  return resp;
};

module.exports = { processDeleteUsers };

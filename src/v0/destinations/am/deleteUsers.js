const btoa = require("btoa");
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
      .setMessage("[Amplitude]::Config for deletion not present")
      .setStatus(400)
      .build();
  }
  const { apiKey, apiSecret } = config;
  if (!apiKey || !apiSecret) {
    throw new ErrorBuilder()
      .setMessage("[Amplitude]::api key/secret for deletion not present")
      .setStatus(400)
      .build();
  }

  await Promise.all(
    userAttributes.map(async ua => {
      const uId = ua.userId;
      if (!uId) {
        throw new ErrorBuilder()
          .setMessage("[Amplitude]::User id for deletion not present")
          .setStatus(400)
          .build();
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
      const handledResponse = processAxiosResponse(resp);
      if (!isHttpStatusSuccess(handledResponse.status)) {
        throw new ErrorBuilder()
          .setMessage(
            `[Amplitude]::user deletion request failed - error: ${JSON.stringify(
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

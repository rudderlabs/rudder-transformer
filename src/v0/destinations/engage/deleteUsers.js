const { httpDELETE } = require("../../../adapters/network");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const { isHttpStatusSuccess } = require("../../util");
const ErrorBuilder = require("../../util/error");
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
    throw new ErrorBuilder()
      .setMessage("[Engage]::Public key is a required field for user deletion")
      .setStatus(400)
      .build();
  }
  if (!privateKey) {
    throw new ErrorBuilder()
      .setMessage("[Engage]::Private key is a required field for user deletion")
      .setStatus(400)
      .build();
  }
  const BASE_URL = "https://api.engage.so/v1/users/uid";
  const basicAuth = Buffer.from(`${publicKey}:${privateKey}`).toString(
    "base64"
  );
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${basicAuth}`
  };

  await Promise.all(
    userAttributes.map(async ua => {
      if (!ua.userId) {
        throw new ErrorBuilder()
          .setMessage("[Engage]::User id for deletion not present")
          .setStatus(400)
          .build();
      }
      const endpoint = `${BASE_URL.replace("uid", ua.userId)}`;
      // eslint-disable-next-line no-await-in-loop
      const response = await httpDELETE(endpoint, { headers });
      const handledResponse = processAxiosResponse(response);
      if (!isHttpStatusSuccess(handledResponse.status)) {
        throw new ErrorBuilder()
          .setMessage(
            `[Engage]::user deletion request failed - error: ${JSON.stringify(
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

const processDeleteUsers = event => {
  const { userAttributes, config } = event;
  executeCommonValidations(userAttributes);
  const resp = userDeletionHandler(userAttributes, config);
  return resp;
};
module.exports = { processDeleteUsers };

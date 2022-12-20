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
      .setMessage("[Braze]::Config for deletion not present")
      .setStatus(400)
      .build();
  }
  const { dataCenter, restApiKey } = config;
  if (!dataCenter || !restApiKey) {
    throw new ErrorBuilder()
      .setMessage("[Braze]::data center / api key for deletion not present")
      .setStatus(400)
      .build();
  }
  let endPoint;

  await Promise.all(
    userAttributes.map(async ua => {
      const uId = ua.userId;
      if (!uId) {
        throw new ErrorBuilder()
          .setMessage("[Braze]::User id for deletion not present")
          .setStatus(400)
          .build();
      }

      // Endpoints different for different data centers.
      // DOC: https://www.braze.com/docs/user_guide/administrative/access_braze/braze_instances/

      const dataCenterArr = dataCenter.trim().split("-");
      if (dataCenterArr[0].toLowerCase() === "eu") {
        endPoint = "https://rest.fra-01.braze.eu";
      } else {
        endPoint = `https://rest.iad-${dataCenterArr[1]}.braze.com`;
      }
      const data = { external_ids: [uId] };
      const requestOptions = {
        method: "post",
        url: `${endPoint}/users/delete`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${restApiKey}`
        },
        data
      };

      const resp = await httpSend(requestOptions);
      const handledResponse = processAxiosResponse(resp);
      if (
        !isHttpStatusSuccess(handledResponse.status) &&
        handledResponse.status !== 404
      ) {
        throw new ErrorBuilder()
          .setMessage(
            `[Braze]::user deletion request failed - error: ${JSON.stringify(
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

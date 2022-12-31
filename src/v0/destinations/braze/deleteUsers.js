const _ = require("lodash");
const { httpPOST } = require("../../../adapters/network");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const { isHttpStatusSuccess } = require("../../util");
const ErrorBuilder = require("../../util/error");
const { executeCommonValidations } = require("../../util/regulation-api");
const { MAX_BATCH_SIZE } = require("./config");

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
  // Endpoints different for different data centers.
  // DOC: https://www.braze.com/docs/user_guide/administrative/access_braze/braze_instances/
  let endPoint;
  const dataCenterArr = dataCenter.trim().split("-");
  if (dataCenterArr[0].toLowerCase() === "eu") {
    endPoint = "https://rest.fra-01.braze.eu//users/delete";
  } else {
    endPoint = `https://rest.iad-${dataCenterArr[1]}.braze.com/users/delete`;
  }
  const identity = [];
  userAttributes.forEach(userAttribute => {
    // Dropping the user if userId is not present
    if (userAttribute.userId) {
      identity.push(userAttribute.userId);
    }
  });
  if (identity.length === 0) {
    throw new ErrorBuilder()
      .setMessage(`[Braze]::No userId found to delete`)
      .setStatus(400)
      .build();
  }
  // batchEvents = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
  // https://www.braze.com/docs/api/endpoints/user_data/post_user_delete#request-body
  const batchEvents = _.chunk(identity, MAX_BATCH_SIZE);
  await Promise.all(
    batchEvents.map(async batchEvent => {
      const data = { external_ids: batchEvent };
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${restApiKey}`
        }
      };

      const resp = await httpPOST(endPoint, data, requestOptions);
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

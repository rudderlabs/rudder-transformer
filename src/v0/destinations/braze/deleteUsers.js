const _ = require("lodash");
const { httpPOST } = require("../../../adapters/network");
const {
  processAxiosResponse,
  getDynamicErrorType
} = require("../../../adapters/utils/networkUtils");
const tags = require("../../util/tags");
const { isHttpStatusSuccess } = require("../../util");
const { executeCommonValidations } = require("../../util/regulation-api");
const { MAX_BATCH_SIZE } = require("./config");
const {
  NetworkError,
  InstrumentationError,
  ConfigurationError
} = require("../../util/errorTypes");

const userDeletionHandler = async (userAttributes, config) => {
  if (!config) {
    throw new ConfigurationError("Config for deletion not present");
  }
  const { dataCenter, restApiKey } = config;
  if (!dataCenter || !restApiKey) {
    throw new ConfigurationError(
      "data center / api key for deletion not present"
    );
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
    throw new InstrumentationError(`No User id for deletion is present`);
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
        throw new NetworkError(
          `user deletion request failed - error: ${JSON.stringify(
            handledResponse.response
          )}`,
          handledResponse.status,
          {
            [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(
              handledResponse.status
            )
          },
          handledResponse
        );
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

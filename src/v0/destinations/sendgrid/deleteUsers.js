const _ = require("lodash");
const { httpDELETE } = require("../../../adapters/network");
const ErrorBuilder = require("../../util/error");
const {
  MAX_BATCH_SIZE,
  DESTINATION,
  DELETE_CONTACTS_ENDPOINT
} = require("./config");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const { isHttpStatusSuccess } = require("../../util");
const { TRANSFORMER_METRIC } = require("../../util/constant");

/**
 * This function will help to delete the users one by one from the userAttributes array.
 * @param {*} userAttributes Array of objects with userId, emaail and phone
 * @param {*} config Destination.Config provided in dashboard
 * @returns
 */
const userDeletionHandler = async (userAttributes, config) => {
  const { apiKey } = config;
  if (!Array.isArray(userAttributes)) {
    throw new ErrorBuilder()
      .setMessage("[SendGrid] :: userAttributes is not an array")
      .setStatus(400)
      .setStatTags({
        destType: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_PARAM
      })
      .build();
  }

  if (!apiKey) {
    throw new ErrorBuilder()
      .setMessage("[SendGrid] :: apiKey is required for deleting user")
      .setStatus(400)
      .setStatTags({
        destType: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_PARAM
      })
      .build();
  }

  let endpoint = DELETE_CONTACTS_ENDPOINT;
  const requestOptions = {
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  };
  const identity = [];
  userAttributes.forEach(userAttribute => {
    // Dropping the user if userId is not present
    if (userAttribute.userId) {
      identity.push(userAttribute.userId);
    }
  });

  // batchEvents = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
  // ref : https://developer.clevertap.com/docs/disassociate-api
  const batchEvents = _.chunk(identity, MAX_BATCH_SIZE);
  batchEvents.forEach(async batchEvent => {
    endpoint = `${endpoint}?ids=${batchEvent}`;
    const deletionRespone = await httpDELETE(endpoint, requestOptions);
    const processedDeletionRespone = processAxiosResponse(deletionRespone);
    if (!isHttpStatusSuccess(processedDeletionRespone.status)) {
      throw new ErrorBuilder()
        .setMessage("[SendGrid]::Deletion Request is not successful")
        .setStatus(400)
        .setStatTags({
          destType: DESTINATION,
          stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
          scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
          meta:
            TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_EVENT
        })
        .build();
    }
  });

  return {
    statusCode: 200,
    status: "successful"
  };
};

const processDeleteUsers = event => {
  const { userAttributes, config } = event;
  const resp = userDeletionHandler(userAttributes, config);
  return resp;
};
module.exports = { processDeleteUsers };

const { httpDELETE } = require("../../../adapters/network");
const ErrorBuilder = require("../../util/error");
const { DESTINATION, DELETE_CONTACTS_ENDPOINT, urlLimit } = require("./config");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const { isHttpStatusSuccess } = require("../../util");
const { TRANSFORMER_METRIC } = require("../../util/constant");

/**
 * This drops the user if userId is not available and converts the ids's into list of strings
 * where each string is a combination of comma separated userIds and length of each string is not more than maxSize
 * @param {*} userAttributes array of userIds
 * @param {*} maxSize maxSize of url
 * @returns list of Strings
 */
const chunksFromUrlLength = (userAttributes, maxSize) => {
  const identity = [];
  let left = maxSize;
  let temp = "";
  userAttributes.forEach(ua => {
    // Dropping the user if userId is not present
    if (ua.userId) {
      left -= String(ua.userId).length;
      if (left < 0) {
        identity.push(temp.slice(0, -1));
        left = maxSize;
        temp = "";
      }
      temp += `${String(ua.userId)},`;
    }
  });
  if (temp.length > 0) {
    identity.push(temp.slice(0, -1));
  }
  return identity;
};

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
  // batchEvents = [["e1,e2,e3,..urlLimit"],["e1,e2,e3,..urlLimit"]..]
  // ref : https://docs.sendgrid.com/api-reference/contacts/delete-contacts
  const batchEvents = chunksFromUrlLength(userAttributes, urlLimit);
  await Promise.all(
    batchEvents.map(async batchEvent => {
      endpoint = `${endpoint.replace("IDS", batchEvent)}`;
      const deletionResponse = await httpDELETE(endpoint, requestOptions);
      const processedDeletionResponse = processAxiosResponse(deletionResponse);

      if (!isHttpStatusSuccess(processedDeletionResponse.status)) {
        throw new ErrorBuilder()
          .setMessage(
            `[SendGrid]::Deletion Request is not successful - error: ${JSON.stringify(
              processedDeletionResponse.response
            )}`
          )
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
    })
  );

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

const _ = require("lodash");
const { httpDELETE } = require("../../../adapters/network");
const { MAX_BATCH_SIZE, DELETE_CONTACTS_ENDPOINT } = require("./config");
const {
  processAxiosResponse,
  getDynamicErrorType
} = require("../../../adapters/utils/networkUtils");
const { isHttpStatusSuccess } = require("../../util");
const {
  NetworkError,
  ConfigurationError,
  InstrumentationError
} = require("../../util/errorTypes");
const tags = require("../../util/tags");

/**
 * This function will help to delete the users one by one from the userAttributes array.
 * @param {*} userAttributes Array of objects with userId, emaail and phone
 * @param {*} config Destination.Config provided in dashboard
 * @returns
 */
const userDeletionHandler = async (userAttributes, config) => {
  const { apiKey } = config;
  if (!Array.isArray(userAttributes)) {
    throw new InstrumentationError("userAttributes is not an array");
  }

  if (!apiKey) {
    throw new ConfigurationError("ApiKey is required for deleting user");
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
      throw new NetworkError(
        "Deletion Request is not successful",
        processedDeletionRespone.status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(
            processedDeletionRespone.status
          )
        },
        processedDeletionRespone
      );
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

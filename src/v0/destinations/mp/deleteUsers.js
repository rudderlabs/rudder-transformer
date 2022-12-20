const _ = require("lodash");
const { httpPOST } = require("../../../adapters/network");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const { isHttpStatusSuccess } = require("../../util");
const { MAX_BATCH_SIZE } = require("./config");
const { executeCommonValidations } = require("../../util/regulation-api");
const { ConfigurationError, NetworkError } = require("../../util/errorTypes");
const { getDynamicErrorType } = require("../../../adapters/utils/networkUtils");
const tags = require("../../util/tags");

/**
 * This function will help to delete the users one by one from the userAttributes array.
 * @param {*} userAttributes Array of objects with userId, emaail and phone
 * @param {*} config Destination.Config provided in dashboard
 * @returns
 */
const userDeletionHandler = async (userAttributes, config) => {
  if (!config?.token) {
    throw new ConfigurationError(
      "API Token is a required field for user deletion"
    );
  }
  const endpoint =
    config.dataResidency === "eu"
      ? "https://api-eu.mixpanel.com/engage"
      : "https://api.mixpanel.com/engage";
  const data = [];
  const defaultValues = {
    $token: `${config.token}`,
    $delete: null,
    $ignore_alias: true
  };
  userAttributes.forEach(userAttribute => {
    // Dropping the user if userId is not present
    if (userAttribute.userId) {
      data.push({
        $distinct_id: userAttribute.userId,
        ...defaultValues
      });
    }
  });
  const headers = {
    accept: "text/plain",
    "content-type": "application/json"
  };

  // batchEvents = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
  // ref : https://help.mixpanel.com/hc/en-us/articles/115004565806-Delete-User-Profiles#:~:text=Bulk%20Delete%20Profiles,Please%20delete%20with%20caution!
  const batchEvents = _.chunk(data, MAX_BATCH_SIZE);
  batchEvents.forEach(async batchEvent => {
    const deletionRespone = await httpPOST(endpoint, batchEvent, headers);
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
        processedDeletionRespone.response
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
  executeCommonValidations(userAttributes);
  const resp = userDeletionHandler(userAttributes, config);
  return resp;
};
module.exports = { processDeleteUsers };

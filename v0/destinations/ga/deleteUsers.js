const { httpPOST } = require("../../../adapters/network");
const ErrorBuilder = require("../../util/error");
const { executeCommonValidations } = require("../../util/regulation-api");
const { GA_USER_DELETION_ENDPOINT } = require("./config");
const { gaResponseHandler } = require("./utils");

/**
 * This function will help to delete the users one by one from the userAttributes array.
 * @param {*} userAttributes Array of objects with userId, emaail and phone
 * @param {*} config Destination.Config provided in dashboard
 * @returns
 */
const userDeletionHandler = async (userAttributes, config) => {
  // TODO: Should we do more validations ?
  userAttributes.forEach(async userAttribute => {
    if (!userAttribute.userId) {
      throw new ErrorBuilder()
        .setMessage("User id for deletion not present")
        .setStatus(400)
        .build();
    }
    // Reference for building userDeletionRequest
    // Ref: https://developers.google.com/analytics/devguides/config/userdeletion/v3/reference/userDeletion/userDeletionRequest#resource
    const reqBody = {
      kind: "analytics#userDeletionRequest",
      id: {
        type: "USER_ID",
        userId: userAttribute.userId
      }
    };
    // TODO: Check with team if this condition needs to be handled
    if (config.useNativeSDK) {
      reqBody.propertyId = config.trackingID;
    } else {
      reqBody.webPropertyId = config.trackingID;
    }
    // TODO: Need to have access token information provided
    const headers = {};
    const response = await httpPOST(GA_USER_DELETION_ENDPOINT, reqBody, {
      headers
    });
    // process the response to know about refreshing scenario
    gaResponseHandler(response);
  });
  return { statusCode: 200, status: "successful" };
};

const processDeleteUsers = event => {
  const { userAttributes, config } = event;
  executeCommonValidations(userAttributes);
  const resp = userDeletionHandler(userAttributes, config);
  return resp;
};

module.exports = { processDeleteUsers };

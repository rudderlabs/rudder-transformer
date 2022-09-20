const { _ } = require("lodash");
const { httpPOST } = require("../../../adapters/network");
const { generateUUID } = require("../../util");
const ErrorBuilder = require("../../util/error");

/**
 * This function will help to delete the users one by one from the userAttributes array.
 * @param {*} userAttributes Array of objects with userId, emaail and phone
 * @param {*} config Destination.Config provided in dashboard
 * @returns
 */
const userDeletionHandler = async (userAttributes, config) => {
  if (!Array.isArray(userAttributes)) {
    throw new ErrorBuilder()
      .setMessage("userAttributes is not an array")
      .setStatus(400)
      .build();
  }
  if (!config?.apiToken || !(config?.appleAppId || config?.androidAppId)) {
    throw new ErrorBuilder()
      .setMessage(
        "API Token and Apple ID or Android App Id are required fields"
      )
      .setStatus(400)
      .build();
  }
  const identityTypes = {
    ios_advertising_id: "appleAppId",
    android_advertising_id: "androidAppId",
    appsflyer_id: undefined
  };
  const body = {
    subject_request_type: "erasure",
    subject_identities: [{ identity_format: "raw" }]
  };
  const endpoint = `https://hq1.appsflyer.com/gdpr/opengdpr_requests?api_token=${config.apiToken}`;
  for (let i = 0; i < userAttributes.length; i += 1) {
    const userAttribute = Object.keys(userAttributes[i]);
    const identityAttributes = Object.keys(identityTypes);

    const identities = _.intersection(userAttribute, identityAttributes);
    for (let j = 0; j < identities.length; j += 1) {
      if (identities[j] === "appsflyer_id") {
        body.property_id = config.androidAppId
          ? config.androidAppId
          : config.appleAppId;
      } else {
        body.property_id = config[identityTypes[identities[j]]];
        if (!body.property_id) {
          throw new ErrorBuilder()
            .setMessage(
              `${identityTypes[identities[j]]} is not available in config`
            )
            .setStatus(400)
            .build();
        }
      }
      body.subject_request_id = generateUUID();
      body.submitted_time = new Date().toISOString();
      body.subject_identities[0].identity_type = identities[j];
      body.subject_identities[0].identity_value =
        userAttributes[i][identities[j]];
      // eslint-disable-next-line no-await-in-loop
      const response = await httpPOST(endpoint, body);
      if (!response || !response.response) {
        throw new ErrorBuilder()
          .setMessage("Could not get response")
          .setStatus(500)
          .build();
      }
    }

    if (identities.length === 0) {
      throw new ErrorBuilder()
        .setMessage(
          "none of the possible identityTypes is provided for deletion"
        )
        .setStatus(400)
        .build();
    }
  }
  return { statusCode: 200, status: "successful" };
};

const processDeleteUsers = event => {
  const { userAttributes, config } = event;
  const resp = userDeletionHandler(userAttributes, config);
  return resp;
};
module.exports = { processDeleteUsers };

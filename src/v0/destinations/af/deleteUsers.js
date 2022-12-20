/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
const { httpPOST } = require("../../../adapters/network");
const { generateUUID } = require("../../util");
const ErrorBuilder = require("../../util/error");
const { executeCommonValidations } = require("../../util/regulation-api");

/**
 * This function is making the ultimate call to delete the user
 * @param {*} endpoint Endpoint for GDPR request (https://support.appsflyer.com/hc/en-us/articles/360000811585#1-gdpr-request)
 * @param {*} body default body which is same for all calls
 * @param {*} identityType type of the identifier those are one of ios_advertising_id, android_advertising_id, appsflyer_id
 * @param {*} identityValue value of identifier
 * @returns
 */
const deleteUser = async (endpoint, body, identityType, identityValue) => {
  body.subject_request_id = generateUUID();
  body.submitted_time = new Date().toISOString();
  body.subject_identities[0].identity_type = identityType;
  body.subject_identities[0].identity_value = identityValue;
  const response = await httpPOST(endpoint, body);
  return response;
};

/**
 * This function will help to delete the users one by one from the userAttributes array.
 * @param {*} userAttributes Array of objects with userId, emaail and phone
 * @param {*} config Destination.Config provided in dashboard
 * @returns
 */
const userDeletionHandler = async (userAttributes, config) => {
  if (!config?.apiToken || !(config?.appleAppId || config?.androidAppId)) {
    throw new ErrorBuilder()
      .setMessage(
        "API Token and one of Apple ID or Android App Id are required fields for user deletion"
      )
      .setStatus(400)
      .build();
  }
  const body = {
    subject_request_type: "erasure",
    subject_identities: [{ identity_format: "raw" }]
  };
  if (config.statusCallbackUrls) {
    const statusCallbackUrlsArray = config.statusCallbackUrls.split(",");
    const filteredStatusCallbackUrlsArray = statusCallbackUrlsArray.filter(
      statusCallbackUrl => {
        const URLRegex = new RegExp(
          "^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$"
        );
        return statusCallbackUrl.match(URLRegex);
      }
    );
    if (filteredStatusCallbackUrlsArray.length > 3) {
      throw new ErrorBuilder()
        .setMessage("you can send atmost 3 callBackUrls")
        .setStatus(400)
        .build();
    }
    body.status_callback_urls = filteredStatusCallbackUrlsArray;
  }
  const endpoint = `https://hq1.appsflyer.com/gdpr/opengdpr_requests?api_token=${config.apiToken}`;
  for (let i = 0; i < userAttributes.length; i += 1) {
    const userAttributeKeys = Object.keys(userAttributes[i]);

    if (userAttributeKeys.includes("appsflyer_id")) {
      body.property_id = config.androidAppId
        ? config.androidAppId
        : config.appleAppId;
      const response = await deleteUser(
        endpoint,
        body,
        "appsflyer_id",
        userAttributes[i].appsflyer_id
      );
      if (!response || !response.response) {
        throw new ErrorBuilder()
          .setMessage("Could not get response")
          .setStatus(500)
          .build();
      }
    } else {
      if (userAttributeKeys.includes("ios_advertising_id")) {
        body.property_id = config.appleAppId;
        if (!body.property_id) {
          throw new ErrorBuilder()
            .setMessage(
              "appleAppId is required for ios_advertising_id type identifier"
            )
            .setStatus(500)
            .build();
        }
        const response = await deleteUser(
          endpoint,
          body,
          "ios_advertising_id",
          userAttributes[i].ios_advertising_id
        );
        if (!response || !response.response) {
          throw new ErrorBuilder()
            .setMessage("Could not get response")
            .setStatus(500)
            .build();
        }
      }
      if (userAttributeKeys.includes("android_advertising_id")) {
        body.property_id = config.androidAppId;
        if (!body.property_id) {
          throw new ErrorBuilder()
            .setMessage(
              "androidAppId is required for android_advertising_id type identifier"
            )
            .setStatus(500)
            .build();
        }
        const response = await deleteUser(
          endpoint,
          body,
          "android_advertising_id",
          userAttributes[i].android_advertising_id
        );
        if (!response || !response.response) {
          throw new ErrorBuilder()
            .setMessage("Could not get response")
            .setStatus(500)
            .build();
        }
      }
    }

    if (
      !userAttributes[i].android_advertising_id &&
      !userAttributes[i].ios_advertising_id &&
      !userAttributes[i].appsflyer_id
    ) {
      throw new ErrorBuilder()
        .setMessage(
          "none of the possible identityTypes i.e.(ios_advertising_id, android_advertising_id, appsflyer_id) is provided for deletion"
        )
        .setStatus(400)
        .build();
    }
  }
  return { statusCode: 200, status: "successful" };
};

const processDeleteUsers = event => {
  const { userAttributes, config } = event;
  executeCommonValidations(userAttributes);
  const resp = userDeletionHandler(userAttributes, config);
  return resp;
};
module.exports = { processDeleteUsers };

const { isEmpty } = require('lodash');
const { InstrumentationError, OAuthSecretError } = require('@rudderstack/integrations-lib');
const { httpPOST } = require('../../../adapters/network');

const { executeCommonValidations } = require('../../util/regulation-api');
const { GA_USER_DELETION_ENDPOINT } = require('./config');
const { gaResponseHandler } = require('./networkHandler');
const { JSON_MIME_TYPE } = require('../../util/constant');

/**
 * Prepare the delete users request
 *
 * @param {*} userAttributes Array of objects with userId, email and phone
 * @param {*} config Destination.Config provided in dashboard
 * @param {Record<string, any> | undefined} rudderDestInfo contains information about the authorisation details to successfully send deletion request
 * @returns
 */
const prepareDeleteRequest = (userAttributes, config, rudderDestInfo) => {
  const { secret } = rudderDestInfo;
  // TODO: Should we do more validations ?
  if (secret && isEmpty(secret)) {
    throw new OAuthSecretError(
      // This would happen when server doesn't send "x-rudder-dest-info" header
      // Todo's in-case this exception happen:
      // 1. The server version might be an older one
      // 2. There would have been some problem with how we are sending this header
      `The "secret" field is not sent in "x-rudder-dest-info" header`,
    );
  }
  const requests = userAttributes.map((userAttribute) => {
    if (!userAttribute.userId) {
      throw new InstrumentationError('User id for deletion not present');
    }
    // Reference for building userDeletionRequest
    // Ref: https://developers.google.com/analytics/devguides/config/userdeletion/v3/reference/userDeletion/userDeletionRequest#resource
    const reqBody = {
      kind: 'analytics#userDeletionRequest',
      id: {
        type: 'USER_ID',
        userId: userAttribute.userId,
      },
    };
    // TODO: Check with team if this condition needs to be handled
    if (config.useNativeSDK) {
      reqBody.propertyId = config.trackingID;
    } else {
      reqBody.webPropertyId = config.trackingID;
    }
    const headers = {
      Authorization: `Bearer ${secret?.access_token}`,
      Accept: JSON_MIME_TYPE,
      'Content-Type': JSON_MIME_TYPE,
    };
    return {
      body: reqBody,
      headers,
    };
  });
  return requests;
};

/**
 * This function will help to delete the users one by one from the userAttributes array.
 *
 * @param {*} userAttributes Array of objects with userId, email and phone
 * @param {*} config Destination.Config provided in dashboard
 * @param {Record<string, any> | undefined} rudderDestInfo contains information about the authorisation details to successfully send deletion request
 * @returns {Array<{ body: any, headers: any }>}
 */
const userDeletionHandler = async (userAttributes, config, rudderDestInfo) => {
  const userDeleteRequests = prepareDeleteRequest(userAttributes, config, rudderDestInfo);
  await Promise.all(
    userDeleteRequests.map(async (userDeleteRequest) => {
      const response = await httpPOST(
        GA_USER_DELETION_ENDPOINT,
        userDeleteRequest.body,
        {
          headers: userDeleteRequest.headers,
        },
        {
          destType: 'ga',
          feature: 'deleteUsers',
        },
      );
      // process the response to know about refreshing scenario
      return gaResponseHandler(response);
    }),
  );
  return { statusCode: 200, status: 'successful' };
};

const processDeleteUsers = async (event) => {
  const { userAttributes, config, rudderDestInfo } = event;
  executeCommonValidations(userAttributes);
  const resp = await userDeletionHandler(userAttributes, config, rudderDestInfo);
  return resp;
};

module.exports = { processDeleteUsers, prepareDeleteRequest };

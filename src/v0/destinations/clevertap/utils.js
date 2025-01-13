const { defaultBatchRequestConfig, getIntegrationsObj } = require('../../util');

const { getEndpoint, ALLOWED_DEVICE_TOKEN_TYPES } = require('./config');
const { JSON_MIME_TYPE } = require('../../util/constant');

function generateClevertapBatchedPayload(events, destination) {
  const { batchedRequest } = defaultBatchRequestConfig();

  // Batch event into dest batch structure
  const batchResponseList = [];
  const eventArray = Object.values(events);

  eventArray.forEach((ev) => {
    batchResponseList.push(ev?.body?.JSON?.d[0]);
  });

  batchedRequest.body.JSON = {
    d: batchResponseList,
  };
  batchedRequest.batched = true;

  batchedRequest.endpoint = getEndpoint(destination.Config);
  batchedRequest.headers = {
    'X-CleverTap-Account-Id': destination?.Config?.accountId,
    'X-CleverTap-Passcode': destination?.Config?.passcode,
    'Content-Type': JSON_MIME_TYPE,
  };

  return batchedRequest;
}
/**
 * Deduces the device token type based on the integration object and device operating system.
 * Ref : https://developer.clevertap.com/docs/upload-device-tokens-api
 * @param {Object} message - The message object containing integration details.
 * @param {string} deviceOS - The device operating system ('android' or 'ios').
 * @returns {string} The deduced device token type ('fcm' for Android or 'apns' for iOS).
 */
const deduceTokenType = (message, deviceOS) => {
  const integrationObj = getIntegrationsObj(message, 'clevertap');
  if (
    integrationObj?.deviceTokenType &&
    ALLOWED_DEVICE_TOKEN_TYPES.includes(integrationObj?.deviceTokenType)
  ) {
    return integrationObj?.deviceTokenType;
  }
  return deviceOS === 'android' ? 'fcm' : 'apns';
};

module.exports = {
  generateClevertapBatchedPayload,
  deduceTokenType,
};

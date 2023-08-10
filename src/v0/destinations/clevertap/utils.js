const { defaultBatchRequestConfig } = require('../../util');

const { getEndpoint } = require('./config');
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

module.exports = {
  generateClevertapBatchedPayload,
};

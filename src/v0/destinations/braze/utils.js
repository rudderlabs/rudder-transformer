const get = require('get-value');
const { BRAZE_PARTNER_NAME, IDENTIFY_BRAZE_MAX_REQ_COUNT } = require('./config');

const { defaultBatchRequestConfig, defaultRequestConfig } = require('../../util');

const createBatching = (
  attributesBatch,
  eventsBatch,
  purchasesBatch,
  trackMetadataBatch,
  jsonBody,
  metadata,
) => {
  // look for events, attributes, purchases
  const { events, attributes, purchases } = jsonBody;
  // add only if present
  if (attributes) {
    attributesBatch.push(...attributes);
  }

  if (events) {
    eventsBatch.push(...events);
  }

  if (purchases) {
    purchasesBatch.push(...purchases);
  }

  // keep the original metadata object. needed later to form the batch
  trackMetadataBatch.push(metadata);
};

function formatBatchResponse(batchPayload, metadataList, destination) {
  const response = defaultBatchRequestConfig();
  response.batchedRequest = batchPayload;
  response.metadata = metadataList;
  response.destination = destination;
  return response;
}

const handleIdentifyBatching = (
  endPoint,
  jsonBody,
  aliasBatch,
  identifyEndpoint,
  ev,
  respList,
  identifyMetadataBatch,
) => {
  const { message, metadata, destination } = ev;
  if (!identifyEndpoint) {
    // eslint-disable-next-line no-param-reassign
    identifyEndpoint = endPoint;
  }
  const aliasObjectArr = get(jsonBody, 'aliases_to_identify');
  const aliasMaxCount = aliasBatch.length + (aliasObjectArr ? aliasObjectArr.length : 0);

  if (aliasMaxCount > IDENTIFY_BRAZE_MAX_REQ_COUNT) {
    // form an identify batch and start over
    const batchResponse = defaultRequestConfig();
    batchResponse.headers = message.headers;
    batchResponse.endpoint = identifyEndpoint;
    const responseBodyJson = {
      partner: BRAZE_PARTNER_NAME,
    };
    if (aliasBatch.length > 0) {
      responseBodyJson.aliases_to_identify = [...aliasBatch];
    }
    batchResponse.body.JSON = responseBodyJson;
    respList.push(formatBatchResponse(batchResponse, identifyMetadataBatch, destination));

    // clear the arrays and reuse
    // eslint-disable-next-line no-param-reassign
    aliasBatch = [];
    // eslint-disable-next-line no-param-reassign
    identifyMetadataBatch = [];
  }

  // separate out the identify request
  // respList.push(formatBatchResponse(message, [metadata], destination));
  if (aliasObjectArr.length > 0) {
    aliasBatch.push(aliasObjectArr[0]);
  }
  identifyMetadataBatch.push(metadata);
};

const createResponseBodyJSON = (attributesBatch, eventsBatch, purchasesBatch) => {
  const responseBodyJson = {
    partner: BRAZE_PARTNER_NAME,
  };
  if (attributesBatch.length > 0) {
    responseBodyJson.attributes = attributesBatch;
  }
  if (eventsBatch.length > 0) {
    responseBodyJson.events = eventsBatch;
  }
  if (purchasesBatch.length > 0) {
    responseBodyJson.purchases = purchasesBatch;
  }
  return responseBodyJson;
};

module.exports = {
  createBatching,
  handleIdentifyBatching,
  formatBatchResponse,
  createResponseBodyJSON,
};

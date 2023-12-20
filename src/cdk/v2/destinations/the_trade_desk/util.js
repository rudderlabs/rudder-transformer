const lodash = require('lodash');
const CryptoJS = require('crypto-js');
const jsonSize = require('json-size');
const { InstrumentationError } = require('@rudderstack/integrations-lib');
const {
  defaultPostRequestConfig,
  defaultRequestConfig,
  getSuccessRespEvents,
  removeUndefinedAndNullValues,
  handleRtTfSingleEventError,
} = require('../../../../v0/util');
const {
  DATA_PROVIDER_ID,
  MAX_REQUEST_SIZE_IN_BYTES,
  DATA_SERVERS_BASE_ENDPOINTS_MAP,
} = require('./config');

const ttlInMin = (ttl) => parseInt(ttl, 10) * 1440;
const getBaseEndpoint = (dataServer) => DATA_SERVERS_BASE_ENDPOINTS_MAP[dataServer];
const getFirstPartyEndpoint = (dataServer) => `${getBaseEndpoint(dataServer)}/data/advertiser`;

function getSignatureHeader(request, secretKey) {
  const sha1 = CryptoJS.HmacSHA1(JSON.stringify(request), secretKey);
  const base = CryptoJS.enc.Base64.stringify(sha1);
  return base;
}

const responseBuilder = (items, Config) => {
  const { advertiserID, advertiserSecretKey, dataServer } = Config;

  const payload = { DataProviderId: DATA_PROVIDER_ID, AdvertiserId: advertiserID, Items: items };

  const response = defaultRequestConfig();
  response.endpoint = getFirstPartyEndpoint(dataServer);
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    secretKey: advertiserSecretKey,
  };
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
};

const splitItemsBasedOnMaxSizeInBytes = (items, maxSize) => {
  const itemsSize = jsonSize(items);

  if (itemsSize <= maxSize) {
    return [items];
  }

  const batches = [];
  let currentBatch = [];

  items.forEach((item) => {
    const itemSize = jsonSize(item);

    if (jsonSize(currentBatch) + itemSize <= maxSize) {
      currentBatch.push(item);
    } else {
      batches.push([...currentBatch]);
      currentBatch = [item];
    }
  });

  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  return batches;
};

const batchResponseBuilder = (items, Config) => {
  const response = [];
  const itemsChunks = splitItemsBasedOnMaxSizeInBytes(items, MAX_REQUEST_SIZE_IN_BYTES);

  itemsChunks.forEach((chunk) => {
    response.push(responseBuilder(chunk, Config));
  });

  return response;
};

const processRecordInputs = (inputs, destination) => {
  const { Config } = destination;
  const items = [];
  const successMetadata = [];
  const errorResponseList = [];

  const error = new InstrumentationError('Invalid action type');

  inputs.forEach((input) => {
    const { fields, action } = input.message;
    const isInsertOrDelete = action === 'insert' || action === 'delete';

    if (isInsertOrDelete) {
      successMetadata.push(input.metadata);
      const data = [
        {
          Name: Config.segmentName,
          TTLInMinutes: action === 'insert' ? ttlInMin(Config.ttlInDays) : 0,
        },
      ];
      Object.keys(fields).forEach((id) => {
        items.push({ [id]: fields[id], Data: data });
      });
    } else {
      errorResponseList.push(handleRtTfSingleEventError(input, error, {}));
    }
  });

  const payloads = batchResponseBuilder(items, Config);

  const response = getSuccessRespEvents(payloads, successMetadata, destination, true);
  return [response, ...errorResponseList];
};

const processRouterDest = (inputs) => {
  const respList = [];
  const { destination } = inputs[0];
  const groupedInputs = lodash.groupBy(inputs, (input) => input.message.type);
  if (groupedInputs.record) {
    const transformedRecordEvent = processRecordInputs(groupedInputs.record, destination);
    respList.push(...transformedRecordEvent);
  }

  return respList;
};

module.exports = { getSignatureHeader, processRouterDest };

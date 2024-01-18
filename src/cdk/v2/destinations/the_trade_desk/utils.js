const lodash = require('lodash');
const CryptoJS = require('crypto-js');
const { InstrumentationError, AbortedError } = require('@rudderstack/integrations-lib');
const { BatchUtils } = require('@rudderstack/workflow-engine');
const {
  defaultPostRequestConfig,
  defaultRequestConfig,
  getSuccessRespEvents,
  removeUndefinedAndNullValues,
  handleRtTfSingleEventError,
  isEmptyObject,
} = require('../../../../v0/util');
const tradeDeskConfig = require('./config');

const { DATA_PROVIDER_ID, DATA_SERVERS_BASE_ENDPOINTS_MAP } = tradeDeskConfig;

const ttlInMin = (ttl) => parseInt(ttl, 10) * 1440;
const getBaseEndpoint = (dataServer) => DATA_SERVERS_BASE_ENDPOINTS_MAP[dataServer];
const getFirstPartyEndpoint = (dataServer) => `${getBaseEndpoint(dataServer)}/data/advertiser`;

const getSignatureHeader = (request, secretKey) => {
  if (!secretKey) {
    throw new AbortedError('Secret key is missing. Aborting');
  }
  const sha1 = CryptoJS.HmacSHA1(JSON.stringify(request), secretKey);
  const base = CryptoJS.enc.Base64.stringify(sha1);
  return base;
};

const responseBuilder = (items, config) => {
  const { advertiserId, dataServer } = config;

  const payload = { DataProviderId: DATA_PROVIDER_ID, AdvertiserId: advertiserId, Items: items };

  const response = defaultRequestConfig();
  response.endpoint = getFirstPartyEndpoint(dataServer);
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
};

const batchResponseBuilder = (items, config) => {
  const response = [];
  const itemsChunks = BatchUtils.chunkArrayBySizeAndLength(items, {
    // TODO: use destructuring at the top of file once proper 'mocking' is implemented.
    // eslint-disable-next-line unicorn/consistent-destructuring
    maxSizeInBytes: tradeDeskConfig.MAX_REQUEST_SIZE_IN_BYTES,
  });

  itemsChunks.items.forEach((chunk) => {
    response.push(responseBuilder(chunk, config));
  });

  return response;
};

const processRecordInputs = (inputs, destination) => {
  const { Config } = destination;
  const items = [];
  const successMetadata = [];
  const errorResponseList = [];

  const invalidActionTypeError = new InstrumentationError('Invalid action type');
  const emptyFieldsError = new InstrumentationError('Fields cannot be empty');

  inputs.forEach((input) => {
    const { fields, action } = input.message;
    const isInsertOrDelete = action === 'insert' || action === 'delete';

    if (!isInsertOrDelete) {
      errorResponseList.push(handleRtTfSingleEventError(input, invalidActionTypeError, {}));
      return;
    }

    if (isEmptyObject(fields)) {
      errorResponseList.push(handleRtTfSingleEventError(input, emptyFieldsError, {}));
      return;
    }

    successMetadata.push(input.metadata);
    const data = [
      {
        Name: Config.audienceId,
        TTLInMinutes: action === 'insert' ? ttlInMin(Config.ttlInDays) : 0,
      },
    ];

    Object.keys(fields).forEach((id) => {
      const value = fields[id];
      if (value) {
        // adding only non empty ID's
        items.push({ [id]: value, Data: data });
      }
    });
  });

  const payloads = batchResponseBuilder(items, Config);
  if (payloads.length === 0) {
    return errorResponseList;
  }

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

const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');
const { BatchUtils } = require('@rudderstack/workflow-engine');
const {
  defaultPostRequestConfig,
  defaultRequestConfig,
  getSuccessRespEvents,
  removeUndefinedAndNullValues,
  handleRtTfSingleEventError,
  isEmptyObject,
} = require('../../../../v0/util');
const { getTTLInMin, getFirstPartyEndpoint } = require('./utils');
const tradeDeskConfig = require('./config');

const { DATA_PROVIDER_ID } = tradeDeskConfig;

const validateConfig = (config) => {
  if (!config.advertiserSecretKey) {
    throw new ConfigurationError('Advertiser Secret Key is not present. Aborting');
  }

  if (config.ttlInDays && !(config.ttlInDays >= 0 && config.ttlInDays <= 180)) {
    throw new ConfigurationError('TTL is out of range. Allowed values are 0 to 180 days');
  }

  if (!config.audienceId) {
    throw new ConfigurationError('Segment name/Audience ID is not present. Aborting');
  }
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

  if (!inputs || inputs.length === 0) {
    return [];
  }

  validateConfig(Config);

  const invalidActionTypeError = new InstrumentationError(
    'Invalid action type. You can only add or remove IDs from the audience/segment',
  );
  const emptyFieldsError = new InstrumentationError('`fields` cannot be empty');
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
        TTLInMinutes: action === 'insert' ? getTTLInMin(Config.ttlInDays) : 0,
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

module.exports = { processRecordInputs };

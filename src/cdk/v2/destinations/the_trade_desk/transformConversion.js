const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');
const {
  defaultRequestConfig,
  simpleProcessRouterDest,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
} = require('../../../../v0/util');
const { EventType } = require('../../../../constants');
const { REAL_TIME_CONVERSION_ENDPOINT } = require('./config');
const {
  prepareFromConfig,
  prepareCommonPayload,
  getRevenue,
  prepareItemsPayload,
  getAdvertisingId,
  prepareCustomProperties,
  populateEventName,
  getDataProcessingOptions,
  getPrivacySetting,
  enrichTrackPayload,
} = require('./utils');

const responseBuilder = (payload) => {
  const response = defaultRequestConfig();
  response.endpoint = REAL_TIME_CONVERSION_ENDPOINT;
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = payload;
  return response;
};

const validateInputAndConfig = (message, destination) => {
  const { Config } = destination;
  if (!Config.trackerId) {
    throw new ConfigurationError('Tracking Tag ID is not present. Aborting');
  }

  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }

  const messageType = message.type.toLowerCase();
  if (messageType !== EventType.TRACK) {
    throw new InstrumentationError(`Event type "${messageType}" is not supported`);
  }

  if (!message.event) {
    throw new InstrumentationError('Event name is not present. Aborting.');
  }
};

const prepareTrackPayload = (message, destination) => {
  const configPayload = prepareFromConfig(destination);
  const commonPayload = prepareCommonPayload(message);
  // prepare items array
  const items = prepareItemsPayload(message);
  const { id, type } = getAdvertisingId(message);
  // get td1-td10 custom properties
  const customProperties = prepareCustomProperties(message, destination);
  const eventName = populateEventName(message, destination);
  const value = getRevenue(message);
  let payload = {
    ...configPayload,
    ...commonPayload,
    event_name: eventName,
    value,
    items,
    adid: id,
    adid_type: type,
    ...customProperties,
    data_processing_option: getDataProcessingOptions(message),
    privacy_settings: getPrivacySetting(message),
  };

  payload = enrichTrackPayload(message, payload);
  return { data: [removeUndefinedAndNullValues(payload)] };
};

const trackResponseBuilder = (message, destination) => {
  const payload = prepareTrackPayload(message, destination);
  return responseBuilder(payload);
};

const processEvent = (message, destination) => {
  validateInputAndConfig(message, destination);
  return trackResponseBuilder(message, destination);
};

const process = (event) => processEvent(event.message, event.destination);

const processConversionInputs = async (inputs, reqMetadata) => {
  if (!inputs || inputs.length === 0) {
    return [];
  }
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { processConversionInputs };

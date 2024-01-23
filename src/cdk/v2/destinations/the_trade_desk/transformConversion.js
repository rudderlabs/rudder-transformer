const { InstrumentationError } = require('@rudderstack/integrations-lib');
const {
  defaultRequestConfig,
  simpleProcessRouterDest,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
} = require('../../../../v0/util');
const { EventType } = require('../../../../constants');
const { JSON_MIME_TYPE } = require('../../../../v0/util/constant');
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
} = require('./utils');

const responseBuilder = (payload) => {
  const response = defaultRequestConfig();
  response.endpoint = REAL_TIME_CONVERSION_ENDPOINT;
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = payload;
  response.headers = { 'Content-Type': JSON_MIME_TYPE };
  return response;
};

const validateInput = (message) => {
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }

  const messageType = message.type.toLowerCase();
  if (messageType !== EventType.TRACK) {
    throw new InstrumentationError(`Event type "${messageType}" is not supported`);
  }

  if (!message.event) {
    throw new InstrumentationError('Event is not present. Aborting.');
  }
};

const prepareTrackPayload = (message, destination) => {
  const configPayload = prepareFromConfig(destination);
  const commonPayload = prepareCommonPayload(message);
  const items = prepareItemsPayload(message);
  const { id, type } = getAdvertisingId(message);
  const customProperties = prepareCustomProperties(message, destination);
  const eventName = populateEventName(message, destination);
  const value = getRevenue(message);
  const payload = {
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

  return { data: [removeUndefinedAndNullValues(payload)] };
};

const trackResponseBuilder = (message, destination) => {
  validateInput(message);
  const payload = prepareTrackPayload(message, destination);
  return responseBuilder(payload);
};

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }

  const messageType = message.type.toLowerCase();
  if (messageType === EventType.TRACK) {
    return trackResponseBuilder(message, destination);
  }
  throw new InstrumentationError(`Event type "${messageType}" is not supported`);
};

const process = (event) => processEvent(event.message, event.destination);

const processConversionInputs = async (inputs, reqMetadata) => {
  const respList = await simpleProcessRouterDest(inputs, process, reqMetadata);
  return respList;
};

module.exports = { processConversionInputs };

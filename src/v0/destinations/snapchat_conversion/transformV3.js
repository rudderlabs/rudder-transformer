const get = require('get-value');
const { InstrumentationError } = require('@rudderstack/integrations-lib');
const validator = require('validator');
const { EventType } = require('../../../constants');

const {
  defaultPostRequestConfig,
  constructPayload,
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  getFieldValueFromMessage,
  handleRtTfSingleEventError,
  getEventType,
} = require('../../util');
const {
  ENDPOINT,
  eventNameMapping,
  mappingConfigV3,
  pageTypeToTrackEvent,
  ConfigCategoryV3,
} = require('./config');
const {
  getHashedValue,
  getItemIds,
  getPriceSum,
  getDataUseValue,
  getNormalizedPhoneNumber,
  eventMappingHandler,
  getEventConversionType,
  validateEventConfiguration,
  getEventTimestamp,
} = require('./util');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { batchResponseBuilder, getExtInfo, productsToContentsMapping } = require('./utilsV3');

function buildResponse(apiKey, payload, ID) {
  const response = defaultRequestConfig();
  response.endpoint = ENDPOINT.Endpoint_v3.replace('{ID}', ID);
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
  };
  response.params = {
    access_token: apiKey,
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = payload;
  return response;
}

const populateHashedTraitsValues = (payload, message) => {
  const updatedPayload = { ...payload };
  const userData = updatedPayload.data[0].user_data || {};

  const getHashedTrait = (value) => {
    const trimmed = value?.toString().trim().toLowerCase();
    return trimmed ? getHashedValue(trimmed) : undefined;
  };

  updatedPayload.data[0].user_data = {
    ...userData,
    fn: getHashedTrait(getFieldValueFromMessage(message, 'firstName')),
    ln: getHashedTrait(getFieldValueFromMessage(message, 'lastName')),
    ge: getHashedTrait(getFieldValueFromMessage(message, 'gender')),
    ct: getHashedTrait(getFieldValueFromMessage(message, 'city')),
    zp: getHashedTrait(getFieldValueFromMessage(message, 'zipcode')),
    st: getHashedTrait(getFieldValueFromMessage(message, 'state')),
    country: getHashedTrait(getFieldValueFromMessage(message, 'country')),
  };

  return updatedPayload;
};

const populateHashedValues = (payload, message) => {
  const updatedPayload = populateHashedTraitsValues(payload, message);

  const email = getFieldValueFromMessage(message, 'emailOnly');
  const trimmedEmail = email?.toString().toLowerCase().trim();
  if (trimmedEmail && validator.isEmail(trimmedEmail)) {
    updatedPayload.data[0].user_data.em = getHashedValue(trimmedEmail);
  }

  const phone = getNormalizedPhoneNumber(message);
  const trimmedPhone = phone?.toString().toLowerCase().trim();
  if (trimmedPhone) {
    updatedPayload.data[0].user_data.ph = getHashedValue(trimmedPhone);
  }

  return updatedPayload;
};

const getEventCommonProperties = (message) =>
  constructPayload(message, mappingConfigV3[ConfigCategoryV3.TRACK_COMMON.name]);

const validateRequiredFields = (payload) => {
  const userData = payload.data?.[0]?.user_data || {};
  const hasRequiredFields =
    userData.em ||
    userData.ph ||
    userData.madid ||
    (userData.client_ip_address && userData.client_user_agent);

  if (!hasRequiredFields) {
    throw new InstrumentationError(
      'At least one of email or phone or advertisingId or ip and clientUserAgent is required',
    );
  }
};

const addSpecificEventDetails = (message, payload, actionSource, pixelId, snapAppId, appId) => {
  const updatedPayload = { ...payload };

  if (actionSource === 'WEB') {
    updatedPayload.data[0].event_source_url = getFieldValueFromMessage(message, 'pageUrl');
  }

  if (actionSource === 'MOBILE_APP') {
    if (!updatedPayload.data[0].app_data) {
      updatedPayload.data[0].app_data = {};
    }
    updatedPayload.data[0].app_data.app_id = appId;
    const extInfo = getExtInfo(message);
    if (extInfo) {
      updatedPayload.data[0].app_data.extinfo = extInfo;
    }
  }

  return updatedPayload;
};

const getEventConfig = (eventType) => {
  const configMap = {
    products_searched: mappingConfigV3[ConfigCategoryV3.PRODUCTS_SEARCHED.name],
    product_list_viewed: mappingConfigV3[ConfigCategoryV3.PRODUCT_LIST_VIEWED.name],
    promotion_viewed: mappingConfigV3[ConfigCategoryV3.PROMOTION_VIEWED.name],
    promotion_clicked: mappingConfigV3[ConfigCategoryV3.PROMOTION_CLICKED.name],
    product_viewed: mappingConfigV3[ConfigCategoryV3.PRODUCT_VIEWED.name],
    checkout_started: mappingConfigV3[ConfigCategoryV3.CHECKOUT_STARTED.name],
    payment_info_entered: mappingConfigV3[ConfigCategoryV3.PAYMENT_INFO_ENTERED.name],
    order_completed: mappingConfigV3[ConfigCategoryV3.ORDER_COMPLETED.name],
    product_added: mappingConfigV3[ConfigCategoryV3.PRODUCT_ADDED.name],
    product_added_to_wishlist: mappingConfigV3[ConfigCategoryV3.PRODUCT_ADDED_TO_WISHLIST.name],
    sign_up: mappingConfigV3[ConfigCategoryV3.SIGN_UP.name],
  };

  return configMap[eventType] || mappingConfigV3[ConfigCategoryV3.DEFAULT.name];
};

const isProductEvent = (eventType) =>
  ['product_list_viewed', 'checkout_started', 'order_completed'].includes(eventType);

const buildBasePayload = (message, event) => {
  const payload = { data: [{}] };
  const eventType = event.toLowerCase();
  const eventConfig = getEventConfig(eventType);

  payload.data[0] = constructPayload(message, eventConfig);
  payload.data[0].event_name = eventNameMapping[eventType];

  // Handle special cases for product events
  if (isProductEvent(eventType)) {
    if (!payload.data[0].custom_data) {
      payload.data[0].custom_data = {};
    }
    payload.data[0].custom_data.content_ids = getItemIds(message);
    payload.data[0].custom_data.value = payload.data[0].custom_data.value || getPriceSum(message);
  }

  const contents = productsToContentsMapping(message);
  if (contents.length > 0) {
    payload.data[0].custom_data.contents = contents;
  }
  return payload;
};

const processPayload = (payload, message, config) => {
  const { actionSource, pixelId, snapAppId, appId, enableDeduplication, deduplicationKey } = config;

  let processedPayload = populateHashedValues(payload, message);
  validateRequiredFields(processedPayload);

  processedPayload.data[0].event_time = getEventTimestamp(message, 7);
  processedPayload.data[0].data_processing_options = getDataUseValue(message);
  processedPayload.data[0].action_source = actionSource;

  processedPayload = addSpecificEventDetails(
    message,
    processedPayload,
    actionSource,
    pixelId,
    snapAppId,
    appId,
  );

  if (enableDeduplication) {
    const eventId = deduplicationKey || 'messageId';
    processedPayload.data[0].event_id = get(message, eventId);
  }

  processedPayload.data[0] = removeUndefinedAndNullValues(processedPayload.data[0]);
  return processedPayload;
};

const trackResponseBuilder = (message, { Config }, mappedEvent) => {
  const { apiKey, pixelId, snapAppId, appId, deduplicationKey, enableDeduplication } = Config;
  const event = mappedEvent?.toString().trim().replace(/\s+/g, '_');
  const actionSource = getEventConversionType(message);

  validateEventConfiguration(actionSource, pixelId, snapAppId, appId);

  if (!eventNameMapping[event.toLowerCase()]) {
    throw new InstrumentationError(`Event ${event} doesn't match with Snapchat Events!`);
  }

  const payload = buildBasePayload(message, event);
  const commonProperties = getEventCommonProperties(message);

  // Merge common properties with payload
  if (commonProperties?.user_data) {
    payload.data[0].user_data = { ...payload.data[0]?.user_data, ...commonProperties.user_data };
  }
  if (commonProperties?.custom_data) {
    payload.data[0].custom_data = {
      ...payload.data[0]?.custom_data,
      ...commonProperties.custom_data,
    };
  }
  if (commonProperties.app_data) {
    payload.data[0].app_data = {
      ...payload.data[0]?.app_data,
      ...commonProperties.app_data,
    };
  }

  // Process and validate payload
  const processedPayload = processPayload(payload, message, {
    actionSource,
    pixelId,
    snapAppId,
    appId,
    enableDeduplication,
    deduplicationKey,
  });

  const ID = actionSource === 'MOBILE_APP' ? snapAppId : pixelId;
  return buildResponse(apiKey, processedPayload, ID);
};

const handlePageEvent = (message, destination) =>
  trackResponseBuilder(message, destination, pageTypeToTrackEvent);

const handleTrackEvent = (message, destination) => {
  const mappedEvents = eventMappingHandler(message, destination);

  if (mappedEvents.length > 0) {
    const responses = mappedEvents.map((mappedEvent) =>
      trackResponseBuilder(message, destination, mappedEvent),
    );
    responses[0].body.JSON.data = responses.flatMap((response) => response.body.JSON.data);
    return responses[0];
  }

  return trackResponseBuilder(message, destination, get(message, 'event'));
};

const processV3 = (event) => {
  const { message, destination } = event;
  const messageType = getEventType(message);

  if (!messageType) {
    throw new InstrumentationError('Event type is required');
  }

  if (messageType === EventType.PAGE) {
    return handlePageEvent(message, destination);
  }

  if (messageType === EventType.TRACK) {
    return handleTrackEvent(message, destination);
  }

  throw new InstrumentationError(`Event type ${messageType} is not supported`);
};

const processRouterDest = async (inputs, reqMetadata) => {
  const webOrOfflineEventsChunk = [];
  const mobileEventsChunk = [];
  const errorRespList = [];

  inputs.forEach((event) => {
    try {
      const actionSource = getEventConversionType(event.message);
      const resp = {
        message: processV3(event),
        metadata: event.metadata,
        destination: event.destination,
      };
      if (actionSource === 'MOBILE_APP') {
        mobileEventsChunk.push(resp);
      } else {
        webOrOfflineEventsChunk.push(resp);
      }
    } catch (error) {
      const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
      errorRespList.push(errRespEvent);
    }
  });

  const batchResponseList = batchResponseBuilder(webOrOfflineEventsChunk, mobileEventsChunk);

  return [...batchResponseList, ...errorRespList];
};

module.exports = { processV3, processRouterDest };

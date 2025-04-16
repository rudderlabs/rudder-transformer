const get = require('get-value');
const moment = require('moment');
const { InstrumentationError } = require('@rudderstack/integrations-lib');
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
  msUnixTimestamp,
  getHashedValue,
  getItemIds,
  getPriceSum,
  getDataUseValue,
  getNormalizedPhoneNumber,
  eventMappingHandler,
  getEventConversionType,
  validateEventConfiguration,
} = require('./util');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { batchResponseBuilder } = require('./utilsV3');

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
  const firstName = getFieldValueFromMessage(message, 'firstName');
  const lastName = getFieldValueFromMessage(message, 'lastName');
  const gender = getFieldValueFromMessage(message, 'gender');
  const city = getFieldValueFromMessage(message, 'city');
  const state = getFieldValueFromMessage(message, 'state');
  const zip = getFieldValueFromMessage(message, 'zipcode');
  const country = getFieldValueFromMessage(message, 'country');

  const updatedPayload = { ...payload };

  if (!updatedPayload.data[0].user_data) {
    updatedPayload.data[0].user_data = {};
  }

  updatedPayload.data[0].user_data = {
    ...updatedPayload.data[0].user_data,
    fn: firstName ? getHashedValue(firstName.toString().toLowerCase().trim()) : undefined,
    ln: lastName ? getHashedValue(lastName.toString().toLowerCase().trim()) : undefined,
    ge: gender ? getHashedValue(gender.toString().toLowerCase().trim()) : undefined,
    ct: city ? getHashedValue(city.toString().toLowerCase().trim()) : undefined,
    zp: zip ? getHashedValue(zip.toString().toLowerCase().trim()) : undefined,
    st: state ? getHashedValue(state.toString().toLowerCase().trim()) : undefined,
    country: country ? getHashedValue(country.toString().toLowerCase().trim()) : undefined,
  };

  return updatedPayload;
};

/**
 * Seperate out hashing operations into one function
 * @param {*} payload
 * @param {*} message
 * @returns updatedPayload
 */
const populateHashedValues = (payload, message) => {
  const email = getFieldValueFromMessage(message, 'email');
  const phone = getNormalizedPhoneNumber(message);

  const updatedPayload = populateHashedTraitsValues(payload, message);

  if (email) {
    updatedPayload.data[0].user_data.em = getHashedValue(email.toString().toLowerCase().trim());
  }
  if (phone) {
    updatedPayload.data[0].user_data.ph = getHashedValue(phone.toString().toLowerCase().trim());
  }

  return updatedPayload;
};

const getEventCommonProperties = (message) =>
  constructPayload(message, mappingConfigV3[ConfigCategoryV3.TRACK_COMMON.name]);

const validateRequiredFields = (payload) => {
  const userData = payload.data?.[0]?.user_data || {};
  if (
    !userData.em &&
    !userData.ph &&
    !userData.madid &&
    !(userData.client_ip_address && userData.client_user_agent)
  ) {
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
  }

  return updatedPayload;
};

// Returns the response for the track event after constructing the payload and setting necessary fields
const trackResponseBuilder = (message, { Config }, mappedEvent) => {
  let payload = { data: [{}] };

  const event = mappedEvent?.toString().trim().replace(/\s+/g, '_');
  const actionSource = getEventConversionType(message);
  const { apiKey, pixelId, snapAppId, appId, deduplicationKey, enableDeduplication } = Config;

  validateEventConfiguration(actionSource, pixelId, snapAppId, appId);

  if (eventNameMapping[event.toLowerCase()]) {
    // Snapchat standard events
    // get event specific parameters
    switch (event.toLowerCase()) {
      /* Browsing Section */
      case 'products_searched':
        payload.data[0] = constructPayload(
          message,
          mappingConfigV3[ConfigCategoryV3.PRODUCTS_SEARCHED.name],
        );
        payload.data[0].event_name = eventNameMapping[event.toLowerCase()];
        break;
      case 'product_list_viewed':
        payload.data[0] = constructPayload(
          message,
          mappingConfigV3[ConfigCategoryV3.PRODUCT_LIST_VIEWED.name],
        );
        payload.data[0].event_name = eventNameMapping[event.toLowerCase()];
        if (!payload.data[0].custom_data) {
          payload.data[0].custom_data = {};
        }
        payload.data[0].custom_data.content_ids = getItemIds(message);
        payload.data[0].custom_data.value =
          payload.data[0].custom_data.value || getPriceSum(message);
        break;
      /* Promotions Section */
      case 'promotion_viewed':
        payload.data[0] = constructPayload(
          message,
          mappingConfigV3[ConfigCategoryV3.PROMOTION_VIEWED.name],
        );
        payload.data[0].event_name = eventNameMapping[event.toLowerCase()];
        break;
      case 'promotion_clicked':
        payload.data[0] = constructPayload(
          message,
          mappingConfigV3[ConfigCategoryV3.PROMOTION_CLICKED.name],
        );
        payload.data[0].event_name = eventNameMapping[event.toLowerCase()];
        break;
      /* Ordering Section */
      case 'product_viewed':
        payload.data[0] = constructPayload(
          message,
          mappingConfigV3[ConfigCategoryV3.PRODUCT_VIEWED.name],
        );
        payload.data[0].event_name = eventNameMapping[event.toLowerCase()];
        break;
      case 'checkout_started':
        payload.data[0] = constructPayload(
          message,
          mappingConfigV3[ConfigCategoryV3.CHECKOUT_STARTED.name],
        );
        payload.data[0].event_name = eventNameMapping[event.toLowerCase()];
        if (!payload.data[0].custom_data) {
          payload.data[0].custom_data = {};
        }
        payload.data[0].custom_data.content_ids = getItemIds(message);
        payload.data[0].custom_data.value =
          payload.data[0].custom_data.value || getPriceSum(message);
        break;
      case 'payment_info_entered':
        payload.data[0] = constructPayload(
          message,
          mappingConfigV3[ConfigCategoryV3.PAYMENT_INFO_ENTERED.name],
        );
        payload.data[0].event_name = eventNameMapping[event.toLowerCase()];
        break;
      case 'order_completed':
        payload.data[0] = constructPayload(
          message,
          mappingConfigV3[ConfigCategoryV3.ORDER_COMPLETED.name],
        );
        payload.data[0].event_name = eventNameMapping[event.toLowerCase()];
        if (!payload.data[0].custom_data) {
          payload.data[0].custom_data = {};
        }
        payload.data[0].custom_data.content_ids = getItemIds(message);
        payload.data[0].custom_data.value =
          payload.data[0].custom_data.value || getPriceSum(message);
        break;
      case 'product_added':
        payload.data[0] = constructPayload(
          message,
          mappingConfigV3[ConfigCategoryV3.PRODUCT_ADDED.name],
        );
        payload.data[0].event_name = eventNameMapping[event.toLowerCase()];
        break;
      /* Wishlist Section */
      case 'product_added_to_wishlist':
        payload.data[0] = constructPayload(
          message,
          mappingConfigV3[ConfigCategoryV3.PRODUCT_ADDED_TO_WISHLIST.name],
        );
        payload.data[0].event_name = eventNameMapping[event.toLowerCase()];
        break;
      /* Snapchat General Events */
      case 'sign_up':
        payload.data[0] = constructPayload(message, mappingConfigV3[ConfigCategoryV3.SIGN_UP.name]);
        payload.data[0].event_name = eventNameMapping[event.toLowerCase()];
        break;
      default:
        payload.data[0] = constructPayload(message, mappingConfigV3[ConfigCategoryV3.DEFAULT.name]);
        payload.data[0].event_name = eventNameMapping[event.toLowerCase()];
        break;
    }
  } else {
    throw new InstrumentationError(`Event ${event} doesn't match with Snapchat Events!`);
  }

  const commonProperties = getEventCommonProperties(message);
  if (commonProperties?.user_data) {
    payload.data[0].user_data = { ...payload.data[0]?.user_data, ...commonProperties.user_data };
  }
  if (commonProperties?.custom_data) {
    payload.data[0].custom_data = {
      ...payload.data[0]?.custom_data,
      ...commonProperties.custom_data,
    };
  }
  payload = populateHashedValues(payload, message);
  validateRequiredFields(payload);

  const eventTime = getFieldValueFromMessage(message, 'timestamp');
  if (eventTime) {
    const start = moment.unix(moment(eventTime).format('X'));
    const current = moment.unix(moment().format('X'));
    // calculates past event in days
    const deltaDay = Math.ceil(moment.duration(current.diff(start)).asDays());
    if (deltaDay > 28) {
      throw new InstrumentationError('Events must be sent within 28 days of their occurrence');
    }
    payload.data[0].event_time = msUnixTimestamp(eventTime)?.toString()?.slice(0, 10);
  }

  payload.data[0].data_processing_options = getDataUseValue(message);
  payload.data[0].action_source = actionSource;
  payload = addSpecificEventDetails(message, payload, actionSource, pixelId, snapAppId, appId);
  // adding for deduplication for more than one source
  if (enableDeduplication) {
    const eventId = deduplicationKey || 'messageId';
    payload.data[0].event_id = get(message, eventId);
  }

  payload.data[0] = removeUndefinedAndNullValues(payload.data[0]);
  const ID = actionSource === 'MOBILE_APP' ? snapAppId : pixelId;
  return buildResponse(apiKey, payload, ID);
};

const processV3 = (event) => {
  const { message, destination } = event;

  const messageType = getEventType(message);
  if (!messageType) {
    throw new InstrumentationError('Event type is required');
  }

  let response;

  if (messageType === EventType.PAGE) {
    response = [trackResponseBuilder(message, destination, pageTypeToTrackEvent)];
  } else if (messageType === EventType.TRACK) {
    const mappedEvents = eventMappingHandler(message, destination);
    if (mappedEvents.length > 0) {
      response = mappedEvents.map((mappedEvent) =>
        trackResponseBuilder(message, destination, mappedEvent),
      );
    } else {
      response = [trackResponseBuilder(message, destination, get(message, 'event'))];
    }
  } else {
    throw new InstrumentationError(`Event type ${messageType} is not supported`);
  }

  return response;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const webOrOfflineEventsChunk = [];
  const mobileEventsChunk = [];
  const errorRespList = [];

  inputs.forEach((event) => {
    try {
      const resp = processV3(event);
      const actionSource = getEventConversionType(event.message);
      if (actionSource === 'MOBILE_APP') {
        mobileEventsChunk.push({
          message: Array.isArray(resp) && resp.length === 1 ? resp[0] : resp,
          metadata: event.metadata,
          destination: event.destination,
        });
      } else {
        webOrOfflineEventsChunk.push({
          message: Array.isArray(resp) && resp.length === 1 ? resp[0] : resp,
          metadata: event.metadata,
          destination: event.destination,
        });
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

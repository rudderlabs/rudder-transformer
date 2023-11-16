const get = require('get-value');
const moment = require('moment');
const { InstrumentationError, ConfigurationError } = require('@rudderstack/integrations-lib');
const { EventType } = require('../../../constants');

const {
  defaultPostRequestConfig,
  constructPayload,
  defaultRequestConfig,
  removeUndefinedAndNullValues,
  getFieldValueFromMessage,
  getSuccessRespEvents,
  isAppleFamily,
  getValidDynamicFormConfig,
  checkInvalidRtTfEvents,
  handleRtTfSingleEventError,
  batchMultiplexedEvents,
} = require('../../util');
const {
  ENDPOINT,
  eventNameMapping,
  mappingConfig,
  ConfigCategory,
  MAX_BATCH_SIZE,
  pageTypeToTrackEvent,
} = require('./config');
const {
  msUnixTimestamp,
  getHashedValue,
  getItemIds,
  getPriceSum,
  getDataUseValue,
  getNormalizedPhoneNumber,
  channelMapping,
  generateBatchedPayloadForArray,
} = require('./util');
const { JSON_MIME_TYPE } = require('../../util/constant');

function buildResponse(apiKey, payload) {
  const response = defaultRequestConfig();
  response.endpoint = ENDPOINT;
  response.headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': JSON_MIME_TYPE,
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
}
const populateHashedTraitsValues = (payload, message) => {
  const firstName = getFieldValueFromMessage(message, 'firstName');
  const lastName = getFieldValueFromMessage(message, 'lastName');
  const middleName = getFieldValueFromMessage(message, 'middleName');
  const city = getFieldValueFromMessage(message, 'city');
  const state = getFieldValueFromMessage(message, 'state');
  const zip = getFieldValueFromMessage(message, 'zipcode');
  const updatedPayload = {
    ...payload,
    hashed_first_name_sha: firstName
      ? getHashedValue(firstName.toString().toLowerCase().trim())
      : undefined,
    hashed_middle_name_sha: middleName
      ? getHashedValue(middleName.toString().toLowerCase().trim())
      : undefined,
    hashed_last_name_sha: lastName
      ? getHashedValue(lastName.toString().toLowerCase().trim())
      : undefined,
    hashed_city_sha: city ? getHashedValue(city.toString().toLowerCase().trim()) : undefined,
    hashed_zip: zip ? getHashedValue(zip.toString().toLowerCase().trim()) : undefined,
    hashed_state_sha: state ? getHashedValue(state.toString().toLowerCase().trim()) : undefined,
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
  const ip = message.context?.ip || message.request_ip;

  const updatedPayload = populateHashedTraitsValues(payload, message);
  if (email) {
    updatedPayload.hashed_email = getHashedValue(email.toString().toLowerCase().trim());
  }
  if (phone) {
    updatedPayload.hashed_phone_number = getHashedValue(phone.toString().toLowerCase().trim());
  }
  if (ip) {
    updatedPayload.hashed_ip_address = getHashedValue(ip.toString().toLowerCase().trim());
  }
  // only in case of ios platform this is required
  if (
    isAppleFamily(message.context?.device?.type) &&
    (message.properties?.idfv || message.context?.device?.id)
  ) {
    updatedPayload.hashed_idfv = getHashedValue(
      message.properties?.idfv || message.context?.device?.id,
    );
  }

  if (message.properties?.adId || message.context?.device?.advertisingId) {
    updatedPayload.hashed_mobile_ad_id = getHashedValue(
      message.properties?.adId || message.context?.device?.advertisingId,
    );
  }
  return updatedPayload;
};
const getEventCommonProperties = (message) =>
  constructPayload(message, mappingConfig[ConfigCategory.TRACK_COMMON.name]);
const validateEventConfiguration = (eventConversionType, pixelId, snapAppId, appId) => {
  if ((eventConversionType === 'WEB' || eventConversionType === 'OFFLINE') && !pixelId) {
    throw new ConfigurationError('Pixel Id is required for web and offline events');
  }

  if (eventConversionType === 'MOBILE_APP' && !(appId && snapAppId)) {
    let requiredId = 'App Id';
    if (!snapAppId) {
      requiredId = 'Snap App Id';
    }
    throw new ConfigurationError(`${requiredId} is required for app events`);
  }
};
const validateRequiredFields = (payload) => {
  if (
    !payload.hashed_email &&
    !payload.hashed_phone_number &&
    !payload.hashed_mobile_ad_id &&
    !(payload.hashed_ip_address && payload.user_agent)
  ) {
    throw new InstrumentationError(
      'At least one of email or phone or advertisingId or ip and userAgent is required',
    );
  }
};
const addSpecificEventDetails = (
  message,
  payload,
  eventConversionType,
  pixelId,
  snapAppId,
  appId,
) => {
  const updatedPayload = { ...payload };
  if (eventConversionType === 'WEB') {
    updatedPayload.pixel_id = pixelId;
    updatedPayload.page_url = getFieldValueFromMessage(message, 'pageUrl');
  }

  if (eventConversionType === 'MOBILE_APP') {
    updatedPayload.snap_app_id = snapAppId;
    updatedPayload.app_id = appId;
  }

  if (eventConversionType === 'OFFLINE') {
    updatedPayload.pixel_id = pixelId;
  }
  return updatedPayload;
};
const getEventConversionType = (message) => {
  const channel = get(message, 'channel');
  let eventConversionType = message?.properties?.eventConversionType;
  if (
    channelMapping[eventConversionType?.toLowerCase()] ||
    channelMapping[channel?.toLowerCase()]
  ) {
    eventConversionType = eventConversionType
      ? channelMapping[eventConversionType?.toLowerCase()]
      : channelMapping[channel?.toLowerCase()];
  } else {
    eventConversionType = 'OFFLINE';
  }
  return eventConversionType;
};

// Returns the response for the track event after constructing the payload and setting necessary fields
const trackResponseBuilder = (message, { Config }, mappedEvent) => {
  let payload = {};
  const event = mappedEvent.trim().replace(/\s+/g, '_');
  const eventConversionType = getEventConversionType(message);
  const { apiKey, pixelId, snapAppId, appId, deduplicationKey, enableDeduplication } = Config;
  validateEventConfiguration(eventConversionType, pixelId, snapAppId, appId);

  if (eventNameMapping[event.toLowerCase()]) {
    // Snapchat standard events
    // get event specific parameters
    switch (event.toLowerCase()) {
      /* Browsing Section */
      case 'products_searched':
        payload = constructPayload(message, mappingConfig[ConfigCategory.PRODUCTS_SEARCHED.name]);
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      case 'product_list_viewed':
        payload = constructPayload(message, mappingConfig[ConfigCategory.PRODUCT_LIST_VIEWED.name]);
        payload.event_type = eventNameMapping[event.toLowerCase()];
        payload.item_ids = getItemIds(message);
        payload.price = payload.price || getPriceSum(message);
        break;
      /* Promotions Section */
      case 'promotion_viewed':
        payload = constructPayload(message, mappingConfig[ConfigCategory.PROMOTION_VIEWED.name]);
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      case 'promotion_clicked':
        payload = constructPayload(message, mappingConfig[ConfigCategory.PROMOTION_CLICKED.name]);
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      /* Ordering Section */
      case 'product_viewed':
        payload = constructPayload(message, mappingConfig[ConfigCategory.PRODUCT_VIEWED.name]);
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      case 'checkout_started':
        payload = constructPayload(message, mappingConfig[ConfigCategory.CHECKOUT_STARTED.name]);
        payload.event_type = eventNameMapping[event.toLowerCase()];
        payload.item_ids = getItemIds(message);
        payload.price = payload.price || getPriceSum(message);
        break;
      case 'payment_info_entered':
        payload = constructPayload(
          message,
          mappingConfig[ConfigCategory.PAYMENT_INFO_ENTERED.name],
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      case 'order_completed':
        payload = constructPayload(message, mappingConfig[ConfigCategory.ORDER_COMPLETED.name]);
        payload.event_type = eventNameMapping[event.toLowerCase()];
        payload.item_ids = getItemIds(message);
        payload.price = payload.price || getPriceSum(message);
        break;
      case 'product_added':
        payload = constructPayload(message, mappingConfig[ConfigCategory.PRODUCT_ADDED.name]);
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      /* Wishlist Section */
      case 'product_added_to_wishlist':
        payload = constructPayload(
          message,
          mappingConfig[ConfigCategory.PRODUCT_ADDED_TO_WISHLIST.name],
        );
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      /* Snapchat General Events */
      case 'sign_up':
        payload = constructPayload(message, mappingConfig[ConfigCategory.SIGN_UP.name]);
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
      default:
        payload = constructPayload(message, mappingConfig[ConfigCategory.DEFAULT.name]);
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
    }
  } else {
    throw new InstrumentationError(`Event ${event} doesn't match with Snapchat Events!`);
  }

  payload = { ...payload, ...getEventCommonProperties(message) };
  payload = populateHashedValues(payload, message);
  validateRequiredFields(payload);
  payload.timestamp = getFieldValueFromMessage(message, 'timestamp');
  const timeStamp = payload.timestamp;
  if (timeStamp) {
    const start = moment.unix(moment(timeStamp).format('X'));
    const current = moment.unix(moment().format('X'));
    // calculates past event in days
    const deltaDay = Math.ceil(moment.duration(current.diff(start)).asDays());
    if (deltaDay > 28) {
      throw new InstrumentationError('Events must be sent within 28 days of their occurrence');
    }
  }
  payload.data_use = getDataUseValue(message);
  if (timeStamp) {
    payload.timestamp = msUnixTimestamp(payload.timestamp)?.toString()?.slice(0, 10);
  }

  payload.event_conversion_type = eventConversionType;
  payload = addSpecificEventDetails(
    message,
    payload,
    eventConversionType,
    pixelId,
    snapAppId,
    appId,
  );
  // adding for deduplication for more than one source
  if (enableDeduplication) {
    const dedupId = deduplicationKey || 'messageId';
    payload.client_dedup_id = get(message, dedupId);
  }
  payload = removeUndefinedAndNullValues(payload);

  // build response
  const response = buildResponse(apiKey, payload);
  return response;
};

// Checks if there are any mapping events for the track event and returns them
const eventMappingHandler = (message, destination) => {
  let event = get(message, 'event');

  if (!event) {
    throw new InstrumentationError('Event name is required');
  }
  event = event.trim().replace(/\s+/g, '_');

  let { rudderEventsToSnapEvents } = destination.Config;
  const mappedEvents = new Set();

  if (Array.isArray(rudderEventsToSnapEvents)) {
    rudderEventsToSnapEvents = getValidDynamicFormConfig(
      rudderEventsToSnapEvents,
      'from',
      'to',
      'snapchat_conversion',
      destination.ID,
    );
    rudderEventsToSnapEvents.forEach((mapping) => {
      if (mapping.from.trim().replace(/\s+/g, '_').toLowerCase() === event.toLowerCase()) {
        mappedEvents.add(mapping.to);
      }
    });
  }

  return [...mappedEvents];
};

const process = (event) => {
  const { message, destination } = event;
  // const message = { ...incomingMessage };
  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }

  const messageType = message.type.toLowerCase();
  let response;
  if (messageType === EventType.PAGE) {
    response = [trackResponseBuilder(message, destination, pageTypeToTrackEvent)];
  } else if (messageType === EventType.TRACK) {
    const mappedEvents = eventMappingHandler(message, destination);
    if (mappedEvents.length > 0) {
      response = [];
      mappedEvents.forEach((mappedEvent) => {
        const res = trackResponseBuilder(message, destination, mappedEvent);
        response.push(res);
      });
    } else {
      response = trackResponseBuilder(message, destination, get(message, 'event'));
    }
  } else {
    throw new InstrumentationError(`Event type ${messageType} is not supported`);
  }
  return response;
};

const processRouterDest = async (inputs, reqMetadata) => {
  const errorRespEvents = checkInvalidRtTfEvents(inputs);
  if (errorRespEvents.length > 0) {
    return errorRespEvents;
  }

  const eventsChunk = []; // temporary variable to divide payload into chunks
  const errorRespList = [];
  inputs.forEach((event) => {
    try {
      let resp = event.message;
      if (!event.message.statusCode) {
        // already transformed event
        resp = process(event);
      }
      eventsChunk.push({
        message: Array.isArray(resp) ? resp : [resp],
        metadata: event.metadata,
        destination: event.destination,
      });
    } catch (error) {
      const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
      errorRespList.push(errRespEvent);
    }
  });

  const batchResponseList = [];
  if (eventsChunk.length > 0) {
    const batchedEvents = batchMultiplexedEvents(eventsChunk, MAX_BATCH_SIZE);
    batchedEvents.forEach((batch) => {
      const batchedRequest = generateBatchedPayloadForArray(batch.events, batch.destination);
      batchResponseList.push(
        getSuccessRespEvents(batchedRequest, batch.metadata, batch.destination, true),
      );
    });
  }

  return [...batchResponseList, ...errorRespList];
};

module.exports = { process, processRouterDest };

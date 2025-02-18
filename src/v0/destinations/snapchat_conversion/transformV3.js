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
  handleRtTfSingleEventError,
  batchMultiplexedEvents,
} = require('../../util');
const {
  ENDPOINT,
  eventNameMapping,
  mappingConfigV3,
  MAX_BATCH_SIZE,
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
  channelMapping,
  generateBatchedPayloadForArray,
} = require('./util');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { getEndpointWithClickId } = require('./utilsV3');

function buildResponse(apiKey, payload, message) {
  const response = defaultRequestConfig();
  response.endpoint = getEndpointWithClickId(ENDPOINT.Endpoint_v3, message);
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
    data: [
      {
        user_data: {
          fn: firstName ? getHashedValue(firstName.toString().toLowerCase().trim()) : undefined,
          mn: middleName ? getHashedValue(middleName.toString().toLowerCase().trim()) : undefined,
          ln: lastName ? getHashedValue(lastName.toString().toLowerCase().trim()) : undefined,
          ct: city ? getHashedValue(city.toString().toLowerCase().trim()) : undefined,
          zp: zip ? getHashedValue(zip.toString().toLowerCase().trim()) : undefined,
          st: state ? getHashedValue(state.toString().toLowerCase().trim()) : undefined,
        },
        custom_data: {},
        app_data: {},
      },
    ],
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
    updatedPayload.data[0].user_data.em = getHashedValue(email.toString().toLowerCase().trim());
  }
  if (phone) {
    updatedPayload.data[0].user_data.ph = getHashedValue(phone.toString().toLowerCase().trim());
  }
  if (ip) {
    updatedPayload.data[0].user_data.client_ip_address = getHashedValue(
      ip.toString().toLowerCase().trim(),
    );
  }
  // only in case of ios platform this is required
  if (
    isAppleFamily(message.context?.device?.type) &&
    (message.properties?.idfv || message.context?.device?.id)
  ) {
    updatedPayload.data[0].user_data.idfv = getHashedValue(
      message.properties?.idfv || message.context?.device?.id,
    );
  }

  if (message.properties?.adId || message.context?.device?.advertisingId) {
    updatedPayload.data[0].user_data.madid = getHashedValue(
      message.properties?.adId || message.context?.device?.advertisingId,
    );
  }
  return updatedPayload;
};
const getEventCommonProperties = (message) =>
  constructPayload(message, mappingConfigV3[ConfigCategoryV3.TRACK_COMMON.name]);
const validateEventConfiguration = (actionSource, pixelId, snapAppId, appId) => {
  if ((actionSource === 'WEB' || actionSource === 'OFFLINE') && !pixelId) {
    throw new ConfigurationError('Pixel Id is required for web and offline events');
  }

  if (actionSource === 'MOBILE_APP' && !(appId && snapAppId)) {
    let requiredId = 'App Id';
    if (!snapAppId) {
      requiredId = 'Snap App Id';
    }
    throw new ConfigurationError(`${requiredId} is required for app events`);
  }
};
const validateRequiredFields = (payload) => {
  if (
    !payload.data[0].user_data.em &&
    !payload.data[0].user_data.ph &&
    !payload.data[0].user_data.madid &&
    !(payload.data[0].user_data.client_ip_address && payload.data[0].user_data.client_user_agent)
  ) {
    throw new InstrumentationError(
      'At least one of email or phone or advertisingId or ip and clientUserAgent is required',
    );
  }
};
const addSpecificEventDetails = (message, payload, actionSource, pixelId, snapAppId, appId) => {
  const updatedPayload = { ...payload };
  if (actionSource === 'WEB') {
    updatedPayload.data.pixel_id = pixelId;
    updatedPayload.data.event_source_url = getFieldValueFromMessage(message, 'eventSourceUrl');
  }

  if (actionSource === 'MOBILE_APP') {
    updatedPayload.data.snap_app_id = snapAppId;
    updatedPayload.data.app_id = appId;
  }

  if (actionSource === 'OFFLINE') {
    updatedPayload.data.pixel_id = pixelId;
  }
  return updatedPayload;
};
const getEventConversionType = (message) => {
  const channel = get(message, 'channel');
  let actionSource = message?.properties?.action_source;
  if (channelMapping[actionSource?.toLowerCase()] || channelMapping[channel?.toLowerCase()]) {
    actionSource = actionSource
      ? channelMapping[actionSource?.toLowerCase()]
      : channelMapping[channel?.toLowerCase()];
  } else {
    actionSource = 'OFFLINE';
  }
  return actionSource;
};

// Returns the response for the track event after constructing the payload and setting necessary fields
const trackResponseBuilder = (message, { Config }, mappedEvent) => {
  let payload = {};
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
        payload = constructPayload(
          message,
          mappingConfigV3[ConfigCategoryV3.PRODUCTS_SEARCHED.name],
        );
        payload.data.event_name = eventNameMapping[event.toLowerCase()];
        break;
      case 'product_list_viewed':
        payload = constructPayload(
          message,
          mappingConfigV3[ConfigCategoryV3.PRODUCT_LIST_VIEWED.name],
        );
        payload.data.event_name = eventNameMapping[event.toLowerCase()];
        payload.data.custom_data.content_ids = getItemIds(message);
        payload.data.custom_data.contents.price =
        payload.data.custom_data.contents.price || getPriceSum(message);
        break;
      /* Promotions Section */
      case 'promotion_viewed':
        payload = constructPayload(
          message,
          mappingConfigV3[ConfigCategoryV3.PROMOTION_VIEWED.name],
        );
        payload.data.event_name = eventNameMapping[event.toLowerCase()];
        break;
      case 'promotion_clicked':
        payload = constructPayload(
          message,
          mappingConfigV3[ConfigCategoryV3.PROMOTION_CLICKED.name],
        );
        payload.data.event_name = eventNameMapping[event.toLowerCase()];
        break;
      /* Ordering Section */
      case 'product_viewed':
        payload = constructPayload(message, mappingConfigV3[ConfigCategoryV3.PRODUCT_VIEWED.name]);
        payload.data.event_name = eventNameMapping[event.toLowerCase()];
        break;
      case 'checkout_started':
        payload = constructPayload(
          message,
          mappingConfigV3[ConfigCategoryV3.CHECKOUT_STARTED.name],
        );
        payload.data.event_name = eventNameMapping[event.toLowerCase()];
        payload.data.custom_data.content_ids = getItemIds(message);
        payload.data.custom_data.contents.price =
          payload.data.custom_data.contents.price || getPriceSum(message);
        break;
      case 'payment_info_entered':
        payload = constructPayload(
          message,
          mappingConfigV3[ConfigCategoryV3.PAYMENT_INFO_ENTERED.name],
        );
        payload.data.event_type = eventNameMapping[event.toLowerCase()];
        break;
      case 'order_completed':
        payload = constructPayload(message, mappingConfigV3[ConfigCategoryV3.ORDER_COMPLETED.name]);
        payload.data.event_name = eventNameMapping[event.toLowerCase()];
        payload.data.custom_data.content_ids = getItemIds(message);
        payload.data.custom_data.contents.price =
          payload.data.custom_data.contents.price || getPriceSum(message);
        break;
      case 'product_added':
        payload = constructPayload(message, mappingConfigV3[ConfigCategoryV3.PRODUCT_ADDED.name]);
        payload.data.event_name = eventNameMapping[event.toLowerCase()];
        break;
      /* Wishlist Section */
      case 'product_added_to_wishlist':
        payload = constructPayload(
          message,
          mappingConfigV3[ConfigCategoryV3.PRODUCT_ADDED_TO_WISHLIST.name],
        );
        payload.data.event_name = eventNameMapping[event.toLowerCase()];
        break;
      /* Snapchat General Events */
      case 'sign_up':
        payload = constructPayload(message, mappingConfigV3[ConfigCategoryV3.SIGN_UP.name]);
        payload.data.event_name = eventNameMapping[event.toLowerCase()];
        break;
      default:
        payload = constructPayload(message, mappingConfigV3[ConfigCategoryV3.DEFAULT.name]);
        payload.data.event_name = eventNameMapping[event.toLowerCase()];
        break;
    }
  } else {
    throw new InstrumentationError(`Event ${event} doesn't match with Snapchat Events!`);
  }

  payload = { ...payload, ...getEventCommonProperties(message) };
  payload = populateHashedValues(payload, message);
  validateRequiredFields(payload);
  payload.data.event_time = getFieldValueFromMessage(message, 'timestamp');
  const eventTime = payload.data.event_time;
  if (eventTime) {
    const start = moment.unix(moment(eventTime).format('X'));
    const current = moment.unix(moment().format('X'));
    // calculates past event in days
    const deltaDay = Math.ceil(moment.duration(current.diff(start)).asDays());
    if (deltaDay > 28) {
      throw new InstrumentationError('Events must be sent within 28 days of their occurrence');
    }
  }
  payload.data.data_processing_options = getDataUseValue(message);
  if (eventTime) {
    payload.data.event_time = msUnixTimestamp(payload.data.event_time)?.toString()?.slice(0, 10);
  }

  payload.data.action_source = actionSource;
  payload = addSpecificEventDetails(message, payload, actionSource, pixelId, snapAppId, appId);
  // adding for deduplication for more than one source
  if (enableDeduplication) {
    const eventId = deduplicationKey || 'eventId';
    payload.data.event_id = get(message, eventId);
  }
  payload = removeUndefinedAndNullValues(payload);

  // build response
  const response = buildResponse(apiKey, payload, message);
  return response;
};

// Checks if there are any mapping events for the track event and returns them
const eventMappingHandler = (message, destination) => {
  let event = get(message, 'event');

  if (!event) {
    throw new InstrumentationError('Event name is required');
  }
  event = event.toString().trim().replace(/\s+/g, '_');

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

const processV3 = (event) => {
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
  const eventsChunk = []; // temporary variable to divide payload into chunks
  const errorRespList = [];
  inputs.forEach((event) => {
    try {
      let resp = event.message;
      if (!event.message.statusCode) {
        // already transformed event
        resp = processV3(event);
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

module.exports = { processV3, processRouterDest };

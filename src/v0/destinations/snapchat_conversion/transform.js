const get = require('get-value');
const moment = require('moment');
const _ = require('lodash');
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
} = require('../../util');
const {
  ENDPOINT,
  eventNameMapping,
  mappingConfig,
  ConfigCategory,
  MAX_BATCH_SIZE,
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
const { InstrumentationError, ConfigurationError } = require('../../util/errorTypes');

// Returns the response for the track event after constructing the payload and setting necessary fields
function trackResponseBuilder(message, { Config }, mappedEvent) {
  let payload = {};
  const event = mappedEvent.trim().replace(/\s+/g, '_');

  const { apiKey, pixelId, snapAppId, appId, deduplicationKey, enableDeduplication } = Config;
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

  if ((eventConversionType === 'WEB' || eventConversionType === 'OFFLINE') && !pixelId) {
    throw new ConfigurationError('Pixel Id is required for web and offline events');
  }

  if (eventConversionType === 'MOBILE_APP' && !(appId && snapAppId)) {
    if (!appId) {
      throw new ConfigurationError('App Id is required for app events');
    } else {
      throw new ConfigurationError('Snap App Id is required for app events');
    }
  }

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
        payload.price = getPriceSum(message);
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
        payload.price = getPriceSum(message);
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
        payload.price = getPriceSum(message);
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
        payload = constructPayload(message, mappingConfig[ConfigCategory.COMMON.name]);
        payload.event_type = eventNameMapping[event.toLowerCase()];
        break;
    }
  } else {
    throw new InstrumentationError(`Event ${event} doesn't match with Snapchat Events!`);
  }

  if (get(message, 'properties.event_tag')) {
    payload.event_tag = message.properties.event_tag;
  }

  const email = getFieldValueFromMessage(message, 'email');
  if (email) {
    payload.hashed_email = getHashedValue(email.toString().toLowerCase().trim());
  }
  const phone = getNormalizedPhoneNumber(message);
  if (phone) {
    payload.hashed_phone_number = getHashedValue(phone.toString().toLowerCase().trim());
  }
  const ip = message.context?.ip || message.request_ip;
  if (ip) {
    payload.hashed_ip_address = getHashedValue(ip.toString().toLowerCase().trim());
  }
  // only in case of ios platform this is required
  if (
    isAppleFamily(message.context?.device?.type) &&
    (message.properties?.idfv || message.context?.device?.id)
  ) {
    payload.hashed_idfv = getHashedValue(message.properties?.idfv || message.context?.device?.id);
  }

  if (message.properties?.adId || message.context?.device?.advertisingId) {
    payload.hashed_mobile_ad_id = getHashedValue(
      message.properties?.adId || message.context?.device?.advertisingId,
    );
  }

  payload.user_agent = message.context?.userAgent?.toString().toLowerCase();

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
  if (eventConversionType === 'WEB') {
    payload.pixel_id = pixelId;
    payload.page_url = getFieldValueFromMessage(message, 'pageUrl');
  }
  if (eventConversionType === 'MOBILE_APP') {
    payload.snap_app_id = snapAppId;
    payload.app_id = appId;
  }
  if (eventConversionType === 'OFFLINE') {
    payload.pixel_id = pixelId;
  }

  // adding for deduplication for more than one source
  if (enableDeduplication) {
    const dedupId = deduplicationKey || 'messageId';
    payload.client_dedup_id = get(message, dedupId);
  }
  payload = removeUndefinedAndNullValues(payload);

  // build response
  const response = defaultRequestConfig();
  response.endpoint = ENDPOINT;
  response.headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  response.method = defaultPostRequestConfig.requestMethod;
  response.body.JSON = removeUndefinedAndNullValues(payload);
  return response;
}

// Checks if there are any mapping events for the track event and returns them
function eventMappingHandler(message, destination) {
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
}

function process(event) {
  const { message, destination } = event;

  if (!message.type) {
    throw new InstrumentationError('Event type is required');
  }

  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.TRACK: {
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
      break;
    }
    default:
      throw new InstrumentationError(`Event type ${messageType} is not supported`);
  }
  return response;
}

function batchEvents(eventsChunk) {
  const batchedResponseList = [];

  // arrayChunks = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
  const arrayChunks = _.chunk(eventsChunk, MAX_BATCH_SIZE);

  arrayChunks.forEach((chunk) => {
    const batchEventResponse = generateBatchedPayloadForArray(chunk);
    batchedResponseList.push(
      getSuccessRespEvents(
        batchEventResponse.batchedRequest,
        batchEventResponse.metadata,
        batchEventResponse.destination,
        true,
      ),
    );
  });

  return batchedResponseList;
}

function getEventChunks(event, eventsChunk) {
  // build eventsChunk of MAX_BATCH_SIZE
  eventsChunk.push(event);
}

const processRouterDest = async (inputs, reqMetadata) => {
  const errorRespEvents = checkInvalidRtTfEvents(inputs);
  if (errorRespEvents.length > 0) {
    return errorRespEvents;
  }

  const eventsChunk = []; // temporary variable to divide payload into chunks
  const errorRespList = [];
  inputs.forEach((event) => {
    try {
      if (event.message.statusCode) {
        // already transformed event
        getEventChunks(event, eventsChunk);
      } else {
        // if not transformed
        let response = process(event);
        response = Array.isArray(response) ? response : [response];
        response.forEach((res) => {
          getEventChunks(
            {
              message: res,
              metadata: event.metadata,
              destination: event.destination,
            },
            eventsChunk,
          );
        });
      }
    } catch (error) {
      const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
      errorRespList.push(errRespEvent);
    }
  });

  let batchedResponseList = [];
  if (eventsChunk.length > 0) {
    batchedResponseList = batchEvents(eventsChunk);
  }
  return [...batchedResponseList, ...errorRespList];
};

module.exports = { process, processRouterDest };

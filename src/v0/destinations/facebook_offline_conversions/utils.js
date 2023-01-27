const sha256 = require('sha256');
const get = require('get-value');
const {
  isObject,
  formatTimeStamp,
  getHashFromArray,
  constructPayload,
  extractCustomFields,
  getFieldValueFromMessage,
  getDestinationExternalID,
  removeUndefinedAndNullValues,
  getHashFromArrayWithDuplicate,
} = require('../../util');

const {
  ENDPOINT,
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  HASHING_REQUIRED_KEYS,
  ACTION_SOURCES_VALUES,
  TRACK_EXCLUSION_FIELDS,
  eventToStandardMapping,
  MATCH_KEY_FIELD_TYPE_DICTIONARY,
} = require('./config');
const { ConfigurationError } = require('../../util/errorTypes');

/**
 * @param {*} message
 * @returns fbc parameter which is a combined string of the parameters below
 * version : "fb" (default)
 * subdomainIndex : 1 ( recommended by facebook, as well as our JS SDK sets cookies on the main domain, i.e "facebook.com")
 * creationTime : mapped to originalTimestamp converted in miliseconds
 * fbclid : deduced query paramter from context.page.url
 * ref: https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/fbp-and-fbc#fbc
 */
const deduceFbcParam = (message) => {
  const url = message.context?.page?.url;
  if (!url) {
    return undefined;
  }
  const parseUrl = new URL(url);
  const paramsList = new URLSearchParams(parseUrl.search);
  const fbclid = paramsList.get('fbclid');

  if (!fbclid) {
    return undefined;
  }
  const creationTime = getFieldValueFromMessage(message, 'timestamp');
  return `fb.1.${formatTimeStamp(creationTime)}.${fbclid}`;
};

/**
 * Returns System User Access Token
 * @param {Object} destination
 * @returns
 */
const getAccessToken = (destination) => {
  const { Config } = destination;
  return Config.accessToken;
};

/**
 * Returns an array of urls
 * %5B%5D signifies an array in encode format
 * @param {*} metadata
 * @param {*} data
 * @param {*} ids
 * @param {*} payload
 * @returns
 */
const prepareUrls = (destination, data, ids, payload) => {
  const urls = [];
  const uploadTags = payload.upload_tag || 'rudderstack';
  const [first] = data;
  const encodedData = `%5B${encodeURIComponent(JSON.stringify(first))}%5D`;
  const accessToken = getAccessToken(destination);
  ids.forEach((id) => {
    const endpoint = ENDPOINT.replace('OFFLINE_EVENT_SET_ID', id);
    urls.push(
      `${endpoint}?upload_tag=${uploadTags}&data=${encodedData}&access_token=${accessToken}`,
    );
  });

  return urls;
};

/**
 * Returns match_keys Object
 * Refer : https://developers.facebook.com/docs/marketing-api/offline-conversions/
 * @param {*} payload
 * @returns
 */
const prepareMatchKeys = (payload, message) => {
  const data = {};

  const propertyMapping = payload;

  propertyMapping.fbc = propertyMapping.fbc || deduceFbcParam(message);
  if (!propertyMapping.fbc) {
    delete propertyMapping.fbc;
  }

  if (propertyMapping.birthday) {
    const { birthday } = propertyMapping;
    const date = new Date(birthday);
    data.doby = sha256(toString(date.getFullYear()));
    data.dobm = sha256(toString(date.getMonth() + 1));
    data.dobd = sha256(toString(date.getDate()));
    delete propertyMapping.birthday;
  }

  const keys = Object.keys(propertyMapping);
  const matchKeyFields = Object.keys(MATCH_KEY_FIELD_TYPE_DICTIONARY);
  keys.forEach((key) => {
    if (matchKeyFields.includes(key)) {
      if (MATCH_KEY_FIELD_TYPE_DICTIONARY[key] === 'string') {
        data[key] = propertyMapping[key];
      } else {
        data[key] = [propertyMapping[key]];
      }
    }
  });
  return data;
};

/**
 * Returns the Standard event name which is mapped with event from webapp configuration
 * we are searching from webapp configuration
 * If not found, we are using our internal mapping
 * if not found there as well, we are returning with other
 * @param {*} eventsMapping
 * @param {*} event
 * @returns
 */
const getStandardEvents = (eventsMapping, event) => {
  const standardEvents = [];
  const keys = Object.keys(eventsMapping);
  keys.forEach((key) => {
    if (key === event) {
      standardEvents.push(...eventsMapping[key]);
    }
  });

  if (standardEvents.length === 0 && eventToStandardMapping[event]) {
    standardEvents.push(eventToStandardMapping[event]);
  }

  if (standardEvents.length === 0) {
    standardEvents.push('Other');
  }

  return standardEvents;
};

/**
 * Returns an array of ids which is mapped with standard event from webapp configuration
 * @param {*} eventsToIds
 * @param {*} standardEvent
 * @returns
 */
const getEventSetIds = (eventsToIds, standardEvent) => {
  let eventSetIds = [];
  const eventsToIdsMapping = getHashFromArrayWithDuplicate(eventsToIds, 'from', 'to', false);

  const keys = Object.keys(eventsToIdsMapping);
  keys.forEach((key) => {
    if (key === standardEvent) {
      eventSetIds = [...eventsToIdsMapping[key]];
    }
  });

  return eventSetIds;
};

/**
 * Returns eventSetIds and standard event name
 * Payload Structure : [ { standardEvent: 'AddToCart', eventSetIds: [ '1148872185708962', '1148872186708962' ] },{ standardEvent: 'InitiateCheckout', eventSetIds: [ '1148872185708962' ] } ]
 * @param {*} destination
 * @param {*} event
 * @returns
 */
const getStandardEventsAndEventSetIds = (destination, event) => {
  const payload = [];
  const { Config } = destination;
  const { eventsToIds, eventsToStandard } = Config;
  const eventsMapping = getHashFromArrayWithDuplicate(eventsToStandard, 'from', 'to', false);
  const standardEvents = getStandardEvents(eventsMapping, event);
  standardEvents.forEach((standardEvent) => {
    const eventSetIds = getEventSetIds(eventsToIds, standardEvent);
    if (eventSetIds.length > 0) {
      payload.push({ standardEvent, eventSetIds });
    }
  });
  if (payload.length === 0) {
    throw new ConfigurationError('Please Map Your Standard Events With Event Set Ids');
  }
  return payload;
};

/**
 * Returns true if event is configured from webapp else false
 * @param {*} eventsMapping
 * @param {*} event
 * @returns
 */
const findEventConfigurationPlace = (eventsMapping, event) => {
  let eventIsMappedFromWebapp = false;
  const keys = Object.keys(eventsMapping);
  keys.forEach((key) => {
    if (key === event) {
      eventIsMappedFromWebapp = true;
    }
  });
  return eventIsMappedFromWebapp;
};

/**
 *
 * @param {*} message Rudder Payload
 * @param {*} standardEvent
 * @param {*} categoryToContent [ { from: 'clothing', to: 'product' } ]
 * @param {*} destination
 * We will be mapping properties.category to user provided content else taking the default value as per ecomm spec
 * If category is clothing it will be set to ["product"]
 * @return Content Type array as defined in:
 * - https://developers.facebook.com/docs/facebook-pixel/reference/#object-properties
 */
const getContentType = (message, standardEvent, categoryToContent, destination) => {
  const { integrations, properties } = message;
  if (
    integrations &&
    integrations.FacebookOfflineConversions &&
    isObject(integrations.FacebookOfflineConversions) &&
    integrations.FacebookOfflineConversions.contentType
  ) {
    return integrations.FacebookOfflineConversions.contentType;
  }

  let contentType;

  let { category } = properties;
  // category field is mapped from properties.category, if not found, then, category of the first product item from the products array ( if any )
  if (!category) {
    const { products } = properties;
    if (products && products.length > 0 && Array.isArray(products) && isObject(products[0])) {
      category = products[0].category;
    }
  }

  /** *
   * if none of the above is followed, we are defaulting it to "product" except whatever events that are mapped to viewContent
   * for viewContent if there is any product array we are setting content_type as "product"
   * when no product array is not found we are defaulting it to "product_group"
   */
  if (category) {
    const categoryToContentMapping = getHashFromArray(categoryToContent, 'from', 'to', false);

    const keys = Object.keys(categoryToContentMapping);

    keys.forEach((key) => {
      if (key === category) {
        contentType = categoryToContentMapping[key];
      }
    });

    // if category isn't mapped with contentType then keeping default contentType as "product"
    if (!contentType) {
      contentType = 'product';
    }
  } else if (standardEvent === 'ViewContent') {
    const { event } = message;
    const { products } = message.properties;
    const { eventsToStandard } = destination.Config;
    const eventsMapping = getHashFromArrayWithDuplicate(eventsToStandard, 'from', 'to', false);
    const isEventConfiguredFromWebapp = findEventConfigurationPlace(eventsMapping, event);
    if (!isEventConfiguredFromWebapp && event === 'Product Viewed') {
      contentType = 'product';
    } else if (products && products.length > 0 && Array.isArray(products)) {
      contentType = 'product';
    } else {
      contentType = 'product_group';
    }
  } else {
    contentType = 'product';
  }
  return contentType;
};

/**
 * Returns an array of products
 * @param {*} contents
 * @returns
 */
const getProducts = (contents) => {
  const fbContents = [];
  const products = [];
  if (Array.isArray(contents)) {
    fbContents.push(...contents);
  } else {
    fbContents.push(contents);
  }

  fbContents.forEach((content) => {
    const id = content.product_id || content.id || content.sku;
    const quantity = content.quantity || 1;
    const { price, brand, category } = content;
    if (id) {
      const obj = { id, quantity, price, brand, category };
      products.push(removeUndefinedAndNullValues(obj));
    }
  });
  return products;
};

/**
 * Returns actionSource value
 * ref : https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/server-event#action-source
 * @param {*} payload
 * @returns
 */
const getActionSource = (payload) => {
  let actionSource = null;
  if (payload.action_source && ACTION_SOURCES_VALUES.includes(payload.action_source)) {
    actionSource = payload.action_source;
  }
  return actionSource;
};

/**
 * Returns the data array
 * @param {*} payload
 * @param {*} message
 * @returns
 */
const prepareData = (payload, message, destination) => {
  const { Config } = destination;
  const { limitedDataUSage, valueFieldIdentifier } = Config;

  const data = {
    match_keys: prepareMatchKeys(payload, message),
    event_time: payload.event_time,
    currency: payload.currency || 'USD',
    value: get(message.properties, valueFieldIdentifier) || payload.value || 0,
    order_id: payload.order_id || null,
    item_number: payload.item_number || null,
    contents: payload.contents ? getProducts(payload.contents) : null,
    custom_data: message.properties
      ? extractCustomFields(message, payload, ['properties'], TRACK_EXCLUSION_FIELDS)
      : null,
    action_source: getActionSource(payload),
    event_source_url: payload.event_source_url || null,
  };

  // ref : https://developers.facebook.com/docs/marketing-apis/data-processing-options#conversions-api-and-offline-conversions-api
  if (limitedDataUSage) {
    const dataProcessingOptions = get(message, 'context.dataProcessingOptions');
    if (dataProcessingOptions && Array.isArray(dataProcessingOptions)) {
      [
        data.data_processing_options,
        data.data_processing_options_country,
        data.data_processing_options_state,
      ] = dataProcessingOptions;
    }
  }

  return [removeUndefinedAndNullValues(data)];
};

/**
 * Attaches the event_name to data object
 * @param {*} data
 * @param {*} standardEvent
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const getData = (data, standardEvent, message, destination) => {
  const { categoryToContent } = destination.Config;
  const payload = data;
  const [first] = payload;
  first.event_name = standardEvent;
  first.content_type = getContentType(message, standardEvent, categoryToContent, destination);
  return [first];
};

/**
 * Returns the payload according to configurations
 * @param {*} facebookOfflineConversionsPayload
 * @param {*} destination
 * @returns
 */
const preparePayload = (facebookOfflineConversionsPayload, destination) => {
  const { isHashRequired } = destination.Config;
  const payload = {};

  const keys = Object.keys(facebookOfflineConversionsPayload);
  keys.forEach((key) => {
    if (isHashRequired && HASHING_REQUIRED_KEYS.includes(key)) {
      payload[key] = sha256(facebookOfflineConversionsPayload[key]);
    } else {
      payload[key] = facebookOfflineConversionsPayload[key];
    }
  });

  if (facebookOfflineConversionsPayload.name) {
    const split = facebookOfflineConversionsPayload.name
      ? facebookOfflineConversionsPayload.name.split(' ')
      : null;
    if (split !== null && Array.isArray(split) && split.length === 2) {
      payload.fn = isHashRequired ? sha256(split[0]) : split[0];
      payload.ln = isHashRequired ? sha256(split[1]) : split[1];
    }
    delete payload.name;
  }

  return payload;
};

/**
 * Returns the payload
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const offlineConversionResponseBuilder = (message, destination) => {
  const facebookOfflineConversionsPayload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.OFFLINE_EVENTS.name],
  );

  const payload = preparePayload(facebookOfflineConversionsPayload, destination);

  const leadId = getDestinationExternalID(message, 'LeadId');

  if (leadId) {
    payload.lead_id = leadId;
  }

  const data = prepareData(payload, message, destination);
  const eventToIdsArray = getStandardEventsAndEventSetIds(destination, message.event);

  const offlineConversionsPayloads = [];
  eventToIdsArray.forEach((eventToIds) => {
    const { standardEvent, eventSetIds } = eventToIds;
    const obj = {};
    obj.data = getData(data, standardEvent, message, destination);
    obj.eventSetIds = eventSetIds;
    obj.payload = payload;
    offlineConversionsPayloads.push(obj);
  });
  return offlineConversionsPayloads;
};

module.exports = { offlineConversionResponseBuilder, prepareUrls };

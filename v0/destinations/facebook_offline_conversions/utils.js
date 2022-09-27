const sha256 = require("sha256");
const get = require("get-value");
const {
  constructPayload,
  getIntegrationsObj,
  extractCustomFields,
  getDestinationExternalID,
  getHashFromArrayWithDuplicate,
  removeUndefinedAndNullValues
} = require("../../util");

const ErrorBuilder = require("../../util/error");
const { TRANSFORMER_METRIC } = require("../../util/constant");

const {
  ENDPOINT,
  destKeys,
  destKeyType,
  DESTINATION,
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  TRACK_EXCLUSION_FIELDS,
  eventToStandardMapping
} = require("./config");

/**
 * Returns System User Access Token
 * @param {Object} destination
 * @returns
 */
const getAccessToken = destination => {
  const { Config } = destination;
  return Config.accessToken;
};

/**
 * Returns an array of urls
 * @param {*} metadata
 * @param {*} data
 * @param {*} ids
 * @param {*} payload
 * @returns
 */
const prepareUrls = (destination, data, ids, payload) => {
  const urls = [];
  const uploadTags = payload.upload_tag || "rudderstack";
  const encodedData = encodeURIComponent(JSON.stringify(data));
  const accessToken = getAccessToken(destination);

  ids.forEach(id => {
    const endpoint = ENDPOINT.replace("OFFLINE_EVENT_SET_ID", id);
    urls.push(
      `${endpoint}?upload_tag=${uploadTags}&data=${encodedData}&access_token=${accessToken}`
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
const prepareMatchKeys = payload => {
  const data = {};
  const propertyMapping = payload;

  if (propertyMapping.birthday) {
    const { birthday } = propertyMapping;
    const date = new Date(birthday);
    data.doby = sha256(toString(date.getFullYear()));
    data.dobm = sha256(toString(date.getMonth() + 1));
    data.dobd = sha256(toString(date.getDate()));
    delete propertyMapping.birthday;
  }

  const keys = Object.keys(propertyMapping);
  keys.forEach(key => {
    if (destKeys.includes(key)) {
      if (destKeyType[key] === "string") {
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
  keys.forEach(key => {
    if (key === event) {
      standardEvents.push(...eventsMapping[key]);
    }
  });

  if (!standardEvents.length && eventToStandardMapping[event]) {
    standardEvents.push(eventToStandardMapping[event]);
  }

  if (!standardEvents.length) {
    standardEvents.push("Other");
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
  const eventsToIdsMapping = getHashFromArrayWithDuplicate(
    eventsToIds,
    "from",
    "to",
    false
  );

  const keys = Object.keys(eventsToIdsMapping);
  keys.forEach(key => {
    if (key === standardEvent) {
      eventSetIds = [...eventsToIdsMapping[key]];
    }
  });

  return eventSetIds;
};

/**
 * Returns eventSetIds and standard event name
 * @param {*} destination
 * @param {*} event
 * @returns
 */
const getStandardEventsAndEventSetIds = (destination, event) => {
  const payload = [];
  const { Config } = destination;
  const { eventsToIds, eventsToStandard } = Config;
  const eventsMapping = getHashFromArrayWithDuplicate(
    eventsToStandard,
    "from",
    "to",
    false
  );
  const standardEvents = getStandardEvents(eventsMapping, event);
  standardEvents.forEach(standardEvent => {
    const eventSetIds = getEventSetIds(eventsToIds, standardEvent);
    if (eventSetIds.length) {
      payload.push({ standardEvent, eventSetIds });
    }
  });
  if (!payload.length) {
    throw new ErrorBuilder()
      .setMessage(
        "[Facebook Offline Conversions] :: Please Map Your Standard Events With Event Set Ids"
      )
      .setStatus(400)
      .setStatTags({
        destType: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta:
          TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.CONFIGURATION
      })
      .build();
  }

  return payload;
};

/**
 * Returns content type
 * @param {*} message
 * @returns
 */
const getContentType = message => {
  let contentType = "product";
  const { event } = message;
  if (event === "Product List Viewed") {
    contentType = "product_group";
  }
  return contentType;
};

/**
 * Returns an array of products
 * @param {*} contents
 * @returns
 */
const getProducts = contents => {
  const fbContents = [];
  const products = [];
  if (Array.isArray(contents)) {
    fbContents.push(...contents);
  } else {
    fbContents.push(contents);
  }

  fbContents.forEach(content => {
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
 * Returns the data array
 * @param {*} payload
 * @param {*} message
 * @returns
 */
const prepareData = (payload, message, destination) => {
  const { Config } = destination;
  const { limitedDataUSage, valueFieldIdentifier } = Config;

  const data = {
    match_keys: prepareMatchKeys(payload),
    event_time: payload.event_time,
    currency: payload.currency || "USD",
    value: get(message.properties, valueFieldIdentifier) || payload.value || 0,
    content_type: getContentType(message),
    order_id: payload.order_id || null,
    item_number: payload.item_number || null,
    contents: payload.contents ? getProducts(payload.contents) : null,
    custom_data: message.properties
      ? extractCustomFields(
          message,
          payload,
          ["properties"],
          TRACK_EXCLUSION_FIELDS
        )
      : null
  };

  if (limitedDataUSage) {
    const dataProcessingOptions = get(message, "context.dataProcessingOptions");
    if (dataProcessingOptions && Array.isArray(dataProcessingOptions)) {
      [
        data.data_processing_options,
        data.data_processing_options_country,
        data.data_processing_options_state
      ] = dataProcessingOptions;
    }
  }

  return [removeUndefinedAndNullValues(data)];
};

/**
 * Attaches the event_name to data object
 * @param {*} data
 * @param {*} standardEvent
 * @returns
 */
const getData = (data, standardEvent) => {
  const payload = data;
  const [first] = payload;
  first.event_name = standardEvent;
  return [first];
};

/**
 * Returns the payload
 * @param {*} message
 * @param {*} destination
 * @returns
 */
const offlineConversionResponseBuilder = (message, destination) => {
  const payload = constructPayload(
    message,
    MAPPING_CONFIG[CONFIG_CATEGORIES.OFFLINE_EVENTS.name]
  );

  const leadId = getDestinationExternalID(message, "LeadId");

  if (leadId) {
    payload.lead_id = leadId;
  }

  const integrationsObj = getIntegrationsObj(
    message,
    "facebook_offline_conversions"
  );

  if (payload.name) {
    const split = payload.name ? payload.name.split(" ") : null;
    if (split !== null && Array.isArray(split) && split.length === 2) {
      payload.fn =
        integrationsObj && integrationsObj.hashed ? split[0] : sha256(split[0]);
      payload.ln =
        integrationsObj && integrationsObj.hashed ? split[1] : sha256(split[1]);
    }
    delete payload.name;
  }

  const data = prepareData(payload, message, destination);
  const eventToIdsArray = getStandardEventsAndEventSetIds(
    destination,
    message.event
  );

  const offlineConversionsPayload = [];
  eventToIdsArray.forEach(eventToIds => {
    const { standardEvent, eventSetIds } = eventToIds;
    const obj = {};
    obj.data = getData(data, standardEvent);
    obj.eventSetIds = eventSetIds;
    obj.payload = payload;
    offlineConversionsPayload.push(obj);
  });
  return offlineConversionsPayload;
};

module.exports = { offlineConversionResponseBuilder, prepareUrls };

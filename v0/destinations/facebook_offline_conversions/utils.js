const sha256 = require("sha256");
const {
  getHashFromArray,
  constructPayload,
  extractCustomFields,
  getDestinationExternalID,
  getHashFromArrayWithDuplicate
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
  TRACK_EXCLUSION_FIELDS
} = require("./config");

/**
 * Get access token to be bound to the event req headers
 *
 * Note:
 * This method needs to be implemented particular to the destination
 * As the schema that we'd get in `metadata.secret` can be different
 * for different destinations
 *
 * @param {Object} metadata
 * @returns
 */
const getAccessToken = metadata => {
  // OAuth for this destination
  const { secret } = metadata;

  // we would need to verify if secret is present and also if the access token field is present in secret
  if (!secret || !secret.access_token) {
    throw new ErrorBuilder()
      .setMessage("Empty/Invalid access token")
      .setStatus(500)
      .build();
  }
  return secret.access_token;
};

/**
 * Returns an array of urls
 * @param {*} metadata
 * @param {*} data
 * @param {*} ids
 * @param {*} payload
 * @returns
 */
const prepareUrls = (metadata, data, ids, payload) => {
  const urls = [];
  const uploadTags = payload.upload_tag || "rudderstack";
  const encodedData = encodeURIComponent(JSON.stringify(data));
  const accessToken = getAccessToken(metadata);

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
    data.doby = sha256(date.getFullYear());
    data.dobm = sha256(date.getMonth() + 1);
    data.dobd = sha256(date.getDate());
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
 * @param {*} eventsMapping
 * @param {*} event
 * @returns
 */
const getStandardEvent = (eventsMapping, event) => {
  let standardEvent = "";
  const keys = Object.keys(eventsMapping);
  keys.forEach(key => {
    if (key === event) {
      standardEvent = eventsMapping[key];
    }
  });
  return standardEvent;
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
      eventSetIds = Array.from(eventsToIdsMapping[key]);
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
const getEventSetId = (destination, event) => {
  const { Config } = destination;
  const { eventsToIds, eventsToStandard } = Config;
  const eventsMapping = getHashFromArray(eventsToStandard, "from", "to", false);
  const standardEvent = getStandardEvent(eventsMapping, event);
  if (!standardEvent) {
    throw new ErrorBuilder()
      .setMessage(
        "[Facebook Offline Conversions] :: Please Map Your Events With Standard Events"
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
  const eventSetIds = getEventSetIds(eventsToIds, standardEvent);
  if (!eventSetIds.length) {
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

  return { eventSetIds, standardEvent };
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
 * Returns the data array
 * @param {*} payload
 * @param {*} message
 * @returns
 */
const prepareData = (payload, message) => {
  const data = {};
  const matchKeys = prepareMatchKeys(payload);
  data.match_keys = matchKeys;
  data.event_time = payload.event_time;
  data.event_name = payload.event_name;
  data.currency = payload.currency || "USD";
  data.value = payload.value || 0;
  data.content_type = getContentType(message);

  if (payload.contents) {
    data.contents = payload.contents;
  }
  if (message.properties) {
    data.custom_data = extractCustomFields(
      message,
      payload,
      ["properties"],
      TRACK_EXCLUSION_FIELDS
    );
  }

  if (payload.order_id) {
    data.order_id = payload.order_id;
  }
  if (payload.item_number) {
    data.item_number = payload.item_number;
  }

  return [data];
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
  const { eventSetIds, standardEvent } = getEventSetId(
    destination,
    message.event
  );

  payload.event_name = standardEvent;

  const data = prepareData(payload, message);
  return { payload, data, eventSetIds };
};

module.exports = { offlineConversionResponseBuilder, prepareUrls };

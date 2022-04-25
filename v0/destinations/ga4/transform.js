const get = require("get-value");
const logger = require("../../../logger");
const { EventType } = require("../../../constants");
const {
  CustomError,
  defaultPostRequestConfig,
  constructPayload,
  defaultRequestConfig,
  extractCustomFields,
  isEmptyObject,
  flattenJson
} = require("../../util");
const {
  ENDPOINT,
  trackCommonConfig,
  eventNameMapping,
  mappingConfig,
  ConfigCategory
} = require("./config");
const {
  msUnixTimestamp,
  isReservedEventName,
  GA4_RESERVED_PARAMETER_EXCLUSION,
  removeReservedParameterPrefixNames,
  GA4_RESERVED_USER_PROPERTY_EXCLUSION,
  removeReservedUserPropertyPrefixNames,
  isReservedWebCustomEventName,
  isReservedWebCustomPrefixName,
  getDestinationItemProperties
} = require("./utils");

const trackResponseBuilder = async (message, { Config }) => {
  let event = get(message, "event");
  if (!event) {
    throw new CustomError("Event name is required", 400);
  }

  // trim and replace spaces with "_"
  event = event.trim().replace(/\s+/g, "_");

  // reserved event names are not allowed
  if (isReservedEventName(event)) {
    throw new CustomError(
      "[Google Analytics 4] track:: Reserved event names are not allowd",
      400
    );
  }

  // get common top level rawPayload
  let rawPayload = constructPayload(message, trackCommonConfig);
  if (rawPayload.timestamp_micros) {
    rawPayload.timestamp_micros = msUnixTimestamp(rawPayload.timestamp_micros);
  }

  const payload = {};
  if (eventNameMapping[event.toLowerCase()]) {
    // GA4 standard events
    // get event specific parameters
    switch (event.toLowerCase()) {
      /* Browsing Section */
      case "products_searched":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.PRODUCTS_SEARCHED.name]
        );
        break;
      case "product_list_viewed":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.PRODUCT_LIST_VIEWED.name]
        );
        payload.params.items = getDestinationItemProperties(message, true);
        break;
      /* Promotions Section */
      case "promotion_viewed":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.PROMOTION_VIEWED.name]
        );
        payload.params.items = getDestinationItemProperties(message, true);
        break;
      case "promotion_clicked":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.PROMOTION_CLICKED.name]
        );
        payload.params.items = getDestinationItemProperties(message, false);
        break;
      /* Ordering Section */
      case "product_clicked":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.PRODUCT_CLICKED.name]
        );
        payload.params.items = getDestinationItemProperties(message, true);
        break;
      case "product_viewed":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.PRODUCT_VIEWED.name]
        );
        payload.params.items = getDestinationItemProperties(message, true);
        break;
      case "product_added":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.PRODUCT_ADDED.name]
        );
        payload.params.items = getDestinationItemProperties(message, true);
        break;
      case "product_removed":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.PRODUCT_REMOVED.name]
        );
        payload.params.items = getDestinationItemProperties(message, true);
        break;
      case "cart_viewed":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.CART_VIEWED.name]
        );
        payload.params.items = getDestinationItemProperties(message, true);
        break;
      case "checkout_started":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.CHECKOUT_STARTED.name]
        );
        payload.params.items = getDestinationItemProperties(message, true);
        break;
      case "payment_info_entered":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.PAYMENT_INFO_ENTERED.name]
        );
        payload.params.items = getDestinationItemProperties(message, true);
        break;
      case "order_completed":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.ORDER_COMPLETED.name]
        );
        payload.params.items = getDestinationItemProperties(message, true);
        break;
      case "order_refunded":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.ORDER_REFUNDED.name]
        );
        payload.params.items = getDestinationItemProperties(message, true);
        break;
      /* Wishlist Section */
      case "product_added_to_wishlist":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.PRODUCT_ADDED_TO_WISHLIST.name]
        );
        payload.params.items = getDestinationItemProperties(message, true);
        break;
      /* Sharing Section */
      case "product_shared":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.PRODUCT_SHARED.name]
        );
        break;
      case "cart_shared":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.CART_SHARED.name]
        );
        break;
      /* Group */
      case "group":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.GROUP.name]
        );
        break;
      /* GA4 Events */
      case "earn_virtual_currency":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.EARN_VIRTUAL_CURRENCY.name]
        );
        break;
      case "generate_lead":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.GENERATE_LEAD.name]
        );
        break;
      case "level_up":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.LEVEL_UP.name]
        );
        break;
      case "login":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.LOGIN.name]
        );
        break;
      case "post_score":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.POST_SCORE.name]
        );
        break;
      case "select_content":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.SELECT_CONTENT.name]
        );
        break;
      case "sign_up":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.SIGN_UP.name]
        );
        break;
      case "spend_virtual_currency":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.SPEND_VIRTUAL_CURRENCY.name]
        );
        break;
      case "tutorial_begin":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.TUTORIAL_BEGIN.name]
        );
        break;
      case "tutorial_complete":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.TUTORIAL_COMPLETE.name]
        );
        break;
      case "unlock_achievement":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.UNLOCK_ACHIEVEMENT.name]
        );
        break;
      case "view_search_results":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.VIEW_SEARCH_RESULTS.name]
        );
        payload.params.items = getDestinationItemProperties(message, true);
        break;
      default:
        logger.info(`'${event}' is a custom GA4 event`);
        break;
    }
  } else {
    // custom events category
    // Event names are case sensitive
    if (isReservedWebCustomEventName(event)) {
      throw new CustomError(
        "[Google Analytics 4] track:: Reserved custom event names are not allowd",
        400
      );
    }

    if (isReservedWebCustomPrefixName(event)) {
      throw new CustomError(
        "[Google Analytics 4] track:: Reserved custom prefix names are not allowd",
        400
      );
    }

    payload.name = event;

    // all extra parameters passed is incorporated inside params
    let customParameters = {};
    customParameters = extractCustomFields(
      message,
      customParameters,
      ["properties"],
      GA4_RESERVED_PARAMETER_EXCLUSION
    );
    if (!isEmptyObject(customParameters)) {
      customParameters = flattenJson(customParameters);
      payload.params = {
        ...payload.params,
        ...customParameters
      };
    }
    removeReservedParameterPrefixNames(payload.params);
  }

  // take GA4 user properties
  let userProperties = {};
  userProperties = extractCustomFields(
    message,
    userProperties,
    ["user_properties"],
    GA4_RESERVED_USER_PROPERTY_EXCLUSION
  );
  if (!isEmptyObject(userProperties)) {
    userProperties = flattenJson(userProperties);
    rawPayload.user_properties = userProperties;
  }

  removeReservedUserPropertyPrefixNames(rawPayload.user_properties);

  rawPayload = { ...rawPayload, events: [payload] };

  // build response
  const response = defaultRequestConfig();
  response.method = defaultPostRequestConfig.requestMethod;
  response.endpoint = ENDPOINT;
  response.headers = {
    HOST: "www.google-analytics.com",
    "Content-Type": "application/json"
  };
  response.params = {
    api_secret: Config.apiSecret,
    measurement_id: Config.measurementId
  };
  response.body.JSON = rawPayload;
  return response;
};

const process = async event => {
  const { message, destination } = event;

  if (!destination.Config.apiSecret) {
    throw new CustomError("API Secret not found. Aborting ", 400);
  }
  if (!destination.Config.measurementId) {
    throw new CustomError("Measurement ID not found. Aborting", 400);
  }

  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }

  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.TRACK:
      response = await trackResponseBuilder(message, destination);
      break;
    default:
      throw new CustomError(`Message type ${messageType} not supported`, 400);
  }
  return response;
};

module.exports = { process };

const get = require("get-value");
const { EventType } = require("../../../constants");
const {
  CustomError,
  defaultPostRequestConfig,
  constructPayload,
  defaultRequestConfig,
  extractCustomFields,
  isEmptyObject,
  flattenJson,
  getDestinationExternalID,
  removeUndefinedAndNullValues,
  isDefinedAndNotNull
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
  getDestinationItemProperties,
  getExclusionList
} = require("./utils");

function trackResponseBuilder(message, { Config }) {
  let event = get(message, "event");
  if (!event) {
    throw new CustomError("Event name is required", 400);
  }

  // trim and replace spaces with "_"
  event = event.trim().replace(/\s+/g, "_");

  // reserved event names are not allowed
  if (isReservedEventName(event)) {
    throw new CustomError(
      "[Google Analytics 4] track:: Reserved event names are not allowed",
      400
    );
  }

  // get common top level rawPayload
  let rawPayload = constructPayload(message, trackCommonConfig);
  if (rawPayload.timestamp_micros) {
    rawPayload.timestamp_micros = msUnixTimestamp(rawPayload.timestamp_micros);
  }

  switch (Config.typesOfClient) {
    case "gtag":
      // gtag.js
      rawPayload.client_id =
        get(message, "context.client_id") || get(message, "messageId");
      if (!isDefinedAndNotNull(rawPayload.client_id)) {
        throw new CustomError(
          "context.client_id or messageId must be provided",
          400
        );
      }
      break;
    case "firebase":
      rawPayload.app_instance_id = getDestinationExternalID(
        message,
        "ga4AppInstanceId"
      );
      if (!isDefinedAndNotNull(rawPayload.app_instance_id)) {
        throw new CustomError(
          "ga4AppInstanceId must be provided under externalId",
          400
        );
      }
      break;
    default:
      throw CustomError("GA4: Invalid type of client", 400);
  }

  let payload = {};
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
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(mappingConfig[ConfigCategory.PRODUCTS_SEARCHED.name])
        );
        break;
      case "product_list_viewed":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.PRODUCT_LIST_VIEWED.name]
        );
        payload.params.items = getDestinationItemProperties(message, true);
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(
            mappingConfig[ConfigCategory.PRODUCT_LIST_VIEWED.name]
          )
        );
        break;
      /* Promotions Section */
      case "promotion_viewed":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.PROMOTION_VIEWED.name]
        );
        payload.params.items = getDestinationItemProperties(message, true);
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(mappingConfig[ConfigCategory.PROMOTION_VIEWED.name])
        );
        break;
      case "promotion_clicked":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.PROMOTION_CLICKED.name]
        );
        payload.params.items = getDestinationItemProperties(message, false);
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(mappingConfig[ConfigCategory.PROMOTION_CLICKED.name])
        );
        break;
      /* Ordering Section */
      case "product_clicked":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.PRODUCT_CLICKED.name]
        );
        payload.params.items = getDestinationItemProperties(message, true);
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(mappingConfig[ConfigCategory.PRODUCT_CLICKED.name])
        );
        break;
      case "product_viewed":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.PRODUCT_VIEWED.name]
        );
        payload.params.items = getDestinationItemProperties(message, true);
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(mappingConfig[ConfigCategory.PRODUCT_VIEWED.name])
        );
        break;
      case "product_added":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.PRODUCT_ADDED.name]
        );
        payload.params.items = getDestinationItemProperties(message, true);
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(mappingConfig[ConfigCategory.PRODUCT_ADDED.name])
        );
        break;
      case "product_removed":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.PRODUCT_REMOVED.name]
        );
        payload.params.items = getDestinationItemProperties(message, true);
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(mappingConfig[ConfigCategory.PRODUCT_REMOVED.name])
        );
        break;
      case "cart_viewed":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.CART_VIEWED.name]
        );
        payload.params.items = getDestinationItemProperties(message, true);
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(mappingConfig[ConfigCategory.CART_VIEWED.name])
        );
        break;
      case "checkout_started":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.CHECKOUT_STARTED.name]
        );
        payload.params.items = getDestinationItemProperties(message, true);
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(mappingConfig[ConfigCategory.CHECKOUT_STARTED.name])
        );
        break;
      case "payment_info_entered":
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.PAYMENT_INFO_ENTERED.name]
        );
        if (payload.params.shipping_tier) {
          payload.name = "add_shipping_info";
        } else {
          payload.name = "add_payment_info";
        }
        payload.params.items = getDestinationItemProperties(message, true);
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(
            mappingConfig[ConfigCategory.PAYMENT_INFO_ENTERED.name]
          )
        );
        break;
      case "order_completed":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.ORDER_COMPLETED.name]
        );
        payload.params.items = getDestinationItemProperties(message, true);
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(mappingConfig[ConfigCategory.ORDER_COMPLETED.name])
        );
        break;
      case "order_refunded":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.ORDER_REFUNDED.name]
        );
        payload.params.items = getDestinationItemProperties(message, false);
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(mappingConfig[ConfigCategory.ORDER_REFUNDED.name])
        );
        break;
      /* Wishlist Section */
      case "product_added_to_wishlist":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.PRODUCT_ADDED_TO_WISHLIST.name]
        );
        payload.params.items = getDestinationItemProperties(message, true);
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(
            mappingConfig[ConfigCategory.PRODUCT_ADDED_TO_WISHLIST.name]
          )
        );
        break;
      /* Sharing Section */
      case "product_shared":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.PRODUCT_SHARED.name]
        );
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(mappingConfig[ConfigCategory.PRODUCT_SHARED.name])
        );
        break;
      case "cart_shared":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.CART_SHARED.name]
        );
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(mappingConfig[ConfigCategory.CART_SHARED.name])
        );
        break;
      /* Group */
      case "group":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.GROUP.name]
        );
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(mappingConfig[ConfigCategory.GROUP.name])
        );
        break;
      /* GA4 Events */
      case "earn_virtual_currency":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.EARN_VIRTUAL_CURRENCY.name]
        );
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(
            mappingConfig[ConfigCategory.EARN_VIRTUAL_CURRENCY.name]
          )
        );
        break;
      case "generate_lead":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.GENERATE_LEAD.name]
        );
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(mappingConfig[ConfigCategory.GENERATE_LEAD.name])
        );
        break;
      case "level_up":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.LEVEL_UP.name]
        );
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(mappingConfig[ConfigCategory.LEVEL_UP.name])
        );
        break;
      case "login":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.LOGIN.name]
        );
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(mappingConfig[ConfigCategory.LOGIN.name])
        );
        break;
      case "post_score":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.POST_SCORE.name]
        );
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(mappingConfig[ConfigCategory.POST_SCORE.name])
        );
        break;
      case "select_content":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.SELECT_CONTENT.name]
        );
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(mappingConfig[ConfigCategory.SELECT_CONTENT.name])
        );
        break;
      case "sign_up":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.SIGN_UP.name]
        );
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(mappingConfig[ConfigCategory.SIGN_UP.name])
        );
        break;
      case "spend_virtual_currency":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.SPEND_VIRTUAL_CURRENCY.name]
        );
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(
            mappingConfig[ConfigCategory.SPEND_VIRTUAL_CURRENCY.name]
          )
        );
        break;
      case "tutorial_begin":
        payload.name = eventNameMapping[event.toLowerCase()];
        break;
      case "tutorial_complete":
        payload.name = eventNameMapping[event.toLowerCase()];
        break;
      case "unlock_achievement":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.UNLOCK_ACHIEVEMENT.name]
        );
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(
            mappingConfig[ConfigCategory.UNLOCK_ACHIEVEMENT.name]
          )
        );
        break;
      case "view_search_results":
        payload.name = eventNameMapping[event.toLowerCase()];
        payload.params = constructPayload(
          message,
          mappingConfig[ConfigCategory.VIEW_SEARCH_RESULTS.name]
        );
        payload.params.items = getDestinationItemProperties(message, false);
        payload.params = extractCustomFields(
          message,
          payload.params,
          ["properties"],
          getExclusionList(
            mappingConfig[ConfigCategory.VIEW_SEARCH_RESULTS.name]
          )
        );
        break;
      default:
        break;
    }
  } else {
    // custom events category
    // Event names are case sensitive
    if (isReservedWebCustomEventName(event)) {
      throw new CustomError(
        "[Google Analytics 4] track:: Reserved custom event names are not allowed",
        400
      );
    }

    if (isReservedWebCustomPrefixName(event)) {
      throw new CustomError(
        "[Google Analytics 4] track:: Reserved custom prefix names are not allowed",
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
  }

  removeReservedParameterPrefixNames(payload.params);

  if (payload.params) {
    payload.params = removeUndefinedAndNullValues(payload.params);
  }

  if (isEmptyObject(payload.params)) {
    delete payload.params;
  }

  // take GA4 user properties
  let userProperties = {};
  userProperties = extractCustomFields(
    message,
    userProperties,
    ["properties.user_properties"],
    GA4_RESERVED_USER_PROPERTY_EXCLUSION
  );
  if (!isEmptyObject(userProperties)) {
    userProperties = flattenJson(userProperties);
    rawPayload.user_properties = userProperties;
  }

  removeReservedUserPropertyPrefixNames(rawPayload.user_properties);

  payload = removeUndefinedAndNullValues(payload);
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
    api_secret: Config.apiSecret
  };

  // setting response params as per client type
  switch (Config.typesOfClient) {
    case "gtag":
      response.params.measurement_id = Config.measurementId;
      break;
    case "firebase":
      response.params.firebase_app_id = Config.firebaseAppId;
      break;
    default:
      break;
  }

  response.body.JSON = rawPayload;
  return response;
}

function process(event) {
  const { message, destination } = event;
  const { Config } = destination;

  if (!Config.typesOfClient) {
    throw new CustomError("Client type not found. Aborting ", 400);
  }
  if (!Config.apiSecret) {
    throw new CustomError("API Secret not found. Aborting ", 400);
  }
  if (Config.typesOfClient === "gtag" && !Config.measurementId) {
    throw new CustomError("measurementId must be provided. Aborting", 400);
  }
  if (Config.typesOfClient === "firebase" && !Config.firebaseAppId) {
    throw new CustomError("firebaseAppId must be provided. Aborting", 400);
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
      response = trackResponseBuilder(message, destination);
      break;
    case EventType.PAGE:
      // passing page_view custom event for page()
      message.event = "page_view";
      response = trackResponseBuilder(message, destination);
      break;
    default:
      throw new CustomError(`Message type ${messageType} not supported`, 400);
  }
  return response;
}

module.exports = { process };

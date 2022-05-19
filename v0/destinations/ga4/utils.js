const get = require("get-value");
const moment = require("moment");
const { proxyRequest } = require("../../../adapters/network");
const {
  getDynamicMeta,
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const {
  constructPayload,
  CustomError,
  flattenJson,
  isEmptyObject,
  extractCustomFields,
  isDefinedAndNotNull,
  isHttpStatusSuccess
} = require("../../util");
const { TRANSFORMER_METRIC } = require("../../util/constant");
const ErrorBuilder = require("../../util/error");
const { mappingConfig, ConfigCategory } = require("./config");

/**
 * converts to Unix timestamp (in microseconds)
 * @param {*} timestamp
 * @returns
 */
function msUnixTimestamp(timestamp) {
  const currentTime = moment.unix(moment().format("X"));
  const time = moment.unix(moment(timestamp).format("X"));

  const timeDifferenceInHours = Math.ceil(
    moment.duration(currentTime.diff(time)).asHours()
  );
  if (timeDifferenceInHours > 72) {
    throw new CustomError(
      "[GA4]:: Measurement protocol only supports timestamps [72h] into the past",
      400
    );
  }

  if (timeDifferenceInHours <= 0) {
    if (Math.ceil(moment.duration(time.diff(currentTime)).asMinutes()) > 15) {
      throw new CustomError(
        "[GA4]:: Measurement protocol only supports timestamps [15m] into the future",
        400
      );
    }
  }

  return time.toDate().getTime() * 1000 + time.toDate().getMilliseconds();
}

/**
 * Reserved event names cannot be used
 * Ref - https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=gtag#reserved_names
 * @param {*} event
 * @returns
 */
function isReservedEventName(event) {
  const reservedEventNames = [
    "ad_activeview",
    "ad_click",
    "ad_exposure",
    "ad_impression",
    "ad_query",
    "adunit_exposure",
    "app_clear_data",
    "app_install",
    "app_update",
    "app_remove",
    "error",
    "first_open",
    "first_visit",
    "in_app_purchase",
    "notification_dismiss",
    "notification_foreground",
    "notification_open",
    "notification_receive",
    "os_update",
    "screen_view",
    "session_start",
    "user_engagement"
  ];

  return reservedEventNames.includes(event.toLowerCase());
}

/* Event parameters */
/**
 * Reserved parameter names cannot be used
 * Here user_properties is a duplicate key hence excluding it.
 * Ref - https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=gtag#reserved_parameter_names
 */
const GA4_RESERVED_PARAMETER_EXCLUSION = [
  "firebase_conversion",
  "user_properties"
];

/**
 * event parameter names cannot start with reserved prefixes
 * Ref - https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=gtag#reserved_parameter_names
 * @param {*} parameter
 */
function removeReservedParameterPrefixNames(parameter) {
  const reservedPrefixesNames = ["google_", "ga_", "firebase_"];

  if (!parameter) {
    return;
  }

  Object.keys(parameter).forEach(key => {
    const valFound = reservedPrefixesNames.some(prefix => {
      if (key.toLowerCase().startsWith(prefix)) {
        return true;
      }
      return false;
    });

    // reject if found
    if (valFound) {
      // eslint-disable-next-line no-param-reassign
      delete parameter[key];
    }
  });
}

/* user property */
/**
 * Reserved user property cannot be used
 * Ref - https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=gtag#reserved_user_property_names
 */
const GA4_RESERVED_USER_PROPERTY_EXCLUSION = [
  "first_open_time",
  "first_visit_time",
  "last_deep_link_referrer",
  "user_id",
  "first_open_after_install"
];

/**
 * user property names cannot start with reserved prefixes
 * Ref - https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=gtag#reserved_user_property_names
 * @param {*} userProperties
 */
function removeReservedUserPropertyPrefixNames(userProperties) {
  const reservedPrefixesNames = ["google_", "ga_", "firebase_"];

  if (!userProperties) {
    return;
  }

  Object.keys(userProperties).forEach(key => {
    const valFound = reservedPrefixesNames.some(prefix => {
      if (key.toLowerCase().startsWith(prefix)) {
        return true;
      }
      return false;
    });

    // reject if found
    if (valFound) {
      // eslint-disable-next-line no-param-reassign
      delete userProperties[key];
    }
  });
}

/* For custom events */
/**
 * Reserved custom event names cannot be used (Web)
 * Ref - https://support.google.com/analytics/answer/10085872#zippy=%2Creserved-prefixes-and-event-names%2Cweb
 * @param {*} event
 * @returns
 */
function isReservedWebCustomEventName(event) {
  const reservedEventNames = [
    "app_remove",
    "app_store_refund",
    "app_store_subscription_cancel",
    "app_store_subscription_convert",
    "app_store_subscription_renew",
    "first_open",
    "first_visit",
    "in_app_purchase",
    "session_start",
    "user_engagement"
  ];

  return reservedEventNames.includes(event.toLowerCase());
}

/**
 * Reserved custom event name cannot start with reserved prefixes (Web)
 * Ref - https://support.google.com/analytics/answer/10085872#zippy=%2Creserved-prefixes-and-event-names%2Cweb
 * @param {*} event
 * @returns
 */
function isReservedWebCustomPrefixName(event) {
  const reservedPrefixesNames = ["_", "firebase_", "ga_", "google_", "gtag."];

  // As soon as a single true is returned, .some() will itself return true and stop
  return reservedPrefixesNames.some(prefix => {
    if (event.toLowerCase().startsWith(prefix)) {
      return true;
    }
    return false;
  });
}

const GA4_ITEM_EXCLUSION = [
  "item_id",
  "itemId",
  "product_id",

  "item_name",
  "itemName",
  "name",

  "coupon",

  "item_category",
  "itemCategory",
  "category",

  "item_brand",
  "itemBrand",
  "brand",

  "item_variant",
  "itemVariant",
  "variant",

  "price",
  "quantity",

  "index",
  "position"
];

/**
 * get items properties for a event.
 * @param {*} message
 * @returns
 */
function getDestinationItemProperties(message, isItemsRequired) {
  let items;
  const products = get(message, "properties.products");
  if ((!products && isItemsRequired) || (products && products.length === 0)) {
    throw new CustomError(
      `Products is an required field for '${message.event}' event`,
      400
    );
  }
  if (products && Array.isArray(products)) {
    items = [];
    products.forEach((item, index) => {
      let element = constructPayload(
        item,
        mappingConfig[ConfigCategory.ITEMS.name]
      );
      if (
        !isDefinedAndNotNull(element.item_id) &&
        !isDefinedAndNotNull(element.item_name)
      ) {
        throw new CustomError("One of product_id or name is required", 400);
      }

      let itemProperties = {};
      itemProperties = extractCustomFields(
        message,
        itemProperties,
        [`properties.products.${index}`],
        GA4_ITEM_EXCLUSION
      );
      if (!isEmptyObject(itemProperties)) {
        itemProperties = flattenJson(itemProperties);
        element = { ...element, ...itemProperties };
      }

      items.push(element);
    });
  } else if (products && !Array.isArray(products)) {
    throw new CustomError("Invalid type. Expected Array of products", 400);
  }
  return items;
}

/**
 * get exclusion list for a particular event
 * ga4ExclusionList contains the sourceKeys that are already mapped
 * @param {*} mappingJson
 * @returns
 */
function getExclusionList(mappingJson) {
  let ga4ExclusionList = [];

  mappingJson.forEach(element => {
    const mappingSourceKeys = element.sourceKeys;

    if (typeof mappingSourceKeys === "string") {
      ga4ExclusionList.push(mappingSourceKeys.split(".").pop());
    } else {
      mappingSourceKeys.forEach(item => {
        ga4ExclusionList.push(item.split(".").pop());
      });
    }
  });

  // We are mapping "products" to "items", so to remove redundancy we should not send products again
  ga4ExclusionList.push("products");
  ga4ExclusionList = ga4ExclusionList.concat(GA4_RESERVED_PARAMETER_EXCLUSION);

  return ga4ExclusionList;
}

const responseHandler = (destinationResponse, dest) => {
  const message = `[GA4 Response Handler] - Request Processed Successfully`;
  let { status } = destinationResponse;
  if (status === 204) {
    status = 200;
  }

  // if the responsee from destination is not a success case build an explicit error
  if (!isHttpStatusSuccess(status)) {
    throw new ErrorBuilder()
      .setStatus(status)
      .setMessage(
        `[GA4 Response Handler] Request failed for destination ${dest} with status: ${status}`
      )
      .isTransformResponseFailure(true)
      .setDestinationResponse(destinationResponse)
      .setStatTags({
        destination: dest,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.API.SCOPE,
        meta: getDynamicMeta(status)
      })
      .build();
  }

  return {
    status,
    message,
    destinationResponse
  };
};

const networkHandler = function() {
  this.responseHandler = responseHandler;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
};

module.exports = {
  networkHandler,
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
};

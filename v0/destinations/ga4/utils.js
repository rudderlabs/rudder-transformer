/**
 * converts to Unix timestamp (in microseconds)
 * @param {*} timestamp
 * @returns
 */
function msUnixTimestamp(timestamp) {
  const time = new Date(timestamp);
  return time.getTime() * 1000 + time.getMilliseconds();
}

/**
 * Reserved event names shouldn't be used
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
 * Reserved parameter names shouldn't be used
 * Ref - https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=gtag#reserved_parameter_names
 */
const GA4_RESERVED_PARAMETER_EXCLUSION = ["firebase_conversion"];

/**
 * event parameter names should not start with reserved prefixes
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
      if (key.startsWith(prefix)) {
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
 * Reserved user property names cannot be used
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
 * check if user property names does not start with reserved prefixes
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
      if (key.startsWith(prefix)) {
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
 * check if the custom event name is not one of the following reserved names (for Web)
 * Ref - https://support.google.com/analytics/answer/10085872#zippy=%2Creserved-prefixes-and-event-names%2Cweb
 * @param {*} event
 * @returns
 */
function isReservedCustomEventNameWeb(event) {
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
 * check if custom event name does not start with the reserved prefixes
 * Ref - https://support.google.com/analytics/answer/10085872#zippy=%2Creserved-prefixes-and-event-names%2Cweb
 * @param {*} event
 * @returns
 */
function isReservedCustomPrefixNameWeb(event) {
  const reservedPrefixesNames = ["_", "firebase_", "ga_", "google_", "gtag."];

  // As soon as a single true is returned, .some() will itself return true and stop
  return reservedPrefixesNames.some(prefix => {
    if (event.startsWith(prefix)) {
      return true;
    }
    return false;
  });
}

module.exports = {
  msUnixTimestamp,
  isReservedEventName,
  GA4_RESERVED_PARAMETER_EXCLUSION,
  removeReservedParameterPrefixNames,
  GA4_RESERVED_USER_PROPERTY_EXCLUSION,
  removeReservedUserPropertyPrefixNames,
  isReservedCustomEventNameWeb,
  isReservedCustomPrefixNameWeb
};

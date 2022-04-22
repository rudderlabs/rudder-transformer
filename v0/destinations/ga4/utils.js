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
 * Check if event name is not one of the following reserved names
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

/**
 * check if custom event name is not one of the following reserved names (for Web)
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

function isReservedCustomPrefixNameWeb(event) {
  const reservedPrefixesNames = ["_", "firebase_", "ga_", "google_", "gtag."];

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
  isReservedCustomEventNameWeb,
  isReservedCustomPrefixNameWeb
};

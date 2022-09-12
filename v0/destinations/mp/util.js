const set = require("set-value");
const get = require("get-value");
const {
  isDefined,
  constructPayload,
  CustomError,
  getFullName,
  extractCustomFields,
  isAppleFamily,
  getBrowserInfo,
  toUnixTimestamp
} = require("../../util");
const {
  ConfigCategory,
  MP_IDENTIFY_EXCLUSION_LIST,
  GEO_SOURCE_ALLOWED_VALUES,
  mappingConfig
} = require("./config");

const mPIdentifyConfigJson = mappingConfig[ConfigCategory.IDENTIFY.name];
const mPProfileAndroidConfigJson =
  mappingConfig[ConfigCategory.PROFILE_ANDROID.name];
const mPProfileIosConfigJson = mappingConfig[ConfigCategory.PROFILE_IOS.name];

/**
 * this function has been used to create
 * @param {*} message rudderstack identify payload
 * @param {*} mappingJson identifyConfig.json
 * @param {*} useNewMapping a variable to support backward compatibility
 * @returns
 */
const getTransformedJSON = (message, mappingJson, useNewMapping) => {
  let rawPayload = constructPayload(message, mappingJson);
  if (
    isDefined(rawPayload.$geo_source) &&
    !GEO_SOURCE_ALLOWED_VALUES.includes(rawPayload.$geo_source)
  ) {
    throw new CustomError(
      "$geo_source value must be either null or 'reverse_geocoding' ",
      400
    );
  }
  const userName = get(rawPayload, "$name");
  if (!userName) {
    set(rawPayload, "$name", getFullName(message));
  }

  rawPayload = extractCustomFields(
    message,
    rawPayload,
    ["traits", "context.traits"],
    MP_IDENTIFY_EXCLUSION_LIST
  );

  /*
    we are adding backward compatibility using useNewMapping key.
    TODO :: This portion need to be removed after we deciding to stop
    support for old mapping.
    */
  if (!useNewMapping) {
    if (rawPayload.$first_name) {
      rawPayload.$firstName = rawPayload.$first_name;
      delete rawPayload.$first_name;
    }
    if (rawPayload.$last_name) {
      rawPayload.$lastName = rawPayload.$last_name;
      delete rawPayload.$last_name;
    }
  }

  const device = get(message, "context.device");
  if (device && device.token) {
    let payload;
    if (isAppleFamily(device.type)) {
      payload = constructPayload(message, mPProfileIosConfigJson);
      rawPayload.$ios_devices = [device.token];
    } else if (device.type.toLowerCase() === "android") {
      payload = constructPayload(message, mPProfileAndroidConfigJson);
      rawPayload.$android_devices = [device.token];
    }
    rawPayload = { ...rawPayload, ...payload };
  }
  if (message.channel === "web" && message.context?.userAgent) {
    const browser = getBrowserInfo(message.context.userAgent);
    rawPayload.$browser = browser.name;
    rawPayload.$browser_version = browser.version;
  }

  return rawPayload;
};

/**
 * This function is used to generate identify response.
 * @param {*} message rudderstack identify payload
 * @param {*} type EventType (identify here)
 * @param {*} destination Config.destination
 * @param {*} responseBuilderSimple function to generate response
 * @returns
 */
const createIdentifyResponse = (
  message,
  type,
  destination,
  responseBuilderSimple
) => {
  // this variable is used for supporting backward compatibility
  const { useNewMapping } = destination.Config;
  // user payload created
  const properties = getTransformedJSON(
    message,
    mPIdentifyConfigJson,
    useNewMapping
  );

  const parameters = {
    $set: properties,
    $token: destination.Config.token,
    $distinct_id: message.userId || message.anonymousId,
    $ip: get(message, "context.ip") || message.request_ip,
    $time: toUnixTimestamp(message.timestamp)
  };
  if (message.context?.active === false) {
    parameters.$ignore_time = true;
  }
  // Creating the response to create user
  return responseBuilderSimple(parameters, message, type, destination.Config);
};

/**
 * This function is checking availability of service account credentials, and secret token.
 * https://developer.mixpanel.com/reference/authentication
 * @param {*} destination inputs from dashboard
 * @returns
 */
const isImportAuthCredentialsAvailable = destination => {
  return (
    destination.Config.apiSecret ||
    (destination.Config.serviceAccountSecret &&
      destination.Config.serviceAccountUserName &&
      destination.Config.projectId)
  );
};

module.exports = { createIdentifyResponse, isImportAuthCredentialsAvailable };

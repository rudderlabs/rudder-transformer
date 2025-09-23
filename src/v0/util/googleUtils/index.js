const GOOGLE_ALLOWED_CONSENT_STATUS = ['UNSPECIFIED', 'UNKNOWN', 'GRANTED', 'DENIED'];
const GA4_ALLOWED_CONSENT_STATUS = ['GRANTED', 'DENIED'];

const UNSPECIFIED_CONSENT = 'UNSPECIFIED';
const UNKNOWN_CONSENT = 'UNKNOWN';
const get = require('get-value');
const { PlatformError } = require('@rudderstack/integrations-lib');
const {
  AUTH_STATUS_INACTIVE,
  REFRESH_TOKEN,
} = require('../../../adapters/networkhandler/authConstants');
/**
 * Populates the consent object based on the provided configuration and consent mapping.
 *
 * @param {Object} config - The configuration object containing consent values.
 * @param {Object} consentConfigMap - The mapping of consent keys to consent types.
 * @returns {Object} - The consent object populated with consent values based on the configuration.
 * * ref : https://developers.google.com/google-ads/api/rest/reference/rest/v16/Consent
 */
const populateConsentFromConfig = (config, consentConfigMap) => {
  const consent = {};

  Object.keys(consentConfigMap).forEach((key) => {
    const consentType = consentConfigMap[key];
    if (config?.[key]) {
      if (GOOGLE_ALLOWED_CONSENT_STATUS.includes(config[key])) {
        consent[consentType] = config[key];
      } else {
        consent[consentType] = UNKNOWN_CONSENT;
      }
    } else {
      consent[consentType] = UNSPECIFIED_CONSENT;
    }
  });

  return consent;
};

/**
 * Generates the final consent object based on the provided consent configuration map, event-level consent, and destination configuration.
 *
 * @param {Object} consentConfigMap - The map of consent configuration keys and their corresponding consent types.
 * @param {Object} [eventLevelConsent={}] - The event-level consent object.
 * @param {Object} [destConfig={}] - The destination configuration object.
 * @returns {Object} The final consent object.
 *  ref :
 * 1) For click conversion :
 *  a) https://developers.google.com/google-ads/api/rest/reference/rest/v16/customers/uploadClickConversions#ClickConversion
 *  b) https://developers.google.com/google-ads/api/reference/rpc/v16/ClickConversion#consent
 * 2) For Call conversion :
 *  a) https://developers.google.com/google-ads/api/rest/reference/rest/v16/customers/uploadCallConversions#CallConversion
 *  b) https://developers.google.com/google-ads/api/reference/rpc/v16/CallConversion#consent
 * 3) For Store sales conversion :
 *  a) https://developers.google.com/google-ads/api/reference/rpc/v16/UserData
 *  b) https://developers.google.com/google-ads/api/reference/rpc/v16/UserData#consent
 */
const finaliseConsent = (consentConfigMap, eventLevelConsent = {}, destConfig = {}) => {
  // Initialize defaultConsentBlock with unspecified consent for all keys defined in consentConfigMap
  const defaultConsentBlock = Object.keys(consentConfigMap).reduce((acc, key) => {
    const consentType = consentConfigMap[key];
    acc[consentType] = UNSPECIFIED_CONSENT;
    return acc;
  }, {});

  // If destConfig is provided, update defaultConsentBlock based on it using populateConsentFromConfig
  if (Object.keys(destConfig).length > 0) {
    const populatedConsent = populateConsentFromConfig(destConfig, consentConfigMap);
    Object.assign(defaultConsentBlock, populatedConsent);
  }

  const consentObj = {};

  // Iterate through each key in consentConfigMap to determine the final consent
  Object.keys(consentConfigMap).forEach((configKey) => {
    const consentKey = consentConfigMap[configKey]; // e.g., 'adUserData'

    // Prioritize event-level consent if available
    if (eventLevelConsent && eventLevelConsent.hasOwnProperty(consentKey)) {
      consentObj[consentKey] = GOOGLE_ALLOWED_CONSENT_STATUS.includes(eventLevelConsent[consentKey])
        ? eventLevelConsent[consentKey]
        : UNKNOWN_CONSENT;
    } else {
      // Fallback to default consent block
      consentObj[consentKey] = defaultConsentBlock[consentKey];
    }
  });

  return consentObj;
};

/**
 * Populates the consent object based on the provided configuration and consent mapping.
 * @param {*} consentConfigMap
 * @param {*} eventLevelConsent
 * @returns
 */
const finaliseAnalyticsConsents = (consentConfigMap, eventLevelConsent = {}) => {
  const consentObj = {};
  // Iterate through each key in consentConfigMap to set the consent
  Object.keys(consentConfigMap).forEach((configKey) => {
    const consentKey = consentConfigMap[configKey]; // e.g., 'ad_user_data'

    // Set consent only if valid
    if (
      eventLevelConsent &&
      eventLevelConsent.hasOwnProperty(consentKey) &&
      GA4_ALLOWED_CONSENT_STATUS.includes(eventLevelConsent[consentKey])
    ) {
      consentObj[consentKey] = eventLevelConsent[consentKey];
    }
  });

  return consentObj;
};

const getAuthErrCategory = ({ response, status }) => {
  if (status === 401) {
    let respArr = response;
    if (!Array.isArray(response)) {
      respArr = [response];
    }
    const authenticationError = respArr.map((resp) =>
      get(resp, 'error.details.0.errors.0.errorCode.authenticationError'),
    );
    if (
      // https://developers.google.com/google-ads/api/docs/oauth/2sv
      authenticationError.includes('TWO_STEP_VERIFICATION_NOT_ENROLLED') ||
      // https://developers.google.com/google-ads/api/docs/common-errors#:~:text=this%20for%20you.-,CUSTOMER_NOT_FOUND,-Summary
      authenticationError.includes('CUSTOMER_NOT_FOUND')
    ) {
      return AUTH_STATUS_INACTIVE;
    }
    return REFRESH_TOKEN;
  }
  if (status === 403) {
    // ACCESS_DENIED
    return AUTH_STATUS_INACTIVE;
  }
  return '';
};

/**
 * Gets the Google Ads Developer Token from environment variables.
 * Throws a ConfigurationError if the token is not set.
 *
 * @returns {string} The Google Ads Developer Token
 * @throws {ConfigurationError} If GOOGLE_ADS_DEVELOPER_TOKEN is not set
 */
const getDeveloperToken = () => {
  const { GOOGLE_ADS_DEVELOPER_TOKEN } = process.env;
  if (GOOGLE_ADS_DEVELOPER_TOKEN) {
    return GOOGLE_ADS_DEVELOPER_TOKEN;
  }
  throw new PlatformError('GOOGLE_ADS_DEVELOPER_TOKEN is not set, please reach out to support');
};

module.exports = {
  populateConsentFromConfig,
  UNSPECIFIED_CONSENT,
  UNKNOWN_CONSENT,
  GOOGLE_ALLOWED_CONSENT_STATUS,
  finaliseConsent,
  finaliseAnalyticsConsents,
  getAuthErrCategory,
  getDeveloperToken,
};

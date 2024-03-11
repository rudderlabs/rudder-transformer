const GOOGLE_ALLOWED_CONSENT_STATUS = ['UNSPECIFIED', 'UNKNOWN', 'GRANTED', 'DENIED'];

const UNSPECIFIED_CONSENT = 'UNSPECIFIED';
const UNKNOWN_CONSENT = 'UNKNOWN';

/**
 * Populates the consent object based on the provided properties.
 *
 * @param {object} properties - message.properties containing properties related to consent.
 * @returns {object} - An object containing consent information.
 * ref : https://developers.google.com/google-ads/api/rest/reference/rest/v16/Consent
 */

const populateConsentFromConfig = (config) => {
  const consent = {};

  if (config?.userDataConsent) {
    if (GOOGLE_ALLOWED_CONSENT_STATUS.includes(config.userDataConsent)) {
      consent.adUserData = config.userDataConsent;
    } else {
      consent.adUserData = UNKNOWN_CONSENT;
    }
  } else {
    consent.adUserData = UNSPECIFIED_CONSENT;
  }

  if (config?.personalizationConsent) {
    if (GOOGLE_ALLOWED_CONSENT_STATUS.includes(config.personalizationConsent)) {
      consent.adPersonalization = config.personalizationConsent;
    } else {
      consent.adPersonalization = UNKNOWN_CONSENT;
    }
  } else {
    consent.adPersonalization = UNSPECIFIED_CONSENT;
  }
  return consent;
};

/**
 * Populates the consent object based on the provided properties.
 *
 * @param {object} properties - message.properties containing properties related to consent.
 * @returns {object} - An object containing consent information.
 *  * ref :
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

const finaliseConsent = (eventLevelConsent, destConfig, destinationAllowedConsentKeys) => {
  const consents = eventLevelConsent || {};

  const defaultConsentBlock = populateConsentFromConfig(destConfig);

  // Define a function to process consent based on type
  const processConsent = (consentType) => {
    if (!consents[consentType]) {
      return defaultConsentBlock[consentType] || UNSPECIFIED_CONSENT;
    }
    if (GOOGLE_ALLOWED_CONSENT_STATUS.includes(consents[consentType])) {
      return consents[consentType];
    }
    return defaultConsentBlock[consentType] || UNKNOWN_CONSENT;
  };

  // Construct consentObj based on the common consent fields
  const consentObj = destinationAllowedConsentKeys.reduce((obj, consentType) => {
    // eslint-disable-next-line no-param-reassign
    obj[consentType] = processConsent(consentType);
    return obj;
  }, {});

  return consentObj;
};

module.exports = {
  populateConsentFromConfig,
  UNSPECIFIED_CONSENT,
  UNKNOWN_CONSENT,
  GOOGLE_ALLOWED_CONSENT_STATUS,
  finaliseConsent,
};

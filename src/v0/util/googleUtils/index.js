const GOOGLE_ALLOWED_CONSENT_STATUS = ['UNSPECIFIED', 'UNKNOWN', 'GRANTED', 'DENIED'];

/**
 * Populates the consent object based on the provided properties.
 *
 * @param {object} properties - message.properties containing properties related to consent.
 * @returns {object} - An object containing consent information.
 * ref : https://developers.google.com/google-ads/api/rest/reference/rest/v15/Consent
 */

const populateConsentForGoogleDestinations = (config) => {
  const consent = {};

  if (config?.userDataConsent) {
    if (GOOGLE_ALLOWED_CONSENT_STATUS.includes(config.userDataConsent)) {
      consent.adUserData = config.userDataConsent;
    } else {
      consent.adUserData = 'UNKNOWN';
    }
  } else {
    consent.adUserData = 'UNSPECIFIED';
  }

  if (config?.personalizationConsent) {
    if (GOOGLE_ALLOWED_CONSENT_STATUS.includes(config.personalizationConsent)) {
      consent.adPersonalization = config.personalizationConsent;
    } else {
      consent.adPersonalization = 'UNKNOWN';
    }
  } else {
    consent.adPersonalization = 'UNSPECIFIED';
  }
  return consent;
};

module.exports = { populateConsentForGoogleDestinations };

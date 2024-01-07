const GOOGLE_ALLOWED_CONSENT_STATUS = ['UNSPECIFIED', 'UNKNOWN', 'GRANTED', 'DENIED'];

/**
 * Populates the consent object based on the provided properties.
 *
 * @param {object} properties - message.properties containing properties related to consent.
 * @returns {object} - An object containing consent information.
 * ref : https://developers.google.com/google-ads/api/rest/reference/rest/v15/Consent
 */

const populateConsentForGoogleDestinations = (properties) => {
  const consent = {};

  if (
    properties?.userDataConsent &&
    GOOGLE_ALLOWED_CONSENT_STATUS.includes(properties.userDataConsent)
  ) {
    consent.adUserData = properties.userDataConsent;
  }

  if (
    properties?.personalizationConsent &&
    GOOGLE_ALLOWED_CONSENT_STATUS.includes(properties.personalizationConsent)
  ) {
    consent.adPersonalization = properties.personalizationConsent;
  }
  return consent;
};

module.exports = { populateConsentForGoogleDestinations };

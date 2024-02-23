const get = require('get-value');
const { getIntegrationsObj } = require('..');

const GOOGLE_ALLOWED_CONSENT_STATUS = ['UNSPECIFIED', 'UNKNOWN', 'GRANTED', 'DENIED'];
const { MappedToDestinationKey } = require('../../../constants');

/**
 * Populates the consent object based on the provided properties.
 *
 * @param {object} properties - message.properties containing properties related to consent.
 * @returns {object} - An object containing consent information.
 * ref : https://developers.google.com/google-ads/api/rest/reference/rest/v15/Consent
 */

const populateConsentForGoogleDestinations = (message, conversionName) => {
  const mappedToDestination = get(message, MappedToDestinationKey);
  if (mappedToDestination) return {};
  // Define mappings for different conversion types
  const mappings = {
    store: {
      ad_user_data: 'ad_user_data',
      ad_personalization: 'ad_personalization',
    },
    click: {
      adUserData: 'adUserData',
      adPersonalization: 'adPersonalization',
    },
    call: {
      adUserData: 'adUserData',
      adPersonalization: 'adPersonalization',
    },
  };

  const currentMapping = mappings[conversionName];
  if (!currentMapping) return {};

  const integrationObj = getIntegrationsObj(message, 'GOOGLE_ADWORDS_OFFLINE_CONVERSIONS') || {};
  const consents = integrationObj.consents || {};

  // Define a function to process consent based on type and key
  const processConsent = (consentType) => {
    if (!consents[consentType]) return 'UNSPECIFIED';
    if (consents[consentType] && GOOGLE_ALLOWED_CONSENT_STATUS.includes(consents[consentType])) {
      return consents[consentType];
    }
    if (consents[consentType] && !GOOGLE_ALLOWED_CONSENT_STATUS.includes(consents[consentType])) {
      return 'UNKNOWN';
    }
    return null;
  };

  // Construct consentObj based on the current mapping
  const consentObj = Object.keys(currentMapping).reduce((obj, consentType) => {
    const key = currentMapping[consentType];
    // Process each consent type and assign it to the key specified in the mapping
    // eslint-disable-next-line no-param-reassign
    obj[key] = processConsent(consentType);
    return obj;
  }, {});

  return consentObj;
};

module.exports = { populateConsentForGoogleDestinations, GOOGLE_ALLOWED_CONSENT_STATUS };

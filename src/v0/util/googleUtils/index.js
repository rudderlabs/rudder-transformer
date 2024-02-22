const get = require('get-value');
const { getIntegrationsObj } = require("..");

const GOOGLE_ALLOWED_CONSENT_STATUS = ['UNSPECIFIED', 'UNKNOWN', 'GRANTED', 'DENIED'];
const { MappedToDestinationKey } = require('../../../constants');

/**
 * Populates the consent object based on the provided properties.
 *
 * @param {object} properties - message.properties containing properties related to consent.
 * @returns {object} - An object containing consent information.
 * ref : https://developers.google.com/google-ads/api/rest/reference/rest/v15/Consent
 */

// const populateConsentForGoogleDestinations = (message, destName) => {
//   let consentObj = {};

//   const integrationObj = getIntegrationsObj(message, destName) || {};

//   if(destName === 'google_adwords_offline_conversion') {
//     const tempConsentObject = {
//       ad_user_data: 'UNSPECIFIED',
//       ad_personalization: 'UNSPECIFIED',
//     };
//     if (
//       integrationObj?.consents?.ad_user_data &&
//       GOOGLE_ALLOWED_CONSENT_STATUS.includes(integrationObj?.consents?.ad_user_data)
//     ) {
//       tempConsentObject.ad_user_data = integrationObj?.consents?.ad_user_data;
//     }
  
//     if (
//       integrationObj?.consents?.ad_personalization &&
//       GOOGLE_ALLOWED_CONSENT_STATUS.includes(integrationObj?.consents?.ad_personalization)
//     ) {
//       tempConsentObject.ad_personalization =integrationObj?.consents?.ad_personalization;
//     }
//     consentObj = {...tempConsentObject};
//   }

//   if(destName === 'google_adwords_remarketing_lists') {
//     const tempConsentObject = {
//       ad_user_data: 'UNSPECIFIED',
//       ad_personalization: 'UNSPECIFIED',
//     };
//     if (
//       integrationObj?.consents?.adUserData &&
//       GOOGLE_ALLOWED_CONSENT_STATUS.includes(integrationObj?.consents?.adUserData)
//     ) {
//       tempConsentObject.adUserData = integrationObj?.consents?.adUserData;
//     }
  
//     if (
//       integrationObj?.consents?.adPersonalization &&
//       GOOGLE_ALLOWED_CONSENT_STATUS.includes(integrationObj?.consents?.adPersonalization)
//     ) {
//       tempConsentObject.adPersonalization =integrationObj?.consents?.adPersonalization;
//     }
//     consentObj = {...tempConsentObject};
//   }



//   return consentObj;
// };

const populateConsentForGoogleDestinations = (message, destName) => {

  const mappedToDestination = get(message, MappedToDestinationKey);
  // TODO : need to add proper handling based on different destinations 
  if(mappedToDestination) return {};
  // Define mappings for different destination names
  const mappings = {
    'GOOGLE_ADWORDS_OFFLINE_CONVERSIONS': {
      ad_user_data: 'ad_user_data',
      ad_personalization: 'ad_personalization',
    },
    'GOOGLE_ADWORDS_REMARKETING_LISTS': {
      adUserData: 'adUserData',
      adPersonalization: 'adPersonalization',
    },
  };

  const currentMapping = mappings[destName];
  if (!currentMapping) return {};

  const integrationObj = getIntegrationsObj(message, destName) || {};
  const consents = integrationObj.consents || {};

  // Define a function to process consent based on type and key
  const processConsent = (consentType) => {
    if (consents[consentType] && GOOGLE_ALLOWED_CONSENT_STATUS.includes(consents[consentType])) {
      return consents[consentType];
    }
    return 'UNSPECIFIED';
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


module.exports = { populateConsentForGoogleDestinations };

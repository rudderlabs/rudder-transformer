const lodash = require('lodash');
const { GOOGLE_ALLOWED_CONSENT_STATUS } = require('../../util/googleUtils');

// Helper to validate and transform consent values
const validateAndTransformConsent = (consentValue) => {
  if (consentValue === undefined) {
    return 'UNSPECIFIED';
  }
  if (!GOOGLE_ALLOWED_CONSENT_STATUS.includes(consentValue)) {
    return 'UNKNOWN';
  }
  return consentValue;
};

/**
 * Groups user data based on their consent level and reformats the structure to nest consent-related fields under a consent object.
 * This function processes an input object containing user details and their consent preferences, segregating them into groups based on their consent fields (`adUserData` and `adPersonalization`). Each user detail is then transformed to nest these consent fields under a new `consent` key, maintaining the rest of the user's information intact.
 *
 * @param {Object} input - The input object containing user details along with their consent preferences. It is expected to have a structure with `properties.listData` containing `add` and `remove` arrays of user details.
 * Each user detail object must contain `adUserData` and `adPersonalization` fields among other user information fields.
 *
 * @returns {Array} An array of objects where each object represents a group of user details based on their consent levels. Each group is categorized under an `add` or `remove` action.
 *
 * Example Input:
 * {
 *   properties: {
 *     listData: {
 *       add: [
 *         { email: "user1@example.com", adUserData: "UNSPECIFIED", adPersonalization: "GRANTED" },
 *         { email: "user2@example.com", adUserData: "DENIED", adPersonalization: "DENIED" }
 *       ],
 *       remove: [
 *         { email: "user3@example.com", adUserData: "UNSPECIFIED", adPersonalization: "GRANTED" }
 *       ]
 *     }
 *   }
 * }
 *
 * Example Output:
 * [
 *   {
 *     consent: { adUserData: "UNSPECIFIED", adPersonalization: "GRANTED" },
 *     add: [
 *       {
 *         email: "user1@example.com"
 *       }
 *     ]
 *   },
 *   {
 *     consent: { adUserData: "DENIED", adPersonalization: "DENIED" },
 *     add: [
 *       {
 *         email: "user2@example.com"
 *       }
 *     ]
 *   },
 *   {
 *     consent: { adUserData: "UNSPECIFIED", adPersonalization: "GRANTED" }
 *     remove: [
 *       {
 *         email: "user3@example.com"
 *       }
 *     ]
 *   }
 * ]
 *
 */
function groupUserDataBasedOnConsentLevel(input) {
  // Helper to omit and group user details by consent, filling 'UNSPECIFIED' for undefined values
  const transformAndGroupByConsent = (action, details) =>
    lodash
      .chain(details)
      .map((detail) => ({
        ...detail,
        // Validate 'adUserData' and 'adPersonalization', or use 'UNSPECIFIED' for undefined values
        adUserData: validateAndTransformConsent(detail.adUserData_consent),
        adPersonalization: validateAndTransformConsent(detail.adPersonalization_consent),
      }))
      .groupBy((detail) => `${detail.adUserData}-${detail.adPersonalization}`)
      .map((group, key) => {
        const consentParts = key.split('-');
        // Adjust the action key based on the original action (add or remove)
        //           const actionKey = action === 'add' ? 'create' : action;
        return {
          consent: { adUserData: consentParts[0], adPersonalization: consentParts[1] },
          [action]: group.map((detail) =>
            lodash.omit(detail, [
              'adUserData_consent',
              'adPersonalization_consent',
              'adPersonalization',
              'adUserData',
            ]),
          ),
        };
      })
      .value();

  const result = [];

  // Process both 'add' and 'remove' actions
  lodash.forEach(['add', 'remove'], (action) => {
    const processedGroups = transformAndGroupByConsent(action, input.properties.listData[action]);
    result.push(...processedGroups);
  });

  return result;
}

module.exports = {
  groupUserDataBasedOnConsentLevel,
};

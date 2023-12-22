/* eslint-disable no-nested-ternary */
const { getFieldValueFromMessage } = require('../../util');

/**
 * get the name value from following heirarchy
 * traits.name
 * traits.firstName+traits.lastName (or either)
 * traits.username
 * traits.email
 * properties.email
 * userId
 * anonymousId
 * @param {*} message
 * @returns uname
 */
const getName = (message) => {
  const traits = getFieldValueFromMessage(message, 'traits');
  const uName =
    traits?.name ||
    (traits?.firstName
      ? traits?.lastName
        ? `${traits?.firstName}${traits?.lastName}`
        : traits?.firstName
      : undefined) ||
    traits?.username ||
    (message?.properties ? message?.properties.email : undefined) ||
    traits?.email ||
    (message.userId ? `User ${message.userId}` : undefined) ||
    `Anonymous user ${message.anonymousId}`;

  return uName;
};

/**
 * To get whitelisted traits from config
 * @param {*} destination
 * @param {*} traitsList map the whitelisted traits to this list
 */
const getWhiteListedTraits = (destination) => {
  const traitsList = [];
  if (destination?.Config?.whitelistedTraitsSettings) {
    destination.Config.whitelistedTraitsSettings.forEach((whiteListTrait) => {
      if (whiteListTrait.trait) {
        const tmpWhitelistTrait = whiteListTrait.trait.trim();
        if (tmpWhitelistTrait.trim().length > 0) {
          traitsList.push(tmpWhitelistTrait);
        }
      }
    });
  }
  return traitsList;
};

/**
 * Stringifying json for traits
 * Not using JSON.stringify() since we forst want to check for whiteListedTraits
 * @param {*} json input json to be stringified
 * @param {*} whiteListedTraits
 * @returns Stringified Json
 */
const stringifyJSON = (json, whiteListedTraits) => {
  let output = '';
  Object.keys(json).forEach((key) => {
    if (whiteListedTraits && whiteListedTraits.length > 0) {
      if (whiteListedTraits.includes(key)) {
        output += `${key}: ${json[key]} `;
      }
    } else {
      output += `${key}: ${json[key]} `;
    }
  });
  return output;
};

/* build default identify template
 * if whitelisted traits are present build on it
 * else build the entire traits object
 */
const buildDefaultTraitTemplate = (traitsList, traits, template) => {
  let generatedStringFromTemplate = template;
  // build template with whitelisted traits
  traitsList.forEach((trait) => {
    generatedStringFromTemplate += `${trait}: {{${trait}}} `;
  });
  // else with all traits
  if (traitsList.length === 0) {
    Object.keys(traits).forEach((traitKey) => {
      generatedStringFromTemplate += `${traitKey}: {{${traitKey}}} `;
    });
  }
  return generatedStringFromTemplate;
};

module.exports = {
  stringifyJSON,
  getName,
  getWhiteListedTraits,
  buildDefaultTraitTemplate,
};

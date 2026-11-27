/* eslint-disable no-nested-ternary */
const Handlebars = require('handlebars');
const { InstrumentationError } = require('@rudderstack/integrations-lib');
const { getFieldValueFromMessage } = require('../../util');

const formatValue = (value) => {
  if (value === null || typeof value !== 'object') {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch (error) {
    throw new InstrumentationError('Unable to serialize object-valued trait or property');
  }
};

// Preserve JSON quotes in message text, but escape characters that can form markup.
const escapeTemplateValue = (value) => Handlebars.escapeExpression(value).replace(/&quot;/g, '"');

Handlebars.registerHelper('formatTraitValue', (value) => {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  return new Handlebars.SafeString(escapeTemplateValue(formatValue(value)));
});

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
 * Formats selected traits and properties as key/value text.
 * Filters keys before serializing object values.
 * @param {*} json input json to be stringified
 * @param {*} whiteListedTraits
 * @param {boolean} escapeForTemplate escape markup for safe insertion into a Slack template
 * @returns Stringified Json
 */
const stringifyJSON = (json, whiteListedTraits, escapeForTemplate = false) => {
  let output = '';
  Object.keys(json).forEach((key) => {
    if (whiteListedTraits?.length > 0 && !whiteListedTraits.includes(key)) {
      return;
    }
    const text = formatValue(json[key]);
    output += `${key}: ${escapeForTemplate ? escapeTemplateValue(text) : text} `;
  });
  return output;
};

/* build default identify template
 * if whitelisted traits are present build on it
 * else build the entire traits object
 */
const buildDefaultTraitTemplate = (traitsList, traits, template) => {
  let generatedStringFromTemplate = template;
  const keys = traitsList.length > 0 ? traitsList : traits ? Object.keys(traits) : [];
  keys.forEach((trait) => {
    generatedStringFromTemplate += `${trait}: {{formatTraitValue (lookup this "${trait}")}} `;
  });
  return generatedStringFromTemplate;
};

module.exports = {
  stringifyJSON,
  getName,
  getWhiteListedTraits,
  buildDefaultTraitTemplate,
};

const { get } = require('lodash');
const {
  getFieldValueFromMessage,
  getHashFromArray,
  constructPayload,
  flattenMultilevelPayload,
} = require('../../util');
const { identifySourceKeys, fileConfigCategories, mappingConfig } = require('./config');
const { InstrumentationError } = require('../../util/errorTypes');

/**
 * Returns the remaining keys from traits
 * @param {*} traits
 * @param {*} sourceKeys
 * @returns
 */
const getIdentifyTraits = (message) => {
  const traits = getFieldValueFromMessage(message, 'traits');
  const contextTraits = get(message, 'context.traits');
  return { ...traits, ...contextTraits };
};

/**
 * Returns the remaining keys from traits
 * Remaining keys : keys which is not included in webapp configuration mapping and not included in source-dest keys file
 * @param {*} traits
 * @param {*} sourceKeys
 * @returns
 */
const getRemainingAttributes = (traits, sourceKeys) => {
  const properties = {};
  const keys = Object.keys(traits);
  keys.forEach((key) => {
    if (!sourceKeys.includes(key)) {
      properties[key] = traits[key];
    }
  });
  return properties;
};

/**
 * Returns the customAttributes (user, company and event custom attributes) + remaining attributes
 * Remaining attributes : keys which is not included in webapp configuration mapping and not included in source-dest keys file
 * @param {*} attributesMap
 * @param {*} properties
 * @param {*} excludeKeys
 * @returns
 */
const getAttributes = (attributesMap, properties, excludeKeys) => {
  const sourceKeys = excludeKeys;
  const data = {};
  const attributesMapKeys = Object.keys(attributesMap);

  attributesMapKeys.forEach((key) => {
    if (properties[key]) {
      const destinationAttributeName = attributesMap[key];
      data[destinationAttributeName] = properties[key];
      sourceKeys.push(key);
    }
  });

  const remainingAttributes = getRemainingAttributes(properties, sourceKeys);
  return { ...data, ...remainingAttributes };
};

const buildLeadPayload = (message, traits, Config) => {
  if (!traits) {
    throw new InstrumentationError('Traits not Provided');
  }
  const configPayload = constructPayload(
    message,
    mappingConfig[fileConfigCategories.IDENTIFY.name],
  );
  const { persistIqAttributesMapping } = Config;
  const persistIqAttributesMap = getHashFromArray(persistIqAttributesMapping, 'from', 'to', false);
  const customPersistIqAttributes = flattenMultilevelPayload(
    getAttributes(persistIqAttributesMap, traits, identifySourceKeys),
  );
  return { ...configPayload, ...customPersistIqAttributes };
};
module.exports = { getIdentifyTraits, buildLeadPayload };

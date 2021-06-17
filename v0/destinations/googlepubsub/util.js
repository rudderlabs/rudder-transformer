/* eslint-disable prettier/prettier */
const {
  getHashFromArray,
  getValueFromMessage,
  isDefinedAndNotNull,
  isDefinedAndNotNullAndNotEmpty
} = require("../../util");

const SOURCE_KEYS = ["properties", "traits", "context.traits"];

/**
 * Returns Topic ID
 * @param {*} event
 * @returns
 */
const getTopic = event => {
  const { message } = event;
  const { eventToTopicMap } = event.destination.Config;
  const hashMap = getHashFromArray(eventToTopicMap, "from", "to");

  return (
    (message.event ? hashMap[message.event.toLowerCase()] : null) ||
    hashMap[message.type.toLowerCase()] ||
    hashMap["*"]
  );
};

/**
 * Creates Attribute metadata object
 * @param {*} message
 * @param {*} attributesMap
 * @returns
 */
const createAttributesMetadata = (message, { Config }) => {
  /**
   * Converts Config map to usable format
   * @param {*} eventToAttributesMap
   * @returns
   */
  function generateAttributesMap(eventToAttributesMap) {
    if (!eventToAttributesMap || eventToAttributesMap.length === 0) {
      return null;
    }

    const attributesMap = {};
    eventToAttributesMap.forEach(item => {
      const key = item.from.toLowerCase();
      if (isDefinedAndNotNullAndNotEmpty(key)) {
        if (isDefinedAndNotNullAndNotEmpty(attributesMap[key])) {
          attributesMap[key].push(item.to);
        } else {
          attributesMap[key] = [item.to];
        }
      }
    });
    return attributesMap;
  }

  // Returns value for Attribute key if present, else returns null
  function getAttributeValueOrNull(key) {
    // Check first if present in message Root
    const requiredVal = getValueFromMessage(message, key);
    if (isDefinedAndNotNull(requiredVal)) {
      return requiredVal;
    }

    let val;
    let found = false;
    SOURCE_KEYS.some(sourceKey => {
      const nestedObj = getValueFromMessage(message, sourceKey);
      if (nestedObj) {
        val = nestedObj[key] || getValueFromMessage(nestedObj, key);
        if (isDefinedAndNotNull(val)) {
          found = true;
          return true;
        }
      }
      return false;
    });

    if (found) {
      return typeof val === "string" ? val : JSON.stringify(val);
    }
    return null;
  }

  // intialize empty attributes metadata
  const attrMetadata = {};

  const attributesMap = generateAttributesMap(Config.eventToAttributesMap);
  if (!attributesMap || Object.keys(attributesMap).length === 0) {
    return attrMetadata;
  }

  const attributeKeys =
    (message.event ? attributesMap[message.event.toLowerCase()] : null) ||
    attributesMap[message.type.toLowerCase()] ||
    attributesMap["*"];

  if (!attributeKeys || attributeKeys.length === 0) {
    return attrMetadata;
  }

  attributeKeys.forEach(key => {
    const val = getAttributeValueOrNull(key);
    if (isDefinedAndNotNull(val)) {
      const splitKeysArray = key.split(".")
      const refinedKey = splitKeysArray[splitKeysArray.length - 1]
      attrMetadata[refinedKey] = val;
    }
  });
  return attrMetadata;
};

module.exports = {
  getTopic,
  createAttributesMetadata
};

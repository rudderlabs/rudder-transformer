/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable array-callback-return */
/* eslint-disable unicorn/no-for-loop */
/* eslint-disable no-restricted-syntax */
const get = require('get-value');
const { isDefinedAndNotNull, getValueFromMessage } = require('../../util');
const { InstrumentationError, ConfigurationError } = require('../../util/errorTypes');

const SOURCE_KEYS = ['properties', 'traits', 'context.traits', 'context'];

/**
 *
 * @param {*} obj
 * @param {*} path
 * @returns value of the property present in absolute path of the object
 */
function getValueByPath(obj, path) {
  const propertyPath = path.split('.');
  for (let i = 0; i < propertyPath.length; i++) {
    // recurse into the message object as per the path provided
    if (!obj || typeof obj !== 'object') return undefined;
    obj = obj[propertyPath[i]];
  }
  return obj;
}

/**
 *
 * @param {*} message
 * @param {*} sourceKey
 * @param {*} mappingKey
 *
 * here we iterate through free flowing objects inside our events
 * and check for the property value. Property with Whitespace between them
 * is also supported
 */
const getMappingFieldValueFormMessage = (message, sourceKey, mappingKey) => {
  let value;
  const tempStore = getValueFromMessage(message, sourceKey);
  if (tempStore) {
    value = tempStore[mappingKey] || get(tempStore, mappingKey);
  }
  return value;
};

const stringifyValue = (val) => {
  if (val === null) {
    return String(val);
  }
  return val;
};

const stringifyValueAndJoinWithDelimitter = (valArr, delimitter = ';') =>
  valArr.map(stringifyValue).join(delimitter);

function handleContextData(payload, destination, message) {
  const { contextDataPrefix, contextDataMapping } = destination;
  const cDataPrefix = contextDataPrefix ? `${contextDataPrefix}` : '';
  const contextData = {};
  Object.keys(contextDataMapping).forEach((key) => {
    const val =
      get(message, key) ||
      get(message, `properties.${key}`) ||
      get(message, `traits.${key}`) ||
      get(message, `context.traits.${key}`);
    if (isDefinedAndNotNull(val)) {
      contextData[`${cDataPrefix}${contextDataMapping[key]}`] = val;
    }
  });
  if (Object.keys(contextData).length > 0) {
    // non-empty object
    payload.contextData = contextData;
  }
  return payload;
}

function rudderPropToDestMap(destVarMapping, message, payload, destVarStrPrefix) {
  const mappedVar = {};
  // pass the Rudder Property mapped in the ui whose evar you want to map
  Object.keys(destVarMapping).forEach((key) => {
    let val = get(message, `properties.${key}`);
    if (isDefinedAndNotNull(val)) {
      const destVarKey = destVarStrPrefix + destVarMapping[key];
      mappedVar[destVarKey] = val;
    } else {
      SOURCE_KEYS.some((sourceKey) => {
        val = getMappingFieldValueFormMessage(message, sourceKey, key);
        if (isDefinedAndNotNull(val)) {
          mappedVar[`${destVarStrPrefix}${[destVarMapping[key]]}`] = val;
        } else {
          val = getValueByPath(message, key);
          if (isDefinedAndNotNull(val)) {
            mappedVar[`${destVarStrPrefix}${[destVarMapping[key]]}`] = val;
          }
        }
      });
    }
  });
  if (Object.keys(mappedVar).length > 0) {
    // non-empty object
    Object.assign(payload, mappedVar);
  }
  return payload;
}

// eVar reference: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/evar.html?lang=en

function handleEvar(payload, destination, message) {
  // pass the Rudder Property mapped in the ui whose evar you want to map
  const { eVarMapping } = destination;
  return rudderPropToDestMap(eVarMapping, message, payload, 'eVar');
}

// hier reference: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/hier.html?lang=en

function handleHier(payload, destination, message) {
  // pass the Rudder Property mapped in the ui whose hier you want to map
  const { hierMapping } = destination;
  return rudderPropToDestMap(hierMapping, message, payload, 'hier');
}

// list reference: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/list.html?lang=en

function handleList(payload, destination, message, properties) {
  const { listMapping, listDelimiter } = destination;
  const list = {};
  Object.keys(properties).forEach((key) => {
    if (listMapping[key] && listDelimiter[key]) {
      let val = get(message, `properties.${key}`);
      if (typeof val !== 'string' && !Array.isArray(val)) {
        throw new ConfigurationError(
          'List Mapping properties variable is neither a string nor an array',
        );
      }
      if (typeof val === 'string') {
        val = val.replace(/\s*,+\s*/g, listDelimiter[key]);
      } else {
        val = val.join(listDelimiter[key]);
      }
      list[`list${listMapping[key]}`] = val.toString();
    }
  });

  // add to the payload
  if (Object.keys(list).length > 0) {
    Object.assign(payload, list);
  }
  return payload;
}

// prop reference: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/prop.html?lang=en

function handleCustomProperties(payload, destination, message, properties) {
  const { customPropsMapping, propsDelimiter } = destination;
  const props = {};
  if (properties) {
    Object.keys(properties).forEach((key) => {
      if (customPropsMapping[key]) {
        let val = get(message, `properties.${key}`);
        if (typeof val !== 'string' && !Array.isArray(val) && typeof val !== 'number') {
          throw new InstrumentationError('prop variable is neither a string, number or an array');
        }
        const delimeter = propsDelimiter[key] || '|';
        if (typeof val === 'string') {
          val = val.replace(/\s*,+\s*/g, delimeter);
        } else {
          val = val.join(delimeter);
        }

        props[`prop${customPropsMapping[key]}`] = val.toString();
      }
    });
  }
  // add to the payload
  if (Object.keys(props).length > 0) {
    Object.assign(payload, props);
  }
  return payload;
}

module.exports = {
  handleContextData,
  handleEvar,
  handleHier,
  handleList,
  handleCustomProperties,
  stringifyValueAndJoinWithDelimitter,
};

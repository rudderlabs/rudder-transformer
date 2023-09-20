/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable array-callback-return */
/* eslint-disable unicorn/no-for-loop */
/* eslint-disable no-restricted-syntax */
const get = require('get-value');
const { isDefinedAndNotNull, getValueFromMessage } = require('../../util');
const { InstrumentationError } = require('../../util/errorTypes');

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

const stringifyValueAndJoinWithDelimiter = (valArr, delimiter = ';') =>
  valArr.map(stringifyValue).join(delimiter);

function handleContextData(payload, destinationConfig, message) {
  const { contextDataPrefix, contextDataMapping } = destinationConfig;
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

/**
 * This function is used for populating the eVars and hVars in the payload
 * @param {*} destVarMapping
 * @param {*} message
 * @param {*} payload
 * @param {*} destVarStrPrefix
 * @returns updated paylaod with eVars and hVars added
 */
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

function handleEvar(payload, destinationConfig, message) {
  // pass the Rudder Property mapped in the ui whose evar you want to map
  const { eVarMapping } = destinationConfig;
  return rudderPropToDestMap(eVarMapping, message, payload, 'eVar');
}

// hier reference: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/hier.html?lang=en

function handleHier(payload, destinationConfig, message) {
  // pass the Rudder Property mapped in the ui whose hier you want to map
  const { hierMapping } = destinationConfig;
  return rudderPropToDestMap(hierMapping, message, payload, 'hier');
}

/**
 * This function is used for populating the lVars and props in the payload
 * @param {*} mapping
 * @param {*} delimMapping
 * @param {*} message
 * @param {*} prefix
 * @returns updated payload with list variables and/or prop variables added.
 */
function rudderPropToDestMapWithDelimitter(mapping, delimMapping, message, prefix) {
  const propMap = {};
  const { properties } = message;
  Object.keys(properties).forEach((key) => {
    if (mapping[key] && delimMapping[key]) {
      let val = get(message, `properties.${key}`);
      if (typeof val !== 'string' && !Array.isArray(val)) {
        throw new InstrumentationError(
          `${prefix} mapping properties variable is neither a string nor an array`,
        );
      }
      
      if (typeof val === 'string') {
        /* following regex is used to find the one or more commas separated/padded by white spaces. 
        Example: val = 'r15,faze90R' , 'r1v, bvp, pol'
        */
        val = val.replace(/\s*,+\s*/g, delimMapping[key]); 
        // Above regex is good as for every comma with whitespace padding the no. of steps will increase by 4.  
      } else {
        val = val.join(delimMapping[key]);
      }
      propMap[`${prefix}${[mapping[key]]}`] = val.toString();
    }
  });
  return propMap;
}

// list reference: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/list.html?lang=en

function handleList(payload, destinationConfig, message) {
  const { listMapping, listDelimiter } = destinationConfig;
  const listMap = rudderPropToDestMapWithDelimitter(listMapping, listDelimiter, message, 'list');
  // add to the payload
  if (Object.keys(listMap).length > 0) {
    Object.assign(payload, listMap);
  }
  return payload;
}

// prop reference: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/prop.html?lang=en

function handleCustomProperties(payload, destinationConfig, message) {
  const { customPropsMapping, propsDelimiter } = destinationConfig;
  const propMap = rudderPropToDestMapWithDelimitter(
    customPropsMapping,
    propsDelimiter,
    message,
    'prop',
  );

  // add to the payload
  if (Object.keys(propMap).length > 0) {
    Object.assign(payload, propMap);
  }
  return payload;
}

module.exports = {
  handleContextData,
  handleEvar,
  handleHier,
  handleList,
  handleCustomProperties,
  stringifyValueAndJoinWithDelimiter,
};

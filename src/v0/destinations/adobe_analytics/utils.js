const get = require('get-value');
const { isDefinedAndNotNull } = require('../../util');
const { InstrumentationError, ConfigurationError } = require('../../util/errorTypes');

function handleContextData(payload, destination, message) {
  const { contextDataPrefix, contextDataMapping } = destination;
  const cDataPrefix = contextDataPrefix ? `${contextDataPrefix}` : '';
  const contextData = {};
  Object.keys(contextDataMapping).forEach(key => {
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

function handleEvar(payload, destination, message) {
  const { eVarMapping } = destination;
  const eVar = {};
  // pass the Rudder Property mapped in the ui whose evar you want to map
  Object.keys(eVarMapping).forEach(key => {
    const val = get(message, `properties.${key}`);
    if (isDefinedAndNotNull(val)) {
      eVar[`eVar${eVarMapping[key]}`] = val;
    }
  });
  if (Object.keys(eVar).length > 0) {
    // non-empty object
    Object.assign(payload, eVar);
  }
  return payload;
}

function handleHier(payload, destination, message) {
  // pass the Rudder Property mapped in the ui whose hier you want to map
  const { hierMapping } = destination;
  const hier = {};
  Object.keys(hierMapping).forEach(key => {
    const val = get(message, `properties.${key}`);
    if (isDefinedAndNotNull(val)) {
      hier[`hier${hierMapping[key]}`] = val;
    }
  });
  if (Object.keys(hier).length > 0) {
    // non-empty object
    Object.assign(payload, hier);
  }
  return payload;
}

function handleList(payload, destination, message, properties) {
  const { listMapping, listDelimiter, trackPageName } = destination;
  const list = {};
  if (properties) {
    Object.keys(properties).forEach(key => {
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
  }
  // add to the payload
  if (Object.keys(list).length > 0) {
    Object.assign(payload, list);
  }
  return payload;
}

function handleCustomProperties(payload, destination, message, properties) {
  const { customPropsMapping, propsDelimiter } = destination;
  const props = {};
  if (properties) {
    Object.keys(properties).forEach(key => {
      if (customPropsMapping[key]) {
        let val = get(message, `properties.${key}`);
        if (typeof val !== 'string' && !Array.isArray(val)) {
          throw new InstrumentationError('prop variable is neither a string nor an array');
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
};

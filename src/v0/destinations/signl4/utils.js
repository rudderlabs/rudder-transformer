const { constructPayload } = require('../../util');
const { mappingConfig, ConfigCategory } = require('./config');

/**
 * This object is defined to map the fields being taken from UI with proper keys
 */
const propertyMappingObj = {
  s4Service: 'X-S4-Service',
  s4Location: 'X-S4-Location',
  s4AlertingScenario: 'X-S4-AlertingScenario',
  s4ExternalID: 'X-S4-ExternalID',
  s4Status: 'X-S4-Status',
};

/**
 * This function is being used to populate payload. And it returns that prepared payload to be sent to the destination.
 * @param {*} message
 * @param {*} Config
 * @returns
 */
const populatePayload = (message, Config) => {
  const { properties, event } = message;
  const { s4Filter, eventToTitleMapping } = Config;

  let payload = constructPayload(message, mappingConfig[ConfigCategory.TRACK.name]);

  // populating all key value pairs of properties into the payload to be returned
  payload = { ...payload, ...properties };

  // Overriding event name with Customizable Title if avaiblable
  if (eventToTitleMapping) {
    eventToTitleMapping.forEach((mapping) => {
      if (mapping.from === event) {
        payload.Title = mapping.to;
      }
    });
  }

  // Populating the payload with the fields(properties) taken from UI
  Object.keys(propertyMappingObj).forEach((element) => {
    // If the key is provided from web-app for this field mappping it with it's value
    const index = `${element}Property`;
    if (properties[Config[index]]) {
      delete payload[`${Config[index]}`]; // deleting the key to avoid duplication as property is already populated in payload
      payload[propertyMappingObj[element]] = properties[Config[index]];
    } else {
      payload[propertyMappingObj[element]] = Config[`${element}Value`]; // if the key is not provided mapping it with the default value
    }
  });
  if (s4Filter) {
    payload['X-S4-Filtering'] = s4Filter;
  }
  return payload;
};

module.exports = { populatePayload };

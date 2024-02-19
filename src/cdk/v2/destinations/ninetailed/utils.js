const { mappingConfig, ConfigCategories } = require('./config');
const { constructPayload } = require('../../../../v0/util');

/**
 * This fucntion constructs payloads based upon mappingConfig for all calls
 * We build context as it has some specific payloads with default values so just breaking them down
 * @param {*} message
 * @returns
 */
const constructFullPayload = (message) => {
  const context = constructPayload(message, mappingConfig[ConfigCategories.CONTEXT.name]);
  const payload = constructPayload(message, mappingConfig[ConfigCategories.GENERAL.name]);
  payload.context = context;
  return payload;
};

module.exports = { constructFullPayload };

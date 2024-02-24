const { mappingConfig, ConfigCategories, batchEndpoint } = require('./config');
const { constructPayload } = require('../../../../v0/util');

/**
 * This fucntion constructs payloads based upon mappingConfig for all calls
 * We build context as it has some specific payloads with default values so just breaking them down
 * @param {*} message
 * @returns
 */
const constructFullPayload = (message) => {
  const context = constructPayload(message, mappingConfig[ConfigCategories.CONTEXT.name]);
  let payload = constructPayload(message, mappingConfig[ConfigCategories.GENERAL.name]);
  let typeSpecifcPayload;
  switch (message.type) {
    case 'track':
      typeSpecifcPayload = constructPayload(message, mappingConfig[ConfigCategories.TRACK.name]);
      break;
    case 'identify':
      typeSpecifcPayload = constructPayload(message, mappingConfig[ConfigCategories.IDENTIFY.name]);
      break;
    case 'page':
      typeSpecifcPayload = constructPayload(message, mappingConfig[ConfigCategories.PAGE.name]);
      break;
    default:
      break;
  }
  payload.context = context ;
  return { ...payload, ...typeSpecifcPayload }; // merge base and type-specific payloads;
};

const getEndpoint = (Config) => {
  const { organisationId, environment } = Config;
  return batchEndpoint
    .replace('{{organisationId}}', organisationId)
    .replace('{{environment}}', environment);
};

module.exports = { constructFullPayload, getEndpoint };

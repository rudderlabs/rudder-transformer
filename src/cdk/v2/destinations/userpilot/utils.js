const { DEFAULT_BASE_URL, MAPPINGS } = require('./config');

const getEndpoints = (config) => {
  const baseUrl = config.apiEndpoint || DEFAULT_BASE_URL;
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  return {
    IDENTIFY: `${normalizedBaseUrl}/identify`,
    TRACK: `${normalizedBaseUrl}/track`,
    GROUP: `${normalizedBaseUrl}/companies/identify`,
  };
};

const transformTraits = (traits) =>
  Object.keys(traits).reduce((acc, key) => {
    acc[MAPPINGS[key] || key] = traits[key];
    return acc;
  }, {});

module.exports = {
  transformTraits,
  getEndpoints,
};

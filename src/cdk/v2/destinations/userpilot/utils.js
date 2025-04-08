const { DEFAULT_BASE_URL, MAPPINGS } = require('./config');

const getEndpoints = ({ apiEndpoint = DEFAULT_BASE_URL }) => {
  const base = apiEndpoint.replace(/\/+$/, ''); // Removes trailing slashes

  return {
    IDENTIFY: `${base}/v1/identify`,
    TRACK: `${base}/v1/track`,
    GROUP: `${base}/v1/companies/identify`,
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

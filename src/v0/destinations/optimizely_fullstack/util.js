const { ConfigurationError } = require('../../util/errorTypes');

const validateConfig = (destination) => {
  if (!destination.Config.sdkKey) {
    throw new ConfigurationError('SDK key is required');
  }

  if (!destination.Config.baseUrl) {
    throw new ConfigurationError('Base url is required');
  }
};

module.exports = { validateConfig };

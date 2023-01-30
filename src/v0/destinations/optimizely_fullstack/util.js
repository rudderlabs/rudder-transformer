const { ConfigurationError } = require('../../util/errorTypes');

const validateConfig = (destination) => {
  if (!destination.Config.sdkKey) {
    throw new ConfigurationError('SDK key is required');
  }

  if (!destination.Config.baseUrl) {
    throw new ConfigurationError('Base url is required');
  }
};

const validateEvent = (message, destination) => {
  const { userId, anonymousId } = message;
  const { trackKnownUsers } = destination.Config;

  if (trackKnownUsers && !userId) {
    throw new ConfigurationError(
      'RudderStack will only track users associated with a userId when the trackKnownUsers setting is enabled',
    );
  }

  if (!trackKnownUsers && !anonymousId) {
    throw new ConfigurationError(
      'AnonymousId is required when trackKnownUsers setting is disabled',
    );
  }
};

module.exports = { validateConfig, validateEvent };

const { getMappingConfig } = require('../../util');

const BASE_URL = 'https://ads-api.twitter.com/12/measurement/conversions';

const ConfigCategories = {
  TRACK: {
    type: 'track',
    name: 'TwitterAdsTrackConfig',
  },
};

const mappingConfig = getMappingConfig(ConfigCategories, __dirname);

const authHeaderConstant = "OAuth oauth_consumer_key=\"qwe\", oauth_nonce=\"V1kMh028kZLLhfeYozuL0B45Pcx6LvuW\", oauth_signature=\"Di4cuoGv4PnCMMEeqfWTcqhvdwc%3D\", oauth_signature_method=\"HMAC-SHA1\", oauth_timestamp=\"1685603652\", oauth_token=\"yrdghfvhjvhj\", oauth_version=\"1.0\"";

module.exports = {
  mappingConfig,
  ConfigCategories,
  BASE_URL,
  authHeaderConstant
};

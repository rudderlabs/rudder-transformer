const {
  getMappingConfig
} = require("../../util");

const ConfigCategory = {
  TRACK: {
    name: "AppcuesTrackConfig"
  },
  PROFILE: {
    name: "AppcuesPageProfile"
  }
};

function getEndpoint(accountId, userId) {
  return `https://api.appcues.com/v1/accounts/${accountId}/users/${userId}/activity`;
}

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  ConfigCategory,
  mappingConfig,
  getEndpoint,
};
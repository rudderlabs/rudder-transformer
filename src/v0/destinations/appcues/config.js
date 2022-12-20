const { getMappingConfig } = require("../../util");

const ConfigCategory = {
  IDENTIFY: {
    name: "AppcuesIdentifyConfig"
  },
  TRACK: {
    name: "AppcuesTrackConfig"
  },
  PAGETRACK: {
    name: "AppcuesPageTrack"
  },
  PAGEPROFILE: {
    name: "AppcuesPageProfile"
  },
  DEFAULT: {
    name: "AppcuesDefaultConfig"
  }
};

function getEndpoint(accountId, userId) {
  return `https://api.appcues.com/v1/accounts/${accountId}/users/${userId}/activity`;
}

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  ConfigCategory,
  mappingConfig,
  getEndpoint
};

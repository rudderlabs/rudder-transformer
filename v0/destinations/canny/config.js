const { getMappingConfig } = require("../../util");

const BASE_URL = "https://canny.io/api/v1/";

const ConfigCategory = {
  IDENTIFY: {
    name: "identifyConfig",
    endpoint: "users/create_or_update"
  },
  CREATE_POST: {
    name: "createPostConfig",
    endpoint: "posts/create"
  },
  CREATE_VOTE: {
    name: "createVoteConfig",
    endpoint: "votes/create"
  }
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  BASE_URL,
  ConfigCategory,
  mappingConfig
};

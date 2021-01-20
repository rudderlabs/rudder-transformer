const { getMappingConfig } = require("../../util");

const ConfigCategory = {
  IDENTIFY: {
    name: "MPIdentifyConfig"
  },
  PROFILE_ANDROID: {
    name: "MPProfilePropertiesAndroid"
  },
  PROFILE_IOS: {
    name: "MPProfilePropertiesIOS"
  },
  EVENT_PROPERTIES: {
    name: "MPEventPropertiesConfig"
  }
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

module.exports = {
  ConfigCategory,
  mappingConfig
};

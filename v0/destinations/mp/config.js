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

const MP_IDENTIFY_EXCLUSION_LIST = [
  "createdAt",
  "email",
  "firstName",
  "firstname",
  "first_name",
  "lastName",
  "lastname",
  "last_name",
  "name",
  "username",
  "userName",
  "phone",
  "avatar",
  "address",
  "country",
  "city",
  "state",
  "unsubscribed"
];

const GEO_SOURCE_ALLOWED_VALUES = [null, "reverse_geocoding"];

module.exports = {
  ConfigCategory,
  mappingConfig,
  MP_IDENTIFY_EXCLUSION_LIST,
  GEO_SOURCE_ALLOWED_VALUES
};

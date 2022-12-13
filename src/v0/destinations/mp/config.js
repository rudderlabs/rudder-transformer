const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://api.mixpanel.com";
const BASE_ENDPOINT_EU = "https://api-eu.mixpanel.com";

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
const MAX_BATCH_SIZE = 1000;

module.exports = {
  mappingConfig,
  BASE_ENDPOINT,
  MAX_BATCH_SIZE,
  ConfigCategory,
  BASE_ENDPOINT_EU,
  GEO_SOURCE_ALLOWED_VALUES,
  MP_IDENTIFY_EXCLUSION_LIST
};

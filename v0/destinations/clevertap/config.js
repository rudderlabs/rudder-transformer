const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://api.clevertap.com/1/upload";
const IN_ENDPOINT = "https://in1.api.clevertap.com/1/upload";
const US_ENDPOINT = "https://us1.api.clevertap.com/1/upload";
const SK_ENDPOINT = "https://sk1.api.clevertap.com/1/upload";
const SG_ENDPOINT = "https://sg1.api.clevertap.com/1/upload";

const getEndpoint = destination => {
  switch (destination.Config.region) {
    case "in1":
      return IN_ENDPOINT;
    case "sg1":
      return SG_ENDPOINT;
    case "us1":
      return US_ENDPOINT;
    case "sk1":
      return SK_ENDPOINT;
    default:
      return BASE_ENDPOINT;
  }
};

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: "CleverTapIdentify", type: "identify" },
  PAGE: { name: "CleverTapPage", type: "page" },
  SCREEN: { name: "CleverTapScreen", type: "screen" },
  TRACK: { name: "CleverTapTrack", type: "track" },
  ECOM: { name: "CleverTapEcom" }
};

// These are clevertap specific properties we are already mapping
// using our mapping json.
const CLEVERTAP_DEFAULT_EXCLUSION = [
  "email",
  "firstName",
  "firstname",
  "first_name",
  "lastName",
  "lastname",
  "last_name",
  "name",
  "phone",
  "gender",
  "education",
  "employed",
  "birthday",
  "married",
  "customerType",
  "anonymousId",
  "avatar",
  "userId",
  "id"
];

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  getEndpoint,
  CLEVERTAP_DEFAULT_EXCLUSION,
  CONFIG_CATEGORIES,
  MAPPING_CONFIG
};

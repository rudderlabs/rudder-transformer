const { getMappingConfig } = require("../../util");

const getEndpoint = destination => {
  const { region } = destination.Config;
  if (region && region !== "none") {
    return `https://${region}.api.clevertap.com/1/upload`;
  }

  return "https://api.clevertap.com/1/upload";
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

const { getMappingConfig } = require("../../util");

const BASE_URL_US = "https://go.urbanairship.com";
const BASE_URL_EU = "https://go.airship.eu";

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: "airshipIdentifyConfig",
    type: "identify"
  },
  TRACK: {
    name: "airshipTrackConfig",
    type: "track"
  },
  GROUP: {
    name: "airshipGroupConfig",
    type: "group"
  }
};

const AIRSHIP_TRACK_EXCLUSION = [
  "interaction_id",
  "interactionId",
  "interaction_type",
  "interactionType",
  "value",
  "session_id",
  "sessionId",
  "transaction"
];

const RESERVED_TRAITS_MAPPING = {
  "address.city": "city",
  "address.country": "country",
  "address.postalcode": "zipcode",
  "address.state": "region",
  createdAt: "account_creation",
  firstName: "first_name",
  lastName: "last_name",
  name: "full_name",
  phone: "mobile_phone"
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  CONFIG_CATEGORIES,
  identifyMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name],
  trackMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name],
  groupMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.GROUP.name],
  MAPPING_CONFIG,
  BASE_URL_EU,
  BASE_URL_US,
  RESERVED_TRAITS_MAPPING,
  AIRSHIP_TRACK_EXCLUSION
};

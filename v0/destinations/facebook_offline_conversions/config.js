const { getMappingConfig } = require("../../util");

const ENDPOINT = "https://graph.facebook.com/v15.0/OFFLINE_EVENT_SET_ID/events";

const CONFIG_CATEGORIES = {
  OFFLINE_EVENTS: {
    type: "track",
    name: "FbOfflineConversionsTrackConfig"
  }
};

const destKeys = [
  "email",
  "phone",
  "gen",
  "ln",
  "fn",
  "fi",
  "dobm",
  "doby",
  "dobd",
  "ct",
  "st",
  "zip",
  "country",
  "madid",
  "extern_id",
  "lead_id"
];

const destKeyType = {
  email: "array",
  phone: "array",
  st: "array",
  zip: "array",
  gen: "string",
  ln: "string",
  fn: "string",
  fi: "string",
  dobm: "string",
  doby: "string",
  dobd: "string",
  ct: "string",
  madid: "string",
  country: "string",
  extern_id: "string",
  lead_id: "string"
};

const TRACK_EXCLUSION_FIELDS = [
  "currency",
  "total",
  "price",
  "value",
  "revenue",
  "products",
  "order_id",
  "item_number",
  "email",
  "upload_tag"
];

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  ENDPOINT,
  destKeys,
  destKeyType,
  TRACK_EXCLUSION_FIELDS
};

const { getMappingConfig } = require("../../util");

const ENDPOINT = "https://api.sendgrid.com/v3/mail/send";
const CONFIG_CATEGORIES = {
  TRACK: { type: "track", name: "SendgridTrack" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
module.exports = {
  ENDPOINT,
  trackMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name]
};

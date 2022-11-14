const { getMappingConfig } = require("../../util");

const ENDPOINT = "https://api.sendgrid.com/v3/mail/send";
const MIN_POOL_LENGTH = 2;
const MAX_POOL_LENGTH = 64;

const CONFIG_CATEGORIES = {
  TRACK: {
    name: "SendgridTrack",
    type: "track",
    endpoint: "https://api.sendgrid.com/v3/mail/send"
  },
  IDENTIFY: {
    name: "SendgridIdentify",
    type: "identify",
    endpoint: "https://api.sendgrid.com/v3/marketing/contacts"
  }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const TRACK_EXCLUSION_FIELDS = [
  "personalizations",
  "from",
  "replyTo",
  "replyToList",
  "subject",
  "content",
  "attachments",
  "templateId",
  "headers",
  "categories",
  "sendAt",
  "batchId",
  "asm",
  "IPPoolName",
  "mailSettings",
  "trackingSettings"
];

const MAX_BATCH_SIZE = 30000;

module.exports = {
  ENDPOINT,
  TRACK_EXCLUSION_FIELDS,
  MAX_POOL_LENGTH,
  MIN_POOL_LENGTH,
  MAX_BATCH_SIZE,
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  DESTINATION: "SENDGRID",
  trackMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name]
};

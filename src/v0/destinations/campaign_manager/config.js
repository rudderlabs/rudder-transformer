const { getMappingConfig } = require("../../util");

const BASE_URL =
  "https://dfareporting.googleapis.com/dfareporting/v4/userprofiles";

const ConfigCategories = {
  TRACK: {
    type: "track",
    name: "CampaignManagerTrackConfig"
  }
};

const EncryptionEntityType = [
  "ENCRYPTION_ENTITY_TYPE_UNKNOWN",
  "DCM_ACCOUNT",
  "DCM_ADVERTISER",
  "DBM_PARTNER",
  "DBM_ADVERTISER",
  "ADWORDS_CUSTOMER",
  "DFP_NETWORK_CODE"
];

const EncryptionSource = [
  "ENCRYPTION_SCOPE_UNKNOWN",
  "AD_SERVING",
  "DATA_TRANSFER"
];

const mappingConfig = getMappingConfig(ConfigCategories, __dirname);
module.exports = {
  mappingConfig,
  ConfigCategories,
  BASE_URL,
  EncryptionEntityType,
  EncryptionSource
};

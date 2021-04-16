const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://api.pipedrive.com/v1";
const PERSONS_ENDPOINT = `${BASE_ENDPOINT}/persons`;
const ORGANISATION_ENDPOINT = `${BASE_ENDPOINT}/organisations`;
const getMergeEndpoint = id => `${BASE_ENDPOINT}/persons/${id}/merge`;

// ALIAS: { name: "PipedriveAlias", type: "alias" },
// GROUP: { name: "PipedriveGroup", type: "group" }
const CONFIG_CATEGORIES = {
  IDENTIFY: { name: "PipedriveIdentify", type: "identify" },
  GROUP: { name: "PipedriveGroup", type: "group" },
  ALIAS: { name: "PipedriveAlias", type: "alias" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const PIPEDRIVE_IDENTIFY_EXCLUSION = [
  "name",
  "owner_id",
  "visible_to",
  "add_time",
  "org_id",
  "email",
  "phone"
];

const PIPEDRIVE_GROUP_EXCLUSION = PIPEDRIVE_IDENTIFY_EXCLUSION.slice(0, 4);

module.exports = {
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  BASE_ENDPOINT,
  getMergeEndpoint,
  PERSONS_ENDPOINT,
  ORGANISATION_ENDPOINT,
  PIPEDRIVE_IDENTIFY_EXCLUSION,
  PIPEDRIVE_GROUP_EXCLUSION
};

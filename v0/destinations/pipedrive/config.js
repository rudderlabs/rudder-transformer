const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://api.pipedrive.com/v1";
const PERSONS_ENDPOINT = `${BASE_ENDPOINT}/persons`;
const ORGANISATION_ENDPOINT = `${BASE_ENDPOINT}/organizations`;
const LEADS_ENDPOINT = `${BASE_ENDPOINT}/leads`;
const getMergeEndpoint = id => `${BASE_ENDPOINT}/persons/${id}/merge`;

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: "PipedriveIdentify", type: "identify" },
  GROUP: { name: "PipedriveGroup", type: "group" },
  TRACK: { name: "PipedriveTrack", type: "track" },
  USER_DATA: { name: "PipedriveUserData" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const PIPEDRIVE_IDENTIFY_EXCLUSION = [
  "name",
  "owner_id",
  "visible_to",
  "add_time",
  "org_id",
  "email",
  "phone",
  "userId"
];

const PIPEDRIVE_GROUP_EXCLUSION = [
  "name",
  "owner_id",
  "visible_to",
  "add_time"
];

const PIPEDRIVE_TRACK_EXCLUSION = [
  "title",
  "value",
  "amount",
  "price",
  "currency",
  "organization_id",
  "expected_close_date",
  "label_ids",
  "owner_id"
];

module.exports = {
  getMergeEndpoint,
  groupDataMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.GROUP.name],
  trackDataMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name],
  userDataMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.USER_DATA.name],
  identifyDataMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name],
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  BASE_ENDPOINT,
  PERSONS_ENDPOINT,
  ORGANISATION_ENDPOINT,
  PIPEDRIVE_IDENTIFY_EXCLUSION,
  PIPEDRIVE_GROUP_EXCLUSION,
  PIPEDRIVE_TRACK_EXCLUSION,
  LEADS_ENDPOINT
};

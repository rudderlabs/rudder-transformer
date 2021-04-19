const { getMappingConfig } = require("../../util");

const BASE_ENDPOINT = "https://api.pipedrive.com/v1";
const PERSONS_ENDPOINT = `${BASE_ENDPOINT}/persons`;
const ORGANISATION_ENDPOINT = `${BASE_ENDPOINT}/organizations`;
const LEADS_ENDPOINT = `${BASE_ENDPOINT}/leads`;
const PRODUCTS_ENDPOINT = `${BASE_ENDPOINT}/products`;
const getMergeEndpoint = id => `${BASE_ENDPOINT}/persons/${id}/merge`;

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: "PipedriveIdentify", type: "identify" },
  GROUP: { name: "PipedriveGroup", type: "group" },
  ALIAS: { name: "PipedriveAlias", type: "alias" },
  TRACK: { name: "PipedriveTrack", type: "track" },
  PRODUCT: { name: "PipedriveProduct" }
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

const PIPEDRIVE_GROUP_EXCLUSION = PIPEDRIVE_IDENTIFY_EXCLUSION.slice(0, 4);
const PIPEDRIVE_TRACK_EXCLUSION = [
  "title",
  "value",
  "organization_id",
  "expected_close_date",
  "label_ids",
  "owner_id"
];
const PIPEDRIVE_PRODUCT_EXCLUSION = [
  "name",
  "code",
  "unit",
  "tax",
  "selectable",
  "visible_to",
  "owner_id",
  "prices"
];

module.exports = {
  MAPPING_CONFIG,
  CONFIG_CATEGORIES,
  BASE_ENDPOINT,
  getMergeEndpoint,
  PERSONS_ENDPOINT,
  ORGANISATION_ENDPOINT,
  PIPEDRIVE_IDENTIFY_EXCLUSION,
  PIPEDRIVE_GROUP_EXCLUSION,
  PIPEDRIVE_PRODUCT_EXCLUSION,
  PIPEDRIVE_TRACK_EXCLUSION,
  LEADS_ENDPOINT,
  PRODUCTS_ENDPOINT
};

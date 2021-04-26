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
  PRODUCT_VIEWED: { name: "PipedriveProductViewed" },
  ORDER_COMPLETED: { name: "PipedriveOrderCompleted" }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

const PRODUCT_EVENTS = ["product viewed", "order completed"];

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
  "organization_id",
  "expected_close_date",
  "label_ids",
  "owner_id",
  "revenue",
  "total"
];

const PIPEDRIVE_PRODUCT_VIEWED_EXCLUSION = [
  "name",
  "quantity",
  "price",
  "currency",
  "product_id",
  "sku",
  "productId",
  "owner_id",
  "active_flag"
];

const PIPEDRIVE_ORDER_COMPLETED_EXCLUSION = [
  "name",
  "order_id",
  "checkout_id",
  "product_id",
  "productId",
  "sku",
  "tax",
  "owner_id",
  "price",
  "currency",
  "active_flag"
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
  PIPEDRIVE_PRODUCT_VIEWED_EXCLUSION,
  PIPEDRIVE_ORDER_COMPLETED_EXCLUSION,
  PIPEDRIVE_TRACK_EXCLUSION,
  LEADS_ENDPOINT,
  PRODUCTS_ENDPOINT,
  PRODUCT_EVENTS
};

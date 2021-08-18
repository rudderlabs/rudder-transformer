const { getMappingConfig } = require("../../util");

const ENDPOINT = "https://api.ometria.com/v2/push";
const CONFIG_CATEGORIES = {
  IDENTIFY: { type: "identify", name: "OmetriaContact" },
  CUSTOM_EVENT: { type: "custom event", name: "OmetriaCustomEvent" },
  ORDER: { type: "order", name: "OmetriaOrder" },
  LINEITEMS: { type: "lineitems", name: "OmetriaLineitems" },
  VARIANT: { type: "variant", name: "OmetriaVariant" }
};

const MAX_BATCH_SIZE = 100;
const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
const IDENTIFY_EXCLUSION_FIELDS = [
  "email",
  "phoneNumber",
  "collection",
  "marketinOptin",
  "userIdOnly",
  "prefix",
  "first_name",
  "firstName",
  "last_name",
  "lastName",
  "middle_name",
  "middleName",
  "firstName",
  "lastname",
  "middlename",
  "dateOfBirth",
  "countryId",
  "timezone",
  "timestampAcquired",
  "timestampSubscribed",
  "timestampUnsubscribed",
  "channels",
  "storeIds",
  "gender",
  "removeFromLists",
  "addToLists",
  "marketingOptin",
  "custom_fields",
  "listingId"
];

const CUSTOM_EVENT_EXCLUSION_FIELDS = [
  "event_id",
  "event_type",
  "timestamp",
  "profile_id",
  "identity_email",
  "identity_account_id",
  "custom_fields"
];

const ORDER_EXCLUSION_FIELDS = [
  "order_d",
  "timestamp",
  "grand_total",
  "subtotal",
  "discount",
  "shipping",
  "tax",
  "currency",
  "web_id",
  "status",
  "isValid",
  "customer",
  "products",
  "ip_address",
  "channels",
  "store",
  "payment_method",
  "shipping_method",
  "shipping_address",
  "billing_address",
  "coupon_code",
  "custom_fields"
];

const LINEITEMS_EXCLUSION_FIELDS = [
  "product_id",
  "variant_id",
  "quantity",
  "sku",
  "unit_price",
  "quantity_refunded",
  "refunded",
  "sub_total",
  "tax",
  "total",
  "discount",
  "is_on_sale",
  "totals",
  "properties"
];

const MARKETING_OPTIN_LIST = [
  "EXPLICITYLY_OPTED_OUT",
  "NOT_SPECIFIED",
  "EXPLICITLY_OPTED_IN"
];

const ecomEvents = [
  "order completed",
  "order shipped",
  "order pending",
  "order complete",
  "pending",
  "complete",
  "shipped"
];

const eventNameMapping = {
  "order completed": "complete",
  "order complete": "complete",
  complete: "complete",
  "order pending": "pending",
  pending: "pending",
  "order shipped": "shipped",
  shipped: "shipped"
};

module.exports = {
  ENDPOINT,
  ecomEvents,
  eventNameMapping,
  MAX_BATCH_SIZE,
  IDENTIFY_EXCLUSION_FIELDS,
  CUSTOM_EVENT_EXCLUSION_FIELDS,
  MARKETING_OPTIN_LIST,
  ORDER_EXCLUSION_FIELDS,
  LINEITEMS_EXCLUSION_FIELDS,
  contactDataMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name],
  customEventMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.CUSTOM_EVENT.name],
  orderMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.ORDER.name],
  lineitemsMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.LINEITEMS.name],
  variantMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.VARIANT.name]
};

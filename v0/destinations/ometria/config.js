const { getMappingConfig } = require("../../util");

const ENDPOINT = "https://api.ometria.com/v2/push";
const CONFIG_CATEGORIES = {
  IDENTIFY: { type: "identify", name: "OmetriaContact" },
  CUSTOM_EVENT: { type: "custom event", name: "OmetriaCustomEvent" },
  ORDER: { type: "order", name: "OmetriaOrder" },
  LINEITEMS: { type: "lineitems", name: "OmetriaLineitems" },
  VARIANT: { type: "variant", name: "OmetriaVariant" },
  PRODUCT: { type: "product", name: "OmetriaProduct" },
  LISTING: { type: "listing", name: "OmetriaListing" }
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
  "properties",
  "listingId"
];

const CUSTOM_EVENT_EXCLUSION_FIELDS = [
  "eventId",
  "eventType",
  "timestamp",
  "profileId",
  "identityEmail",
  "identityAccountId"
];

const ORDER_EXCLUSION_FIELDS = [
  "orderId",
  "timestamp",
  "grandTotal",
  "subTotal",
  "discount",
  "shipping",
  "tax",
  "currency",
  "webId",
  "status",
  "isValid",
  "customer",
  "lineitems",
  "IPAddress",
  "channels",
  "store",
  "paymentMethod",
  "shippingMethod",
  "shippingAddress",
  "billingAddress",
  "couponCode"
];

const PRODUCT_EXCLUSION_FIELDS = [
  "productId",
  "title",
  "isVariant",
  "price",
  "sku",
  "specialPriceDtFrom",
  "specialPriceDtTo",
  "specialPrice",
  "isActive",
  "isInStock",
  "url",
  "imageUrl"
];

const MARKETING_OPTIN_LIST = [
  "EXPLICITYLY_OPTED_OUT",
  "NOT_SPECIFIED",
  "EXPLICITLY_OPTED_IN"
];

module.exports = {
  ENDPOINT,
  MAX_BATCH_SIZE,
  IDENTIFY_EXCLUSION_FIELDS,
  CUSTOM_EVENT_EXCLUSION_FIELDS,
  MARKETING_OPTIN_LIST,
  ORDER_EXCLUSION_FIELDS,
  PRODUCT_EXCLUSION_FIELDS,
  contactDataMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name],
  customEventMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.CUSTOM_EVENT.name],
  orderMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.ORDER.name],
  lineitemsMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.LINEITEMS.name],
  variantMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.VARIANT.name],
  productMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.PRODUCT.name],
  listingMapping: MAPPING_CONFIG[CONFIG_CATEGORIES.LISTING.name]
};

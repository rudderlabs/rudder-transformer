const { getMappingConfig } = require("../../util");

const BASE_URL = "https://api.getblueshift.com";
const BASE_URL_EU = "https://api.eu.getblueshift.com";

const CONFIG_CATEGORIES = {
  IDENTIFY: {
    name: "blueshiftIdentifyConfig",
    type: "identify"
  },
  TRACK: {
    name: "blueshiftTrackConfig",
    type: "track"
  },
  GROUP: {
    name: "blueshiftGroupConfig",
    type: "group"
  }
};
const EVENT_NAME_MAPPING = {
  "Product Viewed": "view",
  "Product Added": "add_to_cart",
  "Order Completed": "purchase",
  "Products Searched": "search",
  "Checkout Step Viewed": "checkout",
  "Product Removed": "remove_from_cart",
  "Subscribe Interest": "subscribe_interest",
  "Unsubscribe Interest": "unsubscribe_interest",
  Identify: "identify"
};

const BLUESHIFT_TRACK_EXCLUSION = [
  "userId",
  "id",
  "email",
  "event",
  "type",
  "token",
  "idfa",
  "advertisingId",
  "idfv",
  "id",
  "manufacturer",
  "carrier",
  "ip",
  "request_ip",
  "latitude",
  "longitude",
  "messageId",
  "cookie",
  "device",
  "os",
  "network",
  "address",
  "traits"
];

const BLUESHIFT_IDENTIFY_EXCLUSION = [
  "email",
  "event",
  "phone",
  "firstName",
  "firstname",
  "first_name",
  "lastName",
  "lastname",
  "last_name",
  "gender",
  "traits",
  "network",
  "address",
  "device",
  "os"
];

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  EVENT_NAME_MAPPING,
  BLUESHIFT_TRACK_EXCLUSION,
  BLUESHIFT_IDENTIFY_EXCLUSION,
  BASE_URL_EU,
  BASE_URL
};

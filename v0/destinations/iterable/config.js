const { getMappingConfig } = require("../../util");

const BASE_URL = "https://api.iterable.com/api/";

const ConfigCategory = {
  IDENTIFY_BROWSER: {
    name: "IterableRegisterBrowserTokenConfig"
  },
  IDENTIFY_DEVICE: {
    name: "IterableRegisterDeviceTokenConfig"
  },
  IDENTIFY: {
    name: "IterableIdentifyConfig",
    action: "identify",
    actionDevice: "identifyDevice",
    actionBrowser: "identifyBrowser",
    endpoint: `${BASE_URL}users/update`,
    endpointDevice: `${BASE_URL}users/registerDeviceToken`,
    endpointBrowser: `${BASE_URL}users/registerBrowserToken`
  },
  PAGE: {
    name: "IterablePageConfig",
    action: "page",
    endpoint: `${BASE_URL}events/track`
  },
  SCREEN: {
    name: "IterablePageConfig",
    action: "screen",
    endpoint: `${BASE_URL}events/track`
  },
  TRACK: {
    name: "IterableTrackConfig",
    action: "track",
    endpoint: `${BASE_URL}events/track`
  },
  TRACK_PURCHASE: {
    name: "IterableTrackPurchaseConfig",
    action: "trackPurchase",
    endpoint: `${BASE_URL}commerce/trackPurchase`
  },
  PRODUCT: {
    name: "IterableProductConfig",
    action: "product",
    endpoint: ""
  },
  UPDATE_CART: {
    name: "IterableProductConfig",
    action: "updateCart",
    endpoint: `${BASE_URL}commerce/updateCart`
  },
  DEVICE: {
    name: "IterableDeviceConfig",
    action: "product",
    endpoint: ""
  },
  ALIAS: {
    name: "IterableAliasConfig",
    action: "alias",
    endpoint: `${BASE_URL}users/updateEmail`
  }
};
const mappingConfig = getMappingConfig(ConfigCategory, __dirname);
module.exports = { ConfigCategory, mappingConfig };

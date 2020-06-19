const { getMappingConfig } = require("../util");

const ConfigCategory = {
  IDENTIFYBROWSER: {
    name: "IterableRegisterBrowserTokenConfig"
  },
  IDENTIFYDEVICE: {
    name: "IterableRegisterDeviceTokenConfig"
  },
  IDENTIFY: {
    name: "IterableIdentifyConfig",
    action: "identify",
    actionDevice: "identifyDevice",
    actionBrowser: "identifyBrowser",
    endpoint: "https://api.iterable.com/api/users/update",
    endpointDevice: "https://api.iterable.com/api/users/registerDeviceToken",
    endpointBrowser: "https://api.iterable.com/api/users/registerBrowserToken"
  },
  PAGE: {
    name: "IterablePageConfig",
    action: "page",
    endpoint: "https://api.iterable.com/api/events/track"
  },
  SCREEN: {
    name: "IterablePageConfig",
    action: "screen",
    endpoint: "https://api.iterable.com/api/events/track"
  },
  TRACK: {
    name: "IterableTrackConfig",
    action: "track",
    endpoint: "https://api.iterable.com/api/events/track"
  },
  TRACKPURCHASE: {
    name: "IterableTrackPurchaseConfig",
    action: "trackPurchase",
    endpoint: "https://api.iterable.com/api/commerce/trackPurchase"
  },
  PRODUCT: {
    name: "IterableProductConfig",
    action: "product",
    endpoint: ""
  },
  UPDATECART: {
    name: "IterableProductConfig",
    action: "updateCart",
    endpoint: "https://api.iterable.com/api/commerce/updateCart"
  },
  DEVICE: {
    name: "IterableDeviceConfig",
    action: "product",
    endpoint: ""
  }
};
const mappingConfig = getMappingConfig(ConfigCategory, __dirname);
module.exports = { ConfigCategory, mappingConfig };

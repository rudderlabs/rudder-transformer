const { getMappingConfig } = require('../../util');

const endpointUS = {
  // track properties, | Track
  identify: `https://api-01.moengage.com/v1/customer/`,
  // identify a user| Identify
  track: `https://api-01.moengage.com/v1/event/`,
  // identify a user| Device
  device: `https://api-01.moengage.com/v1/device/`,
  alias: `https://api-01.moengage.com/v1/customer/merge?app_id=`,
};

const endpointEU = {
  identify: `https://api-02.moengage.com/v1/customer/`,
  track: `https://api-02.moengage.com/v1/event/`,
  device: `https://api-02.moengage.com/v1/device/`,
  alias: `https://api-02.moengage.com/v1/customer/merge?app_id=`,
};

const endpointIND = {
  identify: `https://api-03.moengage.com/v1/customer/`,
  track: `https://api-03.moengage.com/v1/event/`,
  device: `https://api-03.moengage.com/v1/device/`,
  alias: `https://api-03.moengage.com/v1/customer/merge?app_id=`,
};

// moengage supports object types, we added a new mapping for identify, track and device to support object data type
const CONFIG_CATEGORIES = {
  IDENTIFY: { type: 'identify', name: 'MOENGAGEIdentifyConfig' },
  TRACK: { type: 'track', name: 'MOENGAGETrackConfig' },
  DEVICE: { type: 'device', name: 'MOENGAGEDeviceConfig' },
  IDENTIFY_ATTR: {
    type: 'identifyAttr',
    name: 'MOENGAGEIdentifyAttributesConfig',
  },
  IDENTIFY_ATTR_OBJ: {
    type: 'identifyAttr',
    name: 'MOENGAGEIdentifyAttributesObjectConfig',
  },
  DEVICE_ATTR: {
    type: 'deviceAttr',
    name: 'MOENGAGEDeviceAttributesConfig',
  },
  DEVICE_ATTR_OBJ: {
    type: 'deviceAttr',
    name: 'MOENGAGEDeviceAttributesObjectConfig',
  },
  TRACK_ATTR: {
    type: 'trackAttr',
    name: 'MOENGAGETrackAttributesConfig',
  },
  TRACK_ATTR_OBJ: {
    type: 'trackAttrObj',
    name: 'MOENGAGETrackAttributesObjectConfig',
  },
  ALIAS: { type: 'alias', name: 'MoEngageAliasConfig' },
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  endpointEU,
  endpointIND,
  endpointUS,
};

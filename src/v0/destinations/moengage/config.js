const { getMappingConfig } = require('../../util');

const endpointPaths = {
  identify: 'customer',
  track: 'event',
  device: 'device',
  alias: 'customer/merge',
};
const regionApiMap = {
  US: '01',
  EU: '02',
  IND: '03',
  'US-DC-04': '04',
  'SGP-DC-05': '05',
  'IDN-DC-06': '06',
  'DC-101': '101',
};

const endpoints = Object.fromEntries(
  Object.entries(regionApiMap).map(([region, apiNum]) => [
    region,
    {
      identify: `https://api-${apiNum}.moengage.com/v1/${endpointPaths.identify}/`,
      track: `https://api-${apiNum}.moengage.com/v1/${endpointPaths.track}/`,
      device: `https://api-${apiNum}.moengage.com/v1/${endpointPaths.device}/`,
      alias: `https://api-${apiNum}.moengage.com/v1/${endpointPaths.alias}?app_id=`,
    },
  ]),
);

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
  endpointPaths,
  endpoints,
};

const { getMappingConfig } = require("../../util");

const endpointUS = {
  identify: `https://api.moengage.com/v1/customer/`, // track properties, | Track
  track: `https://api.moengage.com/v1/event/`, // identify a user| Identify
  device: `https://api.moengage.com/v1/device/`
};

const endpointEU = {
  identify: `https://api-eu.moengage.com/v1/customer/`, // track properties, | Track
  track: `https://api-eu.moengage.com/v1/event/`, // identify a user| Identify
  device: `https://api-eu.moengage.com/v1/device/`
};

const endpointIND = {
  identify: `https://api-serv3.moengage.com/v1/customer/`, // track properties, | Track
  track: `https://api-serv3.moengage.com/v1/event/`, // identify a user| Identify
  device: `https://api-serv3.moengage.com/v1/device/`
};

const CONFIG_CATEGORIES = {
  IDENTIFY: { type: "identify", name: "MOENGAGEIdentifyConfig" },
  TRACK: { type: "track", name: "MOENGAGETrackConfig" },
  DEVICE: { type: "device", name: "MOENGAGEDeviceConfig" },
  IDENTIFY_ATTR: {
    type: "identifyAttr",
    name: "MOENGAGEIdentifyAttributesConfig"
  },
  DEVICE_ATTR: {
    type: "deviceAttr",
    name: "MOENGAGEDeviceAttributesConfig"
  },
  TRACK_ATTR: {
    type: "trackAttr",
    name: "MOENGAGETrackAttributesConfig"
  }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  endpointEU,
  endpointUS,
  endpointIND
};

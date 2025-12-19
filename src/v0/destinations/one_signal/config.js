const { getMappingConfig } = require('../../util');

const BASE_URL = 'https://onesignal.com/api/v1';
const BASE_URL_V2 = 'https://api.onesignal.com/apps/{{app_id}}/users';
const PARTNER_NAME = 'Rudderstack | Partner Integration';

const ENDPOINTS = {
  IDENTIFY: {
    endpoint: '/players',
  },
  TRACK: {
    endpoint: '/apps',
  },
  GROUP: {
    endpoint: '/apps',
  },
};

const ConfigCategory = {
  IDENTIFY: { name: 'OneSignalIdentifyConfig', endpoint: '/players' },
  IDENTIFY_V2: { name: 'OneSignalIdentifyConfigV2' },
  SUBSCRIPTION: { name: 'OneSignalSubscriptionConfig' },
};

const mappingConfig = getMappingConfig(ConfigCategory, __dirname);

// Used for User Model (V2)
const deviceTypesV2Enums = [
  'iOSPush',
  'email',
  'sms',
  'AndroidPush',
  'HuaweiPush',
  'FireOSPush',
  'WindowsPush',
  'macOSPush',
  'ChromeExtensionPush',
  'ChromePush',
  'SafariLegacyPush',
  'FirefoxPush',
  'SafariPush',
];
module.exports = {
  BASE_URL,
  BASE_URL_V2,
  ENDPOINTS,
  ConfigCategory,
  mappingConfig,
  deviceTypesV2Enums,
  PARTNER_NAME,
};

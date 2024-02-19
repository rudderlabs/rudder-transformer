const destType = 'the_trade_desk_real_time_conversions';
const destTypeInUpperCase = 'THE_TRADE_DESK_REAL_TIME_CONVERSIONS';
const advertiserId = 'test-advertiser-id';
const trackerId = 'test-trackerId';
const sampleDestination = {
  Config: {
    advertiserId,
    trackerId,
  },
  DestinationDefinition: { Config: { cdkV2Enabled: true } },
};

const sampleContextForConversion = {
  app: {
    build: '1.0.0',
    name: 'RudderLabs Android SDK',
    namespace: 'com.rudderlabs.javascript',
    version: '1.0.5',
  },
  device: {
    adTrackingEnabled: true,
    advertisingId: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
    id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
    manufacturer: 'Google',
    model: 'AOSP on IA Emulator',
    name: 'generic_x86_arm',
    type: 'ios',
    attTrackingStatus: 3,
  },
  externalId: [
    {
      type: 'daid',
      id: 'test-daid',
    },
  ],
  ip: '0.0.0.0',
  page: {
    referrer: 'https://docs.rudderstack.com/destinations/trade_desk',
  },
  library: {
    name: 'RudderLabs JavaScript SDK',
    version: '1.0.5',
  },
  locale: 'en-GB',
  os: {
    name: '',
    version: '',
  },
  screen: {
    density: 2,
  },
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
};

const integrationObject = {
  All: true,
  THE_TRADE_DESK: {
    policies: ['LDU'],
    region: 'US-CA',
    privacy_settings: [
      {
        privacy_type: 'GDPR',
        is_applicable: 1,
        consent_string: 'ok',
      },
    ],
  },
};

export {
  destType,
  destTypeInUpperCase,
  advertiserId,
  trackerId,
  sampleDestination,
  sampleContextForConversion,
  integrationObject,
};

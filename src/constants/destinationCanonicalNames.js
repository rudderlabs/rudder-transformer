const fs = require('fs');
const path = require('path');

const DestHandlerMap = {
  ga360: 'ga',
  salesforce_oauth: 'salesforce',
  salesforce_oauth_sandbox: 'salesforce',
};

const WhitelistOnlyDestinationAliases = {
  __rudder_test__: 'rudder_test',
  webhook_v2: 'webhook',
};

const DestCanonicalNames = {
  facebook_conversions: [
    'fb_conversions',
    'fb conversions',
    'FacebookConversions',
    'Facebook Conversions',
    'FB Conversions',
    'Facebook_Conversions',
  ],
  fb_pixel: [
    'fb_pixel',
    'fb pixel',
    'FacebookPixel',
    'Facebook Pixel',
    'FB Pixel',
    'Facebook_Pixel',
  ],
  ometria: ['Ometria', 'ometria', 'OMETRIA'],
  sendgrid: ['sendgrid', 'Sendgrid', 'SENDGRID'],
  reddit: ['REDDIT', 'Reddit', 'reddit'],
  dcm_floodlight: [
    'dcm floodlight',
    'dcm_floodlight',
    'DCM Floodlight',
    'DCM_Floodlight',
    'DCMFloodlight',
    'dcmfloodlight',
  ],
  new_relic: ['new relic', 'new_relic', 'New Relic', 'New_Relic', 'NewRelic', 'newrelic'],
  attentive_tag: [
    'attentive tag',
    'attentive_tag',
    'Attentive Tag',
    'Attentive_Tag',
    'AttentiveTag',
    'attentivetag',
  ],
  webhook: ['webhook', 'Webhook', 'WebHook', 'WEBHOOK'],
  mailchimp: ['mailchimp', 'MailChimp', 'MAILCHIMP'],
  mautic: ['MAUTIC', 'mautic', 'Mautic'],
  mailjet: ['MAILJET', 'MailJet', 'mailjet', 'Mailjet'],
  kafka: ['KAFKA', 'kafka', 'Kafka'],
  azure_event_hub: ['AZURE_EVENT_HUB', 'azure_event_hub', 'AzureEventHub'],
  confluent_cloud: ['CONFLUENT_CLOUD', 'confluent_cloud', 'ConfluentCloud'],
  vero: ['vero', 'Vero', 'VERO'],
  pinterest: ['pinterest', 'Pinterest', 'PINTEREST', 'pinterestConversion'],
  rockerbox: ['rockerbox', 'ROCKERBOX', 'Rockerbox', 'RockerBox', 'rockerBox'],
  canny: ['canny', 'Canny', 'CANNY'],
  one_signal: ['one signal', 'one_signal', 'One Signal', 'One_Signal', 'OneSignal', 'onesignal'],
  wootric: ['wootric', 'Wootric', 'WOOTRIC'],
  clickup: ['ClickUp', 'clickup', 'CLICKUP', 'clickUp', 'Clickup'],
  zapier: ['zapier', 'Zapier', 'ZAPIER'],
  shynet: ['shynet', 'SHYNET', 'shyNet', 'ShyNet'],
  woopra: ['WOOPRA', 'Woopra', 'woopra'],
  monday: ['monday', 'MONDAY', 'monDay', 'MonDay'],
  mailmodo: [
    'mail modo',
    'mail_modo',
    'Mail Modo',
    'Mail_Modo',
    'MailModo',
    'mailmodo',
    'MAILMODO',
    'mailModo',
  ],
  user: ['user', 'USER', 'User', 'User.com', 'user.com', 'USER.com'],
  engage: ['engage', 'Engage', 'ENGAGE'],
  june: ['june', 'JUNE', 'June'],
  factorsai: ['FACTORSAI', 'factorsAI', 'FactorsAi', 'factorsAi'],
  snapchat_custom_audience: [
    'snapchat custom audience',
    'snap chat custom audience',
    'snapchat_custom_audience',
    'snapchatCustomAudience',
    'Snapchat Custom Audience',
    'snapchatcustomaudience',
    'SNAPCHAT CUSTOM AUDIENCE',
    'SNAPCHAT_CUSTOM_AUDIENCE',
    'SNAPCHATCUSTOMAUDIENCE',
  ],
  CAMPAIGN_MANAGER: [
    'campaign manager',
    'campain Manager',
    'CAMPAIGN MANAGER',
    'campaignManager',
    'campaign_manager',
    'CAMPAIGN_MANAGER',
  ],
  gainsight_px: [
    'GAINSIGHT_PX',
    'GAINSIGHTPX',
    'gainsightPx',
    'Gainsight PX',
    'gainsight px',
    'Gainsight Px',
  ],
  awin: ['awin', 'Awin', 'AWIN'],
  sendinblue: ['sendinblue', 'SENDINBLUE', 'Sendinblue', 'SendinBlue'],
  ga4: ['GA4', 'ga4', 'Ga4', 'Google Analytics 4', 'googleAnalytics4', 'Google Analytics 4 (GA4)'],
  ga4_v2: [
    'GA4_V2',
    'ga4_v2',
    'Ga4_v2',
    'Google Analytics 4 V2',
    'googleAnalytics4V2',
    'Google Analytics 4 (GA4) V2',
  ],
  pipedream: ['Pipedream', 'PipeDream', 'pipedream', 'PIPEDREAM'],
  pagerduty: ['pagerduty', 'PAGERDUTY', 'PagerDuty', 'Pagerduty', 'pagerDuty'],
  adobe_analytics: [
    'adobe_analytics',
    'ADOBE_ANALYTICS',
    'adobe analytics',
    'adobeAnalytics',
    'Adobe Analytics',
    'adobeanalytics',
    'ADOBE ANALYTICS',
    'ADOBEANALYTICS',
  ],
  criteo_audience: [
    'criteo audience',
    'criteoAudience',
    'Criteo Audience',
    'criteoaudience',
    'CRITEO AUDIENCE',
    'CRITEO_AUDIENCE',
    'CRITEOAUDIENCE',
  ],
  optimizely_fullstack: [
    'Optimizely Fullstack',
    'OPTIMIZELY FULLSTACK',
    'optimizely fullstack',
    'OptimizelyFullstack',
    'Optimizely_Fullstack',
    'optimizely_fullstack',
  ],
  vitally: ['vitally', 'Vitally', 'VITALLY'],
  courier: ['Courier', 'courier', 'COURIER'],
  TWITTER_ADS: [
    'twitter ads',
    'twitter Manager',
    'TWITTER ADS',
    'twitterADS',
    'twitter_ads',
    'TWITTER_ADS',
  ],
  BRAZE: ['BRAZE', 'Braze', 'braze'],
  THE_TRADE_DESK: [
    'THE_TRADE_DESK',
    'the_trade_desk',
    'The_Trade_Desk',
    'The Trade Desk',
    'thetradedesk',
    'theTradeDesk',
    'TheTradeDesk',
    'the trade desk',
  ],
  INTERCOM: ['INTERCOM', 'intercom', 'Intercom'],
  GOOGLE_ADWORDS_REMARKETING_LISTS: [
    'GOOGLE_ADWORDS_REMARKETING_LISTS',
    'google_adwords_remarketing_lists',
    'Google Adwords Remarketing Lists',
    'google adwords remarketing lists',
  ],
  GOOGLE_ADWORDS_OFFLINE_CONVERSIONS: [
    'GOOGLE_ADWORDS_OFFLINE_CONVERSIONS',
    'google_adwords_offline_conversions',
    'Google Adwords Offline Conversions',
    'google adwords offline conversions',
  ],
  koala: ['Koala', 'koala', 'KOALA'],
  bloomreach: ['Bloomreach', 'bloomreach', 'BLOOMREACH'],
  KLAVIYO_BULK_UPLOAD: [
    'klaviyo bulk upload',
    'klaviyo_bulk_upload',
    'klaviyoBulkUpload',
    'Klaviyo Bulk Upload',
    'klaviyobulkupload',
  ],
  Klaviyo: ['KLAVIYO', 'Klaviyo', 'klaviyo'],
  emarsys: ['EMARSYS', 'Emarsys', 'emarsys'],
  wunderkind: ['wunderkind', 'Wunderkind', 'WUNDERKIND'],
  cordial: ['cordial', 'Cordial', 'CORDIAL'],
  clevertap: ['clevertap', 'Clevertap', 'CleverTap', 'CLEVERTAP'],
  airship: ['airship', 'Airship', 'AIRSHIP'],
  singular: ['Singular'],
};

const ROUTER_TRANSFORM_DESTINATIONS = [
  'AM',
  'ACTIVE_CAMPAIGN',
  'ALGOLIA',
  'CANDU',
  'DELIGHTED',
  'DRIP',
  'FB_CUSTOM_AUDIENCE',
  'GA',
  'GAINSIGHT',
  'GAINSIGHT_PX',
  'GOOGLESHEETS',
  'GOOGLE_ADWORDS_ENHANCED_CONVERSIONS',
  'GOOGLE_ADWORDS_REMARKETING_LISTS',
  'GOOGLE_ADWORDS_OFFLINE_CONVERSIONS',
  'HS',
  'ITERABLE',
  'KLAVIYO',
  'KUSTOMER',
  'MAILCHIMP',
  'MAILMODO',
  'MARKETO',
  'OMETRIA',
  'PARDOT',
  'PINTEREST_TAG',
  'PROFITWELL',
  'SALESFORCE',
  'SALESFORCE_OAUTH',
  'SALESFORCE_OAUTH_SANDBOX',
  'SFMC',
  'SNAPCHAT_CONVERSION',
  'TIKTOK_ADS',
  'TRENGO',
  'YAHOO_DSP',
  'CANNY',
  'LAMBDA',
  'WOOTRIC',
  'GOOGLE_CLOUD_FUNCTION',
  'BQSTREAM',
  'CLICKUP',
  'FRESHMARKETER',
  'FRESHSALES',
  'MONDAY',
  'CUSTIFY',
  'USER',
  'REFINER',
  'FACEBOOK_OFFLINE_CONVERSIONS',
  'MAILJET',
  'SNAPCHAT_CUSTOM_AUDIENCE',
  'MARKETO_STATIC_LIST',
  'CAMPAIGN_MANAGER',
  'SENDGRID',
  'SENDINBLUE',
  'ZENDESK',
  'MP',
  'TIKTOK_ADS_OFFLINE_EVENTS',
  'CRITEO_AUDIENCE',
  'CUSTOMERIO',
  'BRAZE',
  'OPTIMIZELY_FULLSTACK',
  'TWITTER_ADS',
  'CLEVERTAP',
  'ORTTO',
  'GLADLY',
  'ONE_SIGNAL',
  'TIKTOK_AUDIENCE',
  'REDDIT',
  'THE_TRADE_DESK',
  'INTERCOM',
  'NINETAILED',
  'KOALA',
  'LINKEDIN_ADS',
  'BLOOMREACH',
  'MOVABLE_INK',
  'EMARSYS',
  'KODDI',
  'WUNDERKIND',
  'CLICKSEND',
  'ZOHO',
  'CORDIAL',
  'X_AUDIENCE',
  'BLOOMREACH_CATALOG',
  'SMARTLY',
  'HTTP',
  'AMAZON_AUDIENCE',
  'INTERCOM_V2',
  'LINKEDIN_AUDIENCE',
  'TOPSORT',
  'CUSTOMERIO_AUDIENCE',
  'ACCOIL_ANALYTICS',
  'POSTSCRIPT',
  'POSTHOG',
  'CUSTOM_AUDIENCE',
  'ITERABLE_AUDIENCE',
];

const REGULATION_DESTINATIONS = [
  'BRAZE',
  'AM',
  'INTERCOM',
  'CLEVERTAP',
  'AF',
  'MP',
  'GA',
  'ITERABLE',
  'ENGAGE',
  'CUSTIFY',
  'SENDGRID',
  'SPRIG',
  'EMARSYS',
];

const BATCHING_FRAMEWORK_GA_DESTINATIONS = ['POSTHOG', 'CUSTOM_AUDIENCE', 'ITERABLE_AUDIENCE'];

const repoRoot = path.resolve(__dirname, '..');
const destinationRoots = [
  path.join(repoRoot, 'v0', 'destinations'),
  path.join(repoRoot, 'v1', 'destinations'),
  path.join(repoRoot, 'cdk', 'v2', 'destinations'),
];

const normalizeDestinationName = (destination) => destination.trim().toLowerCase();

const getDestinationDirectories = () =>
  destinationRoots.flatMap((destinationRoot) => {
    try {
      return fs
        .readdirSync(destinationRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name);
    } catch {
      return [];
    }
  });

const destinationRegistry = Object.create(null);

const hasDestination = (destination) =>
  Object.prototype.hasOwnProperty.call(destinationRegistry, destination);

const buildDestinationEntry = (key) => ({
  name: key,
  aliases: [],
  routerTransform: false,
  regulation: false,
  batchingFrameworkGa: false,
});

getDestinationDirectories().forEach((destination) => {
  const key = normalizeDestinationName(destination);
  destinationRegistry[key] = destinationRegistry[key] || buildDestinationEntry(key);
});

Object.entries(DestHandlerMap).forEach(([alias, destination]) => {
  const key = normalizeDestinationName(alias);
  const handler = normalizeDestinationName(destination);
  if (!hasDestination(handler)) {
    throw new Error(
      `Destination handler alias ${alias} points to unknown destination: ${destination}`,
    );
  }
  destinationRegistry[key] = {
    ...(destinationRegistry[key] || buildDestinationEntry(key)),
    handler,
  };
});

Object.entries(WhitelistOnlyDestinationAliases).forEach(([alias, destination]) => {
  const key = normalizeDestinationName(alias);
  const canonicalDestination = normalizeDestinationName(destination);
  if (!hasDestination(canonicalDestination)) {
    throw new Error(
      `Destination whitelist alias ${alias} points to unknown destination: ${destination}`,
    );
  }
  destinationRegistry[key] = destinationRegistry[key] || buildDestinationEntry(key);
});

const setCapability = (destinations, capability) => {
  destinations.forEach((destination, index) => {
    const key = normalizeDestinationName(destination);
    if (!hasDestination(key)) {
      throw new Error(
        `Destination capability ${capability} references unknown destination: ${destination}`,
      );
    }
    destinationRegistry[key][capability] = true;
    destinationRegistry[key][`${capability}Name`] = destination;
    destinationRegistry[key][`${capability}Order`] = index;
  });
};

setCapability(ROUTER_TRANSFORM_DESTINATIONS, 'routerTransform');
setCapability(REGULATION_DESTINATIONS, 'regulation');
setCapability(BATCHING_FRAMEWORK_GA_DESTINATIONS, 'batchingFrameworkGa');

const isValidDestination = (destination) =>
  typeof destination === 'string' &&
  destination.length > 0 &&
  hasDestination(normalizeDestinationName(destination));

const assertValidDestination = (destination) => {
  if (!isValidDestination(destination)) {
    const error = new Error(`Invalid destination: ${destination}`);
    error.status = 400;
    error.statusCode = 400;
    error.isRetryable = false;
    throw error;
  }
};

const getDestinationHandlerName = (destination) => {
  assertValidDestination(destination);
  const normalized = normalizeDestinationName(destination);
  return destinationRegistry[normalized].handler || normalized;
};

const getCapabilityDestinations = (capability) =>
  Object.fromEntries(
    Object.values(destinationRegistry)
      .filter((destination) => destination[capability])
      .sort((left, right) => left[`${capability}Order`] - right[`${capability}Order`])
      .map((destination) => [destination[`${capability}Name`], true]),
  );

const getRouterTransformDestinations = () => getCapabilityDestinations('routerTransform');

const getRegulationDestinations = () => Object.keys(getCapabilityDestinations('regulation'));

const getBatchingFrameworkGaDestinations = () => getCapabilityDestinations('batchingFrameworkGa');

module.exports = {
  DestHandlerMap,
  DestCanonicalNames,
  WhitelistOnlyDestinationAliases,
  destinationRegistry,
  normalizeDestinationName,
  isValidDestination,
  assertValidDestination,
  getDestinationHandlerName,
  getRouterTransformDestinations,
  getRegulationDestinations,
  getBatchingFrameworkGaDestinations,
};

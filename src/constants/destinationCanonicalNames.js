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

module.exports = {
  DestHandlerMap,
  DestCanonicalNames,
  WhitelistOnlyDestinationAliases,
  destinationRegistry,
  normalizeDestinationName,
  isValidDestination,
  assertValidDestination,
  getDestinationHandlerName,
};

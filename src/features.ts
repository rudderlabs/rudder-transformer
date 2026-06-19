interface DestinationCapabilities {
  routerTransform?: true;
  regulations?: true;
  batching?: true;
  cdkV2?: true;
}

export const destinationCapabilities: Record<string, DestinationCapabilities> = {
  am: { routerTransform: true, regulations: true },
  active_campaign: { routerTransform: true },
  algolia: { routerTransform: true, cdkV2: true },
  candu: { routerTransform: true },
  delighted: { routerTransform: true },
  drip: { routerTransform: true },
  fb_custom_audience: { routerTransform: true },
  ga: { routerTransform: true, regulations: true },
  gainsight: { routerTransform: true },
  gainsight_px: { routerTransform: true },
  googlesheets: { routerTransform: true },
  google_adwords_enhanced_conversions: { routerTransform: true },
  google_adwords_remarketing_lists: { routerTransform: true },
  google_adwords_offline_conversions: { routerTransform: true },
  hs: { routerTransform: true },
  iterable: { routerTransform: true, regulations: true },
  klaviyo: { routerTransform: true },
  kustomer: { routerTransform: true },
  mailchimp: { routerTransform: true },
  mailmodo: { routerTransform: true },
  marketo: { routerTransform: true },
  ometria: { routerTransform: true },
  pardot: { routerTransform: true },
  pinterest_tag: { routerTransform: true, cdkV2: true },
  profitwell: { routerTransform: true },
  salesforce: { routerTransform: true },
  salesforce_oauth: { routerTransform: true },
  salesforce_oauth_sandbox: { routerTransform: true },
  sfmc: { routerTransform: true },
  snapchat_conversion: { routerTransform: true },
  tiktok_ads: { routerTransform: true },
  trengo: { routerTransform: true },
  yahoo_dsp: { routerTransform: true },
  canny: { routerTransform: true },
  lambda: { routerTransform: true },
  wootric: { routerTransform: true },
  google_cloud_function: { routerTransform: true },
  bqstream: { routerTransform: true },
  clickup: { routerTransform: true },
  freshmarketer: { routerTransform: true },
  freshsales: { routerTransform: true },
  monday: { routerTransform: true },
  custify: { routerTransform: true, regulations: true },
  user: { routerTransform: true },
  refiner: { routerTransform: true },
  facebook_offline_conversions: { routerTransform: true },
  mailjet: { routerTransform: true },
  snapchat_custom_audience: { routerTransform: true },
  marketo_static_list: { routerTransform: true },
  campaign_manager: { routerTransform: true },
  sendgrid: { routerTransform: true, regulations: true },
  sendinblue: { routerTransform: true },
  zendesk: { routerTransform: true },
  mp: { routerTransform: true, regulations: true },
  tiktok_ads_offline_events: { routerTransform: true },
  criteo_audience: { routerTransform: true },
  customerio: { routerTransform: true },
  braze: { routerTransform: true, regulations: true },
  optimizely_fullstack: { routerTransform: true, cdkV2: true },
  twitter_ads: { routerTransform: true },
  clevertap: { routerTransform: true, regulations: true },
  ortto: { routerTransform: true, cdkV2: true },
  gladly: { routerTransform: true, cdkV2: true },
  one_signal: { routerTransform: true },
  tiktok_audience: { routerTransform: true },
  reddit: { routerTransform: true, cdkV2: true },
  the_trade_desk: { routerTransform: true, cdkV2: true },
  intercom: { routerTransform: true, regulations: true, cdkV2: true },
  ninetailed: { routerTransform: true, cdkV2: true },
  koala: { routerTransform: true, cdkV2: true },
  linkedin_ads: { routerTransform: true, cdkV2: true },
  bloomreach: { routerTransform: true, cdkV2: true },
  movable_ink: { routerTransform: true, cdkV2: true },
  emarsys: { routerTransform: true, regulations: true, cdkV2: true },
  koddi: { routerTransform: true, cdkV2: true },
  wunderkind: { routerTransform: true, cdkV2: true },
  clicksend: { routerTransform: true, cdkV2: true },
  zoho: { routerTransform: true, cdkV2: true },
  cordial: { routerTransform: true, cdkV2: true },
  x_audience: { routerTransform: true },
  bloomreach_catalog: { routerTransform: true, cdkV2: true },
  smartly: { routerTransform: true, cdkV2: true },
  http: { routerTransform: true, cdkV2: true },
  amazon_audience: { routerTransform: true },
  intercom_v2: { routerTransform: true },
  linkedin_audience: { routerTransform: true },
  topsort: { routerTransform: true },
  customerio_audience: { routerTransform: true },
  accoil_analytics: { routerTransform: true, cdkV2: true },
  postscript: { routerTransform: true },
  posthog: { routerTransform: true, batching: true },
  custom_audience: { routerTransform: true, batching: true },
  iterable_audience: { routerTransform: true, batching: true },
  survicate: { routerTransform: true },
  af: { regulations: true },
  engage: { regulations: true },
  sprig: { regulations: true, cdkV2: true },
  autopilot: { cdkV2: true },
  bingads_audience: { cdkV2: true },
  bluecore: { cdkV2: true },
  dcm_floodlight: { cdkV2: true },
  dynamic_yield: { cdkV2: true },
  eloqua: { cdkV2: true },
  fullstory: { cdkV2: true },
  heap: { cdkV2: true },
  klaviyo_bulk_upload: { cdkV2: true },
  kochava: { cdkV2: true },
  launchdarkly_audience: { cdkV2: true },
  loops: { cdkV2: true },
  lytics: { cdkV2: true },
  new_relic: { cdkV2: true },
  rakuten: { cdkV2: true },
  statsig: { cdkV2: true },
  the_trade_desk_real_time_conversions: { cdkV2: true },
  userlist: { cdkV2: true },
  userpilot: { cdkV2: true },
  variance: { cdkV2: true },
  vitally: { cdkV2: true },
  webhook: { cdkV2: true },
  webhook_v2: { cdkV2: true },
  yandex_metrica_offline_events: { cdkV2: true },
  zapier: { cdkV2: true },
};

interface FeaturesConfig {
  routerTransform: Record<string, true>;
  regulations: string[];
  supportSourceTransformV1: true;
  supportTransformerProxyV1: true;
  upgradedToSourceTransformV2: true;
  supportDestTransformCompactedPayloadV1: true;
}

const normalizeDestinationName = (destination: string) => destination.trim().toLowerCase();
const featureName = (destination: string) => destination.toUpperCase();

const getCapabilityEntries = (capability: keyof DestinationCapabilities) =>
  Object.entries(destinationCapabilities).filter(([, capabilities]) => capabilities[capability]);

const getCapabilityMap = (capability: keyof DestinationCapabilities): Record<string, true> =>
  Object.fromEntries(
    getCapabilityEntries(capability).map(([destination]) => [featureName(destination), true]),
  );

export const getRouterTransformDestinations = (): Record<string, true> =>
  getCapabilityMap('routerTransform');

export const getRegulationDestinations = (): string[] =>
  getCapabilityEntries('regulations').map(([destination]) => featureName(destination));

export const getBatchingFrameworkGaDestinations = (): Record<string, true> =>
  getCapabilityMap('batching');

export const isDestinationCdkV2Enabled = (destination: string): boolean =>
  Boolean(destinationCapabilities[normalizeDestinationName(destination)]?.cdkV2);

const defaultFeaturesConfig: FeaturesConfig = {
  routerTransform: getRouterTransformDestinations(),
  regulations: getRegulationDestinations(),
  supportSourceTransformV1: true,
  supportTransformerProxyV1: true,
  upgradedToSourceTransformV2: true,
  supportDestTransformCompactedPayloadV1: true,
};

export default defaultFeaturesConfig;

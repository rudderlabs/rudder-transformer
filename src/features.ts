import fs from 'fs';
import path from 'path';
import { ConfigurationError } from '@rudderstack/integrations-lib';
import { DestHandlerMap } from './constants/destinationCanonicalNames';

// ---------------------------------------------------------------------------
// Destination capabilities
// ---------------------------------------------------------------------------

interface DestinationCapabilities {
  routerTransform?: true;
  regulations?: true;
  batching?: true;
  cdkV2?: true;
}

const destinationCapabilities: Record<string, DestinationCapabilities> = {
  AM: { routerTransform: true, regulations: true },
  ACTIVE_CAMPAIGN: { routerTransform: true },
  ALGOLIA: { routerTransform: true, cdkV2: true },
  CANDU: { routerTransform: true },
  DELIGHTED: { routerTransform: true },
  DRIP: { routerTransform: true },
  FB_CUSTOM_AUDIENCE: { routerTransform: true },
  GA: { routerTransform: true, regulations: true },
  GAINSIGHT: { routerTransform: true },
  GAINSIGHT_PX: { routerTransform: true },
  GOOGLESHEETS: { routerTransform: true },
  GOOGLE_ADWORDS_ENHANCED_CONVERSIONS: { routerTransform: true },
  GOOGLE_ADWORDS_REMARKETING_LISTS: { routerTransform: true },
  GOOGLE_ADWORDS_OFFLINE_CONVERSIONS: { routerTransform: true },
  HS: { routerTransform: true },
  ITERABLE: { routerTransform: true, regulations: true },
  KLAVIYO: { routerTransform: true },
  KUSTOMER: { routerTransform: true },
  MAILCHIMP: { routerTransform: true },
  MAILMODO: { routerTransform: true },
  MARKETO: { routerTransform: true },
  OMETRIA: { routerTransform: true },
  PARDOT: { routerTransform: true },
  PINTEREST_TAG: { routerTransform: true, cdkV2: true },
  PROFITWELL: { routerTransform: true },
  SALESFORCE: { routerTransform: true },
  SALESFORCE_OAUTH: { routerTransform: true },
  SALESFORCE_OAUTH_SANDBOX: { routerTransform: true },
  SFMC: { routerTransform: true },
  SNAPCHAT_CONVERSION: { routerTransform: true },
  TIKTOK_ADS: { routerTransform: true },
  TRENGO: { routerTransform: true },
  YAHOO_DSP: { routerTransform: true },
  CANNY: { routerTransform: true },
  LAMBDA: { routerTransform: true },
  WOOTRIC: { routerTransform: true },
  GOOGLE_CLOUD_FUNCTION: { routerTransform: true },
  BQSTREAM: { routerTransform: true },
  CLICKUP: { routerTransform: true },
  FRESHMARKETER: { routerTransform: true },
  FRESHSALES: { routerTransform: true },
  MONDAY: { routerTransform: true },
  CUSTIFY: { routerTransform: true, regulations: true },
  USER: { routerTransform: true },
  REFINER: { routerTransform: true },
  FACEBOOK_OFFLINE_CONVERSIONS: { routerTransform: true },
  MAILJET: { routerTransform: true },
  SNAPCHAT_CUSTOM_AUDIENCE: { routerTransform: true },
  MARKETO_STATIC_LIST: { routerTransform: true },
  CAMPAIGN_MANAGER: { routerTransform: true },
  SENDGRID: { routerTransform: true, regulations: true },
  SENDINBLUE: { routerTransform: true },
  ZENDESK: { routerTransform: true },
  MP: { routerTransform: true, regulations: true },
  TIKTOK_ADS_OFFLINE_EVENTS: { routerTransform: true },
  CRITEO_AUDIENCE: { routerTransform: true },
  CUSTOMERIO: { routerTransform: true },
  BRAZE: { routerTransform: true, regulations: true },
  OPTIMIZELY_FULLSTACK: { routerTransform: true, cdkV2: true },
  TWITTER_ADS: { routerTransform: true },
  CLEVERTAP: { routerTransform: true, regulations: true },
  ORTTO: { routerTransform: true, cdkV2: true },
  GLADLY: { routerTransform: true, cdkV2: true },
  ONE_SIGNAL: { routerTransform: true },
  TIKTOK_AUDIENCE: { routerTransform: true },
  REDDIT: { routerTransform: true, cdkV2: true },
  THE_TRADE_DESK: { routerTransform: true, cdkV2: true },
  INTERCOM: { routerTransform: true, regulations: true, cdkV2: true },
  NINETAILED: { routerTransform: true, cdkV2: true },
  KOALA: { routerTransform: true, cdkV2: true },
  LINKEDIN_ADS: { routerTransform: true, cdkV2: true },
  BLOOMREACH: { routerTransform: true, cdkV2: true },
  MOVABLE_INK: { routerTransform: true, cdkV2: true },
  EMARSYS: { routerTransform: true, regulations: true, cdkV2: true },
  KODDI: { routerTransform: true, cdkV2: true },
  WUNDERKIND: { routerTransform: true, cdkV2: true },
  CLICKSEND: { routerTransform: true, cdkV2: true },
  ZOHO: { routerTransform: true, cdkV2: true },
  CORDIAL: { routerTransform: true, cdkV2: true },
  X_AUDIENCE: { routerTransform: true },
  BLOOMREACH_CATALOG: { routerTransform: true, cdkV2: true },
  SMARTLY: { routerTransform: true, cdkV2: true },
  HTTP: { routerTransform: true, cdkV2: true },
  AMAZON_AUDIENCE: { routerTransform: true },
  INTERCOM_V2: { routerTransform: true },
  LINKEDIN_AUDIENCE: { routerTransform: true },
  TOPSORT: { routerTransform: true },
  CUSTOMERIO_AUDIENCE: { routerTransform: true },
  ACCOIL_ANALYTICS: { routerTransform: true, cdkV2: true },
  POSTSCRIPT: { routerTransform: true },
  POSTHOG: { routerTransform: true, batching: true },
  CUSTOM_AUDIENCE: { routerTransform: true, batching: true },
  ITERABLE_AUDIENCE: { routerTransform: true, batching: true },
  SURVICATE: { routerTransform: true },
  // dev-only fixture — see src/v0/destinations/test_destination/config.ts
  TEST_DESTINATION: { routerTransform: true, batching: true },
  AF: { regulations: true },
  ENGAGE: { regulations: true },
  SPRIG: { regulations: true, cdkV2: true },
  AUTOPILOT: { cdkV2: true },
  BINGADS_AUDIENCE: { cdkV2: true },
  BLUECORE: { cdkV2: true },
  DCM_FLOODLIGHT: { cdkV2: true },
  DYNAMIC_YIELD: { cdkV2: true },
  ELOQUA: { cdkV2: true },
  FULLSTORY: { cdkV2: true },
  HEAP: { cdkV2: true },
  KLAVIYO_BULK_UPLOAD: { cdkV2: true },
  KOCHAVA: { cdkV2: true },
  LAUNCHDARKLY_AUDIENCE: { cdkV2: true },
  LOOPS: { cdkV2: true },
  LYTICS: { cdkV2: true },
  NEW_RELIC: { cdkV2: true },
  RAKUTEN: { cdkV2: true },
  STATSIG: { cdkV2: true },
  THE_TRADE_DESK_REAL_TIME_CONVERSIONS: { cdkV2: true },
  USERLIST: { cdkV2: true },
  USERPILOT: { cdkV2: true },
  VARIANCE: { cdkV2: true },
  VITALLY: { cdkV2: true },
  WEBHOOK: { cdkV2: true },
  YANDEX_METRICA_OFFLINE_EVENTS: { cdkV2: true },
  ZAPIER: { cdkV2: true },
};

// ---------------------------------------------------------------------------
// Destination registry – built once at module load from filesystem + aliases
// ---------------------------------------------------------------------------

const normalizeDestinationName = (destination: string) => destination.trim().toLowerCase();

const destinationRegistry: Record<string, string> = Object.create(null);

const hasDestination = (destination: string) =>
  Object.prototype.hasOwnProperty.call(destinationRegistry, destination);

function initDestinationRegistry() {
  const repoRoot = path.resolve(__dirname);
  const destinationRoots = [
    path.join(repoRoot, 'v0', 'destinations'),
    path.join(repoRoot, 'v1', 'destinations'),
    path.join(repoRoot, 'cdk', 'v2', 'destinations'),
  ];

  destinationRoots
    .flatMap((root) => {
      try {
        return fs
          .readdirSync(root, { withFileTypes: true })
          .filter((entry) => entry.isDirectory())
          .map((entry) => entry.name);
      } catch {
        return [];
      }
    })
    .forEach((destination) => {
      const key = normalizeDestinationName(destination);
      destinationRegistry[key] = key;
    });

  Object.entries(DestHandlerMap).forEach(([alias, destination]) => {
    const key = normalizeDestinationName(alias);
    const handler = normalizeDestinationName(destination);
    if (!hasDestination(handler)) {
      throw new Error(
        `Destination handler alias ${alias} points to unknown destination: ${destination}`,
      );
    }
    destinationRegistry[key] = handler;
  });
}

initDestinationRegistry();

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

export const isValidDestination = (destination: unknown): boolean =>
  typeof destination === 'string' &&
  destination.length > 0 &&
  hasDestination(normalizeDestinationName(destination));

export const getDestinationHandlerName = (destination: string): string => {
  if (!isValidDestination(destination)) {
    throw new ConfigurationError(`Invalid destination: ${destination}`);
  }
  return destinationRegistry[normalizeDestinationName(destination)];
};

// ---------------------------------------------------------------------------
// Feature capability helpers
// ---------------------------------------------------------------------------

const getCapabilityEntries = (capability: keyof DestinationCapabilities) =>
  Object.entries(destinationCapabilities).filter(([, capabilities]) => capabilities[capability]);

const getCapabilityMap = (capability: keyof DestinationCapabilities): Record<string, true> =>
  Object.fromEntries(getCapabilityEntries(capability).map(([destination]) => [destination, true]));

export const getBatchingFrameworkGaDestinations = (): Record<string, true> =>
  getCapabilityMap('batching');

export const isDestinationCdkV2Enabled = (destination: string): boolean =>
  Boolean(destinationCapabilities[destination.trim().toUpperCase()]?.cdkV2);

// ---------------------------------------------------------------------------
// Features config
// ---------------------------------------------------------------------------

interface FeaturesConfig {
  routerTransform: Record<string, true>;
  regulations: string[];
  supportSourceTransformV1: true;
  supportTransformerProxyV1: true;
  upgradedToSourceTransformV2: true;
  supportDestTransformCompactedPayloadV1: true;
}

const defaultFeaturesConfig: FeaturesConfig = {
  routerTransform: getCapabilityMap('routerTransform'),
  regulations: getCapabilityEntries('regulations').map(([destination]) => destination),
  supportSourceTransformV1: true,
  supportTransformerProxyV1: true,
  upgradedToSourceTransformV2: true,
  supportDestTransformCompactedPayloadV1: true,
};

export default defaultFeaturesConfig;

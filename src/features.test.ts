import path from 'path';
import defaultFeaturesConfig, {
  getGaDestinationIntegrations,
  getDestinationHandlerName,
  isDestinationCdkV2Enabled,
  isValidDestination,
} from './features';
import { DestHandlerMap } from './constants/destinationCanonicalNames';
import { getIntegrations } from './routes/utils';
import fs from 'fs';

const getDestinationDirectories = () =>
  ['v0/destinations', 'v1/destinations', 'cdk/v2/destinations'].flatMap((destinationRoot) =>
    getIntegrations(path.join(__dirname, destinationRoot)).map((destination) =>
      destination.toLowerCase(),
    ),
  );

describe('features destination capabilities', () => {
  it('derives legacy capability outputs from the consolidated map', () => {
    expect(defaultFeaturesConfig.routerTransform).toMatchObject({
      SALESFORCE_OAUTH: true,
      SALESFORCE_OAUTH_SANDBOX: true,
      CUSTOM_AUDIENCE: true,
    });
    expect(defaultFeaturesConfig.regulations).toEqual(
      expect.arrayContaining(['BRAZE', 'AM', 'INTERCOM', 'CLEVERTAP']),
    );
    expect(getGaDestinationIntegrations()).toEqual({
      GOOGLE_ADWORDS_ENHANCED_CONVERSIONS: true,
      POSTHOG: true,
      CUSTOM_AUDIENCE: true,
      ITERABLE_AUDIENCE: true,
      BRAZE_AUDIENCE: true,
      REDDIT_AUDIENCE: true,
      TEST_DESTINATION: true,
      CUSTOMERIO: true,
    });
  });

  it('keeps CDK v2 enablement in the consolidated map', () => {
    expect(isDestinationCdkV2Enabled('webhook')).toBe(true);
    expect(isDestinationCdkV2Enabled('am')).toBe(false);
  });

  it('contains only valid destination names in capability outputs', () => {
    const allDestinations = [
      ...Object.keys(defaultFeaturesConfig.routerTransform),
      ...defaultFeaturesConfig.regulations,
      ...Object.keys(defaultFeaturesConfig.transformerProxy),
    ];
    expect(allDestinations.filter((destination) => !isValidDestination(destination))).toEqual([]);
  });

  // A destination may only declare transformerProxy if it implements the proxy itself: either a
  // networkHandler that exports a handler class (the shape networkHandlerFactory looks for) or a
  // batching-framework delivery spec. src/v0/destinations/ga/networkHandler.js is the cautionary
  // case — the file exists but exports only a deletion-API response parser, so GA falls through to
  // genericNetworkHandler. This asserts the export shape from source rather than requiring the
  // factory, which would pull the whole v0/util runtime into this suite.
  it('declares transformerProxy only for destinations that implement the proxy themselves', () => {
    const implementsProxy = (destination: string) => {
      const handlerName = getDestinationHandlerName(destination);
      return ['v0', 'v1'].some((version) => {
        const destinationRoot = path.join(__dirname, version, 'destinations', handlerName);
        if (fs.existsSync(path.join(destinationRoot, 'delivery.ts'))) return true;
        return ['networkHandler.ts', 'networkHandler.js'].some((file) => {
          const handlerPath = path.join(destinationRoot, file);
          return (
            fs.existsSync(handlerPath) &&
            /\b(networkHandler|NetworkHandler)\b\s*[,:}]/.test(fs.readFileSync(handlerPath, 'utf8'))
          );
        });
      });
    };
    const withoutProxy = Object.keys(defaultFeaturesConfig.transformerProxy).filter(
      (destination) => !implementsProxy(destination),
    );
    expect(withoutProxy).toEqual([]);
  });

  // Destinations that ship a handler but have never had proxy enabled in any environment stay off
  // the map: declaring them would turn proxy delivery on for the first time, which is a rollout
  // rather than the config consolidation this map exists for.
  it('excludes destinations that implement a proxy handler but have never been enabled', () => {
    ['CLICKSEND', 'MONDAY', 'POSTSCRIPT', 'FB', 'REDDIT_AUDIENCE', 'GA'].forEach((destination) => {
      expect(defaultFeaturesConfig.transformerProxy).not.toHaveProperty(destination);
    });
  });

  // AF is proxy-enabled fleet-wide but has no handler of its own, so it cannot declare the
  // capability and stays driven by Router.AF.transformerProxy until that is resolved separately.
  it('excludes proxy-enabled destinations that have no handler of their own', () => {
    expect(defaultFeaturesConfig.transformerProxy).not.toHaveProperty('AF');
  });
});

describe('destination registry', () => {
  it('derives valid destination names from destination directories and handler aliases', () => {
    const expectedDestinations = [...getDestinationDirectories(), ...Object.keys(DestHandlerMap)];

    expect(expectedDestinations.filter((destination) => !isValidDestination(destination))).toEqual(
      [],
    );
  });

  it('preserves handler aliases accepted by dynamic loading boundaries', () => {
    expect(isValidDestination('salesforce_oauth')).toBe(true);
    expect(getDestinationHandlerName('salesforce_oauth_sandbox')).toBe('salesforce');
  });

  it('rejects unknown destination names', () => {
    expect(isValidDestination('../salesforce')).toBe(false);
    expect(isValidDestination('not_a_destination')).toBe(false);
    expect(isValidDestination('constructor')).toBe(false);
    expect(isValidDestination('__proto__')).toBe(false);
  });
});

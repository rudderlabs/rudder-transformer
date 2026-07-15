import path from 'path';
import defaultFeaturesConfig, {
  getBatchingFrameworkGaDestinations,
  getDestinationHandlerName,
  isDestinationCdkV2Enabled,
  isValidDestination,
} from './features';
import { DestHandlerMap } from './constants/destinationCanonicalNames';
import { getIntegrations } from './routes/utils';

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
    expect(getBatchingFrameworkGaDestinations()).toEqual({
      POSTHOG: true,
      CUSTOM_AUDIENCE: true,
      ITERABLE_AUDIENCE: true,
      TEST_DESTINATION: true,
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
    ];
    expect(allDestinations.filter((destination) => !isValidDestination(destination))).toEqual([]);
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

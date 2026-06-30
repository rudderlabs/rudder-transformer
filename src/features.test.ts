import defaultFeaturesConfig, {
  getBatchingFrameworkGaDestinations,
  getDestinationHandlerName,
  isDestinationCdkV2Enabled,
  isValidDestination,
} from './features';

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

  it('contains only valid destination names', () => {
    const allDestinations = [
      ...Object.keys(defaultFeaturesConfig.routerTransform),
      ...defaultFeaturesConfig.regulations,
    ];
    expect(allDestinations.filter((destination) => !isValidDestination(destination))).toEqual([]);
  });
});

describe('destination registry', () => {
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

describe('isBatchingFrameworkDeliveryEnabled', () => {
  const ORIGINAL_ENV = process.env;

  const load = () => {
    // The GA map is read at module load, so each case needs a fresh module registry.
    let mod: typeof import('./batchedDestinationsMap');
    jest.isolateModules(() => {
      // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
      mod = require('./batchedDestinationsMap');
    });
    return mod!;
  };

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.NON_GA_DESTINATION_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('is on for a destination declared GA in features.ts', () => {
    // customerio and iterable_audience both carry `batching: true`.
    const { isBatchingFrameworkDeliveryEnabled } = load();
    expect(isBatchingFrameworkDeliveryEnabled('customerio')).toBe(true);
    expect(isBatchingFrameworkDeliveryEnabled('iterable_audience')).toBe(true);
  });

  it('is off for a destination that has not declared batching', () => {
    const { isBatchingFrameworkDeliveryEnabled } = load();
    expect(isBatchingFrameworkDeliveryEnabled('non_ga_destination')).toBe(false);
  });

  it('is case-insensitive on destType', () => {
    const { isBatchingFrameworkDeliveryEnabled } = load();
    expect(isBatchingFrameworkDeliveryEnabled('CUSTOMERIO')).toBe(true);
    expect(isBatchingFrameworkDeliveryEnabled('CustomerIO')).toBe(true);
  });

  it('stays off for a workspace-level transform rollout', () => {
    // The pre-GA allowlist is a rehearsal for a destination that has not declared GA, and such a
    // destination has usually not written a DeliverySpec. Transform moves, delivery must not.
    process.env.NON_GA_DESTINATION_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = 'ALL';
    const { isBatchingFrameworkEnabled, isBatchingFrameworkDeliveryEnabled } = load();
    expect(isBatchingFrameworkEnabled('non_ga_destination', 'ws-1')).toBe(true);
    expect(isBatchingFrameworkDeliveryEnabled('non_ga_destination')).toBe(false);
  });

  it('ignores a stale delivery env var left over from the flag it replaced', () => {
    process.env.NON_GA_DESTINATION_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS = 'ALL';
    const { isBatchingFrameworkDeliveryEnabled } = load();
    expect(isBatchingFrameworkDeliveryEnabled('non_ga_destination')).toBe(false);
  });
});

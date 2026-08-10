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
    delete process.env.CUSTOMERIO_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS;
    delete process.env.CUSTOMERIO_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS;
    delete process.env.ITERABLE_AUDIENCE_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('defaults to off, so delivery keeps using the legacy networkHandler', () => {
    const { isBatchingFrameworkDeliveryEnabled } = load();
    expect(isBatchingFrameworkDeliveryEnabled('customerio', 'ws-1')).toBe(false);
  });

  it('stays off for a GA destination that never opts delivery in', () => {
    // iterable_audience has batching: true, so the *transform* flag is unconditionally on. The
    // delivery flag has no GA map, so it must still be off.
    const { isBatchingFrameworkEnabled, isBatchingFrameworkDeliveryEnabled } = load();
    expect(isBatchingFrameworkEnabled('iterable_audience', 'ws-1')).toBe(true);
    expect(isBatchingFrameworkDeliveryEnabled('iterable_audience', 'ws-1')).toBe(false);
  });

  it('enables delivery for a named workspace once both flags are set', () => {
    process.env.CUSTOMERIO_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = 'ws-1,ws-2';
    process.env.CUSTOMERIO_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS = 'ws-1';
    const { isBatchingFrameworkDeliveryEnabled } = load();
    expect(isBatchingFrameworkDeliveryEnabled('customerio', 'ws-1')).toBe(true);
    // ws-2 is on the framework transform but has not opted delivery in.
    expect(isBatchingFrameworkDeliveryEnabled('customerio', 'ws-2')).toBe(false);
  });

  it('refuses delivery when the workspace is not on the batching-framework transform', () => {
    // The dangerous case: delivery on, transform off. The payload would have been built by the
    // legacy processRouterDest, so the framework must not interpret its response.
    process.env.CUSTOMERIO_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS = 'ALL';
    const { isBatchingFrameworkDeliveryEnabled } = load();
    expect(isBatchingFrameworkDeliveryEnabled('customerio', 'ws-1')).toBe(false);
  });

  it("honours 'ALL' on both flags", () => {
    process.env.CUSTOMERIO_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = 'ALL';
    process.env.CUSTOMERIO_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS = 'ALL';
    const { isBatchingFrameworkDeliveryEnabled } = load();
    expect(isBatchingFrameworkDeliveryEnabled('customerio', 'any-workspace')).toBe(true);
  });

  it('is case-insensitive on destType and trims workspace ids', () => {
    process.env.CUSTOMERIO_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = 'ws-1';
    process.env.CUSTOMERIO_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS = ' ws-1 , ws-9 ';
    const { isBatchingFrameworkDeliveryEnabled } = load();
    expect(isBatchingFrameworkDeliveryEnabled('CUSTOMERIO', ' ws-1 ')).toBe(true);
  });

  it('treats an empty env var as off', () => {
    process.env.CUSTOMERIO_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS = 'ALL';
    process.env.CUSTOMERIO_BATCHING_FRAMEWORK_DELIVERY_ENABLED_WORKSPACE_IDS = '  ,  ';
    const { isBatchingFrameworkDeliveryEnabled } = load();
    expect(isBatchingFrameworkDeliveryEnabled('customerio', 'ws-1')).toBe(false);
  });
});

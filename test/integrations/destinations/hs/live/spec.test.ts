describe('HubSpot live credential passes', () => {
  const originalLiveSecret = process.env.LIVE_SECRET_HS;

  beforeEach(() => {
    jest.resetModules();
    delete process.env.LIVE_SECRET_HS;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    if (originalLiveSecret === undefined) {
      delete process.env.LIVE_SECRET_HS;
    } else {
      process.env.LIVE_SECRET_HS = originalLiveSecret;
    }
  });

  it('disables the service-key pass with a warning when the key is not configured', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation();

    const { default: live } = await import('./spec');

    expect(live.scenarios).toHaveLength(44);
    expect(live.scenarios.filter((scenario) => scenario.enabled === false)).toHaveLength(22);
    expect(warn).toHaveBeenCalledWith(
      '[live:hs] Skipping service-key scenarios: LIVE_SECRET_HS.config.serviceKeyAccessToken is not configured.',
    );
  });

  it('enables both passes when both credentials are configured', async () => {
    process.env.LIVE_SECRET_HS = JSON.stringify({
      config: {
        accessToken: 'private-app-token',
        serviceKeyAccessToken: 'service-key',
      },
    });
    const warn = jest.spyOn(console, 'warn').mockImplementation();

    const { default: live } = await import('./spec');

    expect(live.scenarios).toHaveLength(44);
    expect(live.scenarios.every((scenario) => scenario.enabled !== false)).toBe(true);
    expect(warn).not.toHaveBeenCalled();
  });
});

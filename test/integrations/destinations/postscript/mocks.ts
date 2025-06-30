export const defaultMockFns = () => {
  // Mock current time for consistent timestamp testing
  return jest.spyOn(Date, 'now').mockReturnValue(new Date('2025-06-20T00:00:00.000Z').valueOf());
};

export const envMock = () => {
  process.env.POSTSCRIPT_PARTNER_API_KEY = 'ps_partner_api_key';

  // Clean up after all tests are done
  afterAll(() => {
    delete process.env.POSTSCRIPT_PARTNER_API_KEY;
  });
};

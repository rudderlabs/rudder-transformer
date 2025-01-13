import config from '../../../../src/cdk/v2/destinations/the_trade_desk/config';

export const defaultMockFns = () => {
  jest.replaceProperty(config, 'MAX_REQUEST_SIZE_IN_BYTES', 250);
};

export const envMock = () => {
  process.env.THE_TRADE_DESK_DATA_PROVIDER_SECRET_KEY = 'mockedDataProviderSecretKey';

  // Clean up after all tests are done
  afterAll(() => {
    delete process.env.THE_TRADE_DESK_DATA_PROVIDER_SECRET_KEY;
  });
};

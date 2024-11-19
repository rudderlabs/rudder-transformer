const { BASE_ENDPOINT, BASE_EU_ENDPOINT, BASE_US2_ENDPOINT, getBaseEndpoint } = require('./config');

describe('getBaseEndpoint method test', () => {
  it('Should return BASE_ENDPOINT when destination.Config.dataCenter is not "EU" or "US2"', () => {
    const Config = {
      dataCenter: 'US',
    };
    const result = getBaseEndpoint(Config);
    expect(result).toBe(BASE_ENDPOINT);
  });

  it('Should return BASE_EU_ENDPOINT when destination.Config.dataCenter is "EU"', () => {
    const Config = {
      dataCenter: 'EU',
    };
    const result = getBaseEndpoint(Config);
    expect(result).toBe(BASE_EU_ENDPOINT);
  });

  it('Should return BASE_US2_ENDPOINT when destination.Config.dataCenter is "US2"', () => {
    const Config = {
      dataCenter: 'US2',
    };
    const result = getBaseEndpoint(Config);
    expect(result).toBe(BASE_US2_ENDPOINT);
  });
});

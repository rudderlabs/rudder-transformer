import { DestHandlerMap } from '../../constants/destinationCanonicalNames';
import defaultFeaturesConfig from '../../features';
import { MiscService } from '../misc';

describe('Misc tests', () => {
  test('should return the right transform', async () => {
    const version = 'v0';

    Object.keys(DestHandlerMap).forEach((key) => {
      expect(MiscService.getDestHandler(key, version)).toEqual(
        require(`../../${version}/destinations/${DestHandlerMap[key]}/transform`),
      );
    });

    expect(MiscService.getDestHandler('am', version)).toEqual(
      require(`../../${version}/destinations/am/transform`),
    );

    expect(MiscService.getSourceHandler('shopify')).toEqual(
      require(`../../sources/shopify/transform`),
    );

    expect(MiscService.getDeletionHandler('intercom', version)).toEqual(
      require(`../../${version}/destinations/intercom/deleteUsers`),
    );
  });

  test('should not use transform aliases for capability-specific handlers', async () => {
    const version = 'v0';

    expect(() => MiscService.getDeletionHandler('ga360', version)).toThrow(
      'destinations/ga360/deleteUsers',
    );
    expect(() => MiscService.getBatchDestinationHandler('webhook_v2')).toThrow(
      'destinations/webhook_v2/routerTransform',
    );
  });
});

describe('Misc | getFeatures', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment variables and module cache before each test
    process.env = { ...originalEnv };
    jest.resetModules();
  });

  afterAll(() => {
    // Restore the original environment variables after all tests
    process.env = originalEnv;
  });

  function getMiscService() {
    // Re-import config and featuresService after environment variables are set
    const { MiscService: miscService } = require('../misc');
    return miscService;
  }

  it('should return the default configuration as a JSON string', () => {
    const miscService = getMiscService();
    const expectedConfig = JSON.stringify(defaultFeaturesConfig);
    const result = miscService.getFeatures();
    expect(result).toBe(expectedConfig);
  });
});

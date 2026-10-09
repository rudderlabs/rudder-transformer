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

  test('should resolve handler aliases for capability-specific handlers', async () => {
    const version = 'v0';

    expect(MiscService.getDeletionHandler('ga360', version)).toEqual(
      require(`../../${version}/destinations/ga/deleteUsers`),
    );
  });

  test('should reject unknown destination names before require', async () => {
    expect(() => MiscService.getDestHandler('not_a_destination', 'v0')).toThrow(
      'Invalid destination: not_a_destination',
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

  it('should return the default configuration with the committed secret paths', () => {
    const miscService = getMiscService();
    const features = miscService.getFeatures();

    expect(features).toBe(JSON.stringify(defaultFeaturesConfig));
    expect(JSON.parse(features).secretPaths).toEqual(defaultFeaturesConfig.secretPaths);
  });
});

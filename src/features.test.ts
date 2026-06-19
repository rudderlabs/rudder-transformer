import {
  destinationCapabilities,
  getBatchingFrameworkGaDestinations,
  getRegulationDestinations,
  getRouterTransformDestinations,
  isDestinationCdkV2Enabled,
} from './features';
import { isValidDestination } from './middlewares/destinationValidation';

describe('features destination capabilities', () => {
  it('derives legacy capability outputs from the consolidated map', () => {
    expect(getRouterTransformDestinations()).toMatchObject({
      SALESFORCE_OAUTH: true,
      SALESFORCE_OAUTH_SANDBOX: true,
      CUSTOM_AUDIENCE: true,
      SURVICATE: true,
    });
    expect(getRegulationDestinations()).toEqual(
      expect.arrayContaining(['BRAZE', 'AM', 'INTERCOM', 'CLEVERTAP']),
    );
    expect(getBatchingFrameworkGaDestinations()).toEqual({
      POSTHOG: true,
      CUSTOM_AUDIENCE: true,
      ITERABLE_AUDIENCE: true,
    });
  });

  it('keeps CDK v2 enablement in the consolidated map', () => {
    expect(isDestinationCdkV2Enabled('webhook')).toBe(true);
    expect(isDestinationCdkV2Enabled('WEBHOOK_V2')).toBe(true);
    expect(isDestinationCdkV2Enabled('am')).toBe(false);
  });

  it('contains only valid destination names', () => {
    expect(
      Object.keys(destinationCapabilities).filter(
        (destination) => !isValidDestination(destination),
      ),
    ).toEqual([]);
  });
});

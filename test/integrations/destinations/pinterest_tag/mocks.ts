import * as featureFlagService from '../../../../src/featureFlagService';

export const mockPinterestAdvertisingDisabled = (_: any) => {
  // Mock the getFeatureFlagService function to return a service that disables Pinterest advertising tracking
  jest.spyOn(featureFlagService, 'getFeatureFlagService').mockResolvedValue({
    isFeatureEnabled: jest.fn().mockResolvedValue({ enabled: false, value: false }),
  } as any);
};

export const mockPinterestAdvertisingEnabled = (_: any) => {
  // Mock the getFeatureFlagService function to return a service that enables Pinterest advertising tracking
  jest.spyOn(featureFlagService, 'getFeatureFlagService').mockResolvedValue({
    isFeatureEnabled: jest.fn().mockResolvedValue({ enabled: true, value: true }),
  } as any);
};

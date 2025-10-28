import * as featureFlagService from '../../../../src/featureFlagService';

export const mockPinterestAdvertisingDisabled = (_: any) => {
  jest.spyOn(featureFlagService, 'createFeatureFlagService').mockResolvedValue({
    isFeatureEnabled: jest.fn().mockResolvedValue({ enabled: false, value: false }),
  } as any);
};

export const mockPinterestAdvertisingEnabled = (_: any) => {
  jest.spyOn(featureFlagService, 'createFeatureFlagService').mockResolvedValue({
    isFeatureEnabled: jest.fn().mockResolvedValue({ enabled: true, value: true }),
  } as any);
};

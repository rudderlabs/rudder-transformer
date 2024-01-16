import config from '../../../../src/v0/destinations/tiktok_ads/config';

export const defaultMockFns = () => {
  
   jest.replaceProperty(config, 'maxBatchSizeV2', 3) 
  };

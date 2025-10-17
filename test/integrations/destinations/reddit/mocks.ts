import config from '../../../../src/cdk/v2/destinations/reddit/config';

export const defaultMockFns = () => {
  jest.replaceProperty(config, 'maxBatchSize', 3 as typeof config.maxBatchSize);
  // Mock Date.now to use October 13, 2023 09:03:17.562 UTC to avoid future timestamp validation errors
  jest.spyOn(Date, 'now').mockReturnValue(new Date('2025-10-13T09:03:17.562Z').valueOf());
};

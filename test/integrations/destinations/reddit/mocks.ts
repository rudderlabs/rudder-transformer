import config from '../../../../src/cdk/v2/destinations/reddit/config';

export const defaultMockFns = () => {
  jest.replaceProperty(config, 'maxBatchSize', 3 as typeof config.maxBatchSize);
};

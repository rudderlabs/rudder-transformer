import * as config from '../../../../src/cdk/v2/destinations/bloomreach/config';

export const defaultMockFns = () => {
  jest.replaceProperty(config, 'MAX_BATCH_SIZE', 3 as typeof config.MAX_BATCH_SIZE);
};

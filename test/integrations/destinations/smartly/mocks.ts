import config from '../../../../src/cdk/v2/destinations/smartly/config';

export const defaultMockFns = () => {
  jest.replaceProperty(config, 'MAX_BATCH_SIZE', 2);
};

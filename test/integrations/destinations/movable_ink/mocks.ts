import config from '../../../../src/cdk/v2/destinations/movable_ink/config';

export const defaultMockFns = () => {
  jest.replaceProperty(config, 'MAX_REQUEST_SIZE_IN_BYTES', 5000);
  jest.replaceProperty(config, 'MAX_BATCH_SIZE', 2);
};

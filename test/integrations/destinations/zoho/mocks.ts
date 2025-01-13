import config from '../../../../src/cdk/v2/destinations/zoho/config';

export const defaultMockFns = () => {
  jest.replaceProperty(config, 'MAX_BATCH_SIZE', 2);
};

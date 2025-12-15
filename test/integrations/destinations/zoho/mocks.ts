import * as config from '../../../../src/cdk/v2/destinations/zoho/config';

export const defaultMockFns = () => {
  jest.replaceProperty(config, 'MAX_BATCH_SIZE', 2);
};

export const deletionBatchMock = () => {
  jest.replaceProperty(config, 'COQL_BATCH_SIZE', 3);
  jest.replaceProperty(config, 'MAX_BATCH_SIZE', 3);
};

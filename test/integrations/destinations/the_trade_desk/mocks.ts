import config from '../../../../src/cdk/v2/destinations/the_trade_desk/config';

export const defaultMockFns = () => {
  jest.replaceProperty(config, 'MAX_REQUEST_SIZE_IN_BYTES', 250);
};

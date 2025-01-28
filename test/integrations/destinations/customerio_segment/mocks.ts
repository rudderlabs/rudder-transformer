import * as config from '../../../../src/v0/destinations/customerio_segment/config';

export const defaultMockFns = () => {
  jest.replaceProperty(config, 'MAX_ITEMS', 3 as typeof config.MAX_ITEMS);
};

import * as config from '../../../../src/cdk/v2/destinations/bloomreach_catalog/config';

export const defaultMockFns = () => {
  jest.replaceProperty(config, 'MAX_ITEMS', 2 as typeof config.MAX_ITEMS);
};

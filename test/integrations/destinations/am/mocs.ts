import config from '../../../../src/v0/destinations/am/config';

export const defaultMockFns = () => {
  jest.replaceProperty(
    config,
    'MAX_USERS_DEVICES_PER_BATCH',
    3 as typeof config.MAX_USERS_DEVICES_PER_BATCH,
  );
};

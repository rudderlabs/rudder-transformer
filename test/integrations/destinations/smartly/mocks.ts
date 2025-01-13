import config from '../../../../src/cdk/v2/destinations/smartly/config';

export const defaultMockFns = () => {
  jest.useFakeTimers().setSystemTime(new Date('2024-02-01'));
  jest.replaceProperty(config, 'MAX_BATCH_SIZE', 2);
};

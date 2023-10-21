import helper from '../../../../src/v0/destinations/google_adwords_offline_conversions/helper';

export const timestampMock = (_, timestampValue: string = '2019-10-14 16:45:18+05:30') => {
  jest.spyOn(helper, 'formatTimestamp').mockImplementation((_v) => {
    return timestampValue;
  });
};

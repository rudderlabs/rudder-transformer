const moment = require('moment-timezone');
const { formatTimestamp } = require('./helper');

describe('google adwords offline conversions - helper', () => {
  it('should correctly format to IST', () => {
    moment.tz.setDefault('Asia/Calcutta');
    expect(formatTimestamp('2019-10-14 11:15:18.299Z')).toEqual('2019-10-14 16:45:18+05:30');
  });
  it('should correctly format to UTC', () => {
    moment.tz.setDefault('UTC');
    expect(formatTimestamp('2019-10-14 11:15:18.299Z')).toEqual('2019-10-14 11:15:18+00:00');
  });
  it('should return "Invalid date" when a string not in date-format is sent as argument', () => {
    expect(formatTimestamp('abc')).toEqual('Invalid date');
  });
  it('should return offset value correctly when number is passed', () => {
    moment.tz.setDefault('Asia/Tokyo');
    expect(formatTimestamp(11245)).toEqual('1970-01-01 09:00:11+09:00');
  });
  it('should return current date when a value not string is sent as argument', () => {
    moment.tz.setDefault('UTC');
    const spy = jest.spyOn(Date, 'now').mockReturnValue('2023-10-22 12:51:30+00:00');
    expect(formatTimestamp([])).toEqual('2023-10-22 12:51:30+00:00');
    expect(formatTimestamp({})).toEqual('2023-10-22 12:51:30+00:00');
    expect(formatTimestamp(undefined)).toEqual('2023-10-22 12:51:30+00:00');
    spy.mockClear();
  });
  it('should return "Invalid date" when null value is passed as argument', () => {
    expect(formatTimestamp(null)).toEqual('Invalid date');
  });
});

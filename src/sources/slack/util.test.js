const { tsToISODate, normalizeEventName } = require('./util.js');

describe('Unit test cases for tsToISODate', () => {
  it('should return a valid iso date string for a valid slack timestamp input', () => {
    const result = tsToISODate('1609459200.123000');
    expect(result).toBe('2021-01-01T00:00:00.123Z');
  });

  it('should return iso date string of today when slack timestamp argument is not provided', () => {
    const result = tsToISODate();
    expect(result).not.toBeNull();
    expect(typeof result).toBe('string');
    expect(result).not.toHaveLength(0);
    // Check if the result is a valid date
    const dateObject = new Date(result);
    const resultTime = dateObject.getTime();
    expect(resultTime).not.toBeNaN();
    // Check if the result is close to the current time with precision tolerance of upto a minute
    const nowTime = new Date().getTime();
    const TOLERANCE = 60000; // In ms
    const timeDiff = Math.abs(nowTime - resultTime);
    expect(timeDiff).toBeLessThanOrEqual(TOLERANCE);
  });

  it('should return null if the slack timestamp argument is invalid', () => {
    const result = tsToISODate('invalid.slack.timestamp');
    expect(result).toBeNull();
  });
});

describe('Unit test cases for normalizeEventName', () => {
  it('should normalize a valid snake case string "member_joined_channel" to RudderStack format "Member Joined Channel"', () => {
    const result = normalizeEventName('member_joined_channel');
    expect(result).toBe('Member Joined Channel');
  });

  it('should return undefined string when event name is undefined', () => {
    const result = normalizeEventName(undefined);
    expect(result).toBe('undefined');
  });

  it('should return undefined string when event name is null', () => {
    const result = normalizeEventName(null);
    expect(result).toBe('undefined');
  });

  it('should return undefined string when event name argument cannot be parsed to string', () => {
    const result = normalizeEventName({});
    expect(result).toBe('undefined');
  });
});

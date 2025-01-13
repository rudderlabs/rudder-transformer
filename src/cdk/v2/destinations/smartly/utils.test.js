const moment = require('moment');
const { verifyAdInteractionTime } = require('./utils');

describe('verifyAdInteractionTime', () => {
  it('should pass when adInteractionTime is 2 years in the past (UNIX timestamp)', () => {
    // 2 years ago from now
    const adInteractionTime = moment().subtract(2, 'years').unix();
    expect(() => verifyAdInteractionTime(adInteractionTime)).not.toThrow();
  });

  it('should pass when adInteractionTime is 10 months in the future (UNIX timestamp)', () => {
    // 10 months in the future from now
    const adInteractionTime = moment().add(10, 'months').unix();
    expect(() => verifyAdInteractionTime(adInteractionTime)).not.toThrow();
  });

  it('should fail when adInteractionTime is 4 years in the past (UNIX timestamp)', () => {
    // 4 years ago from now
    const adInteractionTime = moment().subtract(4, 'years').unix();
    expect(() => verifyAdInteractionTime(adInteractionTime)).toThrow(
      'ad_interaction_time must be within one year in the future and three years in the past.',
    );
  });

  it('should fail when adInteractionTime is 2 years in the future (UNIX timestamp)', () => {
    // 2 years in the future from now
    const adInteractionTime = moment().add(2, 'years').unix();
    expect(() => verifyAdInteractionTime(adInteractionTime)).toThrow(
      'ad_interaction_time must be within one year in the future and three years in the past.',
    );
  });

  it('should pass when adInteractionTime is exactly 1 year in the future (UTC date string)', () => {
    // Exactly 1 year in the future from now
    const adInteractionTime = moment.utc().add(1, 'year').toISOString();
    expect(() => verifyAdInteractionTime(adInteractionTime)).toThrow();
  });

  it('should fail when adInteractionTime is 4 years in the past (UTC date string)', () => {
    // 4 years ago from now
    const adInteractionTime = moment.utc().subtract(4, 'years').toISOString();
    expect(() => verifyAdInteractionTime(adInteractionTime)).toThrow(
      'ad_interaction_time must be within one year in the future and three years in the past.',
    );
  });

  it('should fail when adInteractionTime is 2 years in the future (UTC date string)', () => {
    // 2 years in the future from now
    const adInteractionTime = moment.utc().add(2, 'years').toISOString();
    expect(() => verifyAdInteractionTime(adInteractionTime)).toThrow(
      'ad_interaction_time must be within one year in the future and three years in the past.',
    );
  });

  it('should not throw an error if adInteractionTime is null or undefined', () => {
    expect(() => verifyAdInteractionTime(null)).not.toThrow();
    expect(() => verifyAdInteractionTime(undefined)).not.toThrow();
  });
});

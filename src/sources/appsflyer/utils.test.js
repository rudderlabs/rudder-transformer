const { getAdvertisingId } = require('./utils');

describe('getAdvertisingId', () => {
  const testCases = [
    {
      name: 'should return idfa for iOS device',
      event: {
        platform: 'iOS',
        idfa: 'ios-advertising-id-123',
        android_id: 'not-this-one',
      },
      expected: 'ios-advertising-id-123',
    },
    {
      name: 'should return idfa for iPadOS device',
      event: {
        platform: 'iPadOS',
        idfa: 'ipad-advertising-id-456',
        android_id: 'not-this-one',
      },
      expected: 'ipad-advertising-id-456',
    },
    {
      name: 'should return android_id for Android device',
      event: {
        platform: 'Android',
        idfa: 'not-this-one',
        android_id: 'android-advertising-id-789',
      },
      expected: 'android-advertising-id-789',
    },
    {
      name: 'should return null for unknown platform',
      event: {
        platform: 'Windows',
        idfa: 'some-id',
        android_id: 'some-other-id',
      },
      expected: null,
    },
    {
      name: 'should return null when platform is missing',
      event: {
        idfa: 'some-id',
        android_id: 'some-other-id',
      },
      expected: null,
    },
  ];

  testCases.forEach(({ name, event, expected }) => {
    it(name, () => {
      expect(getAdvertisingId(event)).toBe(expected);
    });
  });
});

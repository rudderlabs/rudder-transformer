const { deduceTokenType } = require('./utils');

describe('deduceTokenType', () => {
  // deduces token type from integration object when valid token type is present
  it('should return the token type from integration object when it is valid', () => {
    const message = {
      integrations: {
        clevertap: {
          deviceTokenType: 'fcm',
        },
      },
    };
    const deviceOS = 'android';
    const result = deduceTokenType(message, deviceOS);
    expect(result).toBe('fcm');
  });

  // handles null or undefined message input gracefully
  it('should return default token type based on deviceOS when message is null', () => {
    const message = null;
    const deviceOS = 'android';
    const result = deduceTokenType(message, deviceOS);
    expect(result).toBe('fcm');
  });

  // returns 'fcm' when deviceOS is 'android' and no valid token type is present
  it("should return 'fcm' when deviceOS is 'android' and no valid token type is present", () => {
    const message = { integrations: { clevertap: { deviceTokenType: null } } };
    const result = deduceTokenType(message, 'android');
    expect(result).toBe('fcm');
  });

  // returns 'apns' when deviceOS is not 'android' and no valid token type is present
  it("should return 'apns' when deviceOS is not 'android' and no valid token type is present", () => {
    const message = { integrations: { clevertap: { deviceTokenType: null } } };
    const result = deduceTokenType(message, 'ios');
    expect(result).toBe('apns');
  });

  // handles null or undefined deviceOS input gracefully
  it('should return default token type when deviceOS is null', () => {
    const message = {};
    const deviceOS = null;
    const result = deduceTokenType(message, deviceOS);
    expect(result).toEqual('apns');
  });

  // handles empty integration object in message
  it('should return default token type when integration object is empty', () => {
    const message = { integrations: {} };
    const deviceOS = 'ios';
    const result = deduceTokenType(message, deviceOS);
    expect(result).toEqual('apns');
  });

  // handles integration object with invalid token type
  it('should return default token type when integration object has an invalid token type', () => {
    const message = { integrations: { clevertap: { deviceTokenType: 'invalidType' } } };
    const deviceOS = 'ios';
    const result = deduceTokenType(message, deviceOS);
    expect(result).toEqual('apns');
  });

  // handles integration object with no token type
  it('should return default token type when integration object has no token type', () => {
    const message = { integrations: { clevertap: {} } };
    const deviceOS = 'android';
    const result = deduceTokenType(message, deviceOS);
    expect(result).toEqual('fcm');
  });

  // verifies integration object retrieval with 'clevertap' as destination name
  it('should retrieve correct device token type for CleverTap destination', () => {
    const message = { integrations: { clevertap: { deviceTokenType: 'fcm' } } };
    const deviceOS = 'ios';
    const result = deduceTokenType(message, deviceOS);
    expect(result).toBe('fcm');
  });

  // checks for case sensitivity in deviceOS values
  it('should handle case sensitivity in deviceOS values', () => {
    const message = { integrations: { clevertap: { deviceTokenType: 'fcm' } } };
    const deviceOS = 'Android';
    const result = deduceTokenType(message, deviceOS);
    expect(result).toBe('fcm');
  });
});

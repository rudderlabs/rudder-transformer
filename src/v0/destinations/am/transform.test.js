const { process } = require('./transform');

const destination = {
  ID: '2HMA5LQopuVYs8sCJEvXYYim38M',
  Name: 'Amplitude',
  DestinationDefinition: { Name: 'AM' },
  Config: {
    apiKey: 'test-api-key',
    residencyServer: 'standard',
  },
  Enabled: true,
};

const buildIdentify = (traits) => ({
  message: {
    type: 'identify',
    userId: 'user-1',
    anonymousId: 'anon-1',
    context: { traits },
    timestamp: '2026-09-02T17:51:13.000Z',
  },
  destination,
});

describe('AM userPropertiesHandler - prototype-reserved trait keys', () => {
  // Reproduces the production crash reported by Bugsnag: a trait literally named
  // `constructor` was passed straight into `set-value`, which throws
  // `Cannot set unsafe key: "constructor"` and surfaces as a retryable 500.
  it.each(['constructor', '__proto__', 'prototype'])(
    'does not throw when traits contain a reserved key "%s"',
    (reservedKey) => {
      const input = buildIdentify({ email: 'a@b.com', [reservedKey]: 'boom' });

      expect(() => process(input)).not.toThrow();
    },
  );

  it('drops the reserved trait but keeps the remaining user properties', () => {
    const input = buildIdentify({ email: 'a@b.com', plan: 'pro', constructor: 'boom' });

    const [{ body }] = process(input);
    const [event] = body.JSON.events;

    expect(event.user_properties).toMatchObject({ email: 'a@b.com', plan: 'pro' });
    expect(Object.prototype.hasOwnProperty.call(event.user_properties, 'constructor')).toBe(false);
  });

  it('does not pollute Object.prototype via a __proto__ trait', () => {
    // JSON.parse creates `__proto__` as a real own property rather than invoking the
    // setter, which is exactly how such a trait reaches us off the wire.
    const traits = JSON.parse('{"email":"a@b.com","__proto__":{"polluted":"yes"}}');
    const input = buildIdentify(traits);

    expect(() => process(input)).not.toThrow();
    expect({}.polluted).toBeUndefined();
  });

  it('drops a nested reserved key such as "address.constructor"', () => {
    const input = buildIdentify({ email: 'a@b.com', 'address.constructor': 'boom' });

    expect(() => process(input)).not.toThrow();
  });

  it('does not throw when a group call carries a reserved group_type', () => {
    const input = {
      message: {
        type: 'group',
        userId: 'user-1',
        groupId: 'group-1',
        integrations: {
          Amplitude: { groups: { group_type: 'constructor', group_value: 'acme' } },
        },
        timestamp: '2026-09-02T17:51:13.000Z',
      },
      destination,
    };

    expect(() => process(input)).not.toThrow();
  });
});

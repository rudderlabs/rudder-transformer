import { InstrumentationError } from '@rudderstack/integrations-lib';

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

describe('AM userPropertiesHandler - trait keys that set-value refuses to write', () => {
  // Reproduces the production crash reported by Bugsnag: a trait literally named
  // `constructor` was passed straight into `set-value`, which threw
  // `Cannot set unsafe key: "constructor"`. That plain Error was classified as a
  // retryable 500, so the job was retried until its TTL even though the payload could
  // never succeed. It is now an InstrumentationError, which aborts as a 4xx.
  it.each(['constructor', '__proto__', 'prototype'])(
    'raises an InstrumentationError for a trait named "%s"',
    (reservedKey) => {
      const input = buildIdentify({ email: 'a@b.com', [reservedKey]: 'boom' });

      expect(() => process(input)).toThrow(InstrumentationError);
    },
  );

  it('reports the offending key path in the error message', () => {
    const input = buildIdentify({ email: 'a@b.com', constructor: 'boom' });

    expect(() => process(input)).toThrow(/user_properties\.constructor/);
    expect(() => process(input)).toThrow(/Cannot set unsafe key: "constructor"/);
  });

  it('raises an InstrumentationError for a nested reserved key such as "address.constructor"', () => {
    const input = buildIdentify({ email: 'a@b.com', 'address.constructor': 'boom' });

    expect(() => process(input)).toThrow(InstrumentationError);
  });

  it('raises an InstrumentationError for a group call with a reserved group_type', () => {
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

    expect(() => process(input)).toThrow(InstrumentationError);
  });

  it('leaves ordinary traits alone', () => {
    const input = buildIdentify({ email: 'a@b.com', plan: 'pro', tier: 'gold' });

    const [{ body }] = process(input);
    const [event] = body.JSON.events;

    expect(event.user_properties).toMatchObject({
      email: 'a@b.com',
      plan: 'pro',
      tier: 'gold',
    });
  });

  it('does not pollute Object.prototype via a __proto__ trait', () => {
    // JSON.parse creates `__proto__` as a real own property rather than invoking the
    // setter, which is exactly how such a trait reaches us off the wire.
    const traits = JSON.parse('{"email":"a@b.com","__proto__":{"polluted":"yes"}}');

    expect(() => process(buildIdentify(traits))).toThrow(InstrumentationError);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });
});

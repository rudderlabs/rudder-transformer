const { process } = require('./transform');

const destination = {
  ID: 'fb-1',
  Name: 'Facebook App Events',
  DestinationDefinition: { Name: 'FB' },
  Config: { appID: '123456789', appSecret: 'secret' },
  Enabled: true,
};

const buildTrack = (properties) => ({
  message: {
    type: 'track',
    event: 'Test Event',
    userId: 'user-1',
    properties,
    context: {
      device: { type: 'ios', token: 'token', advertisingId: 'adv-id', id: 'device-id' },
      os: { name: 'iOS', version: '14.0' },
      screen: { width: 100, height: 200, density: 2 },
      app: { namespace: 'com.example', build: '1', version: '1.0' },
      network: { carrier: 'carrier' },
      locale: 'en-US',
      traits: {},
    },
    timestamp: '2026-09-02T17:51:13.000Z',
  },
  destination,
});

describe('FB - property keys that collide with Object.prototype', () => {
  // `eventPropsToPathMapping[k]` walked the prototype chain for a customer-supplied key:
  // eventPropsToPathMapping['constructor'] returns Object itself, which is truthy, and the
  // code then called `.includes` on it. Separate from the set-value crash, same trigger.
  it.each(['constructor', 'toString', 'valueOf', 'hasOwnProperty'])(
    'does not throw on a property named "%s"',
    (key) => {
      const input = buildTrack(JSON.parse(`{"a": 1, ${JSON.stringify(key)}: "boom"}`));

      expect(() => process(input)).not.toThrow();
    },
  );

  it('still maps a genuinely mapped property', () => {
    const input = buildTrack({ revenue: 10, currency: 'USD' });

    expect(() => process(input)).not.toThrow();
  });
});

import { InstrumentationError } from '@rudderstack/integrations-lib';

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

describe('FB - property keys that set-value refuses to write', () => {
  it('raises an InstrumentationError rather than a 500 for a "prototype" property', () => {
    const input = buildTrack(JSON.parse('{"a": 1, "prototype": "boom"}'));

    expect(() => process(input)).toThrow(InstrumentationError);
    expect(() => process(input)).toThrow(/Cannot set unsafe key: "prototype"/);
  });

  it('leaves ordinary properties alone', () => {
    const input = buildTrack({ a: 1, revenue: 10, currency: 'USD' });

    expect(() => process(input)).not.toThrow();
  });
});

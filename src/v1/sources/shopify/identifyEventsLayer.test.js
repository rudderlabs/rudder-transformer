const { identifyLayer } = require('./identifyEventsLayer');
const Message = require('../../../v0/sources/message');

describe('identifyPayloadBuilder', () => {
  // The function should create a new Message object with the INTEGRATION constant as a parameter.
  it('should create a new Message object w.r.t. shopify', () => {
    const event = {};
    const message = identifyLayer.identifyPayloadBuilder(event);
    expect(message).toBeInstanceOf(Message);
    expect(JSON.stringify(message.integrations)).toBe(JSON.stringify({ SHOPIFY: false }));
  });
});

const { InstrumentationError } = require('@rudderstack/integrations-lib');
const { validatePayload } = require('./util');

describe('validatePayload', () => {
  // When payload is valid and contains relevant fields and currency
  it('should validate payload when it is valid and contains relevant fields and currency', () => {
    const payload = {
      objectData: [
        { price: 10, quantity: 2, discount: 0.1 },
        { price: 20, quantity: 1, discount: 0 },
      ],
      currency: 'USD',
    };

    expect(() => validatePayload(payload)).not.toThrow();
  });

  // When payload contains objects with missing relevant fields
  it('should throw an error when payload contains objects with missing relevant fields', () => {
    const payload = {
      objectData: [
        { price: 10, quantity: 2 },
        { price: 20, discount: 0 },
      ],
    };

    expect(() => validatePayload(payload)).toThrow(InstrumentationError);
  });

  // When payload is valid and contains relevant fields but no currency
  it('should throw an InstrumentationError when currency is missing', () => {
    const payload = {
      objectData: [
        { price: 10, quantity: 2, discount: 0.1 },
        { price: 20, quantity: 1, discount: 0 },
      ],
    };

    expect(() => validatePayload(payload)).toThrow(InstrumentationError);
  });

  // When payload is valid but does not contain relevant fields
  it('should not throw an error when payload does not contain relevant fields', () => {
    const payload = {
      objectData: [{ position: 'Product A' }, { position: 'Product B' }],
      currency: 'USD',
    };

    expect(() => validatePayload(payload)).not.toThrow();
  });

  // When payload is empty
  it('should not throw an error when payload is empty', () => {
    const payload = {};

    expect(() => validatePayload(payload)).not.toThrow();
  });
});

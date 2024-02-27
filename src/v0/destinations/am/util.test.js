const { getUnsetObj, validateEventType } = require('./utils');

describe('getUnsetObj', () => {
  it("should return undefined when 'message.integrations.Amplitude.fieldsToUnset' is not array", () => {
    const message = {
      integrations: {
        Amplitude: { fieldsToUnset: 'field_name' },
      },
    };
    const result = getUnsetObj(message);
    expect(result).toBeUndefined();
  });
  it("should return undefined when 'message.integrations.Amplitude.fieldsToUnset' is undefined", () => {
    const message = {
      integrations: {
        Amplitude: {},
      },
    };
    const result = getUnsetObj(message);
    expect(result).toBeUndefined();
  });

  it("should return an empty objecty when 'message.integrations.Amplitude.fieldsToUnset' is an empty array", () => {
    const message = {
      integrations: {
        Amplitude: { fieldsToUnset: [] },
      },
    };
    const result = getUnsetObj(message);
    expect(result).toEqual({});
  });

  it("should return an object with keys and values set to '-' when 'message.integrations.Amplitude.fieldsToUnset' is an array of strings", () => {
    const message = {
      integrations: {
        Amplitude: { fieldsToUnset: ['Unset1', 'Unset2'] },
      },
    };
    const result = getUnsetObj(message);
    expect(result).toEqual({
      Unset1: '-',
      Unset2: '-',
    });
  });

  it("should handle missing 'message' parameter", () => {
    const result = getUnsetObj();
    expect(result).toBeUndefined();
  });

  // Should handle missing 'integrations' property in 'message' parameter
  it("should handle missing 'integrations' property in 'message' parameter", () => {
    const message = {};
    const result = getUnsetObj(message);
    expect(result).toBeUndefined();
  });

  // Should handle missing 'Amplitude' property in 'message.integrations' parameter
  it("should handle missing 'Amplitude' property in 'message.integrations' parameter", () => {
    const message = {
      integrations: {},
    };
    const result = getUnsetObj(message);
    expect(result).toBeUndefined();
  });
});

describe('validateEventType', () => {
  it('should validate event type when it is valid with only page name given', () => {
    expect(() => {
      validateEventType('Home Page');
    }).not.toThrow();
  });

  it('should throw an error when event type is null', () => {
    expect(() => {
      validateEventType(null);
    }).toThrow(
      'Event type is missing. Please send it under `event.type`. For page/screen events, send it under `event.name`',
    );
  });

  it('should throw an error when event type is undefined', () => {
    expect(() => {
      validateEventType(undefined);
    }).toThrow(
      'Event type is missing. Please send it under `event.type`. For page/screen events, send it under `event.name`',
    );
  });

  // Function receives an empty string as event type
  it('should throw an error when event type is an empty string', () => {
    expect(() => {
      validateEventType('');
    }).toThrow(
      'Event type is missing. Please send it under `event.type`. For page/screen events, send it under `event.name`',
    );
  });
});

const { getUnsetObj } = require('./utils');

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

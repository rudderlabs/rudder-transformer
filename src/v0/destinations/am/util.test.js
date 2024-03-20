const {
  getUnsetObj,
  validateEventType,
  userPropertiesPostProcess,
  updateWithSkipAttribute,
} = require('./utils');

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

describe('userPropertiesPostProcess', () => {
  // The function correctly removes duplicate keys found in both operation keys and root level keys.
  it('should remove duplicate keys from user_properties', () => {
    // Arrange
    const rawPayload = {
      user_properties: {
        $setOnce: {
          key1: 'value1',
        },
        $add: {
          key2: 'value2',
        },
        key3: 'value3',
        key1: 'value4',
      },
    };

    // Act
    const result = userPropertiesPostProcess(rawPayload);

    // Assert
    expect(result.user_properties).toEqual({
      $setOnce: {
        key1: 'value1',
      },
      $add: {
        key2: 'value2',
      },
      $set: {
        key3: 'value3',
      },
    });
  });

  // The function correctly moves root level properties to $set operation.
  it('should move root level properties to $set operation when they dont belong to any other operation', () => {
    // Arrange
    const rawPayload = {
      user_properties: {
        $setOnce: {
          key1: 'value1',
        },
        $add: {
          key2: 'value2',
        },
        key3: 'value3',
      },
    };

    // Act
    const result = userPropertiesPostProcess(rawPayload);

    // Assert
    expect(result.user_properties).toEqual({
      $set: {
        key3: 'value3',
      },
      $setOnce: {
        key1: 'value1',
      },
      $add: {
        key2: 'value2',
      },
    });
  });
});

describe('updateWithSkipAttribute', () => {
  // when 'skipUserPropertiesSync ' is present in 'integrations.Amplitude', return the original payload.
  it("should return the original payload when 'skipUserPropertiesSync' is present", () => {
    const message = { integrations: { Amplitude: { skipUserPropertiesSync: true } } };
    const payload = { key: 'value' };
    const expectedPayload = { key: 'value', $skip_user_properties_sync: true };
    updateWithSkipAttribute(message, payload);
    expect(expectedPayload).toEqual(payload);
  });

  // When 'skipUserPropertiesSync' is not present in 'integrations.Amplitude', return the original payload.
  it("should return the original payload when 'skipUserPropertiesSync' is not present", () => {
    const message = { integrations: { Amplitude: {} } };
    const payload = { key: 'value' };
    const expectedPayload = { key: 'value' };
    updateWithSkipAttribute(message, payload);
    expect(payload).toEqual(expectedPayload);
  });
  // When 'message' is null, return null.
  it("should return null when 'message' is null", () => {
    const message = null;
    const payload = { key: 'value' };
    const expectedPayload = { key: 'value' };
    updateWithSkipAttribute(message, payload);
    expect(payload).toEqual(expectedPayload);
  });
});

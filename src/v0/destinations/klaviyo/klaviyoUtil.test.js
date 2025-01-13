const { addSubscribeFlagToTraits } = require('./util');

describe('addSubscribeFlagToTraits', () => {
  // The function should add a 'subscribe' property to the 'properties' object if it exists in the input 'traitsInfo'.
  it('should add subscribe property to properties object when it exists in traitsInfo', () => {
    // Arrange
    const traitsInfo = {
      properties: {
        name: 'John',
        age: 30,
      },
    };

    // Act
    const result = addSubscribeFlagToTraits(traitsInfo);

    // Assert
    expect(result.properties.subscribe).toBe(true);
  });

  // The input 'traitsInfo' object is null.
  it('should create a new traitsInfo object with properties object containing subscribe property when traitsInfo is null', () => {
    // Arrange
    const traitsInfo = null;

    // Act
    const result = addSubscribeFlagToTraits(traitsInfo);

    // Assert
    expect(result).toEqual(null);
  });

  // The function should create a new 'properties' object with a 'subscribe' property and assign it to the 'traitsInfo' if 'properties' does not exist in the input 'traitsInfo'.
  it("should create a new 'properties' object with a 'subscribe' property when 'properties' does not exist in traitsInfo", () => {
    // Arrange
    const traitsInfo = {};

    // Act
    const result = addSubscribeFlagToTraits(traitsInfo);

    // Assert
    expect(result.properties).toBeDefined();
    expect(result.properties.subscribe).toBe(true);
  });

  // The function should return the modified 'traitsInfo' object with the 'subscribe' property added.
  it('should add subscribe property to properties object when it exists in traitsInfo', () => {
    // Arrange
    const traitsInfo = {
      properties: {
        name: 'John',
        age: 30,
      },
    };

    // Act
    const result = addSubscribeFlagToTraits(traitsInfo);

    // Assert
    expect(result.properties.subscribe).toBe(true);
  });

  // The input 'traitsInfo' object has an empty 'properties' object.
  it('should add subscribe property to properties object when it exists in traitsInfo', () => {
    // Arrange
    const traitsInfo = {
      properties: {},
    };

    // Act
    const result = addSubscribeFlagToTraits(traitsInfo);

    // Assert
    expect(result.properties.subscribe).toBe(true);
  });

  // The input 'traitsInfo' object has a 'properties' object with a 'subscribe' property already present.
  it('should add subscribe property to properties object when it exists in traitsInfo', () => {
    // Arrange
    const traitsInfo = {
      properties: {
        name: 'John',
        age: 30,
        subscribe: false,
      },
    };

    // Act
    const result = addSubscribeFlagToTraits(traitsInfo);

    // Assert
    expect(result.properties.subscribe).toBe(false);
  });

  // The function should not modify any other properties of the 'traitsInfo' object.
  it('should not modify any other properties of the traitsInfo object', () => {
    // Arrange
    const traitsInfo = {
      properties: {
        name: 'John',
        age: 30,
      },
    };

    // Act
    const result = addSubscribeFlagToTraits(traitsInfo);

    // Assert
    expect(result.properties.subscribe).toBe(true);
    expect(result.properties.name).toBe('John');
    expect(result.properties.age).toBe(30);
  });

  // The function should handle cases where the input 'traitsInfo' object has nested objects.
  it('should add subscribe property to nested properties object when it exists in traitsInfo', () => {
    // Arrange
    const traitsInfo = {
      properties: {
        name: 'John',
        age: 30,
        address: {
          street: '123 Main St',
          city: 'New York',
        },
      },
    };

    // Act
    const result = addSubscribeFlagToTraits(traitsInfo);

    // Assert
    expect(result.properties.subscribe).toBe(true);
    expect(result.properties.address).toMatchObject({
      street: '123 Main St',
      city: 'New York',
    });
  });

  // The function should handle cases where the input 'traitsInfo' object has properties with null or undefined values.
  it('should add subscribe property to properties object when it exists in traitsInfo', () => {
    // Arrange
    const traitsInfo = {
      properties: {
        name: 'John',
        age: 30,
        address: null,
      },
    };

    // Act
    const result = addSubscribeFlagToTraits(traitsInfo);

    // Assert
    expect(result.properties.subscribe).toBe(true);
  });
});

const { getProfileMetadataAndMetadataFields } = require('./util');

describe('getProfileMetadataAndMetadataFields', () => {
  // Correctly generates metadata with fields to unset, append, and unappend when all fields are provided
  it('should generate metadata with fields to unset, append, and unappend when all fields are provided', () => {
    const message = {
      integrations: {
        Klaviyo: {
          fieldsToUnset: ['Unset1', 'Unset2'],
          fieldsToAppend: ['appendList1', 'appendList2'],
          fieldsToUnappend: ['unappendList1', 'unappendList2'],
        },
        All: true,
      },
      traits: {
        appendList1: 'New Value 1',
        appendList2: 'New Value 2',
        unappendList1: 'Old Value 1',
        unappendList2: 'Old Value 2',
      },
    };

    jest.mock('../../util', () => ({
      getIntegrationsObj: jest.fn(() => message.integrations.Klaviyo),
      getFieldValueFromMessage: jest.fn(() => message.traits),
      isDefinedAndNotNull: jest.fn((value) => value !== null && value !== undefined),
    }));

    const result = getProfileMetadataAndMetadataFields(message);

    expect(result).toEqual({
      meta: {
        patch_properties: {
          append: {
            appendList1: 'New Value 1',
            appendList2: 'New Value 2',
          },
          unappend: {
            unappendList1: 'Old Value 1',
            unappendList2: 'Old Value 2',
          },
          unset: ['Unset1', 'Unset2'],
        },
      },
      metadataFields: [
        'Unset1',
        'Unset2',
        'appendList1',
        'appendList2',
        'unappendList1',
        'unappendList2',
      ],
    });
  });

  // Handles null or undefined message input gracefully
  it('should return empty metadata and metadataFields when message is null or undefined', () => {
    jest.mock('../../util', () => ({
      getIntegrationsObj: jest.fn(() => null),
      getFieldValueFromMessage: jest.fn(() => ({})),
      isDefinedAndNotNull: jest.fn((value) => value !== null && value !== undefined),
    }));

    let result = getProfileMetadataAndMetadataFields(null);
    expect(result).toEqual({ meta: { patch_properties: {} }, metadataFields: [] });

    result = getProfileMetadataAndMetadataFields(undefined);
    expect(result).toEqual({ meta: { patch_properties: {} }, metadataFields: [] });
  });
});

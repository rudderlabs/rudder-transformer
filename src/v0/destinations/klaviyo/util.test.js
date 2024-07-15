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

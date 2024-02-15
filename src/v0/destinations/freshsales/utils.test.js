const { populatePayloadWithCustomFields } = require('./utils');

describe('populatePayloadWithCustomFields', () => {
  it('Mapping config is empty', () => {
    const message = {
      traits: {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        newProp: 'newPropValue',
      },
    };
    const customPropertyMapping = [{ from: 'newProp', to: 'cf_newProp' }];
    const payload = {};
    const MAPPING_CONFIG = [];

    const result = populatePayloadWithCustomFields(
      message,
      customPropertyMapping,
      payload,
      MAPPING_CONFIG,
    );

    expect(result).toEqual({
      custom_field: {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        cf_newProp: 'newPropValue',
      },
    });
  });

  it('should exclude specified fields from being added as custom fields', () => {
    const message = {
      traits: {
        email: 'test@example.com',
        first_name: 'John',
        lastName: 'Doe',
        newProp: 'newPropValue',
      },
    };
    const customPropertyMapping = [{ from: 'newProp', to: 'cf_newProp' }];
    const payload = {};
    const MAPPING_CONFIG = [
      { destKey: 'first_name', sourceKeys: 'firstName', sourceFromGenericMap: true },
      { destKey: 'email', sourceKeys: 'email', sourceFromGenericMap: true },
    ];

    const result = populatePayloadWithCustomFields(
      message,
      customPropertyMapping,
      payload,
      MAPPING_CONFIG,
    );

    expect(result).toEqual({
      custom_field: {
        cf_newProp: 'newPropValue',
        lastName: 'Doe',
      },
    });
  });

  it('should not overwrite existing payload data', () => {
    const message = {
      traits: {
        firstName: 'John',
      },
    };
    const customPropertyMapping = [{ from: 'firstName', to: 'first_name' }];
    const initialPayload = {
      existingField: 'existingValue',
    };
    const MAPPING_CONFIG = [];

    const result = populatePayloadWithCustomFields(
      message,
      customPropertyMapping,
      initialPayload,
      MAPPING_CONFIG,
    );

    expect(result).toEqual({
      existingField: 'existingValue',
      custom_field: {
        first_name: 'John',
      },
    });
  });
});

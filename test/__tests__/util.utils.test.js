const { constructValidationErrors } = require("../../src/util/utils");

describe('constructValidationErrors', () => {
  const validationErrorsInput = [
    {
      type: 'Unplanned-Event',
      message: 'schema not found for event: Product Viewed',
      meta: {},
    },
    {
      type: 'Datatype-Mismatch',
      message: 'must be number',
      meta: {
        instancePath: '/properties/price',
        schemaPath: '#/properties/properties/properties/price/type',
      },
    },
    {
      type: 'Datatype-Mismatch',
      message: 'must be string',
      meta: {
        instancePath: '/properties/product_id',
        schemaPath: '#/properties/properties/properties/product_id/type',
      },
    },
    {
      type: 'Additional-Properties',
      message: 'must NOT have additional properties : sku_id',
      property: 'sku_id',
      meta: {
        instancePath: '/properties',
        schemaPath: '#/properties/properties/additionalProperties',
      },
    },
    {
      type: 'Required-Missing',
      message: "must have required property 'product_id'",
      property: 'product_id',
      meta: {
        instancePath: '/properties',
        schemaPath: '#/properties/properties/required',
      },
    },
  ]
  const expectedOutput = {
    'Unplanned-Event': [{ message: 'schema not found for event: Product Viewed' }],
    'Datatype-Mismatch': [
      {
        message: 'must be number',
        schemaPath: '#/properties/properties/properties/price/type',
      },
      {
        message: 'must be string',
        schemaPath: '#/properties/properties/properties/product_id/type',
      },
    ],
    'Additional-Properties': [
      {
        property: 'sku_id',
        message: 'must NOT have additional properties : sku_id',
        schemaPath: '#/properties/properties/additionalProperties',
      },
    ],
    'Required-Missing': [
      {
        property: 'product_id',
        message: "must have required property 'product_id'",
        schemaPath: '#/properties/properties/required',
      },
    ],
  };

  it('should return formatted validation error object', () => {
    const output = constructValidationErrors(validationErrorsInput);
    expect(output).toEqual(expectedOutput);
  });
});
const { constructValidationErrors, responseStatusHandler } = require("../../src/util/utils");

describe('responseStatusHandler', () => {
  it('does not throw on 200', () => {
    expect(() => responseStatusHandler(200, 'Transformation', 'v1', 'url')).not.toThrow();
  });

  it('throws a retriable 809 on 401 (config backend auth failure), so the event is retried not dropped', () => {
    try {
      responseStatusHandler(401, 'Transformation', 'v1', 'url');
      throw new Error('expected to throw');
    } catch (err) {
      expect(err.statusCode).toBe(809);
    }
  });

  it('throws a retriable 809 on 5xx', () => {
    try {
      responseStatusHandler(503, 'Transformation', 'v1', 'url');
      throw new Error('expected to throw');
    } catch (err) {
      expect(err.statusCode).toBe(809);
    }
  });

  it('passes other non-200 statuses through terminally (e.g. 404)', () => {
    try {
      responseStatusHandler(404, 'Transformation', 'v1', 'url');
      throw new Error('expected to throw');
    } catch (err) {
      expect(err.statusCode).toBe(404);
    }
  });
});

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
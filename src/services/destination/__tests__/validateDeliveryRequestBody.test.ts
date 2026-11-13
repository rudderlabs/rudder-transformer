import { validateDeliveryRequestBody } from '../validateDeliveryRequestBody';

const validCases = [
  { name: 'absent body', request: {} },
  { name: 'empty formats', request: { body: { JSON: {}, GZIP: {}, FORM: null } } },
  { name: 'one JSON body', request: { body: { JSON: { id: 1 }, GZIP: {} } } },
  { name: 'one GZIP body', request: { body: { GZIP: { payload: 'data' }, XML: null } } },
];

const invalidCases = [
  {
    name: 'JSON and GZIP',
    request: { body: { GZIP: { payload: 'data' }, JSON: { id: 1 } } },
    message: 'delivery request has more than one non-empty body format: JSON, GZIP',
  },
  {
    name: 'three legacy formats',
    request: { body: { FORM: { a: 1 }, XML: { b: 2 }, JSON_ARRAY: [1] } },
    message: 'delivery request has more than one non-empty body format: JSON_ARRAY, XML, FORM',
  },
];

describe('validateDeliveryRequestBody', () => {
  it.each(validCases)('accepts $name', ({ request }) => {
    expect(() => validateDeliveryRequestBody(request as any)).not.toThrow();
  });

  it.each(invalidCases)('rejects $name', ({ request, message }) => {
    expect(() => validateDeliveryRequestBody(request as any)).toThrow(message);
  });
});

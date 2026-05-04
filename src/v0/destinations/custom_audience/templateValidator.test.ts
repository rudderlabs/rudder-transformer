import { validateTemplate, extractInputFields } from './templateValidator';

const validTemplates = [
  {
    name: 'iteration producing objects with nested arrays',
    template: `{
      "elements": $.records.({
        "action": "ADD",
        "firstName": .first_name,
        "lastName": .last_name,
        "company": .company,
        "country": .country,
        "userIds": [
          { "idType": "SHA256_EMAIL", "idValue": .email_sha256 }
        ]
      })
    }`,
  },
  {
    name: 'Number() casting and connection paths',
    template: `{
      "id_schema": ["EMAIL_SHA256"],
      "advertiser_ids": ["my_advertiser_id"],
      "action": "add",
      "batch_data": $.records.({
        "id": .email_sha256,
        "audience_ids": [Number($.connection.audience_id)]
      })
    }`,
  },
  {
    name: 'deeply nested objects inside iteration',
    template: `{
      "enablePartialFailure": true,
      "operations": $.records.({
        "create": {
          "userIdentifiers": [
            { "hashedEmail": .email_sha256 },
            { "hashedPhoneNumber": .phone_sha256 }
          ]
        }
      })
    }`,
  },
  {
    name: 'iteration producing arrays',
    template: `{
      "is_raw": true,
      "data_source": { "sub_type": "ANYTHING" },
      "schema": ["EMAIL", "PHONE", "GEN", "COUNTRY"],
      "data": $.records.([.email, .phone, .gender, .country])
    }`,
  },
];

const invalidTemplates = [
  { name: 'spread operator', template: '{ ...$.records }', errorMatch: /spread_expr/ },
  {
    name: 'variable declarations',
    template: 'let x = 1; { "a": x }',
    errorMatch: /definition_expr/,
  },
  {
    name: 'generic function calls',
    template: '$.records.map(.email)',
    errorMatch: /Only Number\(\) casting/,
  },
  {
    name: 'function definitions',
    template: 'function() { $.records }',
    errorMatch: /function_expr/,
  },
  {
    name: 'loops',
    template: 'for(let i = 0; i < 10; i = i + 1) { i }',
    errorMatch: /not supported/,
  },
  { name: 'bare identifier (process)', template: 'process', errorMatch: /Bare identifiers/ },
  { name: 'bare identifier (Object)', template: 'Object', errorMatch: /Bare identifiers/ },
  { name: 'bracket notation', template: '$["records"]', errorMatch: /Bracket notation/ },
  { name: 'standalone block expressions', template: '($.a; $.b)', errorMatch: /Standalone block/ },
  { name: 'assignment expressions', template: 'let x = 1; x = 2', errorMatch: /not supported/ },
  { name: 'return expressions (parser level)', template: 'return $.records', errorMatch: /.+/ },
  { name: 'throw expressions (parser level)', template: 'throw "error"', errorMatch: /.+/ },
  { name: 'unparseable syntax', template: '{ invalid :: syntax }', errorMatch: /.+/ },
  {
    name: 'relative path outside iteration',
    template: '{ "a": .field }',
    errorMatch: /Relative field/,
  },
  {
    name: 'non-Number function call (String)',
    template: '{ "a": String($.records) }',
    errorMatch: /Only Number\(\) casting/,
  },
];

describe('validateTemplate', () => {
  it.each(validTemplates)('should accept: $name', ({ template }) => {
    expect(validateTemplate(template)).toEqual({ valid: true });
  });

  it.each(invalidTemplates)('should reject: $name', ({ template, errorMatch }) => {
    const result = validateTemplate(template);
    expect(result.valid).toBe(false);
    expect(result.errors?.[0]).toMatch(errorMatch);
  });
});

const fieldExtractionErrorCases = [
  {
    name: 'unsupported function call',
    template: '$.records.map(.email)',
    errorMatch: /Only Number\(\) casting/,
  },
  { name: 'unparseable syntax', template: '{ invalid :: syntax }', errorMatch: /.+/ },
  {
    name: 'relative path outside iteration',
    template: '{ "a": .field }',
    errorMatch: /Relative field references/,
  },
  { name: 'bare identifier', template: 'process', errorMatch: /Bare identifiers/ },
  { name: 'bracket notation', template: '$["records"]', errorMatch: /Bracket notation/ },
  { name: 'standalone block expression', template: '($.a; $.b)', errorMatch: /Standalone block/ },
  {
    name: 'spread operator',
    template: '{ ...$.records }',
    errorMatch: /spread_expr.*not supported/,
  },
];

const fieldExtractionCases = [
  {
    name: 'iteration producing objects with nested arrays',
    template: `{
      "elements": $.records.({
        "action": "ADD",
        "firstName": .first_name,
        "lastName": .last_name,
        "company": .company,
        "country": .country,
        "userIds": [
          { "idType": "SHA256_EMAIL", "idValue": .email_sha256 }
        ]
      })
    }`,
    expected: ['company', 'country', 'email_sha256', 'first_name', 'last_name'],
  },
  {
    name: 'connection fields excluded',
    template: `{
      "id_schema": ["EMAIL_SHA256"],
      "advertiser_ids": ["my_advertiser_id"],
      "action": "add",
      "batch_data": $.records.({
        "id": .email_sha256,
        "audience_ids": [Number($.connection.audience_id)]
      })
    }`,
    expected: ['email_sha256'],
  },
  {
    name: 'deeply nested iteration objects',
    template: `{
      "enablePartialFailure": true,
      "operations": $.records.({
        "create": {
          "userIdentifiers": [
            { "hashedEmail": .email_sha256 },
            { "hashedPhoneNumber": .phone_sha256 }
          ]
        }
      })
    }`,
    expected: ['email_sha256', 'phone_sha256'],
  },
  {
    name: 'iteration producing arrays',
    template: `{
      "is_raw": true,
      "data_source": { "sub_type": "ANYTHING" },
      "schema": ["EMAIL", "PHONE", "GEN", "COUNTRY"],
      "data": $.records.([Number(.email), .phone, .gender, .country])
    }`,
    expected: ['country', 'email', 'gender', 'phone'],
  },
  {
    name: 'deduplicated fields',
    template: `{
      "data": $.records.({
        "email1": .email,
        "email2": .email
      })
    }`,
    expected: ['email'],
  },
];

describe('extractInputFields', () => {
  it.each(fieldExtractionCases)('$name', ({ template, expected }) => {
    const result = extractInputFields(template);
    expect(result.fields.sort()).toEqual(expected);
    expect(result.errors).toBeUndefined();
  });

  it.each(fieldExtractionErrorCases)('should return error: $name', ({ template, errorMatch }) => {
    const result = extractInputFields(template);
    expect(result.fields).toEqual([]);
    expect(result.errors?.[0]).toMatch(errorMatch);
  });
});

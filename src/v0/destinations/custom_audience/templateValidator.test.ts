import { parseTemplate } from './templateValidator';

describe('parseTemplate', () => {
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
      expectedFields: ['company', 'country', 'email_sha256', 'first_name', 'last_name'],
    },
    {
      name: 'Number() casting and connection fields excluded',
      template: `{
        "id_schema": ["EMAIL_SHA256"],
        "advertiser_ids": ["my_advertiser_id"],
        "action": "add",
        "batch_data": $.records.({
          "id": .email_sha256,
          "audience_ids": [Number($.connection.audience_id)]
        })
      }`,
      expectedFields: ['email_sha256'],
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
      expectedFields: ['email_sha256', 'phone_sha256'],
    },
    {
      name: 'iteration producing arrays',
      template: `{
        "is_raw": true,
        "data_source": { "sub_type": "ANYTHING" },
        "schema": ["EMAIL", "PHONE", "GEN", "COUNTRY"],
        "data": $.records.([Number(.email), .phone, .gender, .country])
      }`,
      expectedFields: ['country', 'email', 'gender', 'phone'],
    },
    {
      name: 'deduplicated fields',
      template: `{
        "data": $.records.({
          "email1": .email,
          "email2": .email
        })
      }`,
      expectedFields: ['email'],
    },
    {
      name: 'iteration on non-records path (no record fields extracted)',
      template: '{ "data": $.connection.({ "id": .email }) }',
      expectedFields: [],
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
    {
      name: 'standalone block expressions',
      template: '($.a; $.b)',
      errorMatch: /Standalone block/,
    },
    { name: 'assignment expressions', template: 'let x = 1; x = 2', errorMatch: /not supported/ },
    {
      name: 'return expressions (parser level)',
      template: 'return $.records',
      errorMatch: /return, throw, continue and break/,
    },
    {
      name: 'throw expressions (parser level)',
      template: 'throw "error"',
      errorMatch: /return, throw, continue and break/,
    },
    {
      name: 'recursive descent (..field)',
      template: `{ "data": $.records.({ "email": ..email, "phone": .phone_sha256 }) }`,
      errorMatch: /Recursive descent/,
    },
    {
      name: 'unparseable syntax',
      template: '{ invalid :: syntax }',
      errorMatch: /Unexpected token/,
    },
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
    {
      name: 'nested iteration under $.records',
      template: '{ "data": $.records.foo.({ "id": .email }) }',
      errorMatch: /Nested iteration under \$\.records/,
    },
  ];

  it.each(validTemplates)(
    'should accept and extract fields: $name',
    ({ template, expectedFields }) => {
      const result = parseTemplate(template);
      expect(result.valid).toBe(true);
      expect('recordFields' in result && result.recordFields.sort()).toEqual(expectedFields);
    },
  );

  it.each(invalidTemplates)('should reject: $name', ({ template, errorMatch }) => {
    const result = parseTemplate(template);
    expect(result.valid).toBe(false);
    expect('errors' in result && result.errors[0]).toMatch(errorMatch);
  });
});

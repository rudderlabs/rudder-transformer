import { parseTemplate, evaluateTemplate } from './templateEngine';

describe('parseTemplate', () => {
  const validTemplates = [
    {
      name: 'iteration producing objects with nested arrays',
      template: `{
        "elements": [$$.records.{
          "action": "ADD",
          "firstName": first_name,
          "lastName": last_name,
          "company": company,
          "country": country,
          "userIds": [
            { "idType": "SHA256_EMAIL", "idValue": email_sha256 }
          ]
        }]
      }`,
      expectedFields: ['company', 'country', 'email_sha256', 'first_name', 'last_name'],
    },
    {
      name: '$number() casting and connection fields excluded',
      template: `{
        "id_schema": ["EMAIL_SHA256"],
        "advertiser_ids": ["my_advertiser_id"],
        "action": "add",
        "batch_data": [$$.records.{
          "id": email_sha256,
          "audience_ids": [$number($$.connection.audience_id)]
        }]
      }`,
      expectedFields: ['email_sha256'],
    },
    {
      name: 'deeply nested objects inside iteration',
      template: `{
        "enablePartialFailure": true,
        "operations": [$$.records.{
          "create": {
            "userIdentifiers": [
              { "hashedEmail": email_sha256 },
              { "hashedPhoneNumber": phone_sha256 }
            ]
          }
        }]
      }`,
      expectedFields: ['email_sha256', 'phone_sha256'],
    },
    {
      name: 'iteration producing arrays',
      template: `{
        "is_raw": true,
        "data_source": { "sub_type": "ANYTHING" },
        "schema": ["EMAIL", "PHONE", "GEN", "COUNTRY"],
        "data": [$$.records.[$number(email), phone, gender, country]]
      }`,
      expectedFields: ['country', 'email', 'gender', 'phone'],
    },
    {
      name: 'deduplicated fields',
      template: `{
        "data": [$$.records.{
          "email1": email,
          "email2": email
        }]
      }`,
      expectedFields: ['email'],
    },
    {
      name: 'iteration on non-records path (no record fields extracted)',
      template: '{ "data": $$.connection.{ "id": email } }',
      expectedFields: [],
    },
  ];

  const invalidTemplates = [
    {
      name: 'spread operator',
      template: '{ ...$.records }',
      expectedError: 'The symbol ".." cannot be used as a unary operator',
    },
    {
      name: 'variable declarations',
      template: 'let x = 1; { "a": x }',
      expectedError: 'Syntax error: "x"',
    },
    {
      name: 'generic function calls',
      template: '$$.records.$map(email)',
      expectedError: 'Function calls are not supported. Only $number() casting is allowed.',
    },
    {
      name: 'function definitions',
      template: 'function() { $$.records }',
      expectedError: 'Expression type "lambda" is not supported.',
    },
    {
      name: 'loops',
      template: 'for(let i = 0; i < 10; i = i + 1) { i }',
      expectedError: 'Expected ")", got "i"',
    },
    {
      name: 'bare identifier (process)',
      template: 'process',
      expectedError:
        'Bare identifiers (e.g., "process") are not allowed. Use $$.field to access data.',
    },
    {
      name: 'bare identifier (Object)',
      template: 'Object',
      expectedError:
        'Bare identifiers (e.g., "Object") are not allowed. Use $$.field to access data.',
    },
    {
      name: 'bracket notation',
      template: '$$["records"]',
      expectedError:
        'Bracket notation ($$["key"]) is not supported. Use dot notation ($$.key) instead.',
    },
    {
      name: 'standalone block expressions',
      template: '($$.a; $$.b)',
      expectedError: 'Expression type "block" is not supported.',
    },
    {
      name: 'assignment expressions',
      template: 'let x = 1; x = 2',
      expectedError: 'Syntax error: "x"',
    },
    {
      name: 'return expressions (parser level)',
      template: 'return $.records',
      expectedError: 'Syntax error: ""',
    },
    {
      name: 'throw expressions (parser level)',
      template: 'throw "error"',
      expectedError: 'Syntax error: "error"',
    },
    {
      name: 'recursive descent (**.field)',
      template: '{ "data": [$$.records.{ "email": **.email, "phone": phone_sha256 }] }',
      expectedError: 'Expression type "descendant" is not supported.',
    },
    {
      name: 'unparseable syntax',
      template: '{ invalid :: syntax }',
      expectedError: 'The symbol ":" cannot be used as a unary operator',
    },
    {
      name: 'bare field reference outside mapping',
      template: '{ "a": field }',
      expectedError:
        'Relative field references (field) can only be used inside a $$.records.{} mapping block.',
    },
    {
      name: 'non-$number function call ($string)',
      template: '{ "a": $string($$.records) }',
      expectedError: 'Function calls are not supported. Only $number() casting is allowed.',
    },
    {
      name: 'nested iteration under $$.records',
      template: '{ "data": [$$.records.foo.{ "id": email }] }',
      expectedError:
        'Nested iteration under $$.records is not supported. Use $$.records.{...} directly.',
    },
    {
      name: 'unwrapped $$.records object iteration',
      template: '{ "data": $$.records.{ "email": email } }',
      expectedError:
        '$$.records iteration must be wrapped in [...] to guarantee array output ' +
        '(e.g. [$$.records.{...}]). Without this, single-record batches produce a bare object.',
    },
    {
      name: 'unwrapped $$.records array iteration',
      template: '{ "data": $$.records.[email, phone] }',
      expectedError:
        '$$.records iteration must be wrapped in [...] to guarantee array output ' +
        '(e.g. [$$.records.{...}]). Without this, single-record batches produce a bare object.',
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

  it.each(invalidTemplates)('should reject: $name', ({ template, expectedError }) => {
    const result = parseTemplate(template);
    expect(result.valid).toBe(false);
    expect('errors' in result && result.errors[0]).toBe(expectedError);
  });
});

describe('evaluateTemplate', () => {
  it('evaluates a simple template with connection and records', async () => {
    const result = await evaluateTemplate(
      '{ "audienceId": $$.connection.audienceId, "users": $$.records }',
      {
        records: [{ email: 'a@b.com' }, { email: 'c@d.com' }],
        connection: { audienceId: 'aud-1' },
      },
    );
    expect(result).toEqual({
      audienceId: 'aud-1',
      users: [{ email: 'a@b.com' }, { email: 'c@d.com' }],
    });
  });

  it('evaluates object-iteration templates', async () => {
    const result = await evaluateTemplate('{ "data": [$$.records.{ "email": email }] }', {
      records: [{ email: 'a@b.com' }, { email: 'c@d.com' }],
      connection: {},
    });
    expect(result).toEqual({ data: [{ email: 'a@b.com' }, { email: 'c@d.com' }] });
  });

  it('[...] wrapper guarantees array output for single-element records', async () => {
    const result = await evaluateTemplate('{ "data": [$$.records.{ "email": email }] }', {
      records: [{ email: 'a@b.com' }],
      connection: {},
    });
    expect(result).toEqual({ data: [{ email: 'a@b.com' }] });
  });

  it('evaluates array-iteration templates', async () => {
    const result = await evaluateTemplate('{ "data": [$$.records.[email, phone]] }', {
      records: [{ email: 'a@b.com', phone: '555' }],
      connection: {},
    });
    expect(result).toEqual({ data: ['a@b.com', '555'] });
  });

  it('supports $number() casting', async () => {
    const result = await evaluateTemplate(
      '{ "data": [$$.records.{ "id": $number(audience_id) }] }',
      {
        records: [{ audience_id: '42' }],
        connection: {},
      },
    );
    expect(result).toEqual({ data: [{ id: 42 }] });
  });

  it('throws on invalid template syntax', async () => {
    await expect(evaluateTemplate('{{{{', {})).rejects.toThrow(
      'Expected ":" before end of expression',
    );
  });
});

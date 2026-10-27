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
    {
      name: 'nested mapping over a record field (inner fields are not record fields)',
      template: `{
        "data": [$$.records.{
          "email": email,
          "items": [line_items.{ "sku": sku, "qty": $number(quantity) }]
        }]
      }`,
      expectedFields: ['email', 'line_items'],
    },
    {
      name: 'nested array mapping over a deep record path',
      template: '{ "data": [$$.records.{ "pairs": [props.items.[sku, name]] }] }',
      expectedFields: ['props'],
    },
    {
      name: 'mapping nested two levels deep',
      template: '[$$.records.{ "orders": [orders.{ "lines": [lines.{ "sku": sku }] }] }]',
      expectedFields: ['orders'],
    },
    {
      name: 'path headed by a wrapped nested mapping',
      template: '[$$.records.{ "a": [items.{ "s": sku }].s }]',
      expectedFields: ['items'],
    },
    {
      name: 'chained mapping on the root (second block reads the first block output)',
      template: '[$$.records.{ "a": email }.{ "b": a }]',
      expectedFields: ['email'],
    },
    {
      name: 'bare-name object key reads a record field',
      template: '[$$.records.{ email: 1 }]',
      expectedFields: ['email'],
    },
    {
      name: 'wrapped mapping chained onto the wrapped root iteration',
      template: '[[$$.records.{ "e": email }].{ "y": e }]',
      expectedFields: ['email'],
    },
    {
      name: 'root collection referenced inside a nested mapping',
      template: '[$$.records.{ "a": [items.{ "s": [$$.records.{ "e": email }] }] }]',
      expectedFields: ['email', 'items'],
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
    {
      name: 'unwrapped nested iteration',
      template: '{ "data": [$$.records.{ "items": items.{ "sku": sku } }] }',
      expectedError:
        'Nested iteration (items.{...}) must be wrapped in [...] to guarantee array output ' +
        '(e.g. [items.{...}]). Without this, single-element arrays produce a bare value.',
    },
    {
      name: 'function call inside a nested mapping',
      template: '{ "data": [$$.records.{ "items": [items.{ "x": $eval("1") }] }] }',
      expectedError: 'Function calls are not supported. Only $number() casting is allowed.',
    },
    {
      name: 'function step on a relative path',
      template: '{ "data": [$$.records.{ "x": items.$string() }] }',
      expectedError: 'Function calls are not supported. Only $number() casting is allowed.',
    },
    {
      name: 'filter inside a nested mapping',
      template: '{ "data": [$$.records.{ "items": [items.{ "sku": skus[0] }] }] }',
      expectedError: 'Filter expressions are not supported.',
    },
    {
      name: 'group-by on a $$ path',
      template: '{ "a": $$.connection{ "k": $string("x") } }',
      expectedError: 'Group-by expressions (expr{...}) are not supported.',
    },
    {
      name: 'filter on an array constructor inside a mapping',
      template: '[$$.records.{ "a": [email][$eval("1")] }]',
      expectedError: 'Filter expressions are not supported.',
    },
    {
      name: 'filter on the wrapped root iteration',
      template: '{ "d": [$$.records.{ "e": email }][$eval("1")] }',
      expectedError: 'Filter expressions are not supported.',
    },
    {
      name: 'variable step on a relative path',
      template: '[$$.records.{ "a": items.$eval }]',
      expectedError: 'Variable references are not allowed. Use $$.field to access data.',
    },
    {
      name: 'filter on the $number procedure',
      template: '{ "a": $number[$eval("1+1") = 2]("7") }',
      expectedError: 'Function calls are not supported. Only $number() casting is allowed.',
    },
    {
      name: 'group-by on the $number procedure',
      template: '{ "a": $number{ "k": $eval("1+1") }("7") }',
      expectedError: 'Function calls are not supported. Only $number() casting is allowed.',
    },
    {
      name: 'group-by on a string path step',
      template: '{ "a": [$$.records.{ "x": "items"{ "k": $eval("2+2") }.k }] }',
      expectedError: 'Group-by expressions (expr{...}) are not supported.',
    },
    {
      name: 'group-by on a $$ path step',
      template: '$${ "k": $eval("1+1") }.k',
      expectedError: 'Group-by expressions (expr{...}) are not supported.',
    },
    {
      name: 'context binding on a nested mapping',
      template: '[$$.records.{ "items": [line_items@$i.{ "sku": sku }] }]',
      expectedError: 'Context and index bindings (@$var, #$var) are not supported.',
    },
    {
      name: 'index binding on a nested mapping',
      template: '[$$.records.{ "items": [line_items#$i.{ "sku": sku }] }]',
      expectedError: 'Context and index bindings (@$var, #$var) are not supported.',
    },
    {
      name: 'bare root collection iterated through a heading constructor',
      template: '{ "data": [[records].{ "e": email }] }',
      expectedError:
        'Relative field references (field) can only be used inside a $$.records.{} mapping block.',
    },
    {
      name: 'unwrapped mapping after a heading constructor',
      template: '[$$.records.{ "e": [line_items].{ "z": sku } }]',
      expectedError:
        'Nested iteration ([...].{...}) must be wrapped in [...] to guarantee array output ' +
        '(e.g. [[...].{...}]). Without this, single-element arrays produce a bare value.',
    },
    {
      name: 'unwrapped mapping chained onto the wrapped root iteration',
      template: '[$$.records.{ "e": email }].{ "y": e }',
      expectedError:
        'Nested iteration ([...].{...}) must be wrapped in [...] to guarantee array output ' +
        '(e.g. [[...].{...}]). Without this, single-element arrays produce a bare value.',
    },
    {
      name: 'group-by inside a nested mapping',
      template: '[$$.records.{ "p": [items{ "k": $string(a) }] }]',
      expectedError: 'Group-by expressions (expr{...}) are not supported.',
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

  describe('custom root collection', () => {
    it('binds iteration and field extraction to the given root', () => {
      const result = parseTemplate(
        '{ "batch": [$$.events.{ "id": userId, "products": [properties.products.{ "sku": sku }] }] }',
        'events',
      );
      expect(result).toEqual({ valid: true, recordFields: ['userId', 'properties'] });
    });

    it.each([
      {
        name: 'unwrapped root iteration',
        template: '{ "batch": $$.events.{ "id": userId } }',
        expectedError:
          '$$.events iteration must be wrapped in [...] to guarantee array output ' +
          '(e.g. [$$.events.{...}]). Without this, single-record batches produce a bare object.',
      },
      {
        name: 'iteration under the root',
        template: '{ "batch": [$$.events.properties.{ "id": userId }] }',
        expectedError:
          'Nested iteration under $$.events is not supported. Use $$.events.{...} directly.',
      },
      {
        name: 'relative field outside mapping',
        template: '{ "a": userId }',
        expectedError:
          'Relative field references (field) can only be used inside a $$.events.{} mapping block.',
      },
    ])('rejects $name', ({ template, expectedError }) => {
      const result = parseTemplate(template, 'events');
      expect('errors' in result && result.errors[0]).toBe(expectedError);
    });

    it('does not treat $$.records as the root collection', () => {
      expect(parseTemplate('{ "a": $$.records.{ "id": id } }', 'events')).toEqual({
        valid: true,
        recordFields: [],
      });
    });
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

  it('nested [...] wrapper keeps single-element inner arrays as arrays', async () => {
    const result = await evaluateTemplate(
      '{ "data": [$$.records.{ "items": [items.{ "sku": sku }] }] }',
      {
        records: [{ items: [{ sku: 'a' }] }, { items: [{ sku: 'b' }, { sku: 'c' }] }],
        connection: {},
      },
    );
    expect(result).toEqual({
      data: [{ items: [{ sku: 'a' }] }, { items: [{ sku: 'b' }, { sku: 'c' }] }],
    });
  });

  it('throws on invalid template syntax', async () => {
    await expect(evaluateTemplate('{{{{', {})).rejects.toThrow(
      'Expected ":" before end of expression',
    );
  });
});

const { InstrumentationError } = require('@rudderstack/integrations-lib');
const { process: processSlack } = require('./transform');
const { process: processDiscord } = require('../discord/transform');
const { stringifyJSON } = require('./util');

describe('stringifyJSON', () => {
  const nullPrototypeValue = Object.assign(Object.create(null), { x: 1 });
  const values = {
    nullPrototypeValue,
    nested: { detail: { count: 2 } },
    count: 5,
    active: false,
    empty: null,
    missing: undefined,
  };

  it.each([
    {
      name: 'all keys without an allowlist',
      allowlist: undefined,
      expected:
        'nullPrototypeValue: {"x":1} nested: {"detail":{"count":2}} count: 5 active: false empty: null missing: undefined ',
    },
    {
      name: 'only allowlisted keys',
      allowlist: ['nested', 'count', 'empty'],
      expected: 'nested: {"detail":{"count":2}} count: 5 empty: null ',
    },
  ])('formats $name', ({ allowlist, expected }) => {
    expect(stringifyJSON(values, allowlist)).toBe(expected);
  });

  it('preserves JSON quotes but escapes markup when used in a Slack template', () => {
    expect(stringifyJSON({ product: { name: '<lamp & shade>' } }, undefined, true)).toBe(
      'product: {"name":"&lt;lamp &amp; shade&gt;"} ',
    );
  });

  it('classifies excessively deep JSON as invalid input instead of throwing a RangeError', () => {
    const nested = JSON.parse(`${'{"a":'.repeat(12000)}0${'}'.repeat(12000)}`);
    expect(() => stringifyJSON({ nested })).toThrow(InstrumentationError);
  });

  it('does not access excluded values', () => {
    const traits = { included: 'yes' };
    Object.defineProperty(traits, 'excluded', {
      enumerable: true,
      get: () => {
        throw new Error('excluded value was read');
      },
    });

    expect(stringifyJSON(traits, ['included'])).toBe('included: yes ');
  });
});

describe('default Identify template', () => {
  const objectTrait = Object.assign(Object.create(null), { tier: 'gold' });
  const message = {
    type: 'identify',
    userId: '123',
    context: { traits: { name: 'Test User', tier: objectTrait } },
  };
  const config = {
    webhookUrl: 'https://example.com/webhook',
    whitelistedTraitsSettings: [{ trait: 'tier' }],
  };

  it.each([
    {
      name: 'Slack',
      process: processSlack,
      extractText: (result) => JSON.parse(result[0].body.FORM.payload).text,
    },
    { name: 'Discord', process: processDiscord, extractText: (result) => result.body.JSON.content },
  ])('formats null-prototype trait in $name', ({ process, extractText }) => {
    const result = process({ message, destination: { Config: config } });
    expect(extractText(result)).toContain('Identified Test User');
    expect(extractText(result)).toContain('tier: {"tier":"gold"}');
  });
});

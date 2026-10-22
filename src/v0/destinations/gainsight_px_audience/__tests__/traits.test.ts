import { collectTraits, convertTraitValue } from '../traits';

const sent = (value: unknown) => ({ ok: true, value });
const leftOut = (reason: string) => ({ ok: false, reason });

describe('convertTraitValue — trait-mappings §5.2 conversion table', () => {
  it.each<[string, unknown, unknown]>([
    ['a string', 'abc', sent('abc')],
    ['an empty string (PX stores "")', '', sent('')],
    ['a finite number', 7, sent('7')],
    ['a boolean', true, sent('true')],
    ['NaN', Number.NaN, leftOut('unconvertible')],
    ['Infinity', Number.POSITIVE_INFINITY, leftOut('unconvertible')],
    ['an object', { a: 1 }, leftOut('unconvertible')],
    ['an array', ['a'], leftOut('unconvertible')],
  ])('STRING: %s', (_case, value, expected) => {
    expect(convertTraitValue(value, 'STRING')).toEqual(expected);
  });

  it.each<[string, unknown, unknown]>([
    ['a finite number', 42, sent(42)],
    ['a negative decimal', -1.5, sent(-1.5)],
    ['a numeric string', '42', sent(42)],
    ['a padded numeric string', ' 42.5 ', sent(42.5)],
    ['an exponent string', '1e3', sent(1000)],
    ['a leading-dot string', '.5', sent(0.5)],
    ['a signed string', '-3', sent(-3)],
    ['a hex string', '0x1F', leftOut('unconvertible')],
    ['a binary string', '0b101', leftOut('unconvertible')],
    ['an empty string (not 0)', '', leftOut('unconvertible')],
    ['a blank string (not 0)', '   ', leftOut('unconvertible')],
    ['a non-numeric string', 'abc', leftOut('unconvertible')],
    ['NaN', Number.NaN, leftOut('unconvertible')],
    ['Infinity', Number.POSITIVE_INFINITY, leftOut('unconvertible')],
    ['a boolean', true, leftOut('unconvertible')],
    ['an object', {}, leftOut('unconvertible')],
  ])('NUMBER: %s', (_case, value, expected) => {
    expect(convertTraitValue(value, 'NUMBER')).toEqual(expected);
  });

  it.each<[string, unknown, unknown]>([
    ['true', true, sent(true)],
    ['false', false, sent(false)],
    ['"true"', 'true', sent(true)],
    ['" FALSE " (trimmed, case-insensitive)', ' FALSE ', sent(false)],
    ['1', 1, leftOut('unconvertible')],
    ['0', 0, leftOut('unconvertible')],
    ['"yes"', 'yes', leftOut('unconvertible')],
    ['"1"', '1', leftOut('unconvertible')],
  ])('BOOLEAN: %s', (_case, value, expected) => {
    expect(convertTraitValue(value, 'BOOLEAN')).toEqual(expected);
  });

  it.each<[string, unknown, unknown]>([
    ['epoch ms', 1792490400000, sent(1792490400000)],
    ['ISO with Z', '2026-10-20T10:00:00Z', sent(1792490400000)],
    ['ISO with an offset', '2026-10-20T10:00:00+02:00', sent(1792483200000)],
    ['a date only (UTC midnight)', '2026-10-20', sent(1792454400000)],
    ['ISO with microseconds and Z', '2026-10-20T10:00:00.123456Z', sent(1792490400123)],
    ['an unparseable string', 'not a date', leftOut('unconvertible')],
    ['an empty string', '', leftOut('unconvertible')],
    ['NaN', Number.NaN, leftOut('unconvertible')],
    ['a boolean', true, leftOut('unconvertible')],
    ['zero (epoch start)', 0, sent(0)],
    ['the largest valid Date', 8.64e15, sent(8.64e15)],
    ['a fractional epoch ms (PX 400s)', 1792490400000.5, leftOut('unconvertible')],
    ['a negative epoch ms (PX 400s)', -1000, leftOut('unconvertible')],
    ['1e20 (not a valid Date, PX 400s)', 1e20, leftOut('unconvertible')],
    ['just past the largest valid Date', 8.64e15 + 2, leftOut('unconvertible')],
    ['"1" (V8 would read 2001-01-01)', '1', leftOut('unconvertible')],
    ['"12" (V8 would read 2001-12-01)', '12', leftOut('unconvertible')],
    ['a US-format date', '10/20/2026', leftOut('unconvertible')],
    ['a month-name date', 'Oct 20 2026 10:00', leftOut('unconvertible')],
    ['an impossible date', '2026-13-45', leftOut('unconvertible')],
    ['an offset without a colon', '2026-10-20T10:00:00+0200', sent(1792483200000)],
    ['an hour offset', '2026-10-20T10:00:00+02', sent(1792483200000)],
    ['a pre-1970 date (PX 400s negative)', '1969-12-31', leftOut('unconvertible')],
    ['a pre-1970 date-time', '1900-01-01T00:00:00Z', leftOut('unconvertible')],
    ['an overflowing day (V8 rolls to March)', '2026-02-30', leftOut('unconvertible')],
    ['an overflowing day with a time', '2026-02-31T00:00Z', leftOut('unconvertible')],
    ['an hour of 24', '2026-10-20T24:00:00Z', leftOut('unconvertible')],
    ['a minute of 60', '2026-10-20T10:60:00Z', leftOut('unconvertible')],
    ['a leap day', '2024-02-29', sent(1709164800000)],
    ['a non-leap Feb 29', '2026-02-29', leftOut('unconvertible')],
    ['a numeric string (never sent as a string)', '1792490400000', leftOut('unconvertible')],
  ])('DATE_TIME: %s', (_case, value, expected) => {
    expect(convertTraitValue(value, 'DATE_TIME')).toEqual(expected);
  });

  // Setting TZ at runtime only takes effect where the runtime re-reads it (not on CI), so these
  // cases prove host independence whenever the suite runs outside UTC and pass trivially in UTC.
  describe('zone-less date-times are UTC whatever the host time zone', () => {
    const originalTz = process.env.TZ;
    beforeAll(() => {
      process.env.TZ = 'America/New_York';
    });
    afterAll(() => {
      if (originalTz === undefined) delete process.env.TZ;
      else process.env.TZ = originalTz;
    });

    it.each<[string, number]>([
      ['2026-10-20T10:00:00', Date.UTC(2026, 9, 20, 10)],
      ['2026-10-20 10:00:00', Date.UTC(2026, 9, 20, 10)],
      ['2026-10-20 10:30:15.250', Date.UTC(2026, 9, 20, 10, 30, 15, 250)],
      ['2026-10-20T10:00', Date.UTC(2026, 9, 20, 10)],
    ])('%s', (value, epochMs) => {
      expect(convertTraitValue(value, 'DATE_TIME')).toEqual(sent(epochMs));
    });
  });

  it.each(['STRING', 'NUMBER', 'BOOLEAN', 'DATE_TIME'])(
    '%s: null and undefined are left out',
    (type) => {
      expect(convertTraitValue(null, type)).toEqual(leftOut('null'));
      expect(convertTraitValue(undefined, type)).toEqual(leftOut('null'));
    },
  );

  it.each<[string, unknown]>([
    ['missing', undefined],
    ['unknown', 'LIST'],
    ['lowercase', 'string'],
    ['not a string', 7],
  ])('a %s type is always left out, before checking the value', (_case, type) => {
    expect(convertTraitValue('abc', type)).toEqual(leftOut('unknown_type'));
    expect(convertTraitValue(null, type)).toEqual(leftOut('unknown_type'));
  });
});

describe('collectTraits', () => {
  const MAPPINGS = [
    { from: 'role', to: 'rs_gpx_string', type: 'STRING' },
    { from: 'events', to: 'rs_gpx_number', type: 'NUMBER' },
    { from: 'last_visit', to: 'rs_gpx_date', type: 'DATE_TIME' },
  ];

  it('reads each value by `to` and converts it', () => {
    expect(
      collectTraits(
        MAPPINGS,
        { rs_gpx_string: 'admin', rs_gpx_number: '42', rs_gpx_date: '2026-10-20T10:00:00Z' },
        'rs_gpx_e2e',
      ),
    ).toEqual({
      traits: { rs_gpx_string: 'admin', rs_gpx_number: 42, rs_gpx_date: 1792490400000 },
      leftOut: [],
    });
  });

  it('lists left-out traits with their reason, and leaves null values out silently', () => {
    expect(
      collectTraits(
        [...MAPPINGS, { from: 'x', to: 'rs_untyped' }],
        { rs_gpx_string: null, rs_gpx_number: 'abc', rs_untyped: 'v' },
        'rs_gpx_e2e',
      ),
    ).toEqual({
      traits: {},
      leftOut: [
        { attribute: 'rs_gpx_number', reason: 'unconvertible' },
        { attribute: 'rs_untyped', reason: 'unknown_type' },
      ],
    });
  });

  it('never collects a trait mapped to the flag', () => {
    expect(
      collectTraits(
        [{ from: 'x', to: 'rs_gpx_e2e', type: 'BOOLEAN' }],
        { rs_gpx_e2e: false },
        'rs_gpx_e2e',
      ),
    ).toEqual({ traits: {}, leftOut: [] });
  });

  it('does not read inherited keys of the fields object', () => {
    expect(
      collectTraits([{ from: 'x', to: 'constructor', type: 'STRING' }], {}, 'rs_gpx_e2e'),
    ).toEqual({ traits: {}, leftOut: [] });
  });

  it('handles no mappings and no fields', () => {
    expect(collectTraits(undefined, undefined, 'rs_gpx_e2e')).toEqual({ traits: {}, leftOut: [] });
    expect(collectTraits(MAPPINGS, undefined, 'rs_gpx_e2e').traits).toEqual({});
  });
});

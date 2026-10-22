/**
 * Trait conversion for GAINSIGHT_PX_AUDIENCE (trait-mappings D18, §5.2). Pure: no I/O, no logging.
 *
 * PX rejects the WHOLE write when one value does not match its attribute's type (§3), which would
 * also block the membership flag. So a value the transformer cannot convert never blocks the flag:
 * it is left out of the write and the caller reports it (D25). A PX-side rejection (an attribute
 * disabled or retyped after /setup) still fails the write.
 */

export type TraitType = 'STRING' | 'NUMBER' | 'BOOLEAN' | 'DATE_TIME';
export type TraitValue = string | number | boolean;
export type LeftOutReason = 'null' | 'unconvertible' | 'unknown_type';
export type TraitConversion =
  | { ok: true; value: TraitValue }
  | { ok: false; reason: LeftOutReason };
/** A connection `fieldMappings` row; `type` is the PX attribute type `/setup` stamped. */
export type TraitMapping = { from: string; to: string; type?: string | null };
export type LeftOutTrait = { attribute: string; reason: LeftOutReason };

// Strict ISO-8601 only: YYYY-MM-DD, optional [ T]hh:mm[:ss[.f]], optional Z or +-hh[:mm]. Anything
// else (including "1", "10/20/2026") is left out: V8's lenient Date.parse would guess, by host zone.
const ISO_DATE_TIME =
  /^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)(Z|[+-]\d{2}(?::?\d{2})?)?)?$/;

// PX stores a DATE_TIME string as 0 (probe 2026-10-20), so a date is always sent as epoch ms.
// PX 400s a fractional, negative or out-of-range DATE_TIME number (probe 2026-10-20).
const MAX_DATE_MS = 8.64e15;
const epochMs = (value: number): number | undefined =>
  Number.isInteger(value) && value >= 0 && value <= MAX_DATE_MS ? value : undefined;

// V8 rolls an overflowing day into the next month ("2026-02-30" is March 2); a real calendar date
// reads back to the same year, month and day.
const isRealDate = (date: string): boolean => {
  const [y, m, d] = date.split('-').map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d));
  return utc.getUTCFullYear() === y && utc.getUTCMonth() === m - 1 && utc.getUTCDate() === d;
};

const isRealTime = (time: string, zone?: string): boolean => {
  const [h, m, sec] = time.split(':');
  const offset = zone && zone !== 'Z' ? zone.slice(1).replace(':', '') : '';
  return (
    Number(h) <= 23 &&
    Number(m) <= 59 &&
    (sec === undefined || Math.floor(Number(sec)) <= 59) &&
    (offset === '' || (Number(offset.slice(0, 2)) <= 23 && Number(offset.slice(2) || 0) <= 59))
  );
};

const parseEpochMs = (raw: string): number | undefined => {
  const match = ISO_DATE_TIME.exec(raw.trim());
  if (!match) return undefined;
  const [, date, time, zone] = match;
  if (!isRealDate(date) || (time !== undefined && !isRealTime(time, zone))) return undefined;
  let offset = zone ?? 'Z'; // zone-less (and date-only) is UTC
  if (offset !== 'Z') {
    const digits = offset.slice(1).replace(':', '');
    offset = `${offset[0]}${digits.slice(0, 2)}:${digits.slice(2) || '00'}`;
  }
  const parsed = Date.parse(`${date}T${time ?? '00:00'}${offset}`);
  return Number.isFinite(parsed) ? epochMs(parsed) : undefined;
};

const finiteNumber = (value: number): number | undefined =>
  Number.isFinite(value) ? value : undefined;

const DECIMAL = /^[+-]?(\d+(\.\d*)?|\.\d+)([Ee][+-]?\d+)?$/;

const CONVERTERS: Record<TraitType, (value: unknown) => TraitValue | undefined> = {
  STRING: (value) => {
    if (typeof value === 'string') return value;
    if (typeof value === 'boolean') return String(value);
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    return undefined;
  },
  NUMBER: (value) => {
    if (typeof value === 'number') return finiteNumber(value);
    // Decimal text only: `Number('')` is 0 and `Number('0x1F')` is 31.
    if (typeof value === 'string' && DECIMAL.test(value.trim())) {
      return finiteNumber(Number(value.trim()));
    }
    return undefined;
  },
  BOOLEAN: (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value !== 'string') return undefined;
    const normalised = value.trim().toLowerCase();
    if (normalised === 'true') return true;
    if (normalised === 'false') return false;
    return undefined;
  },
  DATE_TIME: (value) => {
    if (typeof value === 'number') return epochMs(value);
    if (typeof value === 'string') return parseEpochMs(value);
    return undefined;
  },
};

const isTraitType = (type: unknown): type is TraitType =>
  typeof type === 'string' && Object.prototype.hasOwnProperty.call(CONVERTERS, type);

/**
 * One value to its PX type. The type is checked first: a connection saved without `type` is a
 * config problem the user can fix (re-save), whatever the value.
 */
export const convertTraitValue = (value: unknown, type: unknown): TraitConversion => {
  if (!isTraitType(type)) return { ok: false, reason: 'unknown_type' };
  if (value === null || value === undefined) return { ok: false, reason: 'null' };
  const converted = CONVERTERS[type](value);
  return converted === undefined
    ? { ok: false, reason: 'unconvertible' }
    : { ok: true, value: converted as TraitValue };
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * The stored `fieldMappings`, made safe (D18: a bad trait never blocks the flag). A non-array is no
 * mappings; a row that is not an object, or whose
 * `from`/`to` is not a string, is dropped. A missing, null or non-string `type` is kept as no type, so
 * the row is left out and reported as `unknown_type` rather than silently disappearing.
 */
export const sanitizeMappings = (raw: unknown): TraitMapping[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (row): row is Record<string, unknown> =>
        isPlainObject(row) && typeof row.from === 'string' && typeof row.to === 'string',
    )
    .map((row) => ({
      from: row.from as string,
      to: row.to as string,
      type: row.type as string | undefined,
    }));
};

/**
 * The member write's traits, read from the record's `fields` by `to` (rudder-sources sets
 * `fields[m.To] = column[m.From]`). A trait mapped to the flag is skipped: it would overwrite the
 * flag, and /setup refuses that mapping, so only an API-only save can carry it.
 */
export const collectTraits = (
  rawMappings: unknown,
  rawFields: unknown,
  flag: string,
): { traits: Record<string, TraitValue>; leftOut: LeftOutTrait[] } => {
  const mappings = sanitizeMappings(rawMappings);
  const fields = isPlainObject(rawFields) ? rawFields : undefined;
  const traits: Record<string, TraitValue> = {};
  const leftOut: LeftOutTrait[] = [];
  mappings.forEach(({ to, type }) => {
    if (to === flag) return;
    const raw = fields && Object.prototype.hasOwnProperty.call(fields, to) ? fields[to] : undefined;
    const result = convertTraitValue(raw, type);
    if (result.ok) traits[to] = result.value;
    // A null value is normal for a nullable column: left out silently, not reported (D25).
    else if (result.reason !== 'null') leftOut.push({ attribute: to, reason: result.reason });
  });
  return { traits, leftOut };
};

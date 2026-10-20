/**
 * Trait conversion for GAINSIGHT_PX_AUDIENCE (trait-mappings D18, §5.2). Pure: no I/O, no logging.
 *
 * PX rejects the WHOLE write when one value does not match its attribute's type (§3), which would
 * also block the membership flag. So a value that cannot be converted is left out of the write
 * instead of sent, and the caller reports it (D25).
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

// A date-time with no offset: what a warehouse TIMESTAMP WITHOUT TIME ZONE serialises to. JS reads
// that form as HOST-LOCAL time; PX wants GMT epoch ms, so it is read as UTC instead.
const ZONELESS_DATE_TIME = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)$/;

const parseEpochMs = (raw: string): number | undefined => {
  const trimmed = raw.trim();
  if (trimmed === '') return undefined;
  const zoneless = ZONELESS_DATE_TIME.exec(trimmed);
  const parsed = Date.parse(zoneless ? `${zoneless[1]}T${zoneless[2]}Z` : trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const finiteNumber = (value: number): number | undefined =>
  Number.isFinite(value) ? value : undefined;

const CONVERTERS: Record<TraitType, (value: unknown) => TraitValue | undefined> = {
  STRING: (value) => {
    if (typeof value === 'string') return value;
    if (typeof value === 'boolean') return String(value);
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    return undefined;
  },
  NUMBER: (value) => {
    if (typeof value === 'number') return finiteNumber(value);
    // `Number('')` is 0: a blank string is not a number.
    if (typeof value === 'string' && value.trim() !== '') return finiteNumber(Number(value.trim()));
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
    if (typeof value === 'number') return finiteNumber(value);
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

/**
 * The member write's traits, read from the record's `fields` by `to` (rudder-sources sets
 * `fields[m.To] = column[m.From]`). A trait mapped to the flag is skipped: it would overwrite the
 * flag, and /setup refuses that mapping, so only an API-only save can carry it.
 */
export const collectTraits = (
  mappings: readonly TraitMapping[] | null | undefined,
  fields: Record<string, unknown> | null | undefined,
  flag: string,
): { traits: Record<string, TraitValue>; leftOut: LeftOutTrait[] } => {
  const traits: Record<string, TraitValue> = {};
  const leftOut: LeftOutTrait[] = [];
  (mappings ?? []).forEach(({ to, type }) => {
    if (to === flag) return;
    const raw = fields && Object.prototype.hasOwnProperty.call(fields, to) ? fields[to] : undefined;
    const result = convertTraitValue(raw, type);
    if (result.ok) traits[to] = result.value;
    else leftOut.push({ attribute: to, reason: result.reason });
  });
  return { traits, leftOut };
};

import { InstrumentationError } from '@rudderstack/integrations-lib';
import { REASONS } from './config';

/**
 * Trim only. Never lowercase: PX identifyIds are case-sensitive (`Case-1` and `case-1` are two
 * users). Any character is allowed because the ID travels in the body, not the path.
 */
export const normalizeIdentifyId = (raw: unknown): string => {
  if (raw === undefined || raw === null) throw new InstrumentationError(REASONS.noIdentifyId);
  if (typeof raw === 'number') {
    if (!Number.isFinite(raw)) throw new InstrumentationError(REASONS.invalidIdentifyId);
    return String(raw);
  }
  if (typeof raw !== 'string') throw new InstrumentationError(REASONS.invalidIdentifyId);
  const value = raw.trim();
  if (value.length === 0) throw new InstrumentationError(REASONS.noIdentifyId);
  return value;
};

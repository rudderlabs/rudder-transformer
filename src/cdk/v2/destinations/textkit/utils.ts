import { EVENT_NAME_MAX_LENGTH, MAX_PROPERTIES } from './config';

// POST /v1/track accepts letters, digits and _ . : - in event names, up to 64 characters.
export const normalizeEventName = (event: string): string =>
  event
    .trim()
    .replace(/[^a-zA-Z0-9_.:-]+/g, '_')
    .slice(0, EVENT_NAME_MAX_LENGTH);

// POST /v1/track takes up to 20 scalar properties, so nested values are left out.
export const getScalarProperties = (
  properties?: Record<string, unknown>,
): Record<string, string | number | boolean> | undefined => {
  const scalars = Object.entries(properties ?? {})
    .filter(([, value]) => ['string', 'number', 'boolean'].includes(typeof value))
    .slice(0, MAX_PROPERTIES);
  return scalars.length > 0
    ? (Object.fromEntries(scalars) as Record<string, string | number | boolean>)
    : undefined;
};

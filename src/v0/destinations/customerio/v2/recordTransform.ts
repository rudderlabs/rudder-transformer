import { InstrumentationError, ConfigurationError } from '@rudderstack/integrations-lib';
import { RECORD_ACTION_MAP, REQUIRED_IDENTIFIER_KEYS } from './config';
import { CustomerIOConnectionConfigSchema, CustomerIOV2Payload } from './types';
import type { RudderRecordV2 } from '../../../../types/rudderEvents';

export const buildRecordEvent = (
  message: RudderRecordV2,
  rawConnectionConfig: unknown,
): CustomerIOV2Payload => {
  const parsed = CustomerIOConnectionConfigSchema.safeParse(rawConnectionConfig);
  if (!parsed.success) {
    throw new ConfigurationError('Invalid or missing connection config for record events');
  }
  const { action, identifiers: rawIdentifiers } = message;
  const rawFields = rawIdentifiers ?? {};

  if (!(action in RECORD_ACTION_MAP)) {
    throw new InstrumentationError(`Action "${action}" is not supported`);
  }
  const cioAction = RECORD_ACTION_MAP[action as keyof typeof RECORD_ACTION_MAP];

  // id takes priority over email; at least one must be a non-empty string
  const validId = ['id', 'email'].find(
    (key) => typeof rawFields[key] === 'string' && (rawFields[key] as string).length > 0,
  );

  if (!validId) {
    throw new InstrumentationError('A non-empty `id` or `email` identifier is required');
  }

  const identifiers: Record<string, string | number> = { [validId]: rawFields[validId] as string };

  // everything in rawFields except id/email becomes attributes
  const attributeEntries = Object.entries(rawFields).filter(
    ([key]) => !REQUIRED_IDENTIFIER_KEYS.has(key),
  );

  const payload: CustomerIOV2Payload = {
    type: 'person',
    action: cioAction,
    identifiers,
  };

  if (cioAction !== 'delete' && attributeEntries.length > 0) {
    payload.attributes = Object.fromEntries(attributeEntries);
  }

  return payload;
};

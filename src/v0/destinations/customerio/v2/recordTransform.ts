import { InstrumentationError, ConfigurationError } from '@rudderstack/integrations-lib';
import { RECORD_ACTION_MAP, REQUIRED_IDENTIFIER_KEYS } from './config';
import {
  CustomerIOConnectionConfigSchema,
  CustomerIOV2Payload,
  type CustomerIORecordMessage,
} from './types';

export const buildRecordEvent = (
  message: CustomerIORecordMessage,
  rawConnectionConfig: unknown,
): CustomerIOV2Payload => {
  const parsed = CustomerIOConnectionConfigSchema.safeParse(rawConnectionConfig);
  if (!parsed.success) {
    throw new ConfigurationError('Invalid or missing connection config for record events');
  }
  const { action, identifiers: rawIdentifiers, fields } = message;
  const identifiers = rawIdentifiers ?? {};

  if (!(action in RECORD_ACTION_MAP)) {
    throw new InstrumentationError(`Action "${action}" is not supported`);
  }
  const cioAction = RECORD_ACTION_MAP[action as keyof typeof RECORD_ACTION_MAP];

  const validId = [...REQUIRED_IDENTIFIER_KEYS].find(
    (key) => typeof identifiers[key] === 'string' && (identifiers[key] as string).length > 0,
  );

  if (!validId) {
    throw new InstrumentationError('A non-empty `id` or `email` identifier is required');
  }

  const payload: CustomerIOV2Payload = {
    type: 'person',
    action: cioAction,
    identifiers: identifiers as Record<string, string | number>,
  };

  if (cioAction !== 'delete' && fields && Object.keys(fields).length > 0) {
    payload.attributes = fields;
  }

  return payload;
};

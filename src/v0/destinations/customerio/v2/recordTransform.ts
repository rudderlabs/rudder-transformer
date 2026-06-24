import { InstrumentationError } from '@rudderstack/integrations-lib';
import { RECORD_ACTION_MAP, RECORD_IDENTIFIER_KEYS } from './config';
import { CustomerIOV2Payload } from './types';
import type { RudderRecordV2 } from '../../../../types/rudderEvents';

export const buildRecordEvent = (message: RudderRecordV2): CustomerIOV2Payload => {
  const { action, identifiers: rawIdentifiers } = message;
  const rawFields = rawIdentifiers ?? {};

  if (!(action in RECORD_ACTION_MAP)) {
    throw new InstrumentationError(`Action "${action}" is not supported`);
  }
  const cioAction = RECORD_ACTION_MAP[action as keyof typeof RECORD_ACTION_MAP];

  // Schema guarantees id or email is present; id takes priority over email
  const identifierKey = RECORD_IDENTIFIER_KEYS.find(
    (key) => typeof rawFields[key] === 'string' && (rawFields[key] as string).length > 0,
  ) as string;

  const identifiers: Record<string, string> = {
    [identifierKey]: rawFields[identifierKey] as string,
  };

  // everything except the winning identifier key becomes an attribute
  const attributeEntries = Object.entries(rawFields).filter(([key]) => key !== identifierKey);

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

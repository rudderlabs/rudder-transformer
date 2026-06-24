import { InstrumentationError } from '@rudderstack/integrations-lib';
import { RECORD_ACTION_MAP, EVENT_RECORD_ACTION_MAP, RECORD_IDENTIFIER_KEYS } from './config';
import { CustomerIOV2Payload } from './types';
import type { RudderRecordV2 } from '../../../../types/rudderEvents';

// The `name` key for an event-object record: lifted to a top-level payload field
// and excluded from attributes (mirroring how the winning identifier is excluded).
const EVENT_NAME_KEY = 'name';

const buildPersonRecordEvent = (
  message: RudderRecordV2,
  rawFields: Record<string, unknown>,
): CustomerIOV2Payload => {
  const { action } = message;

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

const buildEventRecordEvent = (
  message: RudderRecordV2,
  rawFields: Record<string, unknown>,
): CustomerIOV2Payload => {
  const { action } = message;

  if (!(action in EVENT_RECORD_ACTION_MAP)) {
    // delete (and any other unsupported action) is rejected for the event object type
    if (action === 'delete') {
      throw new InstrumentationError('Delete action is not supported for "event" object type');
    }
    throw new InstrumentationError(`Action "${action}" is not supported`);
  }
  const cioAction = EVENT_RECORD_ACTION_MAP[action as keyof typeof EVENT_RECORD_ACTION_MAP];

  // Schema guarantees id or email is present; cio_id > id > email priority
  const identifierKey = RECORD_IDENTIFIER_KEYS.find(
    (key) => typeof rawFields[key] === 'string' && (rawFields[key] as string).length > 0,
  ) as string;

  const identifiers: Record<string, string> = {
    [identifierKey]: rawFields[identifierKey] as string,
  };

  // Prefer message.fields?.name when a `fields` object is present, else fall back
  // to the record data the person path reads (message.identifiers.name).
  const { fields } = message;
  const name =
    fields && typeof fields === 'object' && fields.name !== undefined
      ? fields.name
      : rawFields[EVENT_NAME_KEY];

  // Exclude both the winning identifier key and the name key from attributes.
  const attributeEntries = Object.entries(rawFields).filter(
    ([key]) => key !== identifierKey && key !== EVENT_NAME_KEY,
  );

  const payload: CustomerIOV2Payload = {
    type: 'person',
    action: cioAction,
    identifiers,
  };

  if (name !== undefined) {
    payload.name = String(name);
  }

  if (attributeEntries.length > 0) {
    payload.attributes = Object.fromEntries(attributeEntries);
  }

  return payload;
};

export const buildRecordEvent = (
  message: RudderRecordV2,
  objectType?: string,
): CustomerIOV2Payload => {
  const { identifiers: rawIdentifiers } = message;
  const rawFields = rawIdentifiers ?? {};

  if (objectType === 'event') {
    return buildEventRecordEvent(message, rawFields);
  }
  // undefined, 'person', or anything else keeps the existing person behavior.
  return buildPersonRecordEvent(message, rawFields);
};

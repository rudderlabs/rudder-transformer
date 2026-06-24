import { InstrumentationError } from '@rudderstack/integrations-lib';
import { RECORD_ACTION_MAP, RECORD_IDENTIFIER_KEYS } from './config';
import { CustomerIOV2Payload } from './types';
import type { RudderRecordV2 } from '../../../../types/rudderEvents';

const EVENT_RECORD_OBJECT = 'event';

type RecordFields = Record<string, string | number>;
type RecordObject = string | undefined;
type RecordMessageWithObject = RudderRecordV2 & {
  object?: string;
  recordObject?: string;
  objectType?: string;
  eventName?: string;
  event?: string;
  name?: string;
};

const getRecordObject = (
  message: RudderRecordV2,
  connectionObject?: RecordObject,
): RecordObject => {
  const recordMessage = message as RecordMessageWithObject;
  return (
    recordMessage.object ??
    recordMessage.recordObject ??
    recordMessage.objectType ??
    connectionObject
  );
};

const getRecordFields = (message: RudderRecordV2): RecordFields => ({
  ...(message.fields ?? {}),
  ...(message.identifiers ?? {}),
});

const getEventName = (message: RudderRecordV2, rawFields: RecordFields): string => {
  const recordMessage = message as RecordMessageWithObject;
  const name =
    recordMessage.eventName ??
    recordMessage.event ??
    recordMessage.name ??
    rawFields.eventName ??
    rawFields.event ??
    rawFields.name;

  if (typeof name !== 'string' || name.length === 0) {
    throw new InstrumentationError('Event name is required for CustomerIO event records');
  }

  return name;
};

export const buildRecordEvent = (
  message: RudderRecordV2,
  connectionObject?: RecordObject,
): CustomerIOV2Payload => {
  const { action, identifiers: rawIdentifiers } = message;
  const rawFields = rawIdentifiers ?? {};
  const eventNameFields = getRecordFields(message);

  if (!(action in RECORD_ACTION_MAP)) {
    throw new InstrumentationError(`Action "${action}" is not supported`);
  }
  const cioAction = RECORD_ACTION_MAP[action as keyof typeof RECORD_ACTION_MAP];
  const isEventRecord = getRecordObject(message, connectionObject) === EVENT_RECORD_OBJECT;

  if (isEventRecord && cioAction === 'delete') {
    throw new InstrumentationError('Delete action is not supported for CustomerIO event records');
  }

  // Schema guarantees id or email is present; id takes priority over email
  const identifierKey = RECORD_IDENTIFIER_KEYS.find(
    (key) =>
      typeof rawIdentifiers?.[key] === 'string' && (rawIdentifiers[key] as string).length > 0,
  ) as string;

  const identifiers: Record<string, string> = {
    [identifierKey]: rawIdentifiers?.[identifierKey] as string,
  };

  // everything except the winning identifier key becomes an attribute
  const attributeEntries = Object.entries(rawFields).filter(([key]) => key !== identifierKey);

  const payload: CustomerIOV2Payload = {
    type: 'person',
    action: isEventRecord ? 'event' : cioAction,
    identifiers,
  };

  if (isEventRecord) {
    payload.name = getEventName(message, eventNameFields);
  }

  if (cioAction !== 'delete' && attributeEntries.length > 0) {
    payload.attributes = Object.fromEntries(attributeEntries);
  }

  return payload;
};

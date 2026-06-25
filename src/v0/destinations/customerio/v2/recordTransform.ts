import { InstrumentationError } from '@rudderstack/integrations-lib';
import { RECORD_ACTION_MAP, RECORD_IDENTIFIER_KEYS } from './config';
import { CustomerIOV2Payload } from './types';
import type { RudderRecordV2 } from '../../../../types/rudderEvents';
import { CUSTOMERIO_RECORD_OBJECTS, type CustomerIORecordObject } from '../types';

type RecordFields = Record<string, string | number>;
type RecordActionKey = keyof typeof RECORD_ACTION_MAP;

type RecordPayloadContext = {
  rawIdentifiers: RecordFields;
  identifierKey: string;
  recordAction: RecordActionKey;
};

type RecordPayloadBuilder = {
  getAction: (recordAction: RecordActionKey) => string;
  validateAction?: (recordAction: RecordActionKey) => void;
  getBuilderFields?: (context: RecordPayloadContext) => Partial<CustomerIOV2Payload>;
  getExcludedAttributeKeys?: (context: RecordPayloadContext) => string[];
};

const CUSTOMERIO_PERSON_TYPE = 'person';
const CUSTOMERIO_DELETE_ACTION = 'delete';
const CUSTOMERIO_EVENT_ACTION = 'event';
const EVENT_NAME_IDENTIFIER_KEY = 'event';
const CREATED_AT_FIELD_KEY = 'created_at';

const buildAttributes = (
  rawIdentifiers: RecordFields,
  excludedKeys: Set<string>,
): Record<string, string | number> | undefined => {
  const attributeEntries = Object.entries(rawIdentifiers).filter(([key]) => !excludedKeys.has(key));

  if (attributeEntries.length === 0) {
    return undefined;
  }

  return Object.fromEntries(attributeEntries);
};

const parseTimestamp = (createdAt: unknown): number | undefined => {
  if (typeof createdAt === 'number') {
    return createdAt;
  }
  if (typeof createdAt !== 'string' || createdAt.length === 0) {
    return undefined;
  }

  const numericTimestamp = Number(createdAt);
  if (Number.isFinite(numericTimestamp)) {
    return numericTimestamp;
  }

  const parsedTimestamp = Math.floor(new Date(createdAt).getTime() / 1000);
  return Number.isFinite(parsedTimestamp) ? parsedTimestamp : undefined;
};

const buildPayload = (
  message: RudderRecordV2,
  builder: RecordPayloadBuilder,
): CustomerIOV2Payload => {
  const { action, fields, identifiers: rawIdentifiers = {} } = message;

  if (!(action in RECORD_ACTION_MAP)) {
    throw new InstrumentationError(`Action "${action}" is not supported`);
  }
  const recordAction = action as RecordActionKey;
  builder.validateAction?.(recordAction);

  // Schema guarantees id or email is present; id takes priority over email
  const identifierKey = RECORD_IDENTIFIER_KEYS.find(
    (key) => typeof rawIdentifiers[key] === 'string' && (rawIdentifiers[key] as string).length > 0,
  ) as string;

  const actionName = builder.getAction(recordAction);
  const payload: CustomerIOV2Payload = {
    type: CUSTOMERIO_PERSON_TYPE,
    action: actionName,
    identifiers: {
      [identifierKey]: rawIdentifiers[identifierKey] as string,
    },
    ...builder.getBuilderFields?.({ rawIdentifiers, identifierKey, recordAction }),
  };

  const timestamp = parseTimestamp(
    fields?.[CREATED_AT_FIELD_KEY] ?? rawIdentifiers[CREATED_AT_FIELD_KEY],
  );
  if (timestamp !== undefined) {
    payload.timestamp = timestamp;
  }

  if (actionName !== CUSTOMERIO_DELETE_ACTION) {
    const attributes = buildAttributes(
      rawIdentifiers,
      new Set([
        identifierKey,
        CREATED_AT_FIELD_KEY,
        ...(builder.getExcludedAttributeKeys?.({ rawIdentifiers, identifierKey, recordAction }) ??
          []),
      ]),
    );
    if (attributes) {
      payload.attributes = attributes;
    }
  }

  return payload;
};

const personRecordPayloadBuilder: RecordPayloadBuilder = {
  getAction: (recordAction) => RECORD_ACTION_MAP[recordAction],
};

const eventRecordPayloadBuilder: RecordPayloadBuilder = {
  getAction: () => CUSTOMERIO_EVENT_ACTION,
  validateAction: (recordAction) => {
    if (recordAction === CUSTOMERIO_DELETE_ACTION) {
      throw new InstrumentationError('Delete action is not supported for CustomerIO event records');
    }
  },
  getBuilderFields: ({ rawIdentifiers }) => {
    const name = rawIdentifiers[EVENT_NAME_IDENTIFIER_KEY];
    if (typeof name !== 'string' || name.length === 0) {
      throw new InstrumentationError('Event name is required for CustomerIO event records');
    }
    return { name };
  },
  getExcludedAttributeKeys: () => [EVENT_NAME_IDENTIFIER_KEY],
};

const recordPayloadBuilders: Record<CustomerIORecordObject, RecordPayloadBuilder> = {
  [CUSTOMERIO_RECORD_OBJECTS.person]: personRecordPayloadBuilder,
  [CUSTOMERIO_RECORD_OBJECTS.event]: eventRecordPayloadBuilder,
};

export const buildRecordEvent = (
  message: RudderRecordV2,
  connectionObject?: CustomerIORecordObject,
): CustomerIOV2Payload => {
  const recordPayloadBuilder =
    recordPayloadBuilders[connectionObject ?? CUSTOMERIO_RECORD_OBJECTS.person];

  return buildPayload(message, recordPayloadBuilder);
};

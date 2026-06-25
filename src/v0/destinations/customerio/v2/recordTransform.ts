import { InstrumentationError } from '@rudderstack/integrations-lib';
import { RECORD_ACTION_MAP, RECORD_IDENTIFIER_KEYS } from './config';
import { CustomerIOV2Payload, type CustomerIOV2RecordMessage } from './types';
import { toUnixSeconds } from './util';
import { CUSTOMERIO_RECORD_OBJECTS, type CustomerIORecordObject } from '../types';

type RecordFields = Record<string, string | number>;
type RecordActionKey = CustomerIOV2RecordMessage['action'];

type RecordPayloadContext = {
  rawIdentifiers: RecordFields;
  identifierKey: string;
  recordAction: RecordActionKey;
};

type RecordPayloadBuilder = {
  getAction: (recordAction: RecordActionKey) => string;
  validateAction?: (recordAction: RecordActionKey) => void;
  getAdditionalObjectFields?: (context: RecordPayloadContext) => Partial<CustomerIOV2Payload>;
  getExcludedAttributeKeys?: (context: RecordPayloadContext) => string[];
};

const RECORD_OBJECT_TYPES = {
  PERSON: CUSTOMERIO_RECORD_OBJECTS.person,
  EVENT: CUSTOMERIO_RECORD_OBJECTS.event,
} as const;

const RECORD_ACTIONS = {
  DELETE: 'delete',
  EVENT: 'event',
} as const;

const RESERVED_RECORD_IDENTIFIERS = {
  EVENT: 'event',
  CREATED_AT: 'created_at',
} as const;

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

const buildPayload = (
  message: CustomerIOV2RecordMessage,
  builder: RecordPayloadBuilder,
): CustomerIOV2Payload => {
  const { action, identifiers: rawIdentifiers = {} } = message;

  if (!(action in RECORD_ACTION_MAP)) {
    throw new InstrumentationError(`Action "${action}" is not supported`);
  }
  const recordAction = action;
  builder.validateAction?.(recordAction);

  // Schema guarantees id or email is present; id takes priority over email
  const identifierKey = RECORD_IDENTIFIER_KEYS.find(
    (key) => typeof rawIdentifiers[key] === 'string' && (rawIdentifiers[key] as string).length > 0,
  ) as string;

  const cioAction = builder.getAction(recordAction);
  const payload: CustomerIOV2Payload = {
    type: RECORD_OBJECT_TYPES.PERSON,
    action: cioAction,
    identifiers: {
      [identifierKey]: rawIdentifiers[identifierKey] as string,
    },
    ...builder.getAdditionalObjectFields?.({ rawIdentifiers, identifierKey, recordAction }),
  };

  const createdAt = rawIdentifiers[RESERVED_RECORD_IDENTIFIERS.CREATED_AT];
  if (createdAt !== undefined) {
    payload.timestamp = toUnixSeconds(createdAt);
  }

  if (cioAction !== RECORD_ACTIONS.DELETE) {
    const attributes = buildAttributes(
      rawIdentifiers,
      new Set([
        identifierKey,
        RESERVED_RECORD_IDENTIFIERS.CREATED_AT,
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
  getAction: () => RECORD_ACTIONS.EVENT,
  validateAction: (recordAction) => {
    if (recordAction === RECORD_ACTIONS.DELETE) {
      throw new InstrumentationError('Delete action is not supported for CustomerIO event records');
    }
  },
  getAdditionalObjectFields: ({ rawIdentifiers }) => {
    const name = rawIdentifiers[RESERVED_RECORD_IDENTIFIERS.EVENT];
    if (typeof name !== 'string' || name.length === 0) {
      throw new InstrumentationError('Event name is required for CustomerIO event records');
    }
    return { name };
  },
  getExcludedAttributeKeys: () => [RESERVED_RECORD_IDENTIFIERS.EVENT],
};

const recordPayloadBuilders: Record<CustomerIORecordObject, RecordPayloadBuilder> = {
  [RECORD_OBJECT_TYPES.PERSON]: personRecordPayloadBuilder,
  [RECORD_OBJECT_TYPES.EVENT]: eventRecordPayloadBuilder,
};

export const buildRecordEvent = (
  message: CustomerIOV2RecordMessage,
  connectionObject: CustomerIORecordObject,
): CustomerIOV2Payload => {
  const recordPayloadBuilder = recordPayloadBuilders[connectionObject];

  return buildPayload(message, recordPayloadBuilder);
};

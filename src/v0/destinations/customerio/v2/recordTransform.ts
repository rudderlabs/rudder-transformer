import { InstrumentationError } from '@rudderstack/integrations-lib';
import { RECORD_ACTION_MAP, RECORD_IDENTIFIER_KEYS } from './config';
import { CustomerIOV2Payload } from './types';
import type { RudderRecordV2 } from '../../../../types/rudderEvents';
import { CUSTOMERIO_RECORD_OBJECTS, type CustomerIORecordObject } from '../types';

type RecordFields = Record<string, string | number>;
type RecordAction = (typeof RECORD_ACTION_MAP)[keyof typeof RECORD_ACTION_MAP];

type RecordPayloadContext = {
  cioAction: RecordAction;
  rawIdentifiers: RecordFields;
  identifierKey: string;
  identifiers: Record<string, string>;
};

type RecordPayloadBuilder = {
  buildPayload: (context: RecordPayloadContext) => CustomerIOV2Payload;
};

const EVENT_NAME_IDENTIFIER_KEY = 'eventName';

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

const personRecordPayloadBuilder: RecordPayloadBuilder = {
  buildPayload: ({ cioAction, rawIdentifiers, identifierKey, identifiers }) => {
    const payload: CustomerIOV2Payload = {
      type: 'person',
      action: cioAction,
      identifiers,
    };

    const attributes =
      cioAction === 'delete'
        ? undefined
        : buildAttributes(rawIdentifiers, new Set([identifierKey]));
    if (attributes) {
      payload.attributes = attributes;
    }

    return payload;
  },
};

const eventRecordPayloadBuilder: RecordPayloadBuilder = {
  buildPayload: ({ cioAction, rawIdentifiers, identifierKey, identifiers }) => {
    if (cioAction === 'delete') {
      throw new InstrumentationError('Delete action is not supported for CustomerIO event records');
    }

    const name = rawIdentifiers[EVENT_NAME_IDENTIFIER_KEY];
    if (typeof name !== 'string' || name.length === 0) {
      throw new InstrumentationError('Event name is required for CustomerIO event records');
    }

    const payload: CustomerIOV2Payload = {
      type: 'person',
      action: 'event',
      identifiers,
      name,
    };

    const attributes = buildAttributes(
      rawIdentifiers,
      new Set([identifierKey, EVENT_NAME_IDENTIFIER_KEY]),
    );
    if (attributes) {
      payload.attributes = attributes;
    }

    return payload;
  },
};

const recordPayloadBuilders: Record<CustomerIORecordObject, RecordPayloadBuilder> = {
  [CUSTOMERIO_RECORD_OBJECTS.person]: personRecordPayloadBuilder,
  [CUSTOMERIO_RECORD_OBJECTS.event]: eventRecordPayloadBuilder,
};

export const buildRecordEvent = (
  message: RudderRecordV2,
  connectionObject?: CustomerIORecordObject,
): CustomerIOV2Payload => {
  const { action, identifiers: rawIdentifiers } = message;

  if (!(action in RECORD_ACTION_MAP)) {
    throw new InstrumentationError(`Action "${action}" is not supported`);
  }
  const cioAction = RECORD_ACTION_MAP[action as keyof typeof RECORD_ACTION_MAP];
  const recordPayloadBuilder =
    recordPayloadBuilders[connectionObject ?? CUSTOMERIO_RECORD_OBJECTS.person];

  // Schema guarantees id or email is present; id takes priority over email
  const identifierKey = RECORD_IDENTIFIER_KEYS.find(
    (key) =>
      typeof rawIdentifiers?.[key] === 'string' && (rawIdentifiers[key] as string).length > 0,
  ) as string;

  const identifiers: Record<string, string> = {
    [identifierKey]: rawIdentifiers?.[identifierKey] as string,
  };

  return recordPayloadBuilder.buildPayload({
    cioAction,
    rawIdentifiers: rawIdentifiers ?? {},
    identifierKey,
    identifiers,
  });
};

import { InstrumentationError } from '@rudderstack/integrations-lib';
import { RECORD_ACTION_MAP, RECORD_IDENTIFIER_KEYS } from './config';
import { CustomerIOV2Payload, type CustomerIOV2RecordMessage } from './types';
import { toUnixSeconds } from './util';
import { CUSTOMERIO_RECORD_OBJECTS, type CustomerIORecordObject } from '../types';
import { EVENT_TYPES } from '../../../util/recordUtils';

type RecordFields = Record<string, string | number>;

type RecordPayloadContext = {
  rawIdentifiers: RecordFields;
  identifierKey: string;
  action: CustomerIOV2RecordMessage['action'];
};

type RecordPayloadBuilder = {
  getCIOAction: (action: CustomerIOV2RecordMessage['action']) => string;
  validateAction?: (action: CustomerIOV2RecordMessage['action']) => void;
  getAdditionalFields?: (context: RecordPayloadContext) => Partial<CustomerIOV2Payload>;
  getExcludedAttributeKeys?: () => string[];
};

const IDENTIFIERS = {
  NAME: 'name',
  CREATED_AT: 'created_at',
};

const recordPayloadBuilders: Record<CustomerIORecordObject, RecordPayloadBuilder> = {
  [CUSTOMERIO_RECORD_OBJECTS.person]: {
    getCIOAction: (action) => RECORD_ACTION_MAP[action],
  },
  [CUSTOMERIO_RECORD_OBJECTS.event]: {
    getCIOAction: () => 'event',
    validateAction: (action) => {
      if (action === EVENT_TYPES.DELETE) {
        throw new InstrumentationError(
          'Delete action is not supported for CustomerIO event records',
        );
      }
    },
    getAdditionalFields: ({ rawIdentifiers }) => {
      const name = rawIdentifiers[IDENTIFIERS.NAME];
      if (typeof name !== 'string' || name.length === 0) {
        throw new InstrumentationError('Event name is required for CustomerIO event records');
      }
      return { name };
    },
    getExcludedAttributeKeys: () => [IDENTIFIERS.NAME],
  },
};

export const buildRecordEvent = (
  message: CustomerIOV2RecordMessage,
  connectionObject: CustomerIORecordObject,
): CustomerIOV2Payload => {
  const { action, identifiers: rawIdentifiers = {} } = message;

  if (!(action in RECORD_ACTION_MAP)) {
    throw new InstrumentationError(`Action "${action}" is not supported`);
  }
  const builder = recordPayloadBuilders[connectionObject];
  builder.validateAction?.(action);

  // Schema guarantees id or email is present; id takes priority over email
  const identifierKey = RECORD_IDENTIFIER_KEYS.find(
    (key) => typeof rawIdentifiers[key] === 'string' && (rawIdentifiers[key] as string).length > 0,
  ) as string;

  const cioAction = builder.getCIOAction(action);
  const payload: CustomerIOV2Payload = {
    type: CUSTOMERIO_RECORD_OBJECTS.person,
    action: cioAction,
    identifiers: {
      [identifierKey]: rawIdentifiers[identifierKey] as string,
    },
    ...builder.getAdditionalFields?.({ rawIdentifiers, identifierKey, action }),
  };

  const createdAt = rawIdentifiers[IDENTIFIERS.CREATED_AT];
  if (createdAt !== undefined) {
    payload.timestamp = toUnixSeconds(createdAt);
  }

  if (cioAction !== EVENT_TYPES.DELETE) {
    const excludedKeys = new Set([
      identifierKey,
      IDENTIFIERS.CREATED_AT,
      ...(builder.getExcludedAttributeKeys?.() ?? []),
    ]);
    const attributeEntries = Object.entries(rawIdentifiers).filter(
      ([key]) => !excludedKeys.has(key),
    );
    if (attributeEntries.length > 0) {
      payload.attributes = Object.fromEntries(attributeEntries);
    }
  }

  return payload;
};

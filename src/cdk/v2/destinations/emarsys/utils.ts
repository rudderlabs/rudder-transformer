import lodash from 'lodash';
import crypto from 'crypto';
import {
  InstrumentationError,
  ConfigurationError,
  isDefinedAndNotNullAndNotEmpty,
  removeUndefinedAndNullAndEmptyValues,
  removeUndefinedAndNullValues,
  isDefinedAndNotNull,
} from '@rudderstack/integrations-lib';
import {
  getIntegrationsObj,
  validateEventName,
  getValueFromMessage,
  getHashFromArray,
} from '../../../../v0/util';
import {
  EMAIL_FIELD_ID,
  MAX_BATCH_SIZE,
  OPT_IN_FILED_ID,
  ALLOWED_OPT_IN_VALUES,
  MAX_BATCH_SIZE_BYTES,
  groupedSuccessfulPayload,
} from './config';
import { EventType } from '../../../../constants';
import {
  Message,
  DestConfig,
  FieldMapping,
  IntegrationObject,
  BatchConstants,
  Batch,
  SuccessfulEvent,
  IdentifyPayload,
  GroupPayload,
  BatchedRequest,
} from './types';

const base64Sha = (str: string): string => {
  const hexDigest = crypto.createHash('sha1').update(str).digest('hex');
  return Buffer.from(hexDigest).toString('base64');
};

const getWsseHeader = (user: string, secret: string): string => {
  const nonce = crypto.randomBytes(16).toString('hex');
  const timestamp = new Date().toISOString();

  const digest = base64Sha(nonce + timestamp + secret);
  return `UsernameToken Username="${user}", PasswordDigest="${digest}", Nonce="${nonce}", Created="${timestamp}"`;
};

const buildHeader = (destConfig: DestConfig): Record<string, string> => {
  const { emersysUsername, emersysUserSecret } = destConfig;
  if (
    !isDefinedAndNotNullAndNotEmpty(emersysUsername) ||
    !isDefinedAndNotNullAndNotEmpty(emersysUserSecret)
  ) {
    throw new ConfigurationError('Either Emarsys user name or user secret is missing. Aborting');
  }
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-WSSE': getWsseHeader(emersysUsername, emersysUserSecret),
  };
};

const deduceCustomIdentifier = (
  integrationObject: IntegrationObject | null,
  emersysCustomIdentifier?: string,
): string | number =>
  integrationObject?.customIdentifierId || emersysCustomIdentifier || EMAIL_FIELD_ID;

const buildIdentifyPayload = (
  message: Message,
  destConfig: DestConfig,
): {
  eventType: string;
  destinationPayload: IdentifyPayload;
} => {
  let destinationPayload: IdentifyPayload;
  const { fieldMapping, emersysCustomIdentifier, discardEmptyProperties, defaultContactList } =
    destConfig;
  const payload: Record<string, any> = {};

  const integrationObject = getIntegrationsObj(message, 'emarsys');
  const finalContactList = integrationObject?.contactListId || defaultContactList;
  if (!finalContactList || !isDefinedAndNotNullAndNotEmpty(String(finalContactList))) {
    throw new InstrumentationError(
      'Cannot a find a specific contact list either through configuration or via integrations object',
    );
  }
  if (fieldMapping) {
    fieldMapping.forEach((trait) => {
      const { rudderProperty, emersysProperty } = trait;
      const value = getValueFromMessage(message, [
        `traits.${rudderProperty}`,
        `context.traits.${rudderProperty}`,
      ]);
      if (value) {
        payload[emersysProperty] = value;
      }
    });
  }
  const emersysIdentifier = deduceCustomIdentifier(integrationObject, emersysCustomIdentifier);
  const finalPayload = (
    discardEmptyProperties === true
      ? removeUndefinedAndNullAndEmptyValues(payload)
      : removeUndefinedAndNullValues(payload)
  ) as Record<string, unknown>;
  if (
    isDefinedAndNotNull(finalPayload[OPT_IN_FILED_ID]) &&
    !ALLOWED_OPT_IN_VALUES.includes(String(finalPayload[OPT_IN_FILED_ID]))
  ) {
    throw new InstrumentationError(
      `Only ${ALLOWED_OPT_IN_VALUES} values are allowed for optin field`,
    );
  }

  if (isDefinedAndNotNullAndNotEmpty(payload[emersysIdentifier])) {
    destinationPayload = {
      key_id: emersysIdentifier,
      contacts: [finalPayload],
      contact_list_id: finalContactList,
    };
  } else {
    throw new InstrumentationError(
      'Either configured custom contact identifier value or default identifier email value is missing',
    );
  }
  return { eventType: message.type, destinationPayload };
};

const findRudderPropertyByEmersysProperty = (
  emersysProperty: string | number,
  fieldMapping?: FieldMapping[],
): string => {
  if (!fieldMapping) return 'email';
  const item = lodash.find(fieldMapping, { emersysProperty: String(emersysProperty) });
  return item ? item.rudderProperty : 'email';
};

const deduceExternalIdValue = (
  message: Message,
  emersysIdentifier: string | number,
  fieldMapping?: FieldMapping[],
): string => {
  const configuredPayloadProperty = findRudderPropertyByEmersysProperty(
    emersysIdentifier,
    fieldMapping,
  );
  const externalIdValue = getValueFromMessage(message, [
    `traits.${configuredPayloadProperty}`,
    `context.traits.${configuredPayloadProperty}`,
  ]);

  if (!isDefinedAndNotNull(externalIdValue)) {
    throw new InstrumentationError(
      `Could not find value for externalId required in ${message.type} call. Aborting.`,
    );
  }

  return externalIdValue;
};

const buildGroupPayload = (message: Message, destConfig: DestConfig) => {
  const { emersysCustomIdentifier, defaultContactList, fieldMapping } = destConfig;
  const integrationObject = getIntegrationsObj(message, 'emarsys');
  const emersysIdentifier = deduceCustomIdentifier(integrationObject, emersysCustomIdentifier);
  const externalIdValue = deduceExternalIdValue(message, emersysIdentifier, fieldMapping);
  if (!isDefinedAndNotNull(externalIdValue)) {
    throw new InstrumentationError(
      `No value found in payload for contact custom identifier of id ${emersysIdentifier}`,
    );
  }
  const payload: GroupPayload = {
    key_id: emersysIdentifier,
    external_ids: [externalIdValue],
  };
  return {
    eventType: message.type,
    destinationPayload: {
      payload,
      contactListId: message.groupId || defaultContactList,
    },
  };
};

const deduceEventId = (message: Message, destConfig: DestConfig): string => {
  let eventId: string | undefined;
  const { eventsMapping } = destConfig;
  const { event } = message;
  validateEventName(event);
  if (Array.isArray(eventsMapping) && eventsMapping.length > 0) {
    const keyMap = getHashFromArray(eventsMapping, 'from', 'to', false);
    eventId = keyMap[event as string];
  }
  if (!eventId) {
    throw new ConfigurationError(`${event} is not mapped to any Emersys external event. Aborting`);
  }
  return eventId;
};

const deduceEndPoint = (finalPayload: {
  eventType: string;
  destinationPayload: any;
}): string | undefined => {
  let endPoint: string | undefined;
  let eventId: string;
  let contactListId: string;
  const { eventType, destinationPayload } = finalPayload;
  switch (eventType) {
    case EventType.IDENTIFY:
      endPoint = 'https://api.emarsys.net/api/v2/contact/?create_if_not_exists=1';
      break;
    case EventType.GROUP:
      contactListId = destinationPayload.contactListId;
      endPoint = `https://api.emarsys.net/api/v2/contactlist/${contactListId}/add`;
      break;
    case EventType.TRACK:
      eventId = destinationPayload.eventId;
      endPoint = `https://api.emarsys.net/api/v2/event/${eventId}/trigger`;
      break;
    default:
      break;
  }
  return endPoint;
};

const estimateJsonSize = (obj: any): number => new Blob([JSON.stringify(obj)]).size;

const createSingleIdentifyPayload = (
  keyId: string | number,
  contacts: any[],
  contactListId: string,
): IdentifyPayload => ({
  key_id: keyId,
  contacts,
  contact_list_id: contactListId,
});

const ensureSizeConstraints = (contacts: any[]): any[][] => {
  const chunks: any[][] = [];
  let currentBatch: any[] = [];

  contacts.forEach((contact) => {
    if (
      currentBatch.length === 0 ||
      estimateJsonSize([...currentBatch, contact]) < MAX_BATCH_SIZE_BYTES
    ) {
      currentBatch.push(contact);
    } else {
      chunks.push(currentBatch);
      currentBatch = [contact];
    }
  });

  if (currentBatch.length > 0) {
    chunks.push(currentBatch);
  }

  return chunks;
};

const createIdentifyBatches = (events: SuccessfulEvent[]): Batch[] => {
  const groupedIdentifyPayload = lodash.groupBy(
    events,
    (item) =>
      `${item.message[0].body.JSON.destinationPayload.key_id}-${item.message[0].body.JSON.destinationPayload.contact_list_id}`,
  );
  return lodash.flatMap(groupedIdentifyPayload, (group): Batch[] => {
    const firstItem = group[0].message[0].body.JSON.destinationPayload;
    const { key_id: keyId, contact_list_id: contactListId } = firstItem;

    const allContacts = lodash.flatMap(
      group,
      (item) => item.message[0].body.JSON.destinationPayload.contacts,
    );
    const initialChunks = lodash.chunk(allContacts, MAX_BATCH_SIZE);
    const finalChunks = lodash.flatMap(initialChunks, ensureSizeConstraints);

    return finalChunks.map((contacts) => ({
      endpoint: 'https://api.emarsys.net/api/v2/contact/?create_if_not_exists=1',
      payload: createSingleIdentifyPayload(keyId, contacts, contactListId),
      metadata: group.map((g) => g.metadata),
    }));
  });
};

const createGroupBatches = (events: SuccessfulEvent[]): Batch[] => {
  const grouped = lodash.groupBy(
    events,
    (item) =>
      `${item.message[0].body.JSON.destinationPayload.payload.key_id}-${item.message[0].body.JSON.destinationPayload.contactListId}`,
  );

  return Object.entries(grouped).flatMap(([, group]) => {
    const keyId = group[0].message[0].body.JSON.destinationPayload.payload.key_id;
    const { contactListId } = group[0].message[0].body.JSON.destinationPayload;
    const combinedExternalIds = group.reduce((acc: string[], item) => {
      acc.push(...item.message[0].body.JSON.destinationPayload.payload.external_ids);
      return acc;
    }, []);

    const idChunks = lodash.chunk(combinedExternalIds, MAX_BATCH_SIZE);

    return idChunks.map((chunk) => ({
      endpoint: `https://api.emarsys.net/api/v2/contactlist/${contactListId}/add`,
      payload: {
        key_id: keyId,
        external_ids: chunk,
      },
      metadata: group.map((g) => g.metadata),
    }));
  });
};

const createTrackBatches = (events: SuccessfulEvent[]): Batch[] => [
  {
    endpoint: events[0].message[0].endpoint as string,
    payload: events[0].message[0].body.JSON.destinationPayload.payload,
    metadata: [events[0].metadata],
  },
];

const buildBatchedRequest = (
  batches: Batch[],
  method: string,
  constants: BatchConstants,
  batchedStatus = true,
): BatchedRequest[] =>
  batches.map((batch) => ({
    batchedRequest: {
      body: {
        JSON: batch.payload,
        JSON_ARRAY: {},
        XML: {},
        FORM: {},
      },
      version: constants.version,
      type: constants.type,
      method,
      endpoint: batch.endpoint,
      headers: constants.headers,
      params: {},
      files: {},
    },
    metadata: batch.metadata,
    batched: batchedStatus,
    statusCode: 200,
    destination: constants.destination,
  }));

// Helper to initialize the constants used across batch processing
function initializeConstants(successfulEvents: SuccessfulEvent[]): BatchConstants | null {
  if (successfulEvents.length === 0) return null;
  return {
    version: successfulEvents[0].message[0].version,
    type: successfulEvents[0].message[0].type,
    headers: successfulEvents[0].message[0].headers,
    destination: successfulEvents[0].destination,
  };
}

// Helper to append requests based on batched events and constants
function appendRequestsToOutput(
  groupPayload: { batches: Batch[]; method: string },
  output: BatchedRequest[],
  constants: BatchConstants,
  batched = true,
): void {
  if (groupPayload.batches) {
    const requests = buildBatchedRequest(
      groupPayload.batches,
      groupPayload.method,
      constants,
      batched,
    );
    output.push(...requests);
  }
}

// Process batches based on event types
function processEventBatches(
  typedEventGroups: Record<string, SuccessfulEvent[]>,
  constants: BatchConstants,
): BatchedRequest[] {
  const finalOutput: BatchedRequest[] = [];

  // Process each event group based on type
  Object.keys(typedEventGroups).forEach((eventType) => {
    switch (eventType) {
      case EventType.IDENTIFY:
        groupedSuccessfulPayload.identify.batches = createIdentifyBatches(
          typedEventGroups[eventType],
        );
        break;
      case EventType.GROUP:
        groupedSuccessfulPayload.group.batches = createGroupBatches(typedEventGroups[eventType]);
        break;
      case EventType.TRACK:
        groupedSuccessfulPayload.track.batches = createTrackBatches(typedEventGroups[eventType]);
        break;
      default:
        break;
    }
  });

  // Convert batches into requests for each event type and push to final output
  appendRequestsToOutput(groupedSuccessfulPayload.identify, finalOutput, constants);
  appendRequestsToOutput(groupedSuccessfulPayload.group, finalOutput, constants);
  appendRequestsToOutput(groupedSuccessfulPayload.track, finalOutput, constants, false);

  return finalOutput;
}

// Entry function to create batches from successful events
function batchResponseBuilder(successfulEvents: SuccessfulEvent[]): BatchedRequest[] {
  const constants = initializeConstants(successfulEvents);
  if (!constants) return [];

  const typedEventGroups = lodash.groupBy(
    successfulEvents,
    (event) => event.message[0].body.JSON.eventType,
  );

  return processEventBatches(typedEventGroups, constants);
}

export {
  buildIdentifyPayload,
  buildGroupPayload,
  buildHeader,
  deduceEndPoint,
  batchResponseBuilder,
  base64Sha,
  getWsseHeader,
  findRudderPropertyByEmersysProperty,
  createSingleIdentifyPayload,
  createIdentifyBatches,
  ensureSizeConstraints,
  createGroupBatches,
  deduceExternalIdValue,
  deduceEventId,
  deduceCustomIdentifier,
};

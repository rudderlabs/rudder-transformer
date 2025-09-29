const lodash = require('lodash');
const crypto = require('node:crypto');
const {
  InstrumentationError,
  ConfigurationError,
  isDefinedAndNotNullAndNotEmpty,
  removeUndefinedAndNullAndEmptyValues,
  removeUndefinedAndNullValues,
  isDefinedAndNotNull,
} = require('@rudderstack/integrations-lib');
const {
  getIntegrationsObj,
  validateEventName,
  getValueFromMessage,
  getHashFromArray,
} = require('../../../../v0/util');
const {
  EMAIL_FIELD_ID,
  MAX_BATCH_SIZE,
  OPT_IN_FILED_ID,
  ALLOWED_OPT_IN_VALUES,
  MAX_BATCH_SIZE_BYTES,
  groupedSuccessfulPayload,
} = require('./config');
const { EventType } = require('../../../../constants');

const base64Sha = (str) => {
  const hexDigest = crypto.createHash('sha1').update(str).digest('hex');
  return Buffer.from(hexDigest).toString('base64');
};

const getWsseHeader = (user, secret) => {
  const nonce = crypto.randomBytes(16).toString('hex');
  const timestamp = new Date().toISOString();

  const digest = base64Sha(nonce + timestamp + secret);
  return `UsernameToken Username="${user}", PasswordDigest="${digest}", Nonce="${nonce}", Created="${timestamp}"`;
};

const buildHeader = (destConfig) => {
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

const deduceCustomIdentifier = (integrationObject, emersysCustomIdentifier) =>
  integrationObject?.customIdentifierId || emersysCustomIdentifier || EMAIL_FIELD_ID;

const buildIdentifyPayload = (message, destConfig) => {
  let destinationPayload;
  const { fieldMapping, emersysCustomIdentifier, discardEmptyProperties, defaultContactList } =
    destConfig;
  const payload = {};

  const integrationObject = getIntegrationsObj(message, 'emarsys');
  const finalContactList = integrationObject?.contactListId || defaultContactList;
  if (!finalContactList || !isDefinedAndNotNullAndNotEmpty(String(finalContactList))) {
    throw new InstrumentationError(
      'Cannot a find a specific contact list either through configuration or via integrations object',
    );
  }
  if (fieldMapping) {
    for (const trait of fieldMapping) {
      const { rudderProperty, emersysProperty } = trait;
      const value = getValueFromMessage(message, [
        `traits.${rudderProperty}`,
        `context.traits.${rudderProperty}`,
      ]);
      if (isDefinedAndNotNull(value)) {
        payload[emersysProperty] = value;
      }
    }
  }
  const emersysIdentifier = deduceCustomIdentifier(integrationObject, emersysCustomIdentifier);
  const finalPayload =
    discardEmptyProperties === true
      ? removeUndefinedAndNullAndEmptyValues(payload) // empty property value has a significance in emersys
      : removeUndefinedAndNullValues(payload);
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

const findRudderPropertyByEmersysProperty = (emersysProperty, fieldMapping) => {
  // find the object where the emersysProperty matches the input
  const item = lodash.find(fieldMapping, { emersysProperty: String(emersysProperty) });
  // Return the rudderProperty if the object is found, otherwise return null
  return item ? item.rudderProperty : 'email';
};

const deduceExternalIdValue = (message, emersysIdentifier, fieldMapping) => {
  const configuredPayloadProperty = findRudderPropertyByEmersysProperty(
    emersysIdentifier,
    fieldMapping,
  );
  const externalIdValue = getValueFromMessage(message, [
    `traits.${configuredPayloadProperty}`,
    `context.traits.${configuredPayloadProperty}`,
  ]);

  if (!isDefinedAndNotNull(deduceExternalIdValue)) {
    throw new InstrumentationError(
      `Could not find value for externalId required in ${message.type} call. Aborting.`,
    );
  }

  return externalIdValue;
};

const buildGroupPayload = (message, destConfig) => {
  const { emersysCustomIdentifier, defaultContactList, fieldMapping } = destConfig;
  const integrationObject = getIntegrationsObj(message, 'emarsys');
  const emersysIdentifier = deduceCustomIdentifier(integrationObject, emersysCustomIdentifier);
  const externalIdValue = deduceExternalIdValue(message, emersysIdentifier, fieldMapping);
  if (!isDefinedAndNotNull(externalIdValue)) {
    throw new InstrumentationError(
      `No value found in payload for contact custom identifier of id ${emersysIdentifier}`,
    );
  }
  const payload = {
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

const deduceEventId = (message, destConfig) => {
  let eventId;
  const { eventsMapping } = destConfig;
  const { event } = message;
  validateEventName(event);
  if (Array.isArray(eventsMapping) && eventsMapping.length > 0) {
    const keyMap = getHashFromArray(eventsMapping, 'from', 'to', false);
    eventId = keyMap[event];
  }
  if (!eventId) {
    throw new ConfigurationError(`${event} is not mapped to any Emersys external event. Aborting`);
  }
  return eventId;
};

const deduceEndPoint = (finalPayload) => {
  let endPoint;
  let eventId;
  let contactListId;
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

const estimateJsonSize = (obj) => new Blob([JSON.stringify(obj)]).size;

const createSingleIdentifyPayload = (keyId, contacts, contactListId) => ({
  key_id: keyId,
  contacts,
  contact_list_id: contactListId,
});

const ensureSizeConstraints = (contacts) => {
  const chunks = [];
  let currentBatch = [];
  for (const contact of contacts) {
    if (
      currentBatch.length === 0 ||
      estimateJsonSize([...currentBatch, contact]) < MAX_BATCH_SIZE_BYTES
    ) {
      currentBatch.push(contact);
    } else {
      chunks.push(currentBatch);
      currentBatch = [contact];
    }
  }

  // Add the remaining batch if not empty
  if (currentBatch.length > 0) {
    chunks.push(currentBatch);
  }

  return chunks;
};

const createIdentifyBatches = (events) => {
  const groupedIdentifyPayload = lodash.groupBy(
    events,
    (item) =>
      `${item.message[0].body.JSON.destinationPayload.key_id}-${item.message[0].body.JSON.destinationPayload.contact_list_id}`,
  );
  return lodash.flatMap(groupedIdentifyPayload, (group) => {
    const firstItem = group[0].message[0].body.JSON.destinationPayload;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { key_id, contact_list_id } = firstItem;

    const allContacts = lodash.flatMap(
      group,
      (item) => item.message[0].body.JSON.destinationPayload.contacts,
    );
    const initialChunks = lodash.chunk(allContacts, MAX_BATCH_SIZE);
    const finalChunks = lodash.flatMap(initialChunks, ensureSizeConstraints);

    // Include metadata for each chunk
    return finalChunks.map((contacts) => ({
      payload: createSingleIdentifyPayload(key_id, contacts, contact_list_id),
      metadata: group.map((g) => g.metadata),
    }));
  });
};

const createGroupBatches = (events) => {
  const grouped = lodash.groupBy(
    events,
    (item) =>
      `${item.message[0].body.JSON.destinationPayload.payload.key_id}-${item.message[0].body.JSON.destinationPayload.contactListId}`,
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return Object.entries(grouped).flatMap(([key, group]) => {
    const keyId = group[0].message[0].body.JSON.destinationPayload.payload.key_id;
    const { contactListId } = group[0].message[0].body.JSON.destinationPayload;
    const combinedExternalIds = group.reduce((acc, item) => {
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

const createTrackBatches = (events) => [
  {
    endpoint: events[0].message[0].endpoint,
    payload: events[0].message[0].body.JSON.destinationPayload.payload,
    metadata: [events[0].metadata],
  },
];
const formatIdentifyPayloadsWithEndpoint = (combinedPayloads, endpointUrl = '') =>
  combinedPayloads.map((singleCombinedPayload) => ({
    endpoint: endpointUrl,
    payload: singleCombinedPayload.payload,
    metadata: singleCombinedPayload.metadata,
  }));

const buildBatchedRequest = (batches, method, constants, batchedStatus = true) =>
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
function initializeConstants(successfulEvents) {
  if (successfulEvents.length === 0) return null;
  return {
    version: successfulEvents[0].message[0].version,
    type: successfulEvents[0].message[0].type,
    headers: successfulEvents[0].message[0].headers,
    destination: successfulEvents[0].destination,
  };
}

// Helper to append requests based on batched events and constants
function appendRequestsToOutput(groupPayload, output, constants, batched = true) {
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
function processEventBatches(typedEventGroups, constants) {
  let batchesOfIdentifyEvents;
  const finalOutput = [];

  // Process each event group based on type
  for (const eventType of Object.keys(typedEventGroups)) {
    switch (eventType) {
      case EventType.IDENTIFY:
        batchesOfIdentifyEvents = createIdentifyBatches(typedEventGroups[eventType]);
        groupedSuccessfulPayload.identify.batches = formatIdentifyPayloadsWithEndpoint(
          batchesOfIdentifyEvents,
          'https://api.emarsys.net/api/v2/contact/?create_if_not_exists=1',
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
  }

  // Convert batches into requests for each event type and push to final output
  appendRequestsToOutput(groupedSuccessfulPayload.identify, finalOutput, constants);
  appendRequestsToOutput(groupedSuccessfulPayload.group, finalOutput, constants);
  appendRequestsToOutput(groupedSuccessfulPayload.track, finalOutput, constants, false);

  return finalOutput;
}

// Entry function to create batches from successful events
function batchResponseBuilder(successfulEvents) {
  const constants = initializeConstants(successfulEvents);
  if (!constants) return [];

  const typedEventGroups = lodash.groupBy(
    successfulEvents,
    (event) => event.message[0].body.JSON.eventType,
  );

  return processEventBatches(typedEventGroups, constants);
}

module.exports = {
  buildIdentifyPayload,
  buildGroupPayload,
  buildHeader,
  deduceEndPoint,
  batchResponseBuilder,
  base64Sha,
  getWsseHeader,
  findRudderPropertyByEmersysProperty,
  formatIdentifyPayloadsWithEndpoint,
  createSingleIdentifyPayload,
  createIdentifyBatches,
  ensureSizeConstraints,
  createGroupBatches,
  deduceExternalIdValue,
  deduceEventId,
  deduceCustomIdentifier,
};

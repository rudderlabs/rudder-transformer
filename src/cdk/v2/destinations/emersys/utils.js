import { EVENT_TYPE } from 'rudder-transformer-cdk/build/constants';

const lodash = require('lodash');
const crypto = require('crypto');

const {
  InstrumentationError,
  isDefinedAndNotNullAndNotEmpty,
  removeUndefinedAndNullAndEmptyValues,
  removeUndefinedAndNullValues,
  isDefinedAndNotNull,
} = require('@rudderstack/integrations-lib');
const { getValueFromMessage } = require('rudder-transformer-cdk/build/utils');
const { getIntegrationsObj } = require('../../../../v0/util');
const {
  EMAIL_FIELD_ID,
  MAX_BATCH_SIZE,
  OPT_IN_FILED_ID,
  ALLOWED_OPT_IN_VALUES,
} = require('./config');

function base64Sha(str) {
  const hexDigest = crypto.createHash('sha1').update(str).digest('hex');
  return Buffer.from(hexDigest).toString('base64');
}

function getWsseHeader(user, secret) {
  const nonce = crypto.randomBytes(16).toString('hex');
  const timestamp = new Date().toISOString();

  const digest = base64Sha(nonce + timestamp + secret);
  return `UsernameToken Username="${user}", PasswordDigest="${digest}", Nonce="${nonce}", Created="${timestamp}"`;
}

const buildHeader = (destConfig) => {
  const { emersysUsername, emersysUserSecret } = destConfig;
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-WSSE': getWsseHeader(emersysUsername, emersysUserSecret),
  };
};

const buildIdentifyPayload = (message, destination) => {
  let destinationPayload;
  const { fieldMapping, emersysCustomIdentifier, discardEmptyProperties, defaultContactList } =
    destination.Config;
  const payload = {};

  const integrationObject = getIntegrationsObj(message, 'emersys');
  const finalContactList = integrationObject?.contactListId || defaultContactList;

  if (!isDefinedAndNotNullAndNotEmpty(finalContactList)) {
    throw new InstrumentationError(
      'Cannot a find a specific contact list either through configuration or via integrations object',
    );
  }
  if (fieldMapping) {
    fieldMapping.forEach((trait) => {
      const { rudderProperty, emersysProperty } = trait;
      const value =
        getValueFromMessage(message.traits, rudderProperty) ||
        getValueFromMessage(message.context.traits, rudderProperty);
      if (value) {
        payload[emersysProperty] = value;
      }
    });
  }
  const emersysIdentifier =
    integrationObject?.customIdentifierId || emersysCustomIdentifier || EMAIL_FIELD_ID;
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

function findRudderPropertyByEmersysProperty(emersysProperty, fieldMapping) {
  // Use lodash to find the object where the emersysProperty matches the input
  const item = lodash.find(fieldMapping, { emersysProperty });
  // Return the rudderProperty if the object is found, otherwise return null
  return item ? item.rudderProperty : null;
}

const buildGroupPayload = (message, destination) => {
  const { emersysCustomIdentifier, defaultContactList, fieldMapping } = destination.Config;
  const integrationObject = getIntegrationsObj(message, 'emersys');
  const emersysIdentifier =
    integrationObject?.customIdentifierId || emersysCustomIdentifier || EMAIL_FIELD_ID;
  const configuredPayloadProperty = findRudderPropertyByEmersysProperty(
    emersysIdentifier,
    fieldMapping,
  );
  const externalIdValue = getValueFromMessage(message.context.traits, configuredPayloadProperty);
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

const deduceEndPoint = (message, destConfig, batchGroupId = undefined) => {
  let endPoint;
  let contactListId;
  const { type, groupId } = message;
  switch (type) {
    case EVENT_TYPE.IDENTIFY:
      endPoint = 'https://api.emarsys.net/api/v2/contact/?create_if_not_exists=1';
      break;
    case EVENT_TYPE.GROUP:
      contactListId = batchGroupId || groupId || destConfig.defaultContactList;
      endPoint = `https://api.emarsys.net/api/v2/contactlist/${contactListId}/add`;
      break;
    default:
      break;
  }
  return endPoint;
};

function estimateJsonSize(obj) {
  return new Blob([JSON.stringify(obj)]).size;
}

function createPayload(keyId, contacts, contactListId) {
  return { key_id: keyId, contacts, contact_list_id: contactListId };
}

function ensureSizeConstraints(contacts) {
  const MAX_SIZE_BYTES = 8000000; // 8 MB
  const chunks = [];
  let currentBatch = [];

  contacts.forEach((contact) => {
    // Start a new batch if adding the next contact exceeds size limits
    if (
      currentBatch.length === 0 ||
      estimateJsonSize([...currentBatch, contact]) < MAX_SIZE_BYTES
    ) {
      currentBatch.push(contact);
    } else {
      chunks.push(currentBatch);
      currentBatch = [contact];
    }
  });

  // Add the remaining batch if not empty
  if (currentBatch.length > 0) {
    chunks.push(currentBatch);
  }

  return chunks;
}

function createIdentifyBatches(events) {
  const groupedIdentifyPayload = lodash.groupBy(
    events,
    (item) =>
      `${item.message.body.JSON.destinationPayload.key_id}-${item.message.body.JSON.destinationPayload.contact_list_id}`,
  );

  return lodash.flatMap(groupedIdentifyPayload, (group) => {
    const firstItem = group[0].message.body.JSON.destinationPayload;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { key_id, contact_list_id } = firstItem;

    const allContacts = lodash.flatMap(
      group,
      (item) => item.message.body.JSON.destinationPayload.contacts,
    );
    const initialChunks = lodash.chunk(allContacts, MAX_BATCH_SIZE);
    const finalChunks = lodash.flatMap(initialChunks, ensureSizeConstraints);

    // Include metadata for each chunk
    return finalChunks.map((contacts) => ({
      payload: createPayload(key_id, contacts, contact_list_id),
      metadata: group.map((g) => g.metadata), // assuming metadata is needed per original event grouping
    }));
  });
}

function createGroupBatches(events) {
  const grouped = lodash.groupBy(
    events,
    (item) =>
      `${item.message.body.JSON.destinationPayload.payload.key_id}-${item.message.body.JSON.destinationPayload.contactListId}`,
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return Object.entries(grouped).flatMap(([key, group]) => {
    const keyId = group[0].message.body.JSON.destinationPayload.payload.key_id;
    const { contactListId } = group[0].message.body.JSON.destinationPayload;
    const combinedExternalIds = group.reduce((acc, item) => {
      acc.push(...item.message.body.JSON.destinationPayload.payload.external_ids);
      return acc;
    }, []);

    const idChunks = lodash.chunk(combinedExternalIds, MAX_BATCH_SIZE);

    return idChunks.map((chunk) => ({
      endpoint: `https://api.emarsys.net/api/v2/contactlist/${contactListId}/add`,
      payload: {
        key_id: keyId,
        external_ids: chunk,
      },
      metadata: group.map((g) => g.metadata), // assuming metadata is needed per original event grouping
    }));
  });
}
function formatIdentifyPayloadsWithEndpoint(combinedPayloads, endpointUrl = '') {
  return combinedPayloads.map((payload) => ({
    endpoint: endpointUrl,
    payload,
  }));
}

function buildBatchedRequest(batches, method, constants) {
  return batches.map((batch) => ({
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
    batched: true,
    statusCode: 200,
    destination: constants.destination,
  }));
}

function batchResponseBuilder(successfulEvents) {
  const finaloutput = [];
  const groupedSuccessfulPayload = {
    identify: {
      method: 'PUT',
      batches: [],
    },
    group: {
      method: 'POST',
      batches: [],
    },
  };
  let batchesOfIdentifyEvents;
  if (successfulEvents.length === 0) {
    return [];
  }
  const constants = {
    version: successfulEvents[0].message[0].version,
    type: successfulEvents[0].message[0].type,
    headers: successfulEvents[0].message[0].headers,
    destination: successfulEvents[0].destination,
  };

  const typedEventGroups = lodash.groupBy(
    successfulEvents,
    (event) => event.message.body.JSON.eventType,
  );
  Object.keys(typedEventGroups).forEach((eachEventGroup) => {
    switch (eachEventGroup) {
      case EVENT_TYPE.IDENTIFY:
        batchesOfIdentifyEvents = createIdentifyBatches(eachEventGroup);
        groupedSuccessfulPayload.identify.batches = formatIdentifyPayloadsWithEndpoint(
          batchesOfIdentifyEvents,
          'https://api.emarsys.net/api/v2/contact/?create_if_not_exists=1',
        );
        break;
      case EVENT_TYPE.GROUP:
        groupedSuccessfulPayload.group.batches = createGroupBatches(eachEventGroup);
        break;
      default:
        break;
    }
    return groupedSuccessfulPayload;
  });
  // Process each identify batch
  if (groupedSuccessfulPayload.identify) {
    const identifyBatches = buildBatchedRequest(
      groupedSuccessfulPayload.identify.batches,
      groupedSuccessfulPayload.identify.method,
      constants,
    );
    finaloutput.push(...identifyBatches);
  }

  // Process each group batch
  if (groupedSuccessfulPayload.group) {
    const groupBatches = buildBatchedRequest(
      groupedSuccessfulPayload.group.batches,
      groupedSuccessfulPayload.group.method,
      constants,
    );
    finaloutput.push(...groupBatches);
  }

  return finaloutput;
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
};

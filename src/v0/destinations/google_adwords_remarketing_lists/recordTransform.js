/* eslint-disable no-const-assign */
const lodash = require('lodash');
const { InstrumentationError } = require('@rudderstack/integrations-lib');
const {
  getValueFromMessage,
  getAccessToken,
  constructPayload,
  returnArrayOfSubarrays,
  getSuccessRespEvents,
  isEventSentByVDMV1Flow,
  isEventSentByVDMV2Flow,
} = require('../../util');
const { populateConsentFromConfig } = require('../../util/googleUtils');
const {
  populateIdentifiersForRecordEvent,
  responseBuilder,
  getOperationAudienceId,
} = require('./util');
const { getErrorResponse, createFinalResponse } = require('../../util/recordUtils');
const { offlineDataJobsMapping, consentConfigMap } = require('./config');

const processRecordEventArray = (
  records,
  message,
  destination,
  accessToken,
  developerToken,
  audienceId,
  typeOfList,
  userSchema,
  isHashRequired,
  userDataConsent,
  personalizationConsent,
  operationType,
) => {
  let outputPayloads = {};
  // ** only send it if identifier > 0

  const fieldsArray = [];
  const metadata = [];
  records.forEach((record) => {
    fieldsArray.push(record.message.fields);
    metadata.push(record.metadata);
  });

  const userIdentifiersList = populateIdentifiersForRecordEvent(
    fieldsArray,
    typeOfList,
    userSchema,
    isHashRequired,
  );

  const outputPayload = constructPayload(message, offlineDataJobsMapping);
  outputPayload.operations = [];
  // breaking the userIdentiFier array in chunks of 20
  const userIdentifierChunks = returnArrayOfSubarrays(userIdentifiersList, 20);
  // putting each chunk in different create/remove operations
  switch (operationType) {
    case 'add':
      // for add operation
      userIdentifierChunks.forEach((element) => {
        const operations = {
          create: {},
        };
        operations.create.userIdentifiers = element;
        outputPayload.operations.push(operations);
      });
      outputPayloads = { ...outputPayloads, create: outputPayload };
      break;
    case 'remove':
      // for remove operation
      userIdentifierChunks.forEach((element) => {
        const operations = {
          remove: {},
        };
        operations.remove.userIdentifiers = element;
        outputPayload.operations.push(operations);
      });
      outputPayloads = { ...outputPayloads, remove: outputPayload };
      break;
    default:
  }

  const toSendEvents = [];
  Object.values(outputPayloads).forEach((data) => {
    const consentObj = populateConsentFromConfig(
      { userDataConsent, personalizationConsent },
      consentConfigMap,
    );
    toSendEvents.push(
      responseBuilder(accessToken, developerToken, data, destination, audienceId, consentObj),
    );
  });

  const successResponse = getSuccessRespEvents(toSendEvents, metadata, destination, true);

  return successResponse;
};

function preparepayload(events, config) {
  const { destination, message, metadata } = events[0];
  const accessToken = getAccessToken(metadata, 'access_token');
  const developerToken = getValueFromMessage(metadata, 'secret.developer_token');
  const {
    audienceId,
    typeOfList,
    isHashRequired,
    userSchema,
    userDataConsent,
    personalizationConsent,
  } = config;

  const groupedRecordsByAction = lodash.groupBy(events, (record) =>
    record.message.action?.toLowerCase(),
  );

  let insertResponse;
  let deleteResponse;
  let updateResponse;

  if (groupedRecordsByAction.delete) {
    deleteResponse = processRecordEventArray(
      groupedRecordsByAction.delete,
      message,
      destination,
      accessToken,
      developerToken,
      audienceId,
      typeOfList,
      userSchema,
      isHashRequired,
      userDataConsent,
      personalizationConsent,
      'remove',
    );
  }

  if (groupedRecordsByAction.insert) {
    insertResponse = processRecordEventArray(
      groupedRecordsByAction.insert,
      message,
      destination,
      accessToken,
      developerToken,
      audienceId,
      typeOfList,
      userSchema,
      isHashRequired,
      userDataConsent,
      personalizationConsent,
      'add',
    );
  }

  if (groupedRecordsByAction.update) {
    updateResponse = processRecordEventArray(
      groupedRecordsByAction.update,
      message,
      destination,
      accessToken,
      developerToken,
      audienceId,
      typeOfList,
      userSchema,
      isHashRequired,
      userDataConsent,
      personalizationConsent,
      'add',
    );
  }

  const errorResponse = getErrorResponse(groupedRecordsByAction);
  const finalResponse = createFinalResponse(
    deleteResponse,
    insertResponse,
    updateResponse,
    errorResponse,
  );
  if (finalResponse.length === 0) {
    throw new InstrumentationError(
      'Missing valid parameters, unable to generate transformed payload',
    );
  }

  return finalResponse;
}

function processRecordInputsV0(groupedRecordInputs) {
  const { destination, message } = groupedRecordInputs[0];
  const {
    audienceId,
    typeOfList,
    isHashRequired,
    userSchema,
    userDataConsent,
    personalizationConsent,
  } = destination.Config;

  return preparepayload(groupedRecordInputs, {
    audienceId: getOperationAudienceId(audienceId, message),
    typeOfList,
    userSchema,
    isHashRequired,
    userDataConsent,
    personalizationConsent,
  });
}

function processRecordInputsV1(groupedRecordInputs) {
  const { connection, message } = groupedRecordInputs[0];
  const { audienceId, typeOfList, isHashRequired, userDataConsent, personalizationConsent } =
    connection.config.destination;

  const identifiers = message?.identifiers;
  let userSchema;
  if (identifiers) {
    userSchema = Object.keys(identifiers);
  }

  const events = groupedRecordInputs.map((record) => ({
    ...record,
    message: {
      ...record.message,
      fields: record.message.identifiers,
    },
  }));

  return preparepayload(events, {
    audienceId,
    typeOfList,
    userSchema,
    isHashRequired,
    userDataConsent,
    personalizationConsent,
  });
}

function processRecordInputs(groupedRecordInputs) {
  const event = groupedRecordInputs[0];
  // First check for rETL flow and second check for ES flow
  if (isEventSentByVDMV1Flow(event) || !isEventSentByVDMV2Flow(event)) {
    return processRecordInputsV0(groupedRecordInputs);
  }
  return processRecordInputsV1(groupedRecordInputs);
}

module.exports = {
  processRecordInputs,
};

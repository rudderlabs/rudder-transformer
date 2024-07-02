/* eslint-disable no-const-assign */
const lodash = require('lodash');
const { InstrumentationError } = require('@rudderstack/integrations-lib');
const {
  getValueFromMessage,
  getAccessToken,
  constructPayload,
  returnArrayOfSubarrays,
  getSuccessRespEvents,
} = require('../../util');
const { populateConsentFromConfig } = require('../../util/googleUtils');
const { populateIdentifiers, responseBuilder } = require('./util');
const { getErrorResponse, createFinalResponse } = require('../../util/recordUtils');
const { offlineDataJobsMapping, consentConfigMap } = require('./config');

const processRecordEventArray = (
  records,
  message,
  destination,
  accessToken,
  developerToken,
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

  const userIdentifiersList = populateIdentifiers(fieldsArray, destination);

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
    const consentObj = populateConsentFromConfig(destination.Config, consentConfigMap);
    toSendEvents.push(
      responseBuilder(accessToken, developerToken, data, destination, message, consentObj),
    );
  });

  const successResponse = getSuccessRespEvents(toSendEvents, metadata, destination, true);

  return successResponse;
};

async function processRecordInputs(groupedRecordInputs) {
  const { destination, message, metadata } = groupedRecordInputs[0];
  const accessToken = getAccessToken(metadata, 'access_token');
  const developerToken = getValueFromMessage(metadata, 'secret.developer_token');

  const groupedRecordsByAction = lodash.groupBy(groupedRecordInputs, (record) =>
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

module.exports = {
  processRecordInputs,
};

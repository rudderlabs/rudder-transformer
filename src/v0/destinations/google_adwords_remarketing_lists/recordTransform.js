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

const processRecordEventArray = (records, context, operationType) => {
  const {
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
  } = context;

  const fieldsArray = records.map((record) => record.message.fields);
  const metadata = records.map((record) => record.metadata);

  const userIdentifiersList = populateIdentifiersForRecordEvent(
    fieldsArray,
    typeOfList,
    userSchema,
    isHashRequired,
  );

  const outputPayload = constructPayload(message, offlineDataJobsMapping);

  const userIdentifierChunks = returnArrayOfSubarrays(userIdentifiersList, 20);
  outputPayload.operations = userIdentifierChunks.map((chunk) => ({
    [operationType]: { userIdentifiers: chunk },
  }));

  const consentObj = populateConsentFromConfig(
    { userDataConsent, personalizationConsent },
    consentConfigMap,
  );

  const toSendEvents = [outputPayload].map((data) =>
    responseBuilder(accessToken, developerToken, data, destination, audienceId, consentObj),
  );

  return getSuccessRespEvents(toSendEvents, metadata, destination, true);
};

function preparePayload(events, config) {
  const { destination, message, metadata } = events[0];
  const accessToken = getAccessToken(metadata, 'access_token');
  const developerToken = getValueFromMessage(metadata, 'secret.developer_token');

  const context = {
    message,
    destination,
    accessToken,
    developerToken,
    ...config,
  };

  const groupedRecordsByAction = lodash.groupBy(events, (record) =>
    record.message.action?.toLowerCase(),
  );

  const actionResponses = ['delete', 'insert', 'update'].reduce((responses, action) => {
    const operationType = action === 'delete' ? 'remove' : 'create';
    if (groupedRecordsByAction[action]) {
      return {
        ...responses,
        [action]: processRecordEventArray(groupedRecordsByAction[action], context, operationType),
      };
    }
    return responses;
  }, {});

  const errorResponse = getErrorResponse(groupedRecordsByAction);
  const finalResponse = createFinalResponse(
    actionResponses.delete,
    actionResponses.insert,
    actionResponses.update,
    errorResponse,
  );

  if (finalResponse.length === 0) {
    throw new InstrumentationError(
      'Missing valid parameters, unable to generate transformed payload',
    );
  }

  return finalResponse;
}

function processEventStreamRecordV1Events(groupedRecordInputs) {
  const { destination } = groupedRecordInputs[0];
  const {
    audienceId,
    typeOfList,
    isHashRequired,
    userSchema,
    userDataConsent,
    personalizationConsent,
  } = destination.Config;

  const config = {
    audienceId,
    typeOfList,
    userSchema,
    isHashRequired,
    userDataConsent,
    personalizationConsent,
  };

  return preparePayload(groupedRecordInputs, config);
}

function processVDMV1RecordEvents(groupedRecordInputs) {
  const { destination, message } = groupedRecordInputs[0];
  const {
    audienceId,
    typeOfList,
    isHashRequired,
    userSchema,
    userDataConsent,
    personalizationConsent,
  } = destination.Config;

  const config = {
    audienceId: getOperationAudienceId(audienceId, message),
    typeOfList,
    userSchema,
    isHashRequired,
    userDataConsent,
    personalizationConsent,
  };

  return preparePayload(groupedRecordInputs, config);
}

function processVDMV2RecordEvents(groupedRecordInputs) {
  const { connection, message } = groupedRecordInputs[0];
  const { audienceId, typeOfList, isHashRequired, userDataConsent, personalizationConsent } =
    connection.config.destination;

  const userSchema = message?.identifiers ? Object.keys(message.identifiers) : undefined;

  const events = groupedRecordInputs.map((record) => ({
    ...record,
    message: {
      ...record.message,
      fields: record.message.identifiers,
    },
  }));

  const config = {
    audienceId,
    typeOfList,
    userSchema,
    isHashRequired,
    userDataConsent,
    personalizationConsent,
  };

  return preparePayload(events, config);
}

function processRecordInputs(groupedRecordInputs) {
  const event = groupedRecordInputs[0];

  if (isEventSentByVDMV1Flow(event)) {
    return processVDMV1RecordEvents(groupedRecordInputs);
  }
  if (isEventSentByVDMV2Flow(event)) {
    return processVDMV2RecordEvents(groupedRecordInputs);
  }
  return processEventStreamRecordV1Events(groupedRecordInputs);
}

module.exports = {
  processRecordInputs,
};

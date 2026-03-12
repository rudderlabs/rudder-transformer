import {
  InstrumentationError,
  groupByInBatches,
  mapInBatches,
  reduceInBatches,
  isDefinedAndNotNullAndNotEmpty,
} from '@rudderstack/integrations-lib';
import {
  getAccessToken,
  constructPayload,
  returnArrayOfSubarrays,
  getSuccessRespEvents,
  isEventSentByVDMV1Flow,
  isEventSentByVDMV2Flow,
  generateErrorObject,
  getErrorRespEvents,
} from '../../util';
import { populateConsentFromConfig } from '../../util/googleUtils';
import { populateIdentifiersForRecordEvent, responseBuilder, getOperationAudienceId } from './util';
import { getErrorResponse, createFinalResponse } from '../../util/recordUtils';
import { offlineDataJobsMapping, consentConfigMap } from './config';
import type { RecordEventContext, RecordInput } from './types';

const processRecordEventArray = async (
  records: RecordInput[],
  context: RecordEventContext,
  operationType: string,
) => {
  const {
    message,
    destination,
    accessToken,
    audienceId,
    typeOfList,
    userSchema,
    isHashRequired,
    userDataConsent,
    personalizationConsent,
  } = context;

  const fieldsArray = await mapInBatches(records, (record) => record.message.fields);
  const metadata = await mapInBatches(records, (record) => record.metadata);

  const userIdentifiersList = populateIdentifiersForRecordEvent(
    fieldsArray,
    typeOfList,
    userSchema,
    isHashRequired,
  );

  const outputPayload = constructPayload(message, offlineDataJobsMapping)!;

  const userIdentifierChunks = returnArrayOfSubarrays(userIdentifiersList, 20);
  outputPayload.operations = await mapInBatches(userIdentifierChunks, (chunk) => ({
    [operationType]: { userIdentifiers: chunk },
  }));

  const consentObj = populateConsentFromConfig(
    { userDataConsent, personalizationConsent },
    consentConfigMap,
  );

  const toSendEvents = [outputPayload].map((data) =>
    responseBuilder(accessToken, data, destination, audienceId, consentObj),
  );

  return getSuccessRespEvents(toSendEvents, metadata, destination, true);
};

async function preparePayload(
  events: RecordInput[],
  config: Omit<RecordEventContext, 'message' | 'destination' | 'accessToken'>,
) {
  /**
   * If we are getting invalid identifiers, we are preparing empty object response for that event and that is ending up
   * as an error from google ads api. So we are validating the identifiers and then processing the events.
   */

  const { validEvents, invalidEvents } = await reduceInBatches(
    events,
    (acc, event) => {
      const hasValidIdentifiers = Object.values(event.message?.fields || {}).some(
        isDefinedAndNotNullAndNotEmpty,
      );
      if (hasValidIdentifiers) {
        acc.validEvents.push(event);
      } else {
        const error = new InstrumentationError('Event has no valid identifiers');
        const errorObj = generateErrorObject(error);
        acc.invalidEvents.push(
          getErrorRespEvents(
            [event.metadata],
            errorObj.status,
            errorObj.message,
            errorObj.statTags,
          ),
        );
      }
      return acc;
    },
    { validEvents: [] as RecordInput[], invalidEvents: [] as unknown[] },
  );

  if (validEvents.length === 0) {
    return invalidEvents;
  }

  const { destination, message, metadata } = validEvents[0];
  const accessToken = getAccessToken(metadata, 'access_token');

  const context: RecordEventContext = {
    message,
    destination,
    accessToken,
    ...config,
  };

  const groupedRecordsByAction = await groupByInBatches(
    validEvents,
    (record) => record.message.action?.toLowerCase() || '',
  );

  const actionResponses = await reduceInBatches(
    ['delete', 'insert', 'update'],
    async (responses: Record<string, unknown>, action: string) => {
      const operationType = action === 'delete' ? 'remove' : 'create';
      if (groupedRecordsByAction[action]) {
        return {
          ...responses,
          [action]: await processRecordEventArray(
            groupedRecordsByAction[action],
            context,
            operationType,
          ),
        };
      }
      return responses;
    },
    {},
  );

  const errorResponse = [...invalidEvents, ...getErrorResponse(groupedRecordsByAction)];
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

async function processEventStreamRecordV1Events(groupedRecordInputs: RecordInput[]) {
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

async function processVDMV1RecordEvents(groupedRecordInputs: RecordInput[]) {
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

async function processVDMV2RecordEvents(groupedRecordInputs: RecordInput[]) {
  const { connection, message } = groupedRecordInputs[0];
  const { audienceId, typeOfList, isHashRequired, userDataConsent, personalizationConsent } =
    connection.config.destination;

  const userSchema = message?.identifiers ? Object.keys(message.identifiers) : undefined;

  const events = (await mapInBatches(groupedRecordInputs, (record) => ({
    ...record,
    message: {
      ...record.message,
      fields: record.message.identifiers,
    },
  }))) as RecordInput[];

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

async function processRecordInputs(groupedRecordInputs: RecordInput[]) {
  const event = groupedRecordInputs[0];

  if (isEventSentByVDMV1Flow(event)) {
    return processVDMV1RecordEvents(groupedRecordInputs);
  }
  if (isEventSentByVDMV2Flow(event)) {
    return processVDMV2RecordEvents(groupedRecordInputs);
  }
  return processEventStreamRecordV1Events(groupedRecordInputs);
}

export { processRecordInputs };

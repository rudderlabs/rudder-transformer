import {
  InstrumentationError,
  groupByInBatches,
  mapInBatches,
  reduceInBatches,
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
  workspaceId: string,
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

  const recordIdentifiers = populateIdentifiersForRecordEvent(
    fieldsArray,
    typeOfList,
    userSchema,
    isHashRequired,
    workspaceId,
    destination.ID,
  );

  const validMetadata: (typeof metadata)[0][] = [];
  const userIdentifiersList: Record<string, unknown>[] = [];
  const invalidResponses: unknown[] = [];

  recordIdentifiers.forEach((result, i) => {
    if ('error' in result) {
      const errorObj = generateErrorObject(result.error);
      invalidResponses.push(
        getErrorRespEvents([metadata[i]], errorObj.status, errorObj.message, errorObj.statTags),
      );
    } else {
      validMetadata.push(metadata[i]);
      userIdentifiersList.push(...result.identifiers);
    }
  });

  if (userIdentifiersList.length === 0) {
    return { successResponse: null, invalidResponses };
  }

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

  return {
    successResponse: getSuccessRespEvents(toSendEvents, validMetadata, destination, true),
    invalidResponses,
  };
};

async function preparePayload(
  events: RecordInput[],
  config: Omit<RecordEventContext, 'message' | 'destination' | 'accessToken'>,
) {
  const { destination, message, metadata } = events[0];
  const accessToken = getAccessToken(metadata, 'access_token');

  const { workspaceId } = metadata;

  const context: RecordEventContext = {
    message,
    destination,
    accessToken,
    ...config,
  };

  const groupedRecordsByAction = await groupByInBatches(
    events,
    (record) => record.message.action?.toLowerCase() || '',
  );

  const actionResponses = await reduceInBatches(
    ['delete', 'insert', 'update'],
    async (
      responses: Record<string, { successResponse: unknown; invalidResponses: unknown[] }>,
      action: string,
    ) => {
      const operationType = action === 'delete' ? 'remove' : 'create';
      if (groupedRecordsByAction[action]) {
        return {
          ...responses,
          [action]: await processRecordEventArray(
            groupedRecordsByAction[action] as RecordInput[],
            context,
            operationType,
            workspaceId,
          ),
        };
      }
      return responses;
    },
    {},
  );

  const perRecordInvalidResponses = ['delete', 'insert', 'update'].flatMap(
    (action) => actionResponses[action]?.invalidResponses ?? [],
  );
  const errorResponse = [...perRecordInvalidResponses, ...getErrorResponse(groupedRecordsByAction)];
  const finalResponse = createFinalResponse(
    actionResponses.delete?.successResponse,
    actionResponses.insert?.successResponse,
    actionResponses.update?.successResponse,
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

import {
  InstrumentationError,
  groupByInBatches,
  mapInBatches,
  reduceInBatches,
} from '@rudderstack/integrations-lib';
import {
  getAccessToken,
  returnArrayOfSubarrays,
  getSuccessRespEvents,
  isEventSentByVDMV1Flow,
  isEventSentByVDMV2Flow,
  generateErrorObject,
  getErrorRespEvents,
} from '../../../util';
import { getErrorResponse, createFinalResponse } from '../../../util/recordUtils';
import { getOperationAudienceId } from '../util';
import type { RecordInput } from '../types';
import {
  buildAudienceMember,
  buildMemberConsentFromConfig,
  responseBuilder,
} from './util';
import { DATA_MANAGER_BATCH_SIZE } from './config';
import type {
  AudienceMember,
  GARLBatchRequestOutput,
  GARLDestinationConfig,
  GARLRouterRequest,
} from './types';
import { Metadata, ProcessorTransformationResponse } from '../../../../types';

interface DataManagerRecordContext {
  destination: RecordInput['destination'];
  accessToken: string;
  audienceId: string;
  typeOfList: string;
  userSchema?: string[];
  isHashRequired: boolean;
}

/**
 * Processes a batch of records for a single action (insert/update/delete).
 * Each record.message.fields → one AudienceMember with per-record error handling.
 * Valid members are batched in chunks of DATA_MANAGER_BATCH_SIZE (10,000).
 */
const processRecordEventArray = async (
  records: GARLRouterRequest[],
  context: DataManagerRecordContext,
  isIngest: boolean,
  workspaceId: string,
): Promise<{
  successResponse: GARLBatchRequestOutput | null;
  invalidResponses: ProcessorTransformationResponse[];
}> => {
  const { destination, accessToken, audienceId, typeOfList, userSchema, isHashRequired } = context;

  const fieldsArray = await mapInBatches<GARLRouterRequest, Record<string, unknown>>(
    records,
    (record) => record.message.fields as Record<string, unknown>,
  );
  const metadataArray = await mapInBatches(records, (record) => record.metadata);

  const memberConsent = buildMemberConsentFromConfig(destination.Config);

  const validMembers: AudienceMember[] = [];
  const validMetadata: Metadata[] = [];
  const invalidResponses: ProcessorTransformationResponse[] = [];

  fieldsArray.forEach((rawFields, i) => {
    const result = buildAudienceMember(
      rawFields,
      typeOfList,
      userSchema,
      { workspaceId, destinationId: destination.ID, isHashRequired },
      memberConsent,
    );

    if ('error' in result) {
      const errorObj = generateErrorObject(result.error);
      invalidResponses.push(
        getErrorRespEvents(
          [metadataArray[i]],
          errorObj.status,
          errorObj.message,
          errorObj.statTags,
        ),
      );
    } else {
      validMembers.push(result.member);
      validMetadata.push(metadataArray[i]);
    }
  });

  if (validMembers.length === 0) {
    return { successResponse: null, invalidResponses };
  }

  const memberChunks: AudienceMember[][] = returnArrayOfSubarrays(
    validMembers,
    DATA_MANAGER_BATCH_SIZE,
  );

  const toSendEvents = memberChunks.map((chunk) =>
    responseBuilder(
      accessToken,
      chunk,
      destination,
      audienceId,
      isIngest,
      memberConsent,
    ),
  );

  return {
    successResponse: getSuccessRespEvents(toSendEvents, validMetadata, destination, true),
    invalidResponses,
  };
};

async function preparePayload(
  events: GARLRouterRequest[],
  config: GARLDestinationConfig,
) {
  const { destination, metadata } = events[0];
  const accessToken = getAccessToken(metadata, 'access_token');
  const { workspaceId } = metadata;

  const context: DataManagerRecordContext = {
    destination,
    accessToken,
    ...config,
  };

  const groupedRecordsByAction = await groupByInBatches(
    events,
    (record) => (record.message.action as string).toLocaleLowerCase() || '',
  );

  const actionResponses = await reduceInBatches(
    ['delete', 'insert', 'update'],
    async (
      responses: Record<
        string,
        {
          successResponse: GARLBatchRequestOutput | null;
          invalidResponses: ProcessorTransformationResponse[];
        }
      >,
      action: string,
    ) => {
      const isIngest = action !== 'delete';
      if (groupedRecordsByAction[action]) {
        return {
          ...responses,
          [action]: await processRecordEventArray(
            groupedRecordsByAction[action] as GARLRouterRequest[],
            context,
            isIngest,
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
  ) as GARLBatchRequestOutput[] | ProcessorTransformationResponse[];

  if (finalResponse.length === 0) {
    throw new InstrumentationError(
      'Missing valid parameters, unable to generate transformed payload',
    );
  }

  return finalResponse;
}

async function processEventStreamRecordV1Events(
  groupedRecordInputs: GARLRouterRequest[],
) {
  const { destination } = groupedRecordInputs[0];
  return preparePayload(groupedRecordInputs, destination.Config);
}

async function processVDMV1RecordEvents(groupedRecordInputs: GARLRouterRequest[]) {
  const { destination, message } = groupedRecordInputs[0];
  const { audienceId } = destination.Config;

  return preparePayload(groupedRecordInputs, {
    ...destination.Config,
    audienceId: getOperationAudienceId(audienceId, message),
  });
}

async function processVDMV2RecordEvents(groupedRecordInputs: GARLRouterRequest[]) {
  const { connection, message } = groupedRecordInputs[0];
  const userSchema = message?.identifiers ? Object.keys(message.identifiers) : undefined;

  const events = await mapInBatches(groupedRecordInputs, (record) => ({
    ...record,
    message: {
      ...record.message,
      fields: record.message.identifiers as Record<string, unknown>,
    },
  }));

  return preparePayload(events, {
    ...connection!.config.destination,
    userSchema,
  });
}

export async function processRecordInputs(groupedRecordInputs: GARLRouterRequest[]) {
  const event = groupedRecordInputs[0];

  if (isEventSentByVDMV1Flow(event)) {
    return processVDMV1RecordEvents(groupedRecordInputs);
  }
  if (isEventSentByVDMV2Flow(event)) {
    return processVDMV2RecordEvents(groupedRecordInputs);
  }
  return processEventStreamRecordV1Events(groupedRecordInputs);
}

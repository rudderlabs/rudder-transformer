import {
  InstrumentationError,
  groupByInBatches,
  mapInBatches,
  reduceInBatches,
  forEachInBatches,
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
  buildDataManagerDestination,
  responseBuilder,
} from './util';
import {
  DATA_MANAGER_BATCH_SIZE,
  DATA_MANAGER_DEFAULT_TOS_STATUS,
  DATA_MANAGER_INGEST_ENDPOINT,
  DATA_MANAGER_INGEST_ENDPOINT_PATH,
  DATA_MANAGER_REMOVE_ENDPOINT,
  DATA_MANAGER_REMOVE_ENDPOINT_PATH,
  DATA_MANAGER_DEFAULT_ENCODING,
} from './config';
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

type RecordProcessor = (
  records: GARLRouterRequest[],
  context: DataManagerRecordContext,
) => Promise<{
  successResponse: GARLBatchRequestOutput | null;
  invalidResponses: ProcessorTransformationResponse[];
}>;

const processInsertRecords: RecordProcessor = async (records, context) => {
  const { destination, accessToken, audienceId, typeOfList, userSchema, isHashRequired } = context;
  const { workspaceId } = records[0].metadata;

  const memberConsent = buildMemberConsentFromConfig(destination.Config);

  const validMembers: AudienceMember[] = [];
  const validMetadata: Metadata[] = [];
  const invalidResponses: ProcessorTransformationResponse[] = [];

  await forEachInBatches(records, ({ message: { fields }, metadata }) => {
    const result = buildAudienceMember(
      fields as Record<string, unknown>,
      typeOfList,
      userSchema,
      { workspaceId, destinationId: destination.ID, isHashRequired },
      memberConsent,
    );

    if ('error' in result) {
      const errorObj = generateErrorObject(result.error);
      invalidResponses.push(
        getErrorRespEvents([metadata], errorObj.status, errorObj.message, errorObj.statTags),
      );
    } else {
      validMembers.push(result.member);
      validMetadata.push(metadata);
    }
  });

  if (validMembers.length === 0) {
    return { successResponse: null, invalidResponses };
  }

  const dest = buildDataManagerDestination(destination.Config, audienceId);
  const memberChunks: AudienceMember[][] = returnArrayOfSubarrays(
    validMembers,
    DATA_MANAGER_BATCH_SIZE,
  );

  const toSendEvents = memberChunks.map((chunk) =>
    responseBuilder(
      accessToken,
      {
        destinations: [dest],
        audienceMembers: chunk,
        encoding: DATA_MANAGER_DEFAULT_ENCODING,
        consent: memberConsent,
        termsOfService: { customerMatchTermsOfServiceStatus: DATA_MANAGER_DEFAULT_TOS_STATUS },
      },
      DATA_MANAGER_INGEST_ENDPOINT,
      DATA_MANAGER_INGEST_ENDPOINT_PATH,
      destination.Config,
    ),
  );

  return {
    successResponse: getSuccessRespEvents(toSendEvents, validMetadata, destination, true),
    invalidResponses,
  };
};

const processDeleteRecords: RecordProcessor = async (records, context) => {
  const { destination, accessToken, audienceId, typeOfList, userSchema, isHashRequired } = context;
  const { workspaceId } = records[0].metadata;

  const memberConsent = buildMemberConsentFromConfig(destination.Config);

  const validMembers: AudienceMember[] = [];
  const validMetadata: Metadata[] = [];
  const invalidResponses: ProcessorTransformationResponse[] = [];

  await forEachInBatches(records, ({ message: { fields }, metadata }) => {
    const result = buildAudienceMember(
      fields as Record<string, unknown>,
      typeOfList,
      userSchema,
      { workspaceId, destinationId: destination.ID, isHashRequired },
      memberConsent,
    );

    if ('error' in result) {
      const errorObj = generateErrorObject(result.error);
      invalidResponses.push(
        getErrorRespEvents([metadata], errorObj.status, errorObj.message, errorObj.statTags),
      );
    } else {
      validMembers.push(result.member);
      validMetadata.push(metadata);
    }
  });

  if (validMembers.length === 0) {
    return { successResponse: null, invalidResponses };
  }

  const dest = buildDataManagerDestination(destination.Config, audienceId);
  const memberChunks: AudienceMember[][] = returnArrayOfSubarrays(
    validMembers,
    DATA_MANAGER_BATCH_SIZE,
  );

  const toSendEvents = memberChunks.map((chunk) =>
    responseBuilder(
      accessToken,
      {
        destinations: [dest],
        audienceMembers: chunk,
        encoding: DATA_MANAGER_DEFAULT_ENCODING,
      },
      DATA_MANAGER_REMOVE_ENDPOINT,
      DATA_MANAGER_REMOVE_ENDPOINT_PATH,
      destination.Config,
    ),
  );

  return {
    successResponse: getSuccessRespEvents(toSendEvents, validMetadata, destination, true),
    invalidResponses,
  };
};

const recordActionProcessors: Record<string, RecordProcessor> = {
  insert: processInsertRecords,
  update: processInsertRecords,
  delete: processDeleteRecords,
};

async function transformRecordEvents(events: GARLRouterRequest[], config: GARLDestinationConfig) {
  const { destination, metadata } = events[0];
  const accessToken = getAccessToken(metadata, 'access_token');

  const context: DataManagerRecordContext = {
    destination,
    accessToken,
    ...config,
  };

  const groupedRecordsByAction = await groupByInBatches(events, (record) =>
    typeof record.message.action === 'string' ? record.message.action.toLowerCase() : '',
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
      if (!groupedRecordsByAction[action]) return responses;
      return {
        ...responses,
        [action]: await recordActionProcessors[action](
          groupedRecordsByAction[action] as GARLRouterRequest[],
          context,
        ),
      };
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

async function processEventStreamRecords(groupedRecordInputs: GARLRouterRequest[]) {
  const { destination } = groupedRecordInputs[0];
  return transformRecordEvents(groupedRecordInputs, destination.Config);
}

async function processVDMV1RecordEvents(groupedRecordInputs: GARLRouterRequest[]) {
  const { destination, message } = groupedRecordInputs[0];
  const { audienceId } = destination.Config;

  return transformRecordEvents(groupedRecordInputs, {
    ...destination.Config,
    audienceId: getOperationAudienceId(audienceId, message),
  });
}

async function processVDMV2RecordEvents(groupedRecordInputs: GARLRouterRequest[]) {
  const { connection, message } = groupedRecordInputs[0];
  const userSchema = message?.identifiers ? Object.keys(message.identifiers) : [];

  const events = await mapInBatches(groupedRecordInputs, (record) => ({
    ...record,
    message: {
      ...record.message,
      fields: record.message.identifiers as Record<string, unknown>,
    },
  }));

  return transformRecordEvents(events, {
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
  return processEventStreamRecords(groupedRecordInputs);
}

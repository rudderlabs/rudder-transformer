import {
  InstrumentationError,
  ConfigurationError,
  groupByInBatches,
} from '@rudderstack/integrations-lib';
import logger from '../../../../logger';
import { getAccessToken, returnArrayOfSubarrays, simpleProcessRouterDest } from '../../../util';
import { getOperationAudienceId } from '../util';
import type {
  AudienceMember,
  GARLRouterRequest,
  GARLDestination,
  GARLAudienceMessage,
  GARLBatchRequestOutput,
  GARLBatchRequest,
} from './types';
import type { Metadata, ProcessorTransformationResponse } from '../../../../types';
import {
  buildAudienceMembersFromListData,
  buildMemberConsentFromConfig,
  responseBuilder,
} from './util';
import { processRecordInputs } from './recordTransform';
import { DATA_MANAGER_BATCH_SIZE } from './config';

/**
 * Builds ingest or remove request payloads for an audiencelist event.
 * Each element in listData.add / listData.remove → one AudienceMember.
 * Chunks into batches of DATA_MANAGER_BATCH_SIZE (10,000).
 */
const createPayload = (
  metadata: Metadata,
  message: GARLAudienceMessage,
  destination: GARLDestination,
  accessToken: string,
) => {
  const { listData } = message.properties!;
  const { typeOfList, userSchema, isHashRequired } = destination.Config;
  const { workspaceId } = metadata;

  const memberConsent = buildMemberConsentFromConfig(destination.Config);
  const audienceId = getOperationAudienceId(destination.Config.audienceId, message);

  const ctx = { workspaceId, destinationId: destination.ID, isHashRequired };

  const responses: GARLBatchRequest[] = [];

  (['add', 'remove'] as const).forEach((key) => {
    if (!listData[key]) return;

    const isIngest = key === 'add';
    const audienceMembers: AudienceMember[] = buildAudienceMembersFromListData(
      listData[key],
      typeOfList,
      userSchema,
      ctx,
      memberConsent,
    );

    if (audienceMembers.length === 0) {
      logger.info(`[GARL DM API] No valid audience members in '${key}' property, skipping.`);
      return;
    }

    const memberChunks: AudienceMember[][] = returnArrayOfSubarrays(
      audienceMembers,
      DATA_MANAGER_BATCH_SIZE,
    );
    memberChunks.forEach((chunk) => {
      responses.push(
        responseBuilder(accessToken, chunk, destination, audienceId, isIngest, memberConsent),
      );
    });
  });

  return responses;
};

/**
 * Processes a single audiencelist event using the Data Manager API.
 */
const processAudience = async (event: {
  metadata: Metadata;
  message: GARLAudienceMessage;
  destination: GARLDestination;
}): Promise<GARLBatchRequest[]> => {
  const { metadata, message, destination } = event;

  if (!message.type) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }
  if (!message.properties) {
    throw new InstrumentationError('Message properties is not present. Aborting message.');
  }
  if (!message.properties.listData) {
    throw new InstrumentationError('listData is not present inside properties. Aborting message.');
  }
  if (message.type.toLowerCase() !== 'audiencelist') {
    throw new InstrumentationError(`Message Type ${message.type} not supported.`);
  }

  const accessToken = getAccessToken(metadata, 'access_token');
  const responses = createPayload(metadata, message, destination, accessToken);

  if (responses.length === 0) {
    throw new InstrumentationError(
      "Neither 'add' nor 'remove' property is present inside 'listData' or there are no valid audience members. Aborting message.",
    );
  }

  return responses;
};

const process = async (event: {
  metadata: Metadata;
  message: GARLAudienceMessage;
  destination: GARLDestination;
}): Promise<GARLBatchRequest[]> => processAudience(event);

/**
 * Router entry point for the Data Manager API path.
 * Groups inputs by event type (record vs audiencelist) and processes each group.
 */
export const processRouterDest = async (inputs: GARLRouterRequest[], reqMetadata: unknown) => {
  const groupedInputs = await groupByInBatches(inputs, (input) =>
    input.message.type?.toLowerCase(),
  );

  const eventTypes = ['record', 'audiencelist'];
  const presentKeys = Object.keys(groupedInputs);
  if (presentKeys.some((k) => !eventTypes.includes(k))) {
    throw new ConfigurationError('unsupported events present in the event');
  }

  const response: Array<GARLBatchRequestOutput | ProcessorTransformationResponse> = [];

  if (groupedInputs.record) {
    // transformedRecordEvents = await processRecordInputs(groupedInputs.record);
    const recordResponse = await processRecordInputs(groupedInputs.record);
    response.push(...recordResponse);
  }

  if (groupedInputs.audiencelist) {
    const audienceResponse = await simpleProcessRouterDest(
      groupedInputs.audiencelist,
      process,
      reqMetadata,
      undefined,
    );
    response.push(...audienceResponse);
  }

  return response;
};

import {
  InstrumentationError,
  ConfigurationError,
  groupByInBatches,
} from '@rudderstack/integrations-lib';
import logger from '../../../../logger';
import { getAccessToken, returnArrayOfSubarrays, simpleProcessRouterDest } from '../../../util';
import { getOperationAudienceId } from '../util';
import type {
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
  buildDataManagerDestination,
  responseBuilder,
} from './util';
import { processRecordInputs } from './recordTransform';
import {
  DATA_MANAGER_BATCH_SIZE,
  DATA_MANAGER_DEFAULT_TOS_STATUS,
  DATA_MANAGER_INGEST_ENDPOINT,
  DATA_MANAGER_INGEST_ENDPOINT_PATH,
  DATA_MANAGER_REMOVE_ENDPOINT,
  DATA_MANAGER_REMOVE_ENDPOINT_PATH,
} from './config';

/**
 * Builds ingest or remove request payloads for an audiencelist event.
 * Each element in listData.add / listData.remove → one AudienceMember.
 * Chunks into batches of DATA_MANAGER_BATCH_SIZE (10,000).
 */
const buildAudienceListRequests = (
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
  const dest = buildDataManagerDestination(destination.Config, audienceId);

  const ctx = { workspaceId, destinationId: destination.ID, isHashRequired };

  const responses: GARLBatchRequest[] = [];

  if (listData.add) {
    const audienceMembers = buildAudienceMembersFromListData(
      listData.add,
      typeOfList,
      userSchema,
      ctx,
      memberConsent,
    );
    if (audienceMembers.length === 0) {
      logger.info("[GARL DM API] No valid audience members in 'add' property, skipping.");
    } else {
      returnArrayOfSubarrays(audienceMembers, DATA_MANAGER_BATCH_SIZE).forEach((chunk) => {
        responses.push(
          responseBuilder(
            accessToken,
            {
              destinations: [dest],
              audienceMembers: chunk,
              encoding: 'HEX' as const,
              consent: memberConsent,
              termsOfService: {
                customerMatchTermsOfServiceStatus: DATA_MANAGER_DEFAULT_TOS_STATUS,
              },
            },
            DATA_MANAGER_INGEST_ENDPOINT,
            DATA_MANAGER_INGEST_ENDPOINT_PATH,
            destination.Config,
          ),
        );
      });
    }
  }

  if (listData.remove) {
    const audienceMembers = buildAudienceMembersFromListData(
      listData.remove,
      typeOfList,
      userSchema,
      ctx,
      memberConsent,
    );
    if (audienceMembers.length === 0) {
      logger.info("[GARL DM API] No valid audience members in 'remove' property, skipping.");
    } else {
      returnArrayOfSubarrays(audienceMembers, DATA_MANAGER_BATCH_SIZE).forEach((chunk) => {
        responses.push(
          responseBuilder(
            accessToken,
            {
              destinations: [dest],
              audienceMembers: chunk,
              encoding: 'HEX' as const,
            },
            DATA_MANAGER_REMOVE_ENDPOINT,
            DATA_MANAGER_REMOVE_ENDPOINT_PATH,
            destination.Config,
          ),
        );
      });
    }
  }

  return responses;
};

/**
 * Processes a single audiencelist event using the Data Manager API.
 */
export const transformAudienceListEvent = async (event: {
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
  const responses = buildAudienceListRequests(metadata, message, destination, accessToken);

  if (responses.length === 0) {
    throw new InstrumentationError(
      "Neither 'add' nor 'remove' property is present inside 'listData' or there are no valid audience members. Aborting message.",
    );
  }

  return responses;
};

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
      transformAudienceListEvent,
      reqMetadata,
      undefined,
    );
    response.push(...audienceResponse);
  }

  return response;
};

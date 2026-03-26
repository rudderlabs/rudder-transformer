import md5 from 'md5';
import {
  hashToSha256,
  InstrumentationError,
  formatZodError,
  groupByInBatches,
} from '@rudderstack/integrations-lib';
import type { RouterTransformationResponse } from '../../../types';
import type { TiktokAudienceListRequest } from './types';
import { TiktokAudienceListRouterRequestSchema } from './types';
import { SHA256_TRAITS, ACTION_MAP, ENDPOINT, ENDPOINT_PATH } from './config';
import {
  defaultRequestConfig,
  getDestinationExternalIDInfoForRetl,
  getSuccessRespEvents,
  handleRtTfSingleEventError,
} from '../../util';
import { processTiktokAudienceRecords } from './recordTransform';
import { ProcessTiktokAudienceRecordsResponse, TiktokAudienceRecordRequest } from './recordTypes';

function prepareIdentifiersList(event: TiktokAudienceListRequest) {
  const { message, destination, metadata } = event;
  const { isHashRequired } = destination.Config;

  const destinationFields =
    message.context?.destinationFields
      ?.split(',')
      .map((s) => s.trim())
      .filter(Boolean) ?? [];
  const audienceId = getDestinationExternalIDInfoForRetl(message, 'TIKTOK_AUDIENCE').objectType;
  const advertiserIds = metadata?.secret?.advertiserIds;
  const hashIdentifier = (destinationField: string, trait: string) => {
    if (isHashRequired) {
      if (SHA256_TRAITS.includes(destinationField)) {
        return hashToSha256(trait);
      }
      return md5(trait);
    }
    return trait;
  };

  const hashTraits = (traits: Record<string, string | null>[]) =>
    traits.map((trait) =>
      destinationFields.map((destinationField) =>
        trait[destinationField]
          ? {
              id: hashIdentifier(destinationField, trait[destinationField]!),
              audience_ids: [audienceId],
            }
          : {},
      ),
    );

  const listData = message.properties!.listData!;
  const actions = Object.keys(listData);

  return actions.map((action) => ({
    batch_data: hashTraits(listData[action]),
    id_schema: destinationFields,
    advertiser_ids: advertiserIds,
    action: ACTION_MAP[action],
  }));
}

function buildResponseForProcessTransformation(
  identifiersList: any[],
  event: TiktokAudienceListRequest,
) {
  const accessToken = event.metadata?.secret?.accessToken;
  const anonymousId = event.message?.anonymousId;

  const responses = identifiersList.map((identifierList) => {
    const response = defaultRequestConfig();
    response.body.JSON = identifierList;
    response.userId = anonymousId;
    response.endpoint = ENDPOINT;
    response.endpointPath = ENDPOINT_PATH;
    response.headers = {
      'Access-Token': accessToken,
      'Content-Type': 'application/json',
    };
    return response;
  });
  if (responses.length === 1) {
    return responses[0];
  }
  return responses;
}

function validateAudienceListEvent(event: unknown) {
  const result = TiktokAudienceListRouterRequestSchema.safeParse(event);
  if (!result.success) {
    throw new InstrumentationError(formatZodError(result.error));
  }
  return result.data;
}

function processTiktokAudienceList(event: TiktokAudienceListRequest) {
  const identifierLists = prepareIdentifiersList(event);
  return buildResponseForProcessTransformation(identifierLists, event);
}

const processRouterDest = async (
  events: (TiktokAudienceListRequest | TiktokAudienceRecordRequest)[],
): Promise<RouterTransformationResponse[]> => {
  if (!events || events.length === 0) return [];

  const groupedEvents = await groupByInBatches<
    TiktokAudienceListRequest | TiktokAudienceRecordRequest,
    string
  >(events, (event) => event.message?.type?.toLowerCase());

  const supportedEventTypes = ['record', 'audiencelist'];
  const eventTypes = Object.keys(groupedEvents);
  const unsupportedEventList = eventTypes.filter(
    (eventType) => !supportedEventTypes.includes(eventType),
  );

  const failedResponses: RouterTransformationResponse[] = [];
  const successfulResponses: RouterTransformationResponse[] = [];

  if (groupedEvents.record) {
    const response: ProcessTiktokAudienceRecordsResponse = processTiktokAudienceRecords(
      groupedEvents.record,
    );
    failedResponses.push(...response.failedResponses);
    successfulResponses.push(...response.successfulResponses);
  }
  if (groupedEvents.audiencelist) {
    for (const event of groupedEvents.audiencelist) {
      try {
        const tiktokEvent = validateAudienceListEvent(event);
        const response = processTiktokAudienceList(tiktokEvent);
        successfulResponses.push(
          getSuccessRespEvents(response, [tiktokEvent.metadata], tiktokEvent.destination, true),
        );
      } catch (error) {
        failedResponses.push(handleRtTfSingleEventError(event, error, {}));
      }
    }
  }
  for (const unsupportedEvent of unsupportedEventList) {
    for (const event of groupedEvents[unsupportedEvent]) {
      failedResponses.push(
        handleRtTfSingleEventError(
          event,
          new InstrumentationError(`unsupported event found ${unsupportedEvent}`),
          {},
        ),
      );
    }
  }
  return [...failedResponses, ...successfulResponses];
};

export { processRouterDest };

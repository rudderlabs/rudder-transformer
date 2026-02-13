import md5 from 'md5';
import { hashToSha256, InstrumentationError, formatZodError } from '@rudderstack/integrations-lib';
import type { RouterTransformationResponse } from '../../../types';
import type { TiktokAudienceRequest } from './types';
import { TiktokAudienceRouterRequestSchema } from './types';
import { SHA256_TRAITS, ACTION_MAP, ENDPOINT, ENDPOINT_PATH } from './config';
import {
  defaultRequestConfig,
  getDestinationExternalIDInfoForRetl,
  getSuccessRespEvents,
  handleRtTfSingleEventError,
} from '../../util';

function prepareIdentifiersList(event: TiktokAudienceRequest) {
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

  const hashTraits = (traits: Record<string, string>[]) =>
    traits.map((trait) =>
      destinationFields.map((destinationField) =>
        trait[destinationField]
          ? {
              id: hashIdentifier(destinationField, trait[destinationField]),
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
  event: TiktokAudienceRequest,
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

function validateEvent(event: unknown) {
  const result = TiktokAudienceRouterRequestSchema.safeParse(event);
  if (!result.success) {
    throw new InstrumentationError(formatZodError(result.error));
  }
  return result.data;
}

function processTiktokAudience(event: TiktokAudienceRequest) {
  const identifierLists = prepareIdentifiersList(event);
  return buildResponseForProcessTransformation(identifierLists, event);
}

function process(event: unknown) {
  return processTiktokAudience(validateEvent(event));
}

const processRouterDest = async (events: unknown[]): Promise<RouterTransformationResponse[]> => {
  if (!events || events.length === 0) return [];

  const successfulResponses: RouterTransformationResponse[] = [];
  const failedResponses: RouterTransformationResponse[] = [];

  for (const event of events) {
    try {
      const tiktokEvent = validateEvent(event);
      const response = processTiktokAudience(tiktokEvent);
      successfulResponses.push(
        getSuccessRespEvents(response, [tiktokEvent.metadata], tiktokEvent.destination, true),
      );
    } catch (error) {
      failedResponses.push(handleRtTfSingleEventError(event, error, {}));
    }
  }
  return [...failedResponses, ...successfulResponses];
};

export { process, processRouterDest };

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

function validateTiktokAudienceRequest(event: unknown) {
  const validationResult = TiktokAudienceRouterRequestSchema.safeParse(event);
  if (!validationResult.success) {
    throw new InstrumentationError(formatZodError(validationResult.error));
  }
  return validationResult.data;
}

function processTiktokAudience(event: TiktokAudienceRequest) {
  const identifierLists = prepareIdentifiersList(event);
  return buildResponseForProcessTransformation(identifierLists, event);
}

function process(event: unknown) {
  const tiktokAudienceRequest = validateTiktokAudienceRequest(event);
  return processTiktokAudience(tiktokAudienceRequest);
}

const processRouterDest = async (requests: unknown[]): Promise<RouterTransformationResponse[]> => {
  if (requests?.length === 0) return [];

  const successResponseList: RouterTransformationResponse[] = [];
  const failedResponseList: RouterTransformationResponse[] = [];

  for (const request of requests) {
    try {
      const tiktokAudienceRequest = validateTiktokAudienceRequest(request);
      const response = processTiktokAudience(tiktokAudienceRequest);
      successResponseList.push(
        getSuccessRespEvents(
          response,
          [tiktokAudienceRequest.metadata],
          tiktokAudienceRequest.destination,
          true,
        ),
      );
    } catch (error) {
      failedResponseList.push(handleRtTfSingleEventError(request, error, {}));
    }
  }
  return [...failedResponseList, ...successResponseList];
};

export { process, processRouterDest };

import md5 from 'md5';
import { hashToSha256, InstrumentationError } from '@rudderstack/integrations-lib';
import type { RouterTransformationResponse } from '../../../types';
import type { TiktokAudienceMessage, TiktokAudienceRequest } from './types';
import { SHA256_TRAITS, ACTION_MAP, ENDPOINT } from './config';
import { defaultRequestConfig, getSuccessRespEvents, handleRtTfSingleEventError } from '../../util';

function validateInput(message: TiktokAudienceMessage) {
  const messageType = message.type;
  if (!messageType) {
    throw new InstrumentationError('message Type is not present. Aborting message.');
  }
  if (messageType.toLowerCase() !== 'audiencelist') {
    throw new InstrumentationError(
      `Event type ${messageType.toLowerCase()} is not supported. Aborting message.`,
    );
  }
  if (!message?.properties) {
    throw new InstrumentationError('Message properties is not present. Aborting message.');
  }
  if (!message?.properties?.listData) {
    throw new InstrumentationError('listData is not present inside properties. Aborting message.');
  }

  const keys = Object.keys(message.properties.listData);
  for (const key of keys) {
    if (!ACTION_MAP[key]) {
      throw new InstrumentationError(`unsupported action type ${key}. Aborting message.`);
    }
  }
}

function prepareIdentifiersList(event: TiktokAudienceRequest) {
  const { message, destination, metadata } = event;

  const destinationFields =
    message.context?.destinationFields
      ?.split(',')
      .map((s) => s.trim())
      .filter(Boolean) ?? [];
  const audienceId = message?.context?.externalId?.[0]?.type?.split('-')[1] ?? '';
  const isHashRequired = Boolean(destination?.Config?.isHashRequired);
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
      destinationFields.map((field) =>
        trait[field]
          ? {
              id: hashIdentifier(field, trait[field]),
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

function buildResponseForProcessTransformation(bodies: any[], event: TiktokAudienceRequest) {
  const accessToken = event.metadata?.secret?.accessToken;
  const anonymousId = event.message?.anonymousId;

  const responses = bodies.map((body) => {
    const response = defaultRequestConfig();
    response.body.JSON = body;
    response.userId = anonymousId;
    response.endpoint = ENDPOINT;
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

function process(event: TiktokAudienceRequest) {
  validateInput(event.message);
  const identifierLists = prepareIdentifiersList(event);
  return buildResponseForProcessTransformation(identifierLists, event);
}

const processRouterDest = async (
  requests: TiktokAudienceRequest[],
): Promise<RouterTransformationResponse[]> => {
  if (requests?.length === 0) return [];

  const successResponseList: RouterTransformationResponse[] = [];
  const failedResponseList: RouterTransformationResponse[] = [];

  for (const request of requests) {
    try {
      const out = process(request);
      successResponseList.push(
        getSuccessRespEvents(out, [request.metadata], request.destination, true),
      );
    } catch (error) {
      failedResponseList.push(handleRtTfSingleEventError(request, error, {}));
    }
  }
  return [...failedResponseList, ...successResponseList];
};

export { process, processRouterDest };

import { ConfigurationError, InstrumentationError } from '@rudderstack/integrations-lib';
import type { RouterTransformationResponse } from '../../../types';
import { defaultRequestConfig, handleRtTfSingleEventError } from '../../util';
import { SUPPORTED_EVENT_TYPE, ACTION_TYPES } from './config';
import type { LinkedinAudienceRequest, LinkedinAudienceConfigs } from './types';
import {
  prepareUserIds,
  hashIdentifiers,
  generateActionType,
  generateEndpoint,
  batchResponseBuilder,
} from './utils';

function validateInput(event: LinkedinAudienceRequest) {
  const { connection, metadata, message } = event;

  const config = connection?.config?.destination;
  const secret = metadata?.secret;
  const messageType = message?.type;

  if (!config?.audienceId) {
    throw new ConfigurationError('Audience Id is not present. Aborting');
  }
  if (!secret?.accessToken) {
    throw new ConfigurationError(
      'Access Token is not present. This might be a platform issue. Please contact RudderStack support for assistance.',
    );
  }
  if (!config?.audienceType) {
    throw new ConfigurationError('audienceType is not present. Aborting');
  }

  if (!messageType) {
    throw new InstrumentationError('Message Type is not present. Aborting message.');
  }
  if (messageType.toLowerCase() !== SUPPORTED_EVENT_TYPE) {
    throw new InstrumentationError(
      `Event type ${messageType.toLowerCase()} is not supported. Aborting message.`,
    );
  }

  if (!message?.fields) {
    throw new InstrumentationError('`fields` is not present. Aborting message.');
  }
  if (!message?.identifiers) {
    throw new InstrumentationError(
      '`identifiers` is not present inside properties. Aborting message.',
    );
  }
  if (!ACTION_TYPES.includes(message?.action ?? '')) {
    throw new InstrumentationError(`Unsupported action type. Aborting message.`);
  }
}

function getConfigs(event: LinkedinAudienceRequest): LinkedinAudienceConfigs {
  const config = event.connection?.config?.destination;
  return {
    audienceType: config!.audienceType!,
    audienceId: config!.audienceId!,
    accessToken: event.metadata!.secret!.accessToken!,
    isHashRequired: Boolean(config?.isHashRequired),
  };
}

function prepareUserTypeBasePayload(
  event: LinkedinAudienceRequest,
  configs: LinkedinAudienceConfigs,
) {
  const identifiers = configs.isHashRequired
    ? hashIdentifiers(event.message.identifiers!)
    : event.message.identifiers!;
  const userIds = prepareUserIds(identifiers);
  return {
    elements: [
      {
        action: generateActionType(event.message.action!),
        userIds,
        ...event.message.fields!,
      },
    ],
  };
}

function prepareCompanyTypeBasePayload(event: LinkedinAudienceRequest) {
  return {
    elements: [
      {
        action: generateActionType(event.message.action!),
        ...event.message.identifiers!,
        ...event.message.fields!,
      },
    ],
  };
}

function buildResponseForProcessTransformation(
  configs: LinkedinAudienceConfigs,
  payload: Record<string, any>,
) {
  const response = defaultRequestConfig();
  response.body.JSON = payload;
  response.endpoint = generateEndpoint(configs.audienceType, configs.audienceId);
  response.headers = {
    Authorization: `Bearer ${configs.accessToken}`,
    'Content-Type': 'application/json',
    'X-RestLi-Method': 'BATCH_CREATE',
    'X-Restli-Protocol-Version': '2.0.0',
    'LinkedIn-Version': '202509',
  };
  return response;
}

function process(event: LinkedinAudienceRequest) {
  validateInput(event);

  const configs = getConfigs(event);
  const preparePayload = () => {
    switch (configs.audienceType) {
      case 'user':
        return prepareUserTypeBasePayload(event, configs);
      case 'company':
        return prepareCompanyTypeBasePayload(event);
      default:
        throw new ConfigurationError(`Unsupported audience type ${configs.audienceType}. Aborting`);
    }
  };

  const payload = preparePayload();
  return buildResponseForProcessTransformation(configs, payload);
}

const processRouterDest = async (
  requests: LinkedinAudienceRequest[],
): Promise<RouterTransformationResponse[]> => {
  if (requests?.length === 0) return [];

  const successResponseList: any[] = [];
  const failedResponseList: RouterTransformationResponse[] = [];

  for (const request of requests) {
    try {
      const response = process(request);
      successResponseList.push({
        message: [response],
        destination: request.destination,
        metadata: request.metadata,
      });
    } catch (error) {
      failedResponseList.push(handleRtTfSingleEventError(request, error, {}));
    }
  }

  const batchedSuccessResponseList = batchResponseBuilder(successResponseList);

  return [...batchedSuccessResponseList, ...failedResponseList];
};

export { process, processRouterDest };

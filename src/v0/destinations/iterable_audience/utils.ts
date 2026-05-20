import { BatchUtils } from '@rudderstack/workflow-engine';
import {
  ConfigurationError,
  InstrumentationError,
  formatZodError,
} from '@rudderstack/integrations-lib';

import {
  defaultRequestConfig,
  getSuccessRespEvents,
} from '../../util';
import { JSON_MIME_TYPE } from '../../util/constant';
import { RecordAction } from '../../../types/rudderEvents';
import { Metadata } from '../../../types';
import {
  IterableAudienceDestination,
  IterableAudienceDestinationConfig,
  IterableAudienceMessage,
  IterableAudienceRequestBuildResult,
  IterableAudienceRespList,
  IterableAudienceRouterRequest,
  IterableAudienceDestinationConfigSchema,
  IterableAudienceMessageSchema,
} from './types';
import { getBaseEndpoint, getEndpointPathByAction, MAX_ITEMS, UNSUBSCRIBE_PATH } from './config';

const getIdentifierValue = (
  identifiers: Record<string, string | number>,
  preferredKey: string,
): string | null => {
  const exactValue = identifiers[preferredKey];
  if (exactValue !== undefined && exactValue !== null && `${exactValue}`.trim() !== '') {
    return `${exactValue}`;
  }

  const keyByCaseInsensitiveMatch = Object.keys(identifiers).find(
    (key) => key.toLowerCase() === preferredKey.toLowerCase(),
  );
  if (!keyByCaseInsensitiveMatch) {
    return null;
  }

  const matchedValue = identifiers[keyByCaseInsensitiveMatch];
  if (matchedValue === undefined || matchedValue === null || `${matchedValue}`.trim() === '') {
    return null;
  }
  return `${matchedValue}`;
};

const getSubscriberPayload = (
  message: IterableAudienceMessage,
  destinationConfig: IterableAudienceDestinationConfig,
): { email: string } | { userId: string } => {
  const { identifiers } = message;
  const { projectType } = destinationConfig;

  const email = getIdentifierValue(identifiers, 'email');
  const userId = getIdentifierValue(identifiers, 'userId');

  if (projectType === 'email_based') {
    if (!email) {
      throw new InstrumentationError('email identifier is required for projectType email_based');
    }
    return { email };
  }

  if (projectType === 'userId_based') {
    if (!userId) {
      throw new InstrumentationError('userId identifier is required for projectType userId_based');
    }
    return { userId };
  }

  // hybrid: prefer email when present, otherwise fallback to userId
  if (email) {
    return { email };
  }
  if (userId) {
    return { userId };
  }

  throw new InstrumentationError(
    'Either email or userId identifier is required for projectType hybrid',
  );
};

export const createEventChunk = (
  event: IterableAudienceRouterRequest,
): IterableAudienceRequestBuildResult => {
  const configValidation = IterableAudienceDestinationConfigSchema.safeParse(
    event.destination.Config,
  );
  if (!configValidation.success) {
    throw new ConfigurationError(formatZodError(configValidation.error));
  }

  const messageValidation = IterableAudienceMessageSchema.safeParse(event.message);
  if (!messageValidation.success) {
    throw new InstrumentationError(formatZodError(messageValidation.error));
  }

  const validatedMessage = messageValidation.data;
  const action = validatedMessage.action as RecordAction;

  return {
    endpointPath: getEndpointPathByAction(action),
    payload: getSubscriberPayload(validatedMessage, configValidation.data),
    metadata: event.metadata,
  };
};

const getBatchedResponses = (
  respList: IterableAudienceRespList[],
  endpointPath: string,
  destination: IterableAudienceDestination,
) => {
  if (!respList?.length) {
    return [];
  }

  const batches = BatchUtils.chunkArrayBySizeAndLength(respList, { maxItems: MAX_ITEMS });

  return batches.items.map((batch) => {
    const response = defaultRequestConfig();
    response.endpoint = `${getBaseEndpoint(destination.Config.dataCenter)}${endpointPath}`;
    response.endpointPath = endpointPath;
    response.method = 'POST';
    response.headers = {
      'Content-Type': JSON_MIME_TYPE,
      'Api-Key': destination.Config.apiKey,
    };

    const listId =
      typeof destination.Config.listId === 'string'
        ? Number(destination.Config.listId)
        : destination.Config.listId;

    const requestBody = {
      listId,
      subscribers: batch.flatMap((item) => item.payload.subscribers),
      ...(endpointPath === UNSUBSCRIBE_PATH
        ? {
            campaignId: null,
            channelUnsubscribe: false,
          }
        : {}),
    };

    response.body.JSON = requestBody;

    return getSuccessRespEvents(
      response,
      batch.map((item) => item.metadata as Metadata),
      destination,
      true,
    );
  });
};

export const batchResponseBuilder = (
  subscribeRespList: IterableAudienceRespList[],
  unsubscribeRespList: IterableAudienceRespList[],
  destination: IterableAudienceDestination,
) => {
  const subscribeResponses = getBatchedResponses(
    subscribeRespList,
    '/api/lists/subscribe',
    destination,
  );
  const unsubscribeResponses = getBatchedResponses(
    unsubscribeRespList,
    '/api/lists/unsubscribe',
    destination,
  );

  return [...subscribeResponses, ...unsubscribeResponses];
};

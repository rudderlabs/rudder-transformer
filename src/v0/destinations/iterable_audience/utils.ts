import { InstrumentationError } from '@rudderstack/integrations-lib';
import { defaultRequestConfig } from '../../util';
import {
  BASE_ENDPOINT,
  MAX_SUBSCRIBERS_PER_BATCH,
  PROJECT_TYPES,
  SYNC_MODES,
} from './config';
import { IterableAudienceRouterRequest, ProjectType, Subscriber, SyncMode } from './types';

const PRINTABLE_ASCII_REGEX = /^[\x20-\x7E]+$/;

const isValidEmail = (value: string): boolean => /^\S+@\S+\.\S+$/.test(value);

export const getProjectType = (event: IterableAudienceRouterRequest): ProjectType => {
  const projectType = event.destination.Config.projectType;
  if (!projectType) {
    throw new InstrumentationError('projectType is required for iterable_audience');
  }
  return projectType;
};

export const getSyncMode = (event: IterableAudienceRouterRequest): SyncMode =>
  event.connection.config.destination.syncMode || SYNC_MODES.UPSERT;

const getMappedIdentifierField = (event: IterableAudienceRouterRequest): 'email' | 'userId' | null => {
  const mappings = event.connection?.config?.destination?.identifierMappings || [];
  const mapped = mappings.find((mapping) => mapping?.to === 'email' || mapping?.to === 'userId');
  return mapped?.to || null;
};

const validateUserId = (userId: string): boolean => !!userId.trim() && PRINTABLE_ASCII_REGEX.test(userId);

const validateByProjectType = (
  identifiers: { email?: string; userId?: string },
  projectType: ProjectType,
  mappedField: 'email' | 'userId' | null,
): Subscriber => {
  const email = identifiers.email?.trim();
  const userId = identifiers.userId?.trim();

  if (projectType === PROJECT_TYPES.EMAIL_BASED) {
    if (email && isValidEmail(email)) {
      return { email: email.toLowerCase() };
    }
    throw new InstrumentationError('email is required for email_based Iterable project type');
  }

  if (projectType === PROJECT_TYPES.USERID_BASED) {
    if (userId && validateUserId(userId)) {
      return { userId };
    }
    throw new InstrumentationError('valid userId is required for userid_based Iterable project type');
  }

  if (mappedField === 'email') {
    if (email && isValidEmail(email)) {
      return { email: email.toLowerCase() };
    }
    throw new InstrumentationError('mapped email is missing or invalid for hybrid Iterable project type');
  }

  if (userId && validateUserId(userId)) {
    return { userId };
  }
  if (email && isValidEmail(email)) {
    return { email: email.toLowerCase() };
  }

  throw new InstrumentationError('at least one valid identifier is required for hybrid Iterable project type');
};

export const getSubscriberForEvent = (event: IterableAudienceRouterRequest): Subscriber => {
  const projectType = getProjectType(event);
  const mappedField = getMappedIdentifierField(event);
  return validateByProjectType(event.message.identifiers || {}, projectType, mappedField);
};

export const chunkSubscribers = <T>(items: T[]): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += MAX_SUBSCRIBERS_PER_BATCH) {
    chunks.push(items.slice(i, i + MAX_SUBSCRIBERS_PER_BATCH));
  }
  return chunks;
};

const getBaseUrl = (event: IterableAudienceRouterRequest): string => {
  const dataCenter = event.destination.Config.dataCenter || 'USDC';
  return BASE_ENDPOINT[dataCenter];
};

export const buildSubscribeRequest = (
  event: IterableAudienceRouterRequest,
  subscribers: Subscriber[],
) => {
  const request = defaultRequestConfig();
  request.method = 'POST';
  request.endpoint = `${getBaseUrl(event)}/lists/subscribe`;
  request.headers = {
    'Api-Key': event.destination.Config.apiKey,
    'Content-Type': 'application/json',
  };
  request.body.JSON = {
    listId: event.connection.config.destination.audienceId,
    subscribers,
  };
  return request;
};

export const buildUnsubscribeRequest = (
  event: IterableAudienceRouterRequest,
  subscribers: Subscriber[],
) => {
  const request = defaultRequestConfig();
  request.method = 'POST';
  request.endpoint = `${getBaseUrl(event)}/lists/unsubscribe`;
  request.headers = {
    'Api-Key': event.destination.Config.apiKey,
    'Content-Type': 'application/json',
  };
  request.body.JSON = {
    listId: event.connection.config.destination.audienceId,
    subscribers,
    campaignId: null,
    channelUnsubscribe: false,
  };
  return request;
};

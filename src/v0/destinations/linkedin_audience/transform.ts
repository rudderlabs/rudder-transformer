import {
  ConfigurationError,
  InstrumentationError,
  formatZodError,
} from '@rudderstack/integrations-lib';
import validator from 'validator';
import lodash from 'lodash';
import type { RouterTransformationResponse } from '../../../types';
import {
  defaultRequestConfig,
  getSuccessRespEvents,
  handleRtTfSingleEventError,
  removeNullValues,
} from '../../util';
import {
  LinkedinAudienceRecordRequest,
  LinkedinAudienceRouterRequestSchema,
  LinkedinAudienceUserPayload,
  LinkedinAudienceCompanyPayload,
  LinkedinAudienceConfigParams,
  LinkedinAudiencePayload,
} from './types';
import {
  COMPANY_ENDPOINT,
  COMPANY_ENDPOINT_PATH,
  USER_ENDPOINT,
  USER_ENDPOINT_PATH,
  ACTION_RECORD_MAP,
  DESTINATION_TYPE,
  API_PROTOCOL_VERSION,
  API_VERSION,
  REMOVE_SPACES_REGEX,
  USER_IDENTIFIER_MAP,
  COMPANY_TRAITS,
  MAX_BATCH_SIZE,
} from './config';

import { AudienceField, HashingType, processAudienceRecord } from '../../util/audienceUtils';

const USERS_IDENTIFIER_CONFIG: Record<string, AudienceField> = {
  sha256Email: {
    hashingType: HashingType.SHA256,
    normalize: (value: string) => value.replace(REMOVE_SPACES_REGEX, '').toLowerCase(),
    validate: (normalized: string) => validator.isEmail(normalized),
  },
  sha512Email: {
    hashingType: HashingType.SHA512,
    normalize: (value: string) => value.replace(REMOVE_SPACES_REGEX, '').toLowerCase(),
    validate: (normalized: string) => validator.isEmail(normalized),
  },
  googleAid: {
    hashingType: HashingType.NONE,
    normalize: (value: string) => value.trim(),
    validate: (normalized: string) => normalized.length > 0,
  },
};

function validateLinkedinAudienceEvent(event: unknown): LinkedinAudienceRecordRequest {
  const result = LinkedinAudienceRouterRequestSchema.safeParse(event);
  if (!result.success) {
    throw new InstrumentationError(formatZodError(result.error));
  }
  return result.data;
}

export function generateEndpoint(audienceType: string, audienceId: string | number) {
  if (audienceType === 'user') {
    return { endpoint: USER_ENDPOINT(audienceId), endpointPath: USER_ENDPOINT_PATH };
  }
  return { endpoint: COMPANY_ENDPOINT(audienceId), endpointPath: COMPANY_ENDPOINT_PATH };
}

const prepareUserIds = (
  ids: Record<string, string>,
): {
  idType: (typeof USER_IDENTIFIER_MAP)[keyof typeof USER_IDENTIFIER_MAP];
  idValue: string;
}[] => {
  const userIds: {
    idType: (typeof USER_IDENTIFIER_MAP)[keyof typeof USER_IDENTIFIER_MAP];
    idValue: string;
  }[] = [];
  Object.keys(ids).forEach((key) => {
    const value = ids[key];
    if (value) {
      userIds.push({ idType: USER_IDENTIFIER_MAP[key], idValue: value });
    }
  });
  return userIds;
};

function prepareUserTypePayload(event: LinkedinAudienceRecordRequest): LinkedinAudienceUserPayload {
  const { message, connection, destination, metadata } = event;
  const { isHashRequired } = connection.config.destination;
  const { action, identifiers, fields } = message;

  Object.keys(identifiers).forEach((fieldName) => {
    if (!USERS_IDENTIFIER_CONFIG[fieldName]) {
      throw new InstrumentationError(`Invalid identifier key ${fieldName} for LinkedIn Audience.`);
    }
  });

  const processedIdentifiers = processAudienceRecord(identifiers, {
    fieldConfigs: USERS_IDENTIFIER_CONFIG,
    destination: {
      workspaceId: metadata.workspaceId,
      id: destination.ID,
      type: DESTINATION_TYPE,
      config: { isHashRequired },
    },
  });
  if (Object.keys(processedIdentifiers).length === 0) {
    throw new InstrumentationError('No identifiers found, aborting event.');
  }

  const userIds = prepareUserIds(processedIdentifiers);
  const nonNullFields = removeNullValues(fields);
  const payload: LinkedinAudienceUserPayload = {
    action: ACTION_RECORD_MAP[action],
    userIds,
    ...nonNullFields,
  };
  return payload;
}

function prepareCompanyTypePayload(
  event: LinkedinAudienceRecordRequest,
): LinkedinAudienceCompanyPayload {
  const { action, identifiers, fields } = event.message;

  Object.keys(identifiers).forEach((fieldName) => {
    if (!COMPANY_TRAITS.includes(fieldName)) {
      throw new InstrumentationError(`Invalid identifier key ${fieldName} for LinkedIn Audience.`);
    }
  });

  const nonNullIdentifiers = removeNullValues(identifiers);
  if (Object.keys(nonNullIdentifiers).length === 0) {
    throw new InstrumentationError('No identifiers found, aborting event.');
  }

  const nonNullFields = removeNullValues(fields);
  const payload: LinkedinAudienceCompanyPayload = {
    action: ACTION_RECORD_MAP[action],
    ...nonNullIdentifiers,
    ...nonNullFields,
  };
  return payload;
}

function preparePayloadForProcessTransformation(
  payload: Record<string, any>,
  configParams: LinkedinAudienceConfigParams,
) {
  const { endpoint, endpointPath } = generateEndpoint(
    configParams.audienceType,
    configParams.audienceId,
  );

  const response = defaultRequestConfig();
  response.body.JSON = payload;
  response.endpoint = endpoint;
  response.endpointPath = endpointPath;
  response.headers = {
    Authorization: `Bearer ${configParams.accessToken}`,
    'Content-Type': 'application/json',
    'X-RestLi-Method': 'BATCH_CREATE',
    'X-Restli-Protocol-Version': API_PROTOCOL_VERSION,
    'LinkedIn-Version': API_VERSION,
  };
  return response;
}

function processLinkedinAudienceRecord(
  event: LinkedinAudienceRecordRequest,
): LinkedinAudiencePayload {
  const { audienceType } = event.connection.config.destination;
  switch (audienceType) {
    case 'user': {
      const userPayload = prepareUserTypePayload(event);
      return {
        payload: userPayload,
        event,
      };
    }
    case 'company': {
      const companyPayload = prepareCompanyTypePayload(event);
      return {
        payload: companyPayload,
        event,
      };
    }
    default:
      throw new ConfigurationError(`Unsupported audience type ${audienceType}. Aborting`);
  }
}

const processRouterDest = async (events: unknown[]): Promise<RouterTransformationResponse[]> => {
  if (!events || events.length === 0) return [];

  const failedResponses: RouterTransformationResponse[] = [];
  const successfulResponses: RouterTransformationResponse[] = [];

  const groupedPayloads: {
    action: string;
    configParams: LinkedinAudienceConfigParams;
    payloads: LinkedinAudiencePayload[];
  }[] = [];

  for (const event of events) {
    try {
      const recordEvent = validateLinkedinAudienceEvent(event);
      const linkedinAudiencePayload = processLinkedinAudienceRecord(recordEvent);

      const existingGroup = groupedPayloads.find(
        (group) => group.action === linkedinAudiencePayload.payload.action,
      );

      if (existingGroup) {
        existingGroup.payloads.push(linkedinAudiencePayload);
      } else {
        const configParams: LinkedinAudienceConfigParams = {
          audienceType: recordEvent.connection.config.destination.audienceType,
          audienceId: recordEvent.connection.config.destination.audienceId,
          accessToken: recordEvent.metadata.secret.accessToken,
          isHashRequired: recordEvent.connection.config.destination.isHashRequired,
        };
        groupedPayloads.push({
          action: linkedinAudiencePayload.payload.action,
          configParams,
          payloads: [linkedinAudiencePayload],
        });
      }
    } catch (error) {
      failedResponses.push(handleRtTfSingleEventError(event, error, {}));
    }
  }
  for (const group of groupedPayloads) {
    const { configParams, payloads } = group;
    try {
      const chunkedPayloads = lodash.chunk(payloads, MAX_BATCH_SIZE);
      for (const chunk of chunkedPayloads) {
        const elementsPayload = {
          elements: chunk.map((payload) => payload.payload),
        };
        const metadataList = chunk.map((payload) => payload.event.metadata);
        const response = preparePayloadForProcessTransformation(elementsPayload, configParams);

        successfulResponses.push(
          getSuccessRespEvents(response, metadataList, chunk[0].event.destination, true),
        );
      }
    } catch (error) {
      failedResponses.push(
        ...payloads.map((payload) => handleRtTfSingleEventError(payload.event, error, {})),
      );
    }
  }
  return [...successfulResponses, ...failedResponses];
};

export { processRouterDest };

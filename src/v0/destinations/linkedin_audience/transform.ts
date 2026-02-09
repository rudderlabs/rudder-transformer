import {
  ConfigurationError,
  InstrumentationError,
  formatZodError,
} from '@rudderstack/integrations-lib';
import type { RouterTransformationResponse } from '../../../types';
import { defaultRequestConfig, getSuccessRespEvents, handleRtTfSingleEventError } from '../../util';
import {
  LinkedinAudienceRecordRequest,
  LinkedinAudienceRouterRequestSchema,
  LinkedinAudienceUserPayload,
  LinkedinAudienceCompanyPayload,
  LinkedinAudienceConfigParams,
  LinkedinAudiencePayload,
} from './types';
import { prepareUserIds, hashIdentifiers, generateEndpoint, prepareNonNullRecord } from './utils';
import { ACTION_RECORD_MAP, API_PROTOCOL_VERSION, API_VERSION } from './config';

function validateLinkedinAudienceEvent(event: unknown): LinkedinAudienceRecordRequest {
  const result = LinkedinAudienceRouterRequestSchema.safeParse(event);
  if (!result.success) {
    throw new InstrumentationError(formatZodError(result.error));
  }
  return result.data;
}

function prepareUserTypePayload(event: LinkedinAudienceRecordRequest): LinkedinAudienceUserPayload {
  const { isHashRequired } = event.connection.config.destination;
  const { action, identifiers, fields } = event.message;
  const hashedIdentifiers = isHashRequired ? hashIdentifiers(identifiers) : identifiers;
  const userIds = prepareUserIds(hashedIdentifiers);
  const nonNullFields = prepareNonNullRecord(fields);
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
  const nonNullFields = prepareNonNullRecord(fields);
  const nonNullIdentifiers = prepareNonNullRecord(identifiers);
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

const processRouterDest = async (
  events: LinkedinAudienceRecordRequest[],
): Promise<RouterTransformationResponse[]> => {
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
          audienceType: event.connection.config.destination.audienceType,
          audienceId: event.connection.config.destination.audienceId,
          accessToken: event.metadata.secret.accessToken,
          isHashRequired: event.connection.config.destination.isHashRequired,
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
    try {
      const elementsPayload = {
        elements: group.payloads.map((payload) => payload.payload),
      };
      const metadataList = group.payloads.map((payload) => payload.event.metadata);
      const response = preparePayloadForProcessTransformation(elementsPayload, group.configParams);

      successfulResponses.push(
        getSuccessRespEvents(response, metadataList, group.payloads[0].event.destination, true),
      );
    } catch (error) {
      failedResponses.push(
        ...group.payloads.map((payload) => handleRtTfSingleEventError(payload.event, error, {})),
      );
    }
  }
  return [...successfulResponses, ...failedResponses];
};

export { processRouterDest };

import {
  ConfigurationError,
  InstrumentationError,
  formatZodError,
} from '@rudderstack/integrations-lib';
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
import { prepareUserIds, hashIdentifiers, generateEndpoint } from './utils';
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
  const nonNullFields = removeNullValues(fields);
  const nonNullIdentifiers = removeNullValues(identifiers);
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
    const { payloads, configParams } = group;
    try {
      const elementsPayload = {
        elements: payloads.map((payload) => payload.payload),
      };
      const metadataList = payloads.map((payload) => payload.event.metadata);
      const response = preparePayloadForProcessTransformation(elementsPayload, configParams);

      successfulResponses.push(
        getSuccessRespEvents(response, metadataList, payloads[0].event.destination, true),
      );
    } catch (error) {
      failedResponses.push(
        ...payloads.map((payload) => handleRtTfSingleEventError(payload.event, error, {})),
      );
    }
  }
  return [...successfulResponses, ...failedResponses];
};

export { processRouterDest };

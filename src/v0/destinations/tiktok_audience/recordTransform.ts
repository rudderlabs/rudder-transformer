import md5 from 'md5';
import { hashToSha256, InstrumentationError, formatZodError } from '@rudderstack/integrations-lib';
import type {
  TiktokAudienceRecordRequest,
  IdentifiersPayload,
  Identifier,
  SegmentMappingPayload,
  ProcessTiktokAudienceRecordsResponse,
} from './recordTypes';
import { TiktokAudienceRecordRouterRequestSchema } from './recordTypes';
import { SHA256_TRAITS, ENDPOINT, ENDPOINT_PATH, ACTION_RECORD_MAP } from './config';
import { defaultRequestConfig, getSuccessRespEvents, handleRtTfSingleEventError } from '../../util';

function prepareIdentifiersPayload(event: TiktokAudienceRecordRequest): IdentifiersPayload {
  const { message, connection, destination } = event;
  const { isHashRequired, audienceId } = connection.config.destination;
  const { advertiserId } = destination.Config;
  const { action, identifiers } = message;

  const hashIdentifier = (fieldName: string, value: string) => {
    if (isHashRequired) {
      if (SHA256_TRAITS.includes(fieldName)) {
        return hashToSha256(value);
      }
      return md5(value);
    }
    return value;
  };

  const identifiersList: Identifier[] = [];
  for (const [fieldName, value] of Object.entries(identifiers)) {
    if (value) {
      identifiersList.push({
        id: hashIdentifier(fieldName, value),
        audience_ids: [audienceId],
      });
    }
  }

  const payload: IdentifiersPayload = {
    event,
    batchIdentifiers: identifiersList,
    idSchema: Object.keys(identifiers).sort(),
    advertiserId,
    action: ACTION_RECORD_MAP[action],
  };
  return payload;
}

function prepareSegmentMappingRequest(
  payload: SegmentMappingPayload,
  event: TiktokAudienceRecordRequest,
) {
  const accessToken = event.metadata?.secret?.accessToken;
  const userId = event.message?.userId;

  const response = defaultRequestConfig();
  response.body.JSON = payload;
  response.userId = userId;
  response.endpoint = ENDPOINT;
  response.endpointPath = ENDPOINT_PATH;
  response.headers = {
    'Access-Token': accessToken,
    'Content-Type': 'application/json',
  };
  return response;
}

function validateAudienceRecordEvent(event: unknown): TiktokAudienceRecordRequest {
  const result = TiktokAudienceRecordRouterRequestSchema.safeParse(event);
  if (!result.success) {
    throw new InstrumentationError(formatZodError(result.error));
  }
  return result.data;
}

function processTiktokAudienceRecords(events: unknown[]): ProcessTiktokAudienceRecordsResponse {
  const recordResponse: ProcessTiktokAudienceRecordsResponse = {
    failedResponses: [],
    successfulResponses: [],
  };
  const groupedPayloads: {
    advertiserId: string;
    action: string;
    idSchema: string[];
    payloads: IdentifiersPayload[];
  }[] = [];

  for (const event of events) {
    try {
      const recordEvent = validateAudienceRecordEvent(event);
      const identifiersPayload = prepareIdentifiersPayload(recordEvent);

      const existingGroup = groupedPayloads.find(
        (group) =>
          group.advertiserId === identifiersPayload.advertiserId &&
          group.action === identifiersPayload.action &&
          group.idSchema.length === identifiersPayload.idSchema.length &&
          group.idSchema.every((field, index) => field === identifiersPayload.idSchema[index]),
      );

      if (existingGroup) {
        existingGroup.payloads.push(identifiersPayload);
      } else {
        groupedPayloads.push({
          advertiserId: identifiersPayload.advertiserId,
          action: identifiersPayload.action,
          idSchema: identifiersPayload.idSchema,
          payloads: [identifiersPayload],
        });
      }
    } catch (error) {
      recordResponse.failedResponses.push(handleRtTfSingleEventError(event, error, {}));
    }
  }

  for (const group of groupedPayloads) {
    try {
      const batchIdentifiers = group.payloads.map((payload) => payload.batchIdentifiers);
      const metadataList = group.payloads.map((payload) => payload.event.metadata);

      const payload: SegmentMappingPayload = {
        batch_data: batchIdentifiers,
        id_schema: group.idSchema,
        advertiser_ids: [group.advertiserId],
        action: group.action,
      };
      const response = prepareSegmentMappingRequest(payload, group.payloads[0].event);

      recordResponse.successfulResponses.push(
        getSuccessRespEvents(response, metadataList, group.payloads[0].event.destination, true),
      );
    } catch (error) {
      recordResponse.failedResponses.push(
        ...group.payloads.map((payload) => handleRtTfSingleEventError(payload.event, error, {})),
      );
    }
  }
  return recordResponse;
}

export { processTiktokAudienceRecords };

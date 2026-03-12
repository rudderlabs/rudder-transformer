import md5 from 'md5';
import { hashToSha256, InstrumentationError, formatZodError } from '@rudderstack/integrations-lib';
import { groupBy } from 'lodash';
import type { TiktokAudienceRecordRequest } from './recordTypes';
import { TiktokAudienceRecordRouterRequestSchema } from './recordTypes';
import { SHA256_TRAITS, ENDPOINT, ENDPOINT_PATH, ACTION_RECORD_MAP } from './config';
import { defaultRequestConfig, getSuccessRespEvents, handleRtTfSingleEventError } from '../../util';
import { RouterTransformationResponse } from '../../../types';

type ProcessTiktokAudienceRecordsResponse = {
  failedResponses: RouterTransformationResponse[];
  successfulResponses: RouterTransformationResponse[];
};

type Identifier = {
  id: string;
  audience_ids: string[];
};

type IdentifiersPayload = {
  event: TiktokAudienceRecordRequest;
  batchIdentifiers: Identifier[];
  idSchema: string[];
  advertiserId: string;
  action: string;
};

type SegmentMappingPayload = {
  batch_data: Identifier[][];
  id_schema: string[];
  advertiser_ids: string[];
  action: string;
};

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
  const identifiersPayloads: IdentifiersPayload[] = [];

  for (const event of events) {
    try {
      const recordEvent = validateAudienceRecordEvent(event);
      const identifiersPayload = prepareIdentifiersPayload(recordEvent);
      identifiersPayloads.push(identifiersPayload);
    } catch (error) {
      recordResponse.failedResponses.push(handleRtTfSingleEventError(event, error, {}));
    }
  }

  const groupedPayloads = groupBy(
    identifiersPayloads,
    (payload) => `${payload.advertiserId}-${payload.action}-${payload.idSchema.join(',')}`,
  );

  for (const [key, payloadArray] of Object.entries(groupedPayloads)) {
    try {
      const [advertiserId, action, idSchema] = key.split('-');
      const idSchemaList = idSchema.split(',');
      const batchIdentifiers = payloadArray.map((payload) => payload.batchIdentifiers);
      const metadataList = payloadArray.map((payload) => payload.event.metadata);

      const payload: SegmentMappingPayload = {
        batch_data: batchIdentifiers,
        id_schema: idSchemaList,
        advertiser_ids: [advertiserId],
        action,
      };
      const response = prepareSegmentMappingRequest(payload, payloadArray[0].event);
      recordResponse.successfulResponses.push(
        getSuccessRespEvents(response, metadataList, payloadArray[0].event.destination, true),
      );
    } catch (error) {
      recordResponse.failedResponses.push(
        ...payloadArray.map((payload) => handleRtTfSingleEventError(payload.event, error, {})),
      );
    }
  }
  return recordResponse;
}

export { processTiktokAudienceRecords, ProcessTiktokAudienceRecordsResponse };

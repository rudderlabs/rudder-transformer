import md5 from 'md5';
import { hashToSha256, InstrumentationError, formatZodError } from '@rudderstack/integrations-lib';
import { groupBy } from 'lodash';
import type { TiktokAudienceRecordRequest } from './recordTypes';
import { TiktokAudienceRecordRouterRequestSchema } from './recordTypes';
import { SHA256_TRAITS, ENDPOINT, ENDPOINT_PATH, ACTION_RECORD_MAP } from './config';
import { defaultRequestConfig, getSuccessRespEvents, handleRtTfSingleEventError } from '../../util';
import { RouterTransformationResponse } from '../../../types';

type Identifier = {
  id: string;
  audience_ids: string[];
};

type Payload = {
  event: TiktokAudienceRecordRequest;
  batchIdentifiers: Identifier[];
  idSchema: string[];
  advertiserId: string;
  action: string;
};

function prepareIdentifiersPayload(event: TiktokAudienceRecordRequest): Payload {
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

  const payload: Payload = {
    event,
    batchIdentifiers: identifiersList,
    idSchema: Object.keys(identifiers).sort(),
    advertiserId,
    action: ACTION_RECORD_MAP[action],
  };
  return payload;
}

function buildResponseForProcessTransformation(
  payload: Record<string, any>,
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

function validateAudienceRecordEvent(event: unknown) {
  const result = TiktokAudienceRecordRouterRequestSchema.safeParse(event);
  if (!result.success) {
    throw new InstrumentationError(formatZodError(result.error));
  }
  return result.data;
}

function processTiktokAudienceRecords(events: unknown[]): {
  recordFailedResponses: RouterTransformationResponse[];
  recordSuccessfulResponses: RouterTransformationResponse[];
} {
  const recordSuccessfulResponses: RouterTransformationResponse[] = [];
  const recordFailedResponses: RouterTransformationResponse[] = [];

  const payloads: Payload[] = [];

  for (const event of events) {
    try {
      const tiktokEvent = validateAudienceRecordEvent(event);
      const payload = prepareIdentifiersPayload(tiktokEvent);
      payloads.push(payload);
    } catch (error) {
      recordFailedResponses.push(handleRtTfSingleEventError(event, error, {}));
    }
  }

  const groupedPayloads = groupBy(
    payloads,
    (payload) => `${payload.advertiserId}-${payload.action}-${payload.idSchema.join(',')}`,
  );

  for (const [key, payloadArray] of Object.entries(groupedPayloads)) {
    try {
      const [advertiserId, action, idSchema] = key.split('-');
      const idSchemaList = idSchema.split(',');
      const batchData = payloadArray.map((payload) => payload.batchIdentifiers);
      const metadataList = payloadArray.map((payload) => payload.event.metadata);

      const payload: Record<string, any> = {
        batch_data: batchData,
        id_schema: idSchemaList,
        advertiser_ids: [advertiserId],
        action,
      };
      const response = buildResponseForProcessTransformation(payload, payloadArray[0].event);
      recordSuccessfulResponses.push(
        getSuccessRespEvents(response, metadataList, payloadArray[0].event.destination, true),
      );
    } catch (error) {
      recordFailedResponses.push(
        ...payloadArray.map((payload) => handleRtTfSingleEventError(payload.event, error, {})),
      );
    }
  }

  return { recordFailedResponses, recordSuccessfulResponses };
}

export { processTiktokAudienceRecords };

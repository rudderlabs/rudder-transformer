import md5 from 'md5';
import { hashToSha256, InstrumentationError, formatZodError } from '@rudderstack/integrations-lib';
import type { TiktokAudienceRecordRequest } from './types.record';
import { TiktokAudienceRecordRouterRequestSchema } from './types.record';
import { SHA256_TRAITS, ENDPOINT, ENDPOINT_PATH, ACTION_RECORD_MAP } from './config';
import { defaultRequestConfig } from '../../util';

function prepareIdentifiersPayload(event: TiktokAudienceRecordRequest): Record<string, any> {
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

  const identifiersList = Object.entries(identifiers).map(([fieldName, value]) => {
    if (value) {
      return {
        id: hashIdentifier(fieldName, value!),
        audience_ids: [audienceId],
      };
    }
    return {};
  });

  const payload = {
    batch_data: [identifiersList],
    id_schema: Object.keys(identifiers),
    advertiser_ids: [advertiserId],
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

function processTiktokAudienceRecord(event: TiktokAudienceRecordRequest) {
  const payload = prepareIdentifiersPayload(event);
  return buildResponseForProcessTransformation(payload, event);
}

export { validateAudienceRecordEvent, processTiktokAudienceRecord };

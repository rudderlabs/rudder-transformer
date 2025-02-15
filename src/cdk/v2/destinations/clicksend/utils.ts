import { InstrumentationError } from '@rudderstack/integrations-lib';
import lodash from 'lodash';
import { BatchUtils } from '@rudderstack/workflow-engine';
import { SMS_SEND_ENDPOINT, MAX_BATCH_SIZE, COMMON_CONTACT_DOMAIN } from './config';
import { isDefinedAndNotNullAndNotEmpty } from '../../../../v0/util';

interface Constants {
  version: string;
  type: string;
  headers: Record<string, string>;
  destination: unknown;
  endPoint: string;
}

interface Event {
  metadata: unknown;
  message: [
    {
      body: {
        JSON: any;
      };
      version: string;
      type: string;
      headers: Record<string, string>;
      endpoint: string;
    },
  ];
  destination: unknown;
}

interface BatchedRequest {
  batchedRequest: {
    body: {
      JSON: any;
      JSON_ARRAY: Record<string, never>;
      XML: Record<string, never>;
      FORM: Record<string, never>;
    };
    version: string;
    type: string;
    method: string;
    endpoint: string;
    headers: Record<string, string>;
    params: Record<string, never>;
    files: Record<string, never>;
  };
  metadata: unknown[];
  batched: boolean;
  statusCode: number;
  destination: unknown;
}

export interface SMSCampaignPayload {
  body?: string;
  name?: string;
  list_id?: string;
  from?: string;
}

const getEndIdentifyPoint = (contactId?: string, contactListId?: string): string => {
  const basePath = `${COMMON_CONTACT_DOMAIN}/${contactListId}/contacts`;
  const contactSuffix = isDefinedAndNotNullAndNotEmpty(contactId) ? `/${contactId}` : '';
  return basePath + contactSuffix;
};

const validateIdentifyPayload = (payload: {
  phone_number?: string;
  email?: string;
  fax_number?: string;
}): void => {
  if (
    !(
      isDefinedAndNotNullAndNotEmpty(payload.phone_number) ||
      isDefinedAndNotNullAndNotEmpty(payload.email) ||
      isDefinedAndNotNullAndNotEmpty(payload.fax_number)
    )
  ) {
    throw new InstrumentationError(
      'Either phone number or email or fax_number is mandatory for contact creation',
    );
  }
};

const validateTrackSMSCampaignPayload = (payload: SMSCampaignPayload): void => {
  if (!(payload.body && payload.name && payload.list_id && payload.from)) {
    throw new InstrumentationError(
      'All of contact list Id, name, body and from are required to trigger an sms campaign',
    );
  }
};

const deduceSchedule = (
  eventLevelSchedule: number | null | undefined,
  timestamp: number | string,
  destConfig: {
    defaultCampaignScheduleUnit?: string;
    defaultCampaignSchedule?: string;
  },
): number => {
  if (typeof eventLevelSchedule === 'number' && !Number.isNaN(eventLevelSchedule)) {
    return eventLevelSchedule;
  }
  const { defaultCampaignScheduleUnit = 'minute', defaultCampaignSchedule = '0' } = destConfig;
  const date = new Date(timestamp);
  let defaultCampaignScheduleInt = parseInt(defaultCampaignSchedule, 10);
  if (Number.isNaN(defaultCampaignScheduleInt)) {
    defaultCampaignScheduleInt = 0;
  }

  if (defaultCampaignScheduleUnit === 'day') {
    date.setUTCDate(date.getUTCDate() + defaultCampaignScheduleInt);
  } else if (defaultCampaignScheduleUnit === 'minute') {
    date.setUTCMinutes(date.getUTCMinutes() + defaultCampaignScheduleInt);
  } else {
    throw new Error("Invalid delta unit. Use 'day' or 'minute'.");
  }

  return Math.floor(date.getTime() / 1000);
};

const mergeMetadata = (batch: Event[]): unknown[] => batch.map((event) => event.metadata);

const getMergedEvents = (batch: Event[]): any[] => batch.map((event) => event.message[0].body.JSON);

const getHttpMethodForEndpoint = (endpoint: string): string => {
  const contactIdPattern = /\/contacts\/[^/]+$/;
  return contactIdPattern.test(endpoint) ? 'PUT' : 'POST';
};

const buildBatchedRequest = (
  batch: Event[],
  constants: Constants,
  endpoint: string,
): BatchedRequest => ({
  batchedRequest: {
    body: {
      JSON:
        endpoint === SMS_SEND_ENDPOINT
          ? { messages: getMergedEvents(batch) }
          : batch[0].message[0].body.JSON,
      JSON_ARRAY: {},
      XML: {},
      FORM: {},
    },
    version: '1',
    type: 'REST',
    method: getHttpMethodForEndpoint(endpoint),
    endpoint,
    headers: constants.headers,
    params: {},
    files: {},
  },
  metadata: mergeMetadata(batch),
  batched: endpoint === SMS_SEND_ENDPOINT,
  statusCode: 200,
  destination: batch[0].destination,
});

const initializeConstants = (successfulEvents: Event[]): Constants | null => {
  if (successfulEvents.length === 0) return null;
  return {
    version: successfulEvents[0].message[0].version,
    type: successfulEvents[0].message[0].type,
    headers: successfulEvents[0].message[0].headers,
    destination: successfulEvents[0].destination,
    endPoint: successfulEvents[0].message[0].endpoint,
  };
};

const batchResponseBuilder = (events: Event[]): BatchedRequest[] => {
  const response: BatchedRequest[] = [];
  const constants = initializeConstants(events);
  if (!constants) return [];
  const typedEventGroups = lodash.groupBy(events, (event) => event.message[0].endpoint);

  Object.keys(typedEventGroups).forEach((eventEndPoint) => {
    if (eventEndPoint === SMS_SEND_ENDPOINT) {
      const batchesOfSMSEvents = BatchUtils.chunkArrayBySizeAndLength(
        typedEventGroups[eventEndPoint],
        { maxItems: MAX_BATCH_SIZE },
      );
      batchesOfSMSEvents.items.forEach((batch) => {
        response.push(buildBatchedRequest(batch, constants, eventEndPoint));
      });
    } else {
      response.push(
        buildBatchedRequest([typedEventGroups[eventEndPoint][0]], constants, eventEndPoint),
      );
    }
  });

  return response;
};

export {
  batchResponseBuilder,
  getEndIdentifyPoint,
  validateIdentifyPayload,
  validateTrackSMSCampaignPayload,
  deduceSchedule,
  getHttpMethodForEndpoint,
};

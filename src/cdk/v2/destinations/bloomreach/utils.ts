import lodash from 'lodash';
import { BatchUtils } from '@rudderstack/workflow-engine';
import { isObject, isEmptyObject, getIntegrationsObj } from '../../../../v0/util';
import { RudderMessage, Destination } from '../../../../types';
import { MAX_BATCH_SIZE, MAX_ITEMS, MAX_PAYLOAD_SIZE } from './config';

const getCustomerIDsFromIntegrationObject = (message: RudderMessage): any => {
  const integrationObj = getIntegrationsObj(message, 'bloomreach' as any) || {};
  const { hardID, softID } = integrationObj;
  const customerIDs = {};

  if (isObject(hardID) && !isEmptyObject(hardID)) {
    Object.keys(hardID).forEach((id) => {
      customerIDs[id] = hardID[id];
    });
  }

  if (isObject(softID) && !isEmptyObject(softID)) {
    Object.keys(softID).forEach((id) => {
      customerIDs[id] = softID[id];
    });
  }

  return customerIDs;
};

export const prepareCustomerIDs = (message: RudderMessage, destination: Destination): any => {
  const customerIDs = {
    [destination.Config.hardID]: message.userId,
    [destination.Config.softID]: message.anonymousId,
    ...getCustomerIDsFromIntegrationObject(message),
  };
  return customerIDs;
};

export const prepareRecordInsertOrUpdatePayload = (fields: any): any => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { item_id, ...properties } = fields;
  return { item_id, properties };
};

const mergeMetadata = (batch: any[]) => batch.map((event) => event.metadata);

const getMergedEvents = (batch: any[]) => batch.map((event) => event.message[0].body.JSON);

const buildBatchedRequest = (
  batch: any[],
  constants: {
    version: any;
    type: any;
    method: any;
    headers: any;
    destination: any;
    endPoint: any;
  } | null,
  endpoint: string,
  batchEvent: boolean,
) => ({
  batchedRequest: {
    body: {
      JSON: batchEvent ? { commands: getMergedEvents(batch) } : getMergedEvents(batch),
      JSON_ARRAY: {},
      XML: {},
      FORM: {},
    },
    version: '1',
    type: 'REST',
    method: constants?.method,
    endpoint,
    headers: constants?.headers,
    params: {},
    files: {},
  },
  metadata: mergeMetadata(batch),
  batched: true,
  statusCode: 200,
  destination: batch[0].destination,
});

const initializeConstants = (successfulEvents: any[]) => {
  if (successfulEvents.length === 0) return null;
  return {
    version: successfulEvents[0].message[0].version,
    type: successfulEvents[0].message[0].type,
    method: successfulEvents[0].message[0].method,
    headers: successfulEvents[0].message[0].headers,
    destination: successfulEvents[0].destination,
    endPoint: successfulEvents[0].message[0].endpoint,
  };
};

export const batchResponseBuilder = (events: any): any => {
  const response: any[] = [];
  let constants = initializeConstants(events);
  if (!constants) return [];
  const eventsGroupByEndpoint = lodash.groupBy(events, (event) => event.message[0].endpoint);

  Object.keys(eventsGroupByEndpoint).forEach((eventEndPoint) => {
    const batchEvent = eventEndPoint.endsWith('/batch');
    if (batchEvent) {
      constants = initializeConstants(eventsGroupByEndpoint[eventEndPoint]);
      const bathesOfEvents = BatchUtils.chunkArrayBySizeAndLength(
        eventsGroupByEndpoint[eventEndPoint],
        { maxItems: MAX_BATCH_SIZE },
      );
      bathesOfEvents.items.forEach((batch) => {
        response.push(buildBatchedRequest(batch, constants, eventEndPoint, batchEvent));
      });
    } else {
      constants = initializeConstants(eventsGroupByEndpoint[eventEndPoint]);
      const bathesOfEvents = BatchUtils.chunkArrayBySizeAndLength(
        eventsGroupByEndpoint[eventEndPoint],
        {
          maxSizeInBytes: MAX_PAYLOAD_SIZE,
          maxItems: MAX_ITEMS,
        },
      );
      bathesOfEvents.items.forEach((batch) => {
        response.push(buildBatchedRequest(batch, constants, eventEndPoint, batchEvent));
      });
    }
  });
  return response;
};

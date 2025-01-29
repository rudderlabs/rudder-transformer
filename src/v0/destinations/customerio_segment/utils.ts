import { base64Convertor, ConfigurationError, NetworkError } from '@rudderstack/integrations-lib';
import { BatchUtils } from '@rudderstack/workflow-engine';
import { BASE_ENDPOINT, MAX_ITEMS } from './config';
import {
  ConnectionStructure,
  CustomerSearchPayloadType,
  CustomerSearchResponseType,
  DestinationStructure,
  EventStructure,
  RespList,
  SegmentActionPayloadType,
} from './type';
import { handleRtTfSingleEventError, isHttpStatusSuccess } from '../../util';
import { handleHttpRequest } from '../../../adapters/network';
import { getDynamicErrorType } from '../../../adapters/utils/networkUtils';

const tags = require('../../util/tags');

function getIdType(connection: ConnectionStructure) {
  return connection?.config?.destination?.identifierMappings[0]?.to || 'id';
}

const getMergedQueryPayload = (batch: any[]) => batch.map((input) => input?.payload);

const getMergedEvents = (batch: any[]) => batch.map((input) => input?.event);

async function getUserIds(
  finalPayload: CustomerSearchPayloadType,
  destination: DestinationStructure,
  connection: ConnectionStructure,
) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${destination?.Config?.appApiKey}`,
  };
  const endpoint = `https://api.customer.io/v1/customers?limit=${MAX_ITEMS}`;
  const statTags = {
    destType: 'CUSTOMERIO_SEGMENT',
    feature: 'transformation',
    endpointPath: 'v1/customers',
    requestMethod: 'POST',
    module: 'router',
  };

  const { processedResponse: response } = await handleHttpRequest(
    'POST',
    endpoint,
    finalPayload,
    {
      headers,
    },
    statTags,
  );

  if (!isHttpStatusSuccess(response.status)) {
    throw new NetworkError(
      `error fetching customers : ${JSON.stringify(response)}`,
      response.status,
      {
        [tags]: getDynamicErrorType(response.status),
      },
      response,
    );
  }

  const destinationResponse: CustomerSearchResponseType = response?.response;

  const idType = getIdType(connection);
  return destinationResponse?.identifiers?.map((item) => item[idType]) || [];
}

function getCustomerSearchPayloadAndEvent(event: EventStructure, payloadAndEventList: any[]) {
  const { identifiers } = event?.message || {};
  const [field, value] = Object.entries(identifiers)[0];

  payloadAndEventList.push({
    payload: {
      attribute: {
        field,
        operator: 'eq',
        value,
      },
    },
    event,
  });
}

async function filterCustomers(
  payloadAndEventList: any[],
  destination: DestinationStructure,
  connection: ConnectionStructure,
  reqMetadata: any,
) {
  const filteredErrorRespList: any[] = [];
  const filteredSuccessInputs: any[] = [];

  const batches = BatchUtils.chunkArrayBySizeAndLength(payloadAndEventList, {
    maxItems: MAX_ITEMS,
  });

  await Promise.all(
    batches.items.map(async (batch) => {
      const queryPayload = getMergedQueryPayload(batch);
      const mergedEvents: EventStructure[] = getMergedEvents(batch);

      const finalPayload = {
        filter: {
          or: queryPayload,
        },
      };

      try {
        // get filtered available user ids from customer io
        const userIdsList: any[] = await getUserIds(finalPayload, destination, connection);
        const userIdsSet = new Set(userIdsList);

        mergedEvents.forEach((event) => {
          const { identifiers } = event?.message || {};
          const idType = getIdType(connection);
          const idValue = identifiers[idType];
          // if user id is available add it to successInputs to process it later
          // else add the error response to corresponding event
          if (userIdsSet.has(String(idValue))) {
            filteredSuccessInputs.push(event);
          } else {
            const error = new ConfigurationError(
              `customer with '${idType}':'${idValue}' is not present in customer io`,
            );
            const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
            filteredErrorRespList.push(errRespEvent);
          }
        });
      } catch (error) {
        // add the error response if there is some failure during search customers api call
        mergedEvents.forEach((event) => {
          const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
          filteredErrorRespList.push(errRespEvent);
        });
      }
    }),
  );

  return { filteredSuccessInputs, filteredErrorRespList };
}

const buildBatchedResponse = (
  payload: SegmentActionPayloadType,
  endpoint: string,
  headers: any,
  params: { id_type: string },
  metadata: Record<string, unknown>[],
  destination: DestinationStructure,
) => ({
  batchedRequest: {
    body: {
      JSON: payload,
      JSON_ARRAY: {},
      XML: {},
      FORM: {},
    },
    version: '1',
    type: 'REST',
    method: 'POST',
    endpoint,
    headers,
    params,
    files: {},
  },
  metadata,
  batched: true,
  statusCode: 200,
  destination,
});

const getEventAction = (event: EventStructure) => event?.message?.action?.toLowerCase() || '';

function getSegmentId(connection: ConnectionStructure) {
  return connection?.config?.destination?.audienceId || '';
}

function getMergedPayload(batch: any[]) {
  const mergedIds = batch.flatMap((input) => input.payload.ids);
  return { ids: mergedIds };
}

const getMergedMetadata = (batch: any[]) => batch.map((input) => input.metadata);

function getHeaders(destination: DestinationStructure) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Basic ${base64Convertor(`${destination.Config.siteId}:${destination.Config.apiKey}`)}`,
  };
}

function getParams(connection: ConnectionStructure) {
  return {
    id_type: getIdType(connection),
  };
}

function insertOrUpdateBatchResponseBuilder(
  insertOrUpdateRespList: RespList[],
  destination: DestinationStructure,
  connection: ConnectionStructure,
) {
  const insertOrUpdateBatchResponse: any[] = [];
  const endpoint = `${BASE_ENDPOINT}/${getSegmentId(connection)}/add_customers`;
  const headers = getHeaders(destination);
  const params = getParams(connection);
  const batches = BatchUtils.chunkArrayBySizeAndLength(insertOrUpdateRespList, {
    maxItems: MAX_ITEMS,
  });
  batches.items.forEach((batch) => {
    const mergedPayload = getMergedPayload(batch);
    const mergedMetadata = getMergedMetadata(batch);
    insertOrUpdateBatchResponse.push(
      buildBatchedResponse(mergedPayload, endpoint, headers, params, mergedMetadata, destination),
    );
  });
  return insertOrUpdateBatchResponse;
}

function deleteBatchResponseBuilder(
  deleteRespList: RespList[],
  destination: DestinationStructure,
  connection: ConnectionStructure,
) {
  const deleteBatchResponse: any[] = [];
  const endpoint = `${BASE_ENDPOINT}/${getSegmentId(connection)}/remove_customers`;
  const headers = getHeaders(destination);
  const params = getParams(connection);
  const batches = BatchUtils.chunkArrayBySizeAndLength(deleteRespList, {
    maxItems: MAX_ITEMS,
  });
  batches.items.forEach((batch) => {
    const mergedPayload = getMergedPayload(batch);
    const mergedMetadata = getMergedMetadata(batch);
    deleteBatchResponse.push(
      buildBatchedResponse(mergedPayload, endpoint, headers, params, mergedMetadata, destination),
    );
  });
  return deleteBatchResponse;
}

// returns final batched response
const batchResponseBuilder = (
  insertOrUpdateRespList: RespList[],
  deleteRespList: RespList[],
  destination: DestinationStructure,
  connection: ConnectionStructure,
) => {
  const response: any[] = [];
  if (insertOrUpdateRespList.length > 0) {
    response.push(
      ...insertOrUpdateBatchResponseBuilder(insertOrUpdateRespList, destination, connection),
    );
  }
  if (deleteRespList.length > 0) {
    response.push(...deleteBatchResponseBuilder(deleteRespList, destination, connection));
  }
  return response;
};

module.exports = {
  batchResponseBuilder,
  getEventAction,
  getCustomerSearchPayloadAndEvent,
  filterCustomers,
};

import { BatchUtils } from '@rudderstack/workflow-engine';
import {
  DeletePayload,
  ProcessedEvent,
  SFMCBatchResponse,
  SFMCAction,
  UpsertPayload,
  SFMCDestination,
} from './type';
import { tokenManager } from './utils/tokenManager';
import {
  createUpsertObjects,
  createDeleteObjects,
  createBatchResponse,
} from './utils/batchResponse';
import { getMergedMetadata } from './utils';
import { createSoapRequest } from './utils/soapRequest';
import { MAX_ITEMS } from './config';

/**
 * Creates a batch request for a specific operation type
 * @param objects Array of objects to process
 * @param requestType Type of request (Create/Update/Delete)
 * @param soapAction SOAP action to perform
 * @param metadata Metadata for the batch
 * @param authToken Authentication token
 * @param destination SFMC destination configuration
 * @returns Array of batch responses
 */
const createBatchRequests = (
  objects: any[],
  requestType: string,
  soapAction: string,
  metadata: any[],
  authToken: string,
  destination: SFMCDestination,
): SFMCBatchResponse[] => {
  const chunks = BatchUtils.chunkArrayBySizeAndLength(objects, { maxItems: MAX_ITEMS });
  return chunks.items.map((batch) => {
    const batchedRequest = createSoapRequest(
      {
        requestType,
        soapAction,
        objects: batch,
      },
      authToken,
      destination,
    );
    return createBatchResponse(batchedRequest, metadata, destination);
  });
};

/**
 * Processes insert operations
 * @param insertRespList List of events to insert
 * @param dataExtensionKey Data extension key
 * @param authToken Authentication token
 * @param destination SFMC destination configuration
 * @returns Array of batch responses
 */
export const processInsertOperations = async (
  insertRespList: ProcessedEvent[],
  dataExtensionKey: string,
  destination: SFMCDestination,
): Promise<SFMCBatchResponse[]> => {
  if (insertRespList.length === 0) return Promise.resolve([]);
  const objects = createUpsertObjects(insertRespList, dataExtensionKey);
  const authToken = await tokenManager.getAuthToken(destination.Config);
  return createBatchRequests(
    objects,
    'CreateRequest',
    'Create',
    getMergedMetadata(insertRespList),
    authToken,
    destination,
  );
};

/**
 * Processes update operations
 * @param updateRespList List of events to update
 * @param dataExtensionKey Data extension key
 * @param authToken Authentication token
 * @param destination SFMC destination configuration
 * @returns Array of batch responses
 */
export const processUpdateOperations = async (
  updateRespList: ProcessedEvent[],
  dataExtensionKey: string,
  destination: SFMCDestination,
): Promise<SFMCBatchResponse[]> => {
  if (updateRespList.length === 0) return Promise.resolve([]);
  const objects = createUpsertObjects(updateRespList, dataExtensionKey);
  const authToken = await tokenManager.getAuthToken(destination.Config);
  return createBatchRequests(
    objects,
    'UpdateRequest',
    'Update',
    getMergedMetadata(updateRespList),
    authToken,
    destination,
  );
};

/**
 * Processes delete operations
 * @param deleteRespList List of events to delete
 * @param dataExtensionKey Data extension key
 * @param authToken Authentication token
 * @param destination SFMC destination configuration
 * @returns Array of batch responses
 */
export const processDeleteOperations = async (
  deleteRespList: ProcessedEvent[],
  dataExtensionKey: string,
  destination: SFMCDestination,
): Promise<SFMCBatchResponse[]> => {
  if (deleteRespList.length === 0) return Promise.resolve([]);
  const objects = createDeleteObjects(deleteRespList, dataExtensionKey);
  const authToken = await tokenManager.getAuthToken(destination.Config);
  return createBatchRequests(
    objects,
    'DeleteRequest',
    'Delete',
    getMergedMetadata(deleteRespList),
    authToken,
    destination,
  );
};

export const recordEventsHandler = async (
  successfulEvents: ProcessedEvent[],
  dataExtensionKey: string,
  destination: SFMCDestination,
): Promise<SFMCBatchResponse[]> => {
  const insertRespList = successfulEvents
    .filter((event) => event.eventAction === SFMCAction.INSERT)
    .map(({ payload, metadata, eventAction }) => ({
      payload: { keys: payload.keys, values: payload.values } as UpsertPayload,
      metadata,
      eventAction,
    }));
  const insertResponses = await processInsertOperations(
    insertRespList,
    dataExtensionKey,
    destination,
  );

  const updateRespList = successfulEvents
    .filter((event) => event.eventAction === SFMCAction.UPDATE)
    .map(({ payload, metadata, eventAction }) => ({
      payload: { keys: payload.keys, values: payload.values } as UpsertPayload,
      metadata,
      eventAction,
    }));
  const updateResponses = await processUpdateOperations(
    updateRespList,
    dataExtensionKey,
    destination,
  );

  // Split successful events into delete and insert/update lists
  const deleteRespList = successfulEvents
    .filter((event) => event.eventAction === SFMCAction.DELETE)
    .map(({ payload, metadata }) => ({
      payload: { keys: payload.keys } as DeletePayload,
      metadata,
      eventAction: SFMCAction.DELETE,
    }));

  const deleteResponses = await processDeleteOperations(
    deleteRespList,
    dataExtensionKey,
    destination,
  );

  return [...insertResponses, ...updateResponses, ...deleteResponses];
};

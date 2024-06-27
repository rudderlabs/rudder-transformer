const { TransformationError } = require('@rudderstack/integrations-lib');
// const { get } = require('lodash');
const lodash = require('lodash');
const {
  defaultBatchRequestConfig,
  defaultPostRequestConfig,
  getSuccessRespEvents,
} = require('../../util');

const {
  BATCH_IDENTIFY_CRM_CREATE_NEW_CONTACT,
  BATCH_IDENTIFY_CRM_UPDATE_CONTACT,
} = require('./config');

const batchIdentify2 = (
  arrayChunksIdentify,
  batchedResponseList,
  batchOperation,
  endPoint,
  destinationObject,
) => {
  // list of chunks [ [..], [..] ]
  arrayChunksIdentify.forEach((chunk) => {
    const identifyResponseList = [];
    const metadata = [];

    // extracting message, destination value
    // from the first event in a batch
    // const { message, destination } = chunk[0];

    let batchEventResponse = defaultBatchRequestConfig();

    if (batchOperation === 'createObject') {
      batchEventResponse.batchedRequest.endpoint = endPoint;

      // create operation
      chunk.forEach((ev) => {
        identifyResponseList.push({ ...ev.tempPayload });
        metadata.push(ev.metadata);
      });
    } else if (batchOperation === 'updateObject') {
      batchEventResponse.batchedRequest.endpoint = endPoint;
      // update operation
      chunk.forEach((ev) => {
        identifyResponseList.push(ev);

        metadata.push(ev.metadata);
      });
    } else if (batchOperation === 'createContacts') {
      // create operation
      chunk.forEach((ev) => {
        // appending unique events
        identifyResponseList.push(ev);
        // }
        metadata.push(ev.metadata);
      });
    } else if (batchOperation === 'updateContacts') {
      // update operation
      chunk.forEach((ev) => {
        identifyResponseList.push(...ev.tempPayload);
        // }
        metadata.push(ev.metadata);
      });
    } else {
      throw new TransformationError('Unknown hubspot operation', 400);
    }

    batchEventResponse.batchedRequest.body.JSON = {
      inputs: identifyResponseList,
    };

    if (batchOperation === 'createContacts') {
      batchEventResponse.batchedRequest.endpoint = BATCH_IDENTIFY_CRM_CREATE_NEW_CONTACT;
    } else if (batchOperation === 'updateContacts') {
      batchEventResponse.batchedRequest.endpoint = BATCH_IDENTIFY_CRM_UPDATE_CONTACT;
    }

    batchEventResponse.batchedRequest.headers = {
      Authorization: `Bearer ${destinationObject.Config.accessToken}`,
    };
    // batchEventResponse.batchedRequest.params = message.params;

    batchEventResponse = {
      ...batchEventResponse,
      metadata,
      destinationObject,
    };
    batchedResponseList.push(
      getSuccessRespEvents(
        batchEventResponse.batchedRequest,
        batchEventResponse.metadata,
        batchEventResponse.destination,
        true,
      ),
    );
  });
  return batchedResponseList;
};

const batchEvents2 = (destEvents) => {
  let batchedResponseList = [];
  const trackResponseList = [];
  let staticDestObject;
  // rETL specific chunk
  const createAllObjectsEventChunk = [];
  const updateAllObjectsEventChunk = [];
  let maxBatchSize;

  destEvents.forEach((event) => {
    // handler for track call
    // track call does not have batch endpoint
    const { message, metadata, destination } = event;
    staticDestObject = destination;
    if (message.operation === 'create') {
      createAllObjectsEventChunk.push(message.tempPayload);
    } else if (message.operation === 'update') {
      updateAllObjectsEventChunk.push(message.tempPayload);
    }

    const batchedResponse = defaultBatchRequestConfig();
    batchedResponse.batchedRequest.headers = {
      Authorization: `Bearer ${destination.Config.accessToken}`,
    };
    batchedResponse.batchedRequest.endpoint = message.endPoint;
    batchedResponse.batchedRequest.body = message.tempPayload;
    batchedResponse.batchedRequest.method = defaultPostRequestConfig.requestMethod;
    batchedResponse.metadata = [metadata];
    batchedResponse.destination = destination;

    trackResponseList.push(
      getSuccessRespEvents(
        batchedResponse.batchedRequest,
        batchedResponse.metadata,
        batchedResponse.destination,
      ),
    );
  });

  const arrayChunksIdentifyCreateObjects = lodash.chunk(createAllObjectsEventChunk, maxBatchSize);

  const arrayChunksIdentifyUpdateObjects = lodash.chunk(updateAllObjectsEventChunk, maxBatchSize);

  // batching up 'create' all objects endpoint chunks
  if (arrayChunksIdentifyCreateObjects.length > 0) {
    batchedResponseList = batchIdentify2(
      arrayChunksIdentifyCreateObjects,
      batchedResponseList,
      'createObject',
      BATCH_IDENTIFY_CRM_CREATE_NEW_CONTACT,
      staticDestObject,
    );
  }

  // batching up 'update' all objects endpoint chunks
  if (arrayChunksIdentifyUpdateObjects.length > 0) {
    batchedResponseList = batchIdentify2(
      arrayChunksIdentifyUpdateObjects,
      batchedResponseList,
      'updateObject',
      BATCH_IDENTIFY_CRM_UPDATE_CONTACT,
      staticDestObject,
    );
  }

  return batchedResponseList.concat(trackResponseList);
};

module.exports = { batchEvents2 };

// const { TransformationError } = require('@rudderstack/integrations-lib');
// const { get } = require('lodash');
const lodash = require('lodash');
const { defaultBatchRequestConfig, getSuccessRespEvents } = require('../../util');

const {
  BATCH_IDENTIFY_CRM_CREATE_NEW_CONTACT,
  BATCH_IDENTIFY_CRM_UPDATE_CONTACT,
  MAX_BATCH_SIZE,
} = require('./config');

const batchIdentify2 = (
  arrayChunksIdentify,
  batchedResponseList,
  batchOperation,
  endPoint,
  destinationObject,
  metadaDataArray,
) => {
  // list of chunks [ [..], [..] ]
  arrayChunksIdentify.forEach((chunk) => {
    const identifyResponseList = [];

    let batchEventResponse = defaultBatchRequestConfig();
    batchEventResponse.batchedRequest.endpoint = endPoint;

    // create operation
    chunk.forEach((ev) => {
      identifyResponseList.push(ev);
    });

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

    batchEventResponse = {
      ...batchEventResponse,
      metadata: metadaDataArray,
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
  const metadataCreateArray = [];
  const metadataUpdateArray = [];
  let endPoint;

  destEvents.forEach((event) => {
    // handler for track call
    // track call does not have batch endpoint
    const { message, metadata, destination } = event;
    staticDestObject = destination;

    if (message.operation === 'create') {
      createAllObjectsEventChunk.push(message.tempPayload);
      metadataCreateArray.push(metadata);
    } else if (message.operation === 'update') {
      updateAllObjectsEventChunk.push(message.tempPayload);
      metadataUpdateArray.push(metadata);
    }
    // eslint-disable-next-line unicorn/consistent-destructuring
    endPoint = event?.message?.endPoint;
  });

  const arrayChunksIdentifyCreateObjects = lodash.chunk(createAllObjectsEventChunk, MAX_BATCH_SIZE);
  const arrayChunksMetadataCreateObjects = lodash.chunk(metadataCreateArray, MAX_BATCH_SIZE);

  const arrayChunksIdentifyUpdateObjects = lodash.chunk(updateAllObjectsEventChunk, MAX_BATCH_SIZE);
  const arrayChunksMetadataUpdateObjects = lodash.chunk(metadataUpdateArray, MAX_BATCH_SIZE);

  // batching up 'create' all objects endpoint chunks
  if (arrayChunksIdentifyCreateObjects.length > 0) {
    batchedResponseList = batchIdentify2(
      arrayChunksIdentifyCreateObjects,
      batchedResponseList,
      'createObject',
      endPoint,
      staticDestObject,
      arrayChunksMetadataCreateObjects,
    );
  }

  // batching up 'update' all objects endpoint chunks
  if (arrayChunksIdentifyUpdateObjects.length > 0) {
    batchedResponseList = batchIdentify2(
      arrayChunksIdentifyUpdateObjects,
      batchedResponseList,
      'updateObject',
      endPoint,
      staticDestObject,
      arrayChunksMetadataUpdateObjects,
    );
  }

  return batchedResponseList.concat(trackResponseList);
};

module.exports = { batchEvents2 };

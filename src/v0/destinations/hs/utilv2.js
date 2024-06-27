const { get } = require('lodash');
const lodash = require('lodash');
const {
  defaultBatchRequestConfig,
  defaultPostRequestConfig,
  getSuccessRespEvents,
} = require('../../util');

// const getExistingContactsData = async (inputs, destination) => {
//   const { Config } = destination;
//   const hsIdsToBeUpdated = [];
//   const firstMessage = inputs[0].message;

//   if (!firstMessage) {
//     throw new InstrumentationError('rETL - objectType or identifier type not found.');
//   }

//   const { objectType, identifierType } = getObjectAndIdentifierType(firstMessage);

//   const values = extractIDsForSearchAPI(inputs);
//   const valuesChunk = lodash.chunk(values, MAX_CONTACTS_PER_REQUEST);
//   const requestOptions = {
//     headers: {
//       'Content-Type': JSON_MIME_TYPE,
//       Authorization: `Bearer ${Config.accessToken}`,
//     },
//   };
//   // eslint-disable-next-line no-restricted-syntax
//   for (const chunk of valuesChunk) {
//     const requestData = getRequestData(identifierType, chunk);
//     const searchResults = await performHubSpotSearch(
//       requestData,
//       requestOptions,
//       objectType,
//       identifierType,
//       destination,
//     );
//     if (searchResults.length > 0) {
//       hsIdsToBeUpdated.push(...searchResults);
//     }
//   }
//   return hsIdsToBeUpdated;
// };

// const splitEventsForCreateUpdate = async (inputs, destination) => {
//   // get all the id and properties of already existing objects needed for update.
//   const hsIdsToBeUpdated = await getExistingContactsData(inputs, destination);

//   const resultInput = inputs.map((input) => {
//     const { message } = input;
//     const inputParam = input;
//     const { destinationExternalId, identifierType } = getDestinationExternalIDInfoForRetl(
//       message,
//       DESTINATION,
//     );

//     const filteredInfo = hsIdsToBeUpdated.filter(
//       (update) =>
//         update.property.toString().toLowerCase() === destinationExternalId.toString().toLowerCase(), // second condition is for secondary property for identifier type
//     );

//     if (filteredInfo.length > 0) {
//       inputParam.message.context.externalId = setHsSearchId(input, filteredInfo[0].id);
//       inputParam.message.context.hubspotOperation = 'updateObject';
//       return inputParam;
//     }
//     const secondaryProp = primaryToSecondaryFields[identifierType];
//     if (secondaryProp) {
//       /* second condition is for secondary property for identifier type
//          For example:
//          update[secondaryProp] = "abc@e.com;cd@e.com;k@w.com"
//          destinationExternalId = "cd@e.com"
//          So we are splitting all the emails in update[secondaryProp] into an array using ';'
//          and then checking if array includes  destinationExternalId
//          */
//       const filteredInfoForSecondaryProp = hsIdsToBeUpdated.filter((update) =>
//         update[secondaryProp]
//           ?.toString()
//           .toLowerCase()
//           .split(';')
//           .includes(destinationExternalId.toString().toLowerCase()),
//       );
//       if (filteredInfoForSecondaryProp.length > 0) {
//         inputParam.message.context.externalId = setHsSearchId(
//           input,
//           filteredInfoForSecondaryProp[0].id,
//           true,
//         );
//         inputParam.message.context.hubspotOperation = 'updateObject';
//         return inputParam;
//       }
//     }
//     // if not found in the existing contacts, then it's a new contact
//     inputParam.message.context.hubspotOperation = 'createObject';
//     return inputParam;
//   });

//   return resultInput;
// };

const batchIdentify2 = (arrayChunksIdentify, batchedResponseList, batchOperation) => {
  // list of chunks [ [..], [..] ]
  arrayChunksIdentify.forEach((chunk) => {
    const identifyResponseList = [];
    const metadata = [];

    // extracting message, destination value
    // from the first event in a batch
    const { message, destination } = chunk[0];

    let batchEventResponse = defaultBatchRequestConfig();

    if (batchOperation === 'createObject') {
      batchEventResponse.batchedRequest.endpoint = `${message.endPoint}/batch/create`;

      // create operation
      chunk.forEach((ev) => {
        identifyResponseList.push({ ...ev.message.body.JSON });
        metadata.push(ev.metadata);
      });
    } else if (batchOperation === 'updateObject') {
      batchEventResponse.batchedRequest.endpoint = `${message.endPoint.substr(
        0,
        message.endpoint.lastIndexOf('/'),
      )}/batch/update`;
      // update operation
      chunk.forEach((ev) => {
        const updateEndpoint = ev.message.endpoint;
        identifyResponseList.push({
          ...ev.message.body.JSON,
          id: updateEndpoint.split('/').pop(),
        });

        metadata.push(ev.metadata);
      });
    } else if (batchOperation === 'createContacts') {
      // create operation
      chunk.forEach((ev) => {
        // duplicate email can cause issue with create in batch
        // updating the existing one to avoid duplicate
        // as same event can fire in batch one of the reason
        // can be due to network lag or processor being busy
        const isDuplicate = identifyResponseList.find(
          (data) => data.properties.email === ev.message.body.JSON.properties.email,
        );
        if (isDefinedAndNotNullAndNotEmpty(isDuplicate)) {
          // array is being shallow copied hence changes are affecting the original reference
          // basically rewriting the same value to avoid duplicate entry
          isDuplicate.properties = ev.message.body.JSON.properties;
        } else {
          // appending unique events
          identifyResponseList.push({
            properties: ev.message.body.JSON.properties,
          });
        }
        metadata.push(ev.metadata);
      });
    } else if (batchOperation === 'updateContacts') {
      // update operation
      chunk.forEach((ev) => {
        // update has contactId and properties
        // extract contactId from the end of the endpoint
        const id = ev.message.endpoint.split('/').pop();

        // duplicate contactId is not allowed in batch
        // updating the existing one to avoid duplicate
        // as same event can fire in batch one of the reason
        // can be due to network lag or processor being busy
        const isDuplicate = identifyResponseList.find((data) => data.id === id);
        if (isDefinedAndNotNullAndNotEmpty(isDuplicate)) {
          // rewriting the same value to avoid duplicate entry
          isDuplicate.properties = ev.message.body.JSON.properties;
        } else {
          // appending unique events
          identifyResponseList.push({
            id,
            properties: ev.message.body.JSON.properties,
          });
        }
        metadata.push(ev.metadata);
      });
    } else if (batchOperation === 'createAssociations') {
      chunk.forEach((ev) => {
        batchEventResponse.batchedRequest.endpoint = ev.message.endpoint;
        identifyResponseList.push(ev.message.body.JSON);
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

    batchEventResponse.batchedRequest.headers = message.headers;
    batchEventResponse.batchedRequest.params = message.params;

    batchEventResponse = {
      ...batchEventResponse,
      metadata,
      destination,
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
  // create contact chunck
  //   const createContactEventsChunk = [];
  // update contact chunk
  //   const updateContactEventsChunk = [];
  // rETL specific chunk
  const createAllObjectsEventChunk = [];
  const updateAllObjectsEventChunk = [];
  // const associationObjectsEventChunk = [];
  let maxBatchSize;

  destEvents.forEach((event) => {
    // handler for track call
    // track call does not have batch endpoint
    const { message, metadata, destination, endPoint } = event;
    if (message.operation === 'create') {
      createAllObjectsEventChunk.push(event);
    } else if (message.operation === 'update') {
      updateAllObjectsEventChunk.push(event);
    }

    const batchedResponse = defaultBatchRequestConfig();
    batchedResponse.batchedRequest.headers = message.headers;
    batchedResponse.batchedRequest.endpoint = endPoint;
    batchedResponse.batchedRequest.body = message;
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

  // eventChunks = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
  // CRM create contact endpoint chunks
  //   const arrayChunksIdentifyCreateContact = lodash.chunk(
  //     createContactEventsChunk,
  //     MAX_BATCH_SIZE_CRM_CONTACT,
  //   );
  //   // CRM update contact endpoint chunks
  //   const arrayChunksIdentifyUpdateContact = lodash.chunk(
  //     updateContactEventsChunk,
  //     MAX_BATCH_SIZE_CRM_CONTACT,
  //   );

  //   const arrayChunksIdentifyCreateAssociations = lodash.chunk(
  //     associationObjectsEventChunk,
  //     MAX_BATCH_SIZE_CRM_OBJECT,
  //   );

  // batching up 'create' all objects endpoint chunks
  if (arrayChunksIdentifyCreateObjects.length > 0) {
    batchedResponseList = batchIdentify2(
      arrayChunksIdentifyCreateObjects,
      batchedResponseList,
      'createObject',
    );
  }

  // batching up 'update' all objects endpoint chunks
  if (arrayChunksIdentifyUpdateObjects.length > 0) {
    batchedResponseList = batchIdentify2(
      arrayChunksIdentifyUpdateObjects,
      batchedResponseList,
      'updateObject',
    );
  }

  //   // batching up 'create' contact endpoint chunks
  //   if (arrayChunksIdentifyCreateContact.length > 0) {
  //     batchedResponseList = batchIdentify2(
  //       arrayChunksIdentifyCreateContact,
  //       batchedResponseList,
  //       'createContacts',
  //     );
  //   }

  //   // batching up 'update' contact endpoint chunks
  //   if (arrayChunksIdentifyUpdateContact.length > 0) {
  //     batchedResponseList = batchIdentify2(
  //       arrayChunksIdentifyUpdateContact,
  //       batchedResponseList,
  //       'updateContacts',
  //     );
  //   }

  return batchedResponseList.concat(trackResponseList);
};

module.exports = { batchEvents2 };

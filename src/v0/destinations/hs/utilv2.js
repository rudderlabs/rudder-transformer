const lodash = require('lodash');
const { NetworkError, InstrumentationError } = require('@rudderstack/integrations-lib');
const tags = require('../../util/tags');
const {
  defaultBatchRequestConfig,
  getSuccessRespEvents,
  getDestinationExternalIDInfoForRetl,
} = require('../../util');

const {
  MAX_BATCH_SIZE,
  MAX_CONTACTS_PER_REQUEST,
  SEARCH_LIMIT_VALUE,
  IDENTIFY_CRM_SEARCH_ALL_OBJECTS,
  primaryToSecondaryFields,
} = require('./config');
const { httpPOST } = require('../../../adapters/network');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { JSON_MIME_TYPE } = require('../../util/constant');

const batchIdentify2 = (
  arrayChunksIdentify,
  batchedResponseList,
  endPoint,
  destinationObject,
  metadaDataArray,
) => {
  // list of chunks [ [..], [..] ]
  arrayChunksIdentify.forEach((chunk, index) => {
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

    batchEventResponse.batchedRequest.endpoint = endPoint;
    batchEventResponse.batchedRequest.headers = {
      'Content-Type': JSON_MIME_TYPE,
      Authorization: `Bearer ${destinationObject.Config.accessToken}`,
    };

    batchEventResponse = {
      ...batchEventResponse,
      metadata: metadaDataArray[index],
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

  const createAllObjectsEventChunk = [];
  const updateAllObjectsEventChunk = [];
  const metadataCreateArray = [];
  const metadataUpdateArray = [];

  destEvents.forEach((event) => {
    const { message, metadata, destination } = event;
    staticDestObject = destination;

    if (message.operation === 'create') {
      createAllObjectsEventChunk.push({
        tempPayload: message.tempPayload,
        endPoint: message.endPoint,
        objectType: message.objectType,
      });
      metadataCreateArray.push({ metadata, objectType: message.objectType });
    } else if (message.operation === 'update') {
      updateAllObjectsEventChunk.push({
        tempPayload: message.tempPayload,
        endPoint: message.endPoint,
        objectType: message.objectType,
      });
      metadataUpdateArray.push({ metadata, objectType: message.objectType });
    }
  });

  const groupedCreateEvents = lodash.groupBy(createAllObjectsEventChunk, 'objectType');
  const groupedUpdateEvents = lodash.groupBy(updateAllObjectsEventChunk, 'objectType');
  const groupedMetadataCreate = lodash.groupBy(metadataCreateArray, 'objectType');
  const groupedMetadataUpdate = lodash.groupBy(metadataUpdateArray, 'objectType');

  // Iterate over grouped create events
  Object.entries(groupedCreateEvents).forEach(([objectType, events]) => {
    const endPointCreate = events[0].endPoint;
    const arrayChunksIdentifyCreateObjects = lodash.chunk(
      events.map((event) => event.tempPayload),
      MAX_BATCH_SIZE,
    );
    const arrayChunksMetadataCreateObjects = lodash.chunk(
      groupedMetadataCreate[objectType].map((item) => item.metadata),
      MAX_BATCH_SIZE,
    );

    if (arrayChunksIdentifyCreateObjects.length > 0) {
      batchedResponseList = batchIdentify2(
        arrayChunksIdentifyCreateObjects,
        batchedResponseList,
        endPointCreate,
        staticDestObject,
        arrayChunksMetadataCreateObjects,
      );
    }
  });

  // Iterate over grouped update events
  Object.entries(groupedUpdateEvents).forEach(([objectType, events]) => {
    const endPointUpdate = events[0].endPoint;
    const arrayChunksIdentifyUpdateObjects = lodash.chunk(
      events.map((event) => event.tempPayload),
      MAX_BATCH_SIZE,
    );
    const arrayChunksMetadataUpdateObjects = lodash.chunk(
      groupedMetadataUpdate[objectType].map((item) => item.metadata),
      MAX_BATCH_SIZE,
    );

    if (arrayChunksIdentifyUpdateObjects.length > 0) {
      batchedResponseList = batchIdentify2(
        arrayChunksIdentifyUpdateObjects,
        batchedResponseList,
        endPointUpdate,
        staticDestObject,
        arrayChunksMetadataUpdateObjects,
      );
    }
  });

  return batchedResponseList.concat(trackResponseList);
};

const getObjectAndIdentifierType = (firstMessage) => {
  // eslint-disable-next-line prefer-const
  let { objectType, identifierType } = getDestinationExternalIDInfoForRetl(firstMessage, 'HS');
  if (objectType === 'identify') {
    identifierType = 'email';
  }
  if (!objectType || !identifierType) {
    throw new InstrumentationError('rETL - external Id not found.');
  }
  return { objectType, identifierType };
};

const extractIDsForSearchAPI = (inputs) => {
  const values = inputs.map((input) => {
    const { message } = input;
    const { destinationExternalId, identifierType } = getDestinationExternalIDInfoForRetl(
      message,
      'HS',
    );
    if (!destinationExternalId && identifierType === 'identify') {
      return message.fields?.email;
    }
    return destinationExternalId.toString().toLowerCase();
  });

  return Array.from(new Set(values));
};

const getRequestData = (identifierType, chunk) => {
  const requestData = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: identifierType,
            values: chunk,
            operator: 'IN',
          },
        ],
      },
    ],
    properties: [identifierType],
    limit: SEARCH_LIMIT_VALUE,
    after: 0,
  };
  /* In case of email as identifier we add a filter for hs_additional_emails field
   * and append hs_additional_emails to properties list
   * We are doing this because there might be emails exisitng as hs_additional_emails for some conatct but
   * will not come up in search API until we search with hs_additional_emails as well.
   * Not doing this resulted in erro 409 Duplicate records found
   */
  const secondaryProp = primaryToSecondaryFields[identifierType];
  if (secondaryProp) {
    requestData.filterGroups.push({
      filters: [
        {
          propertyName: secondaryProp,
          values: chunk,
          operator: 'IN',
        },
      ],
    });
    requestData.properties.push(secondaryProp);
  }
  return requestData;
};

const performHubSpotSearch = async (
  reqdata,
  reqOptions,
  objectType,
  identifierType,
  destination,
) => {
  let checkAfter = 1;
  const searchResults = [];
  const requestData = reqdata;
  const { Config } = destination;
  if (objectType === 'identify') {
    // eslint-disable-next-line no-param-reassign
    objectType = 'contacts';
  }

  const endpoint = IDENTIFY_CRM_SEARCH_ALL_OBJECTS.replace(':objectType', objectType);
  const endpointPath = `objects/:objectType/search`;

  const url =
    Config.authorizationType === 'newPrivateAppApi'
      ? endpoint
      : `${endpoint}?hapikey=${Config.apiKey}`;

  const requestOptions = Config.authorizationType === 'newPrivateAppApi' ? reqOptions : {};

  /* *
   * This is needed for processing paginated response when searching hubspot.
   * we can't avoid await in loop as response to the request contains the pagination details
   * */

  while (checkAfter) {
    // eslint-disable-next-line no-await-in-loop
    const searchResponse = await httpPOST(url, requestData, requestOptions, {
      destType: 'hs',
      feature: 'transformation',
      endpointPath,
      requestMethod: 'POST',
      module: 'router',
    });

    const processedResponse = processAxiosResponse(searchResponse);

    if (processedResponse.status !== 200) {
      throw new NetworkError(
        `rETL - Error during searching object record. ${JSON.stringify(
          processedResponse.response?.message,
        )}`,
        processedResponse.status,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(processedResponse.status),
        },
        processedResponse,
      );
    }

    const after = processedResponse.response?.paging?.next?.after || 0;
    requestData.after = after; // assigning to the new value of after
    checkAfter = after; // assigning to the new value if no after we assign it to 0 and no more calls will take place

    const results = processedResponse.response?.results;
    const extraProp = primaryToSecondaryFields[identifierType];
    if (results) {
      searchResults.push(
        ...results.map((result) => {
          const contact = {
            id: result.id,
            property: result.properties[identifierType],
          };
          // Following maps the extra property to the contact object which
          // help us to know if the contact was found using secondary property
          if (extraProp) {
            contact[extraProp] = result.properties?.[extraProp];
          }
          return contact;
        }),
      );
    }
  }
  /*
  searchResults = {
    id: 'existing_contact_id',
    property: 'existing_contact_email', // when email is identifier 
    hs_additional_emails: ['secondary_email'] // when email is identifier 
  } */
  return searchResults;
};

/**
 * DOC: https://developers.hubspot.com/docs/api/crm/search
 * @param {*} inputs
 * @param {*} destination
 */
const getExistingContactsData = async (inputs, destination) => {
  const { Config } = destination;
  const hsIdsToBeUpdated = [];
  const firstMessage = inputs[0].message;

  if (!firstMessage) {
    throw new InstrumentationError('rETL - objectType or identifier type not found.');
  }

  const { objectType, identifierType } = getObjectAndIdentifierType(firstMessage);

  const values = extractIDsForSearchAPI(inputs);
  const valuesChunk = lodash.chunk(values, MAX_CONTACTS_PER_REQUEST);
  const requestOptions = {
    headers: {
      'Content-Type': JSON_MIME_TYPE,
      Authorization: `Bearer ${Config.accessToken}`,
    },
  };
  // eslint-disable-next-line no-restricted-syntax
  for (const chunk of valuesChunk) {
    const requestData = getRequestData(identifierType, chunk);
    // eslint-disable-next-line no-await-in-loop
    const searchResults = await performHubSpotSearch(
      requestData,
      requestOptions,
      objectType,
      identifierType,
      destination,
    );
    if (searchResults.length > 0) {
      hsIdsToBeUpdated.push(...searchResults);
    }
  }
  return hsIdsToBeUpdated;
};

const setHsSearchId = (input, id, useSecondaryProp = false) => {
  const { message } = input;
  // const resultExternalId = [];
  let extIdObjParam = {};
  const externalIdArray = message.context?.externalId;
  if (externalIdArray) {
    externalIdArray.forEach((extIdObj) => {
      const { type } = extIdObj;
      extIdObjParam = { ...extIdObj };
      if (type.includes('HS')) {
        extIdObjParam.hsSearchId = id;
      }
      if (useSecondaryProp) {
        // we are using it so that when final payload is made
        // then primary key shouldn't be overidden
        extIdObjParam.useSecondaryObject = useSecondaryProp;
      }
      // resultExternalId.push(extIdObjParam);
    });
  }
  return extIdObjParam;
};

/**
 *
 * To reduce the number of calls for searching of already existing objects
 * We do search for all the objects before router transform and assign the type (create/update)
 * accordingly to context.hubspotOperation
 *
 * For email as primary key we use `hs_additional_emails` as well property to search existing contacts
 * */

const splitEventsForCreateUpdateV2 = async (inputs, destination) => {
  // get all the id and properties of already existing objects needed for update.
  const hsIdsToBeUpdated = await getExistingContactsData(inputs, destination);

  const resultInput = inputs.map((input) => {
    const { message } = input;
    const inputParam = input;
    // eslint-disable-next-line prefer-const
    let { destinationExternalId, identifierType } = getDestinationExternalIDInfoForRetl(
      message,
      'HS',
    );
    if (!destinationExternalId) {
      destinationExternalId = message.fields.email;
    }
    const filteredInfo = hsIdsToBeUpdated.filter(
      (update) =>
        update.property.toString().toLowerCase() ===
        destinationExternalId?.toString().toLowerCase(), // second condition is for secondary property for identifier type
    );

    if (filteredInfo.length > 0) {
      const searchId = setHsSearchId(input, filteredInfo[0].id);
      message.context.lookupId = [
        {
          id: searchId,
          type: 'hubspotId',
        },
      ];
      inputParam.message.action = 'update';
      return inputParam;
    }
    const secondaryProp = primaryToSecondaryFields[identifierType];
    if (secondaryProp) {
      /* second condition is for secondary property for identifier type
       For example:
       update[secondaryProp] = "abc@e.com;cd@e.com;k@w.com"
       destinationExternalId = "cd@e.com"
       So we are splitting all the emails in update[secondaryProp] into an array using ';'
       and then checking if array includes  destinationExternalId
       */
      const filteredInfoForSecondaryProp = hsIdsToBeUpdated.filter((update) =>
        update[secondaryProp]
          ?.toString()
          .toLowerCase()
          .split(';')
          .includes(destinationExternalId.toString().toLowerCase()),
      );
      if (filteredInfoForSecondaryProp.length > 0) {
        inputParam.message.context.externalId = setHsSearchId(
          input,
          filteredInfoForSecondaryProp[0].id,
          true,
        );
        inputParam.message.context.hubspotOperation = 'updateObject';
        return inputParam;
      }
    }
    // if not found in the existing contacts, then it's a new contact
    inputParam.message.action = 'insert';
    return inputParam;
  });

  return resultInput;
};

module.exports = { batchEvents2, splitEventsForCreateUpdateV2 };

const get = require("get-value");
const _ = require("lodash");
const {
  MappedToDestinationKey,
  GENERIC_TRUE_VALUES
} = require("../../../constants");
const {
  defaultGetRequestConfig,
  defaultPostRequestConfig,
  defaultRequestConfig,
  defaultPatchRequestConfig,
  getFieldValueFromMessage,
  getSuccessRespEvents,
  CustomError,
  addExternalIdToTraits,
  defaultBatchRequestConfig,
  removeUndefinedAndNullValues,
  getDestinationExternalID,
  getDestinationExternalIDInfoForRetl
} = require("../../util");
const {
  BATCH_CONTACT_ENDPOINT,
  MAX_BATCH_SIZE,
  TRACK_ENDPOINT,
  IDENTIFY_CREATE_UPDATE_CONTACT,
  IDENTIFY_CREATE_NEW_CONTACT,
  CRM_CREATE_UPDATE_ALL_OBJECTS,
  MAX_BATCH_SIZE_CRM_OBJECT
} = require("./config");
const {
  getTransformedJSON,
  getEmailAndUpdatedProps,
  formatPropertyValueForIdentify,
  getHsSearchId
} = require("./util");

/**
 * using legacy API
 * Reference:
 * https://legacydocs.hubspot.com/docs/methods/contacts/create_contact
 * https://legacydocs.hubspot.com/docs/methods/contacts/create_or_update
 *
 * for rETL support for custom objects
 * Ref - https://developers.hubspot.com/docs/api/crm/crm-custom-objects
 * @param {*} message
 * @param {*} destination
 * @param {*} propertyMap
 * @returns
 */
const processLegacyIdentify = async (message, destination, propertyMap) => {
  const { Config } = destination;
  const traits = getFieldValueFromMessage(message, "traits");
  const mappedToDestination = get(message, MappedToDestinationKey);
  const hubspotOp = get(message, "context.hubspotOperation");
  // if mappedToDestination is set true, then add externalId to traits
  // rETL source
  let endpoint;
  const response = defaultRequestConfig();
  if (
    GENERIC_TRUE_VALUES.includes(mappedToDestination?.toString()) &&
    hubspotOp
  ) {
    addExternalIdToTraits(message);
    const { objectType } = getDestinationExternalIDInfoForRetl(message, "HS");
    if (hubspotOp === "create") {
      endpoint = CRM_CREATE_UPDATE_ALL_OBJECTS.replace(
        ":objectType",
        objectType
      );
    } else if (hubspotOp === "update" && getHsSearchId(message)) {
      const { hsSearchId } = getHsSearchId(message);
      endpoint = `${CRM_CREATE_UPDATE_ALL_OBJECTS.replace(
        ":objectType",
        objectType
      )}/${hsSearchId}`;
      response.method = defaultPatchRequestConfig.requestMethod;
    }
    response.body.JSON = removeUndefinedAndNullValues({ properties: traits });
    response.source = "rETL";
    response.hubspotOp = hubspotOp;
  } else {
    if (!traits || !traits.email) {
      throw new CustomError(
        "[HS]:: Identify without email is not supported.",
        400
      );
    }
    const { email } = traits;

    const userProperties = await getTransformedJSON(
      message,
      destination,
      propertyMap
    );

    const payload = {
      properties: formatPropertyValueForIdentify(userProperties)
    };

    if (email) {
      endpoint = IDENTIFY_CREATE_UPDATE_CONTACT.replace(
        ":contact_email",
        email
      );
    } else {
      endpoint = IDENTIFY_CREATE_NEW_CONTACT;
    }
    response.body.JSON = removeUndefinedAndNullValues(payload);
  }

  response.endpoint = endpoint;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json"
  };

  // choosing API Type
  if (Config.authorizationType === "newPrivateAppApi") {
    // Private Apps
    response.headers = {
      ...response.headers,
      Authorization: `Bearer ${Config.accessToken}`
    };
  } else {
    // use legacy API Key
    response.params = { hapikey: Config.apiKey };
  }

  return response;
};

/**
 * using legacy API
 * Ref - https://legacydocs.hubspot.com/docs/methods/enterprise_events/http_api
 * @param {*} message
 * @param {*} destination
 * @param {*} propertyMap
 * @returns
 */
const processLegacyTrack = async (message, destination, propertyMap) => {
  const { Config } = destination;
  const parameters = {
    _a: Config.hubID,
    _n: message.event,
    _m:
      get(message, "properties.revenue") ||
      get(message, "properties.value") ||
      get(message, "properties.total"),
    id: getDestinationExternalID(message, "hubspotId")
  };

  const userProperties = await getTransformedJSON(
    message,
    destination,
    propertyMap
  );

  const payload = { ...parameters, ...userProperties };
  const params = removeUndefinedAndNullValues(payload);

  const response = defaultRequestConfig();
  response.endpoint = TRACK_ENDPOINT;
  response.method = defaultGetRequestConfig.requestMethod;
  response.headers = {
    "Content-Type": "application/json"
  };
  response.messageType = "track";

  // choosing API Type
  if (Config.authorizationType === "newPrivateAppApi") {
    // eslint-disable-next-line no-underscore-dangle
    delete params._a;
    response.headers = {
      ...response.headers,
      Authorization: `Bearer ${Config.accessToken}`
    };
  }
  response.params = params;

  return response;
};
const batchIdentifyForrETL = (
  arrayChunksIdentify,
  batchedResponseList,
  batchOperation
) => {
  // list of chunks [ [..], [..] ]
  arrayChunksIdentify.forEach(chunk => {
    const identifyResponseList = [];
    const metadata = [];

    // extracting message, destination value
    // from the first event in a batch
    const { message, destination } = chunk[0];

    let batchEventResponse = defaultBatchRequestConfig();

    if (batchOperation === "create") {
      // create operation
      chunk.forEach(ev => {
        // if source is of rETL
        identifyResponseList.push({ ...ev.message.body.JSON });
        batchEventResponse.batchedRequest.endpoint = `${ev.message.endpoint}/batch/create`;

        metadata.push(ev.metadata);
      });
    } else if (batchOperation === "update") {
      // update operation
      chunk.forEach(ev => {
        const updateEndpoint = ev.message.endpoint;
        identifyResponseList.push({
          ...ev.message.body.JSON,
          id: updateEndpoint.split("/").pop()
        });
        batchEventResponse.batchedRequest.endpoint = `${updateEndpoint.substr(
          0,
          updateEndpoint.lastIndexOf("/")
        )}/batch/update`;

        metadata.push(ev.metadata);
      });
    }

    batchEventResponse.batchedRequest.body.JSON = {
      inputs: identifyResponseList
    };

    batchEventResponse.batchedRequest.headers = message.headers;
    batchEventResponse.batchedRequest.params = message.params;

    batchEventResponse = {
      ...batchEventResponse,
      metadata,
      destination
    };
    batchedResponseList.push(
      getSuccessRespEvents(
        batchEventResponse.batchedRequest,
        batchEventResponse.metadata,
        batchEventResponse.destination,
        true
      )
    );
  });
  return batchedResponseList;
};

const legacyBatchEvents = destEvents => {
  let batchedResponseList = [];
  const trackResponseList = [];
  const eventsChunk = [];
  const createAllObjectsEventChunk = [];
  const updateAllObjectsEventChunk = [];
  let maxBatchSize;
  destEvents.forEach(event => {
    // handler for track call
    if (event.message.messageType === "track") {
      const { message, metadata, destination } = event;
      const endpoint = get(message, "endpoint");

      const batchedResponse = defaultBatchRequestConfig();
      batchedResponse.batchedRequest.headers = message.headers;
      batchedResponse.batchedRequest.endpoint = endpoint;
      batchedResponse.batchedRequest.body = message.body;
      batchedResponse.batchedRequest.params = message.params;
      batchedResponse.batchedRequest.method =
        defaultGetRequestConfig.requestMethod;
      batchedResponse.metadata = [metadata];
      batchedResponse.destination = destination;

      trackResponseList.push(
        getSuccessRespEvents(
          batchedResponse.batchedRequest,
          batchedResponse.metadata,
          batchedResponse.destination
        )
      );
    } else if (event.message.source && event.message.source === "rETL") {
      const { endpoint } = event.message;
      maxBatchSize = endpoint.includes("contact")
        ? MAX_BATCH_SIZE_CRM_OBJECT
        : MAX_BATCH_SIZE_CRM_OBJECT;
      const { hubspotOp } = event.message;
      if (hubspotOp) {
        if (hubspotOp === "create") {
          createAllObjectsEventChunk.push(event);
        } else if (hubspotOp === "update") {
          updateAllObjectsEventChunk.push(event);
        }
      }
    } else {
      // making chunks for identify
      eventsChunk.push(event);
    }
  });
  const arrayChunksIdentifyCreateObjects = _.chunk(
    createAllObjectsEventChunk,
    maxBatchSize
  );

  const arrayChunksIdentifyUpdateObjects = _.chunk(
    updateAllObjectsEventChunk,
    maxBatchSize
  );
  // batching up 'create' all objects endpoint chunks
  if (arrayChunksIdentifyCreateObjects.length) {
    batchedResponseList = batchIdentifyForrETL(
      arrayChunksIdentifyCreateObjects,
      batchedResponseList,
      "create"
    );
  }

  // batching up 'update' all objects endpoint chunks
  if (arrayChunksIdentifyUpdateObjects.length) {
    batchedResponseList = batchIdentifyForrETL(
      arrayChunksIdentifyUpdateObjects,
      batchedResponseList,
      "update"
    );
  }

  // eventChunks = [[e1,e2,e3,..batchSize],[e1,e2,e3,..batchSize]..]
  const arrayChunksIdentify = _.chunk(eventsChunk, MAX_BATCH_SIZE);

  // list of chunks [ [..], [..] ]
  arrayChunksIdentify.forEach(chunk => {
    const identifyResponseList = [];
    const metadata = [];

    // extracting destination, apiKey value
    // from the first event in a batch
    const { destination } = chunk[0];
    const { Config } = destination;

    let batchEventResponse = defaultBatchRequestConfig();

    chunk.forEach(ev => {
      // if source is of rETL
      if (ev.message.source === "rETL") {
        identifyResponseList.push({ ...ev.message.body.JSON });
        batchEventResponse.batchedRequest.body.JSON = {
          inputs: identifyResponseList
        };
        batchEventResponse.batchedRequest.endpoint = `${ev.message.endpoint}/batch/create`;
        metadata.push(ev.metadata);
      } else {
        const { email, updatedProperties } = getEmailAndUpdatedProps(
          ev.message.body.JSON.properties
        );
        // eslint-disable-next-line no-param-reassign
        ev.message.body.JSON.properties = updatedProperties;
        identifyResponseList.push({
          email,
          properties: ev.message.body.JSON.properties
        });
        metadata.push(ev.metadata);
        batchEventResponse.batchedRequest.body.JSON_ARRAY = {
          batch: JSON.stringify(identifyResponseList)
        };
        batchEventResponse.batchedRequest.endpoint = BATCH_CONTACT_ENDPOINT;
      }
    });

    batchEventResponse.batchedRequest.headers = {
      "Content-Type": "application/json"
    };

    // choosing API Type
    if (Config.authorizationType === "newPrivateAppApi") {
      // Private Apps
      batchEventResponse.batchedRequest.headers = {
        ...batchEventResponse.batchedRequest.headers,
        Authorization: `Bearer ${Config.accessToken}`
      };
    } else {
      // API Key
      batchEventResponse.batchedRequest.params = { hapikey: Config.apiKey };
    }

    batchEventResponse = {
      ...batchEventResponse,
      metadata,
      destination
    };
    batchedResponseList.push(
      getSuccessRespEvents(
        batchEventResponse.batchedRequest,
        batchEventResponse.metadata,
        batchEventResponse.destination,
        true
      )
    );
  });

  return batchedResponseList.concat(trackResponseList);
};

module.exports = {
  processLegacyIdentify,
  processLegacyTrack,
  legacyBatchEvents
};

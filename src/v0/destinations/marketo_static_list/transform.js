const lodash = require('lodash');
const cloneDeep = require('lodash/cloneDeep');
const {
  defaultPostRequestConfig,
  defaultDeleteRequestConfig,
  generateErrorObject,
} = require('../../util');
const { AUTH_CACHE_TTL, JSON_MIME_TYPE } = require('../../util/constant');
const { getIds, validateMessageType, transformForRecordEvent } = require('./util');
const {
  getDestinationExternalID,
  defaultRequestConfig,
  getErrorRespEvents,
  simpleProcessRouterDest,
} = require('../../util');
const { formatConfig, MAX_LEAD_IDS_SIZE } = require('./config');
const Cache = require('../../util/cache');
const { getAuthToken } = require('../marketo/transform');
const { InstrumentationError, UnauthorizedError } = require('../../util/errorTypes');

const authCache = new Cache(AUTH_CACHE_TTL); // 1 hr

const responseBuilder = (endPoint, leadIds, operation, token) => {
  let updatedEndpoint = endPoint;
  if (leadIds.length > 0) {
    leadIds.forEach((id) => {
      updatedEndpoint = `${updatedEndpoint}id=${id}&`;
    });
  }
  updatedEndpoint = updatedEndpoint.slice(0, -1);
  const response = defaultRequestConfig();
  response.endpoint = updatedEndpoint;
  if (operation === 'add') {
    response.method = defaultPostRequestConfig.requestMethod;
  } else {
    response.method = defaultDeleteRequestConfig.requestMethod;
  }
  response.headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': JSON_MIME_TYPE,
  };
  return response;
};

const batchResponseBuilder = (message, Config, token, leadIds, operation) => {
  const { accountId, staticListId } = Config;
  const listId = getDestinationExternalID(message, 'marketoStaticListId') || staticListId;
  const endpoint = `https://${accountId}.mktorest.com/rest/v1/lists/${listId}/leads.json?`;
  if (!listId) {
    throw new InstrumentationError('No static listId is provided');
  }
  const response = [];
  const leadIdsChunks = lodash.chunk(leadIds, MAX_LEAD_IDS_SIZE);
  leadIdsChunks.forEach((ids) => {
    response.push(responseBuilder(endpoint, ids, operation, token));
  });
  return response;
};

const processEvent = (input) => {
  const { token, message, destination } = input;
  const { Config } = destination;
  validateMessageType(message, ['audiencelist', 'record']);
  const response = [];
  let toAdd;
  let toRemove;
  if (message.properties?.listData?.add) {
    toAdd = getIds(message.properties.listData.add);
  }
  if (message.properties?.listData?.remove) {
    toRemove = getIds(message.properties.listData.remove);
  }
  if (
    (!Array.isArray(toAdd) || toAdd.length === 0) &&
    (!Array.isArray(toRemove) || toRemove.length === 0)
  ) {
    throw new InstrumentationError(
      'Invalid leadIds format or no leadIds found neither to add nor to remove',
    );
  } else {
    if (Array.isArray(toRemove) && toRemove.length > 0) {
      const payload = batchResponseBuilder(message, Config, token, toRemove, 'remove');
      if (payload) {
        response.push(...payload);
      }
    }
    if (Array.isArray(toAdd) && toAdd.length > 0) {
      const payload = batchResponseBuilder(message, Config, token, toAdd, 'add');
      if (payload) {
        response.push(...payload);
      }
    }
  }
  return response;
};

const process = async (event) => {
  const token = await getAuthToken(formatConfig(event.destination));

  if (!token) {
    throw new UnauthorizedError('Authorization failed');
  }
  const response = processEvent({ ...event, token });
  return response;
};

const processRouterDest = async (inputs, reqMetadata) => {
  // Token needs to be generated for marketo which will be done on input level.
  // If destination information is not present Error should be thrown
  let token;
  try {
    token = await getAuthToken(formatConfig(inputs[0].destination));
    if (!token) {
      throw new UnauthorizedError('Could not retrieve authorisation token');
    }
  } catch (error) {
    // Not using handleRtTfSingleEventError here as this is for multiple events
    const errObj = generateErrorObject(error);
    const respEvents = getErrorRespEvents(
      inputs.map((input) => input.metadata),
      errObj.status,
      errObj.message,
      errObj.statTags,
    );
    return [{ ...respEvents, destination: inputs?.[0]?.destination }];
  }

  // Checking previous status Code. Initially setting to false.
  // If true then previous status is 500 and every subsequent event output should be
  // sent with status code 500 to the router to be retried.
  const tokenisedInputs = inputs.map((input) => ({ ...input, token }));
  const leadIdObj = {
    insert: [],
    delete: [],
  };
  // use lodash.groupby to group the inputs based on message type
  let transformedRecordEvent = [];
  let transformedAudienceEvent = [];
  const groupedInputs = lodash.groupBy(tokenisedInputs, (input) => input.message.type);

  if (groupedInputs.record && groupedInputs.record.length > 0) {
    const finalInputForRecordEvent = transformForRecordEvent(groupedInputs.record, leadIdObj);
    transformedRecordEvent = await simpleProcessRouterDest(
      finalInputForRecordEvent,
      processEvent,
      reqMetadata,
    );
  }
  if (groupedInputs.audiencelist && groupedInputs.audiencelist.length > 0) {
    transformedAudienceEvent = await simpleProcessRouterDest(
      groupedInputs.audiencelist,
      processEvent,
      reqMetadata,
    );
  }
  const respList = [...transformedRecordEvent, ...transformedAudienceEvent];
  return respList;
};

/**
 * This function takes the transformed output containing metadata and returns the updated metadata
 * @param {*} output
 * @returns {*} metadata
 */
function processMetadataForRouter(output) {
  const { metadata, destination } = output;
  // check if metadata[0] is an array or not
  let clonedMetadata;
  if (Array.isArray(metadata[0])) {
    [clonedMetadata] = cloneDeep(metadata);
  } else {
    clonedMetadata = cloneDeep(metadata);
  }
  clonedMetadata.forEach((metadataElement) => {
    // eslint-disable-next-line no-param-reassign
    metadataElement.destInfo = { authKey: destination.ID };
  });
  return clonedMetadata;
}

module.exports = {
  process,
  processRouterDest,
  processMetadataForRouter,
  authCache,
};

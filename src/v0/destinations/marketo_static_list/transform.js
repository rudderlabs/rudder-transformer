const _ = require("lodash");
const cloneDeep = require("lodash/cloneDeep");
const {
  defaultPostRequestConfig,
  defaultDeleteRequestConfig,
  generateErrorObject
} = require("../../util");
const { AUTH_CACHE_TTL } = require("../../util/constant");
const { getIds, validateMessageType } = require("./util");
const {
  getDestinationExternalID,
  defaultRequestConfig,
  getErrorRespEvents,
  simpleProcessRouterDest
} = require("../../util");
const { DESTINATION, formatConfig, MAX_LEAD_IDS_SIZE } = require("./config");
const Cache = require("../../util/cache");
const { getAuthToken } = require("../marketo/transform");
const {
  InstrumentationError,
  UnauthorizedError
} = require("../../util/errorTypes");

const authCache = new Cache(AUTH_CACHE_TTL); // 1 hr

const responseBuilder = (endPoint, leadIds, operation, token) => {
  let updatedEndpoint = endPoint;
  if (leadIds.length > 0) {
    leadIds.forEach(id => {
      updatedEndpoint = `${updatedEndpoint}id=${id}&`;
    });
  }
  updatedEndpoint = updatedEndpoint.slice(0, -1);
  const response = defaultRequestConfig();
  response.endpoint = updatedEndpoint;
  if (operation === "add") {
    response.method = defaultPostRequestConfig.requestMethod;
  } else {
    response.method = defaultDeleteRequestConfig.requestMethod;
  }
  response.headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
  return response;
};

const batchResponseBuilder = (message, Config, token, leadIds, operation) => {
  const { accountId } = Config;
  const listId =
    getDestinationExternalID(message, "marketoStaticListId") ||
    Config.staticListId;
  const endpoint = `https://${accountId}.mktorest.com/rest/v1/lists/${listId}/leads.json?`;
  if (!listId) {
    throw new InstrumentationError("No static listId is provided");
  }
  const response = [];
  const leadIdsChunks = _.chunk(leadIds, MAX_LEAD_IDS_SIZE);
  leadIdsChunks.forEach(ids => {
    response.push(responseBuilder(endpoint, ids, operation, token));
  });
  return response;
};

const processEvent = input => {
  const { token, message, destination } = input;
  const { Config } = destination;
  validateMessageType(message, ["audiencelist"]);
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
    (Array.isArray(toAdd) && toAdd.length > 0) ||
    (Array.isArray(toRemove) && toRemove.length > 0)
  ) {
    if (Array.isArray(toAdd) && toAdd.length > 0) {
      const payload = batchResponseBuilder(
        message,
        Config,
        token,
        toAdd,
        "add"
      );
      if (payload) {
        response.push(...payload);
      }
    }
    if (Array.isArray(toRemove) && toRemove.length > 0) {
      const payload = batchResponseBuilder(
        message,
        Config,
        token,
        toRemove,
        "remove"
      );
      if (payload) {
        response.push(...payload);
      }
    }
  } else {
    throw new InstrumentationError(
      "Invalid leadIds format or no leadIds found neither to add nor to remove"
    );
  }
  return response;
};
const process = async event => {
  const token = await getAuthToken(formatConfig(event.destination));

  if (!token) {
    throw new UnauthorizedError("Authorization failed");
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
      const errResp = {
        status: 400,
        message: "Authorisation failed",
        responseTransformFailure: true,
        statTags: {}
      };
      const respEvents = getErrorRespEvents(
        inputs.map(input => input.metadata),
        errResp.status,
        errResp.message,
        errResp.statTags
      );
      return [{ ...respEvents, destination: inputs?.[0]?.destination }];
    }
  } catch (error) {
    // Not using handleRtTfSingleEventError here as this is for multiple events
    const errObj = generateErrorObject(error);
    const respEvents = getErrorRespEvents(
      inputs.map(input => input.metadata),
      errObj.status,
      errObj.message,
      errObj.statTags
    );
    return [{ ...respEvents, destination: inputs?.[0]?.destination }];
  }

  // Checking previous status Code. Initially setting to false.
  // If true then previous status is 500 and every subsequent event output should be
  // sent with status code 500 to the router to be retried.
  const tokenisedInputs = inputs.map(input => {
    return { ...input, token };
  });
  const respList = await simpleProcessRouterDest(
    tokenisedInputs,
    processEvent,
    reqMetadata
  );
  return respList;
};

/**
 * This function takes the transformed output containing metadata and returns the updated metadata
 * @param {*} output
 * @returns {*} metadata
 */
function processMetadataForRouter(output) {
  const { metadata, destination } = output;
  const clonedMetadata = cloneDeep(metadata);
  clonedMetadata.forEach(metadataElement => {
    // eslint-disable-next-line no-param-reassign
    metadataElement.destInfo = { authKey: destination.ID };
  });
  return clonedMetadata;
}

module.exports = {
  process,
  processRouterDest,
  processMetadataForRouter,
  authCache
};

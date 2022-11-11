const _ = require("lodash");
const cloneDeep = require("lodash/cloneDeep");
const {
  defaultPostRequestConfig,
  defaultDeleteRequestConfig
} = require("../../util");

const stats = require("../../../util/stats");
const { TRANSFORMER_METRIC, AUTH_CACHE_TTL } = require("../../util/constant");
const { marketoResponseHandler, sendGetRequest, getIds } = require("./util");
const ErrorBuilder = require("../../util/error");
const {
  getDestinationExternalID,
  defaultRequestConfig,
  getSuccessRespEvents,
  getErrorRespEvents,
  generateErrorObject,
  TransformationError
} = require("../../util");
const {
  FETCH_TOKEN_METRIC,
  DESTINATION,
  formatConfig,
  MAX_LEAD_IDS_SIZE
} = require("./config");
const Cache = require("../../util/cache");
const logger = require("../../../logger");

const authCache = new Cache(AUTH_CACHE_TTL); // 1 hr
const getAuthToken = async formattedDestination => {
  return authCache.get(formattedDestination.ID, async () => {
    const { accountId, clientId, clientSecret } = formattedDestination;
    const clientResponse = await sendGetRequest(
      `https://${accountId}.mktorest.com/identity/oauth/token`,
      {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "client_credentials"
        }
      }
    );
    const data = marketoResponseHandler(
      clientResponse,
      "During fetching auth token",
      TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM
    );
    if (data) {
      stats.increment(FETCH_TOKEN_METRIC, 1, { status: "success" });
      return { value: data.access_token, age: data.expires_in };
    }
    stats.increment(FETCH_TOKEN_METRIC, 1, { status: "failed" });
    return null;
  });
};

const responseBuilder = (endPoint, leadIds, operation, token) => {
  let endpoint = endPoint;
  if (leadIds.length > 0) {
    leadIds.forEach(id => {
      endpoint = `${endpoint}id=${id}&`;
    });
  }
  endpoint = endpoint.slice(0, -1);
  const response = defaultRequestConfig();
  response.endpoint = endpoint;
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
    throw new ErrorBuilder()
      .setStatus(400)
      .setMessage("No static listId is provided.")
      .setStatTags({
        destType: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta:
          TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META
            .INSTRUMENTATION
      })
      .build();
  }
  const response = [];
  const leadIdsChunks = _.chunk(leadIds, MAX_LEAD_IDS_SIZE);
  leadIdsChunks.forEach(ids => {
    response.push(responseBuilder(endpoint, ids, operation, token));
  });
  return response;
};

const processEvent = (message, destination, token) => {
  const { Config } = destination;
  if (!message.type) {
    throw new ErrorBuilder()
      .setMessage("Message Type is not present. Aborting message.")
      .setStatus(400)
      .setStatTags({
        destType: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_PARAM
      })
      .build();
  }
  if (message.type.toLowerCase() !== "audiencelist") {
    throw new ErrorBuilder()
      .setMessage(`${message.type} call is not supported.`)
      .setStatus(400)
      .setStatTags({
        destType: DESTINATION,
        stage: TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM,
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.SCOPE,
        meta: TRANSFORMER_METRIC.MEASUREMENT_TYPE.TRANSFORMATION.META.BAD_PARAM
      })
      .build();
  }
  const response = [];
  if (message.properties?.listData?.add) {
    const payload = batchResponseBuilder(
      message,
      Config,
      token,
      getIds(message.properties.listData.add),
      "add"
    );
    response.push(...payload);
  }
  if (message.properties?.listData?.remove) {
    const payload = batchResponseBuilder(
      message,
      Config,
      token,
      getIds(message.properties.listData.remove),
      "remove"
    );
    response.push(...payload);
  }
  return response;
};
const process = async event => {
  const token = await getAuthToken(formatConfig(event.destination));

  if (!token) {
    throw new TransformationError(
      "Authorisation failed",
      400,
      {
        scope: TRANSFORMER_METRIC.MEASUREMENT_TYPE.AUTHENTICATION.SCOPE
      },
      DESTINATION
    );
  }
  const response = processEvent(event.message, event.destination, token);
  return response;
};
const processRouterDest = async inputs => {
  // Token needs to be generated for marketo which will be done on input level.
  // If destination information is not present Error should be thrown
  let token;
  try {
    token = await getAuthToken(formatConfig(inputs[0].destination));
  } catch (error) {
    logger.error("Router Transformation problem:");
    const errObj = generateErrorObject(
      error,
      DESTINATION,
      TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM
    );
    logger.error(errObj);
    const respEvents = getErrorRespEvents(
      inputs.map(input => input.metadata),
      error.status || 500, // default to retryable
      error.message || "Error occurred while processing payload.",
      errObj.statTags
    );
    return [respEvents];
  }

  // Checking previous status Code. Initially setting to false.
  // If true then previous status is 500 and every subsequent event output should be
  // sent with status code 500 to the router to be retried.
  const respList = await Promise.all(
    inputs.map(async input => {
      try {
        return getSuccessRespEvents(
          processEvent(input.message, input.destination, token),
          [input.metadata],
          input.destination
        );
      } catch (error) {
        logger.error("Router transformation Error for Marketo:");
        const errObj = generateErrorObject(
          error,
          DESTINATION,
          TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM
        );
        logger.error(errObj);
        return getErrorRespEvents(
          [input.metadata],
          error.status || 500,
          error.message || "Error occurred while processing payload.",
          errObj.statTags
        );
      }
    })
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

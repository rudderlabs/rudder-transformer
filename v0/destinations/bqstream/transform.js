/* eslint-disable no-console */
const { EventType } = require("../../../constants");
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  CustomError,
  getSuccessRespEvents,
  getErrorRespEvents,
  isOAuthDestination
} = require("../../util");

/**
 * This function puts the accessToken information in the transformed response
 * to facilitate for a successfully authorised event
 *
 * @param {*} event - The event on which transformation is being performed
 * @param {*} response - Transformation Response
 * @returns Transformation Response bound with token information(may not be required as such)
 */
async function processAuth(event, response) {
  // OAuth for BQStream destination
  const { oauthAccessToken } = event.metadata;
  if (!oauthAccessToken) {
    throw new CustomError("Empty/Invalid access token", 500);
  }
  if (!response.headers) {
    response.headers = {};
  }
  response.headers.Authorization = `Bearer ${oauthAccessToken}`;
  return response;
}

const responseWrapper = response => {
  const resp = defaultRequestConfig();
  resp.endpoint = response.endPoint;
  resp.method = defaultPostRequestConfig.requestMethod;
  resp.headers = { ...response.headers, "Content-Type": "application/json" };
  resp.body.JSON = response.payload;
  return resp;
};

async function process(event) {
  const { message } = event;
  const { properties, type } = message;
  // EventType validation
  if (type !== EventType.TRACK) {
    throw new CustomError(`Message Type not supported: ${type}`, 400);
  }
  if (!properties || typeof properties !== 'object') {
    throw new CustomError('Invalid Payload for the destination', 400);
  }
  const {
    destination: {
      Config: { datasetId, tableId, projectId }
    },
    destination
  } = event;

  const payload = {
    rows: [
      {
        json: { ...properties }
      }
    ]
  };
  const responseParams = {
    payload,
    method: "POST",
    endPoint: `https://bigquery.googleapis.com/bigquery/v2/projects/${projectId}/datasets/${datasetId}/tables/${tableId}/insertAll`
  };
  if (isOAuthDestination(destination)) {
    // Put authorisation headers into processedResponse
    await processAuth(event, responseParams);
  }
  return responseWrapper(responseParams);
}

const processRouterDest = async events => {
  if (!Array.isArray(events) || events.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const responseList = Promise.all(
    events.map(async event => {
      try {
        return getSuccessRespEvents(
          await process(event),
          [event.metadata],
          event.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [event.metadata],
          // eslint-disable-next-line no-nested-ternary
          error.response
            ? error.response.status
            : error.code
            ? error.code
            : 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return responseList;
};

module.exports = { processRouterDest };

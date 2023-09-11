/* eslint-disable no-param-reassign */
const _ = require('lodash');
const getValue = require('get-value');
const {
  getDynamicErrorType,
  processAxiosResponse,
} = require('../../../adapters/utils/networkUtils');
const { DISABLE_DEST, REFRESH_TOKEN } = require('../../../adapters/networkhandler/authConstants');
const { isHttpStatusSuccess, isDefinedAndNotNull } = require('../../util');
const { proxyRequest } = require('../../../adapters/network');
const { UnhandledStatusCodeError, NetworkError, AbortedError } = require('../../util/errorTypes');
const tags = require('../../util/tags');

const DESTINATION_NAME = 'bqstream';

const trimBqStreamResponse = (response) => ({
  code: getValue(response, 'response.response.data.error.code'), // data.error.status which contains PERMISSION_DENIED
  status: getValue(response, 'response.response.status'),
  statusText: getValue(response, 'response.response.statusText'),
  headers: getValue(response, 'response.response.headers'),
  data: getValue(response, 'response.response.data'), // Incase of errors, this contains error data
  success: getValue(response, 'suceess'),
});
/**
 * Obtains the Destination OAuth Error Category based on the error code obtained from destination
 *
 * - If an error code is such that the user will not be allowed inside the destination,
 * such error codes fall under DISABLE_DESTINATION
 * - If an error code is such that upon refresh we can get a new token which can be used to send event,
 * such error codes fall under REFRESH_TOKEN category
 * - If an error code doesn't fall under both categories, we can return an empty string
 * @param {string} errorCategory - The error code obtained from the destination
 * @returns Destination OAuth Error Category
 */
const getDestAuthCategory = (errorCategory) => {
  switch (errorCategory) {
    case 'PERMISSION_DENIED':
      return DISABLE_DEST;
    case 'UNAUTHENTICATED':
      return REFRESH_TOKEN;
    default:
      return '';
  }
};

const destToRudderStatusMap = {
  403: {
    rateLimitExceeded: 429,
    default: 400,
  },
  400: {
    tableUnavailable: 500,
    default: 400,
  },
  500: { default: 500 },
  503: { default: 500 },
  401: { default: 500 },
  404: { default: 400 },
  501: { default: 400 },
};

const getStatusAndCategory = (dresponse, status) => {
  const authErrorCategory = getDestAuthCategory(dresponse.error.status);
  const reason =
    dresponse.error.errors &&
    Array.isArray(dresponse.error.errors) &&
    dresponse.error.errors.length > 0 &&
    dresponse.error.errors[0].reason;

  const trStatus = destToRudderStatusMap[status]
    ? destToRudderStatusMap[status][reason] || destToRudderStatusMap[status].default
    : 500;
  return { status: trStatus, authErrorCategory };
};

/**
 * This class actually handles the response for BigQuery Stream API
 * It can also be used for any Google related API but an API related handling has to be done separately
 *
 * Here we are only trying to handle OAuth related error(s)
 * Any destination specific error handling has to be done in their own way
 *
 * Reference doc for OAuth Errors
 * 1. https://cloud.google.com/apigee/docs/api-platform/reference/policies/oauth-http-status-code-reference
 * 2. https://cloud.google.com/bigquery/docs/error-messages
 *
 * Summary:
 * Abortable -> 403, 501, 400
 * Retryable -> 5[0-9][02-9], 401(UNAUTHENTICATED)
 * "Special Cases":
 * status=200, resp.insertErrors.length > 0  === Failure
 * 403 => AccessDenied -> DISABLE_DEST, other 403 => Just abort
 *
 */
const processResponse = ({ dresponse, status } = {}) => {
  const isSuccess =
    !dresponse.error &&
    isHttpStatusSuccess(status) &&
    (!dresponse.insertErrors || (dresponse.insertErrors && dresponse.insertErrors.length === 0));

  if (!isSuccess) {
    if (dresponse.error) {
      const { status: trStatus } = getStatusAndCategory(dresponse, status);
      throw new NetworkError(
        dresponse.error.message || `Request failed for ${DESTINATION_NAME} with status: ${status}`,
        trStatus,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(trStatus),
        },
        dresponse,
      );
    } else if (dresponse.insertErrors && dresponse.insertErrors.length > 0) {
      const temp = trimBqStreamResponse(dresponse);
      throw new AbortedError(
        'Problem during insert operation',
        400,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(temp.status || 400),
        },
        temp,
        getDestAuthCategory(temp.code),
      );
    }
    throw new UnhandledStatusCodeError('Unhandled error type while sending to destination');
  }
};

const responseHandler = (respTransformPayload) => {
  const { response, status } = respTransformPayload;
  processResponse({
    dresponse: response,
    status,
  });
  return {
    status,
    destinationResponse: response,
    message: 'Request Processed Successfully',
  };
};

function networkHandler() {
  this.responseHandler = responseHandler;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
}

/**
 * Groups the input events based on the `userId` property
 *
 * @param {Array} inputs - An array of objects representing events with `metadata.userId` property.
 * @returns {Array} An array of arrays containing the grouped events.
 * Each inner array represents a user journey.
 */
const generateUserJourneys = (inputs) => {
  const userIdEventMap = _.groupBy(inputs, 'metadata.userId');
  const eventGroupedByUserId = Object.values(userIdEventMap);
  return eventGroupedByUserId;
};

/**
 * Filters and splits an array of events based on whether they have an error or not.
 * Returns an array of arrays, where inner arrays represent either a chunk of successful events or 
 * an array of single error event. It maintains the order of events strictly.
 *
 * @param {Array} sortedEvents - An array of events to be filtered and split.
 * @returns {Array} - An array of arrays where each inner array represents a chunk of successful events followed by an error event.
 */
const filterAndSplitEvents = (sortedEvents) => {
  let successfulEventsChunk = [];
  const resultArray = []
  for (const item of sortedEvents) {
    // if error is present, then push the previous successfulEventsChunk 
    // and then push the error event
    if (isDefinedAndNotNull(item.error)) {
      if(successfulEventsChunk.length > 0) {
        resultArray.push(successfulEventsChunk);
        successfulEventsChunk = [];
      }
      resultArray.push([item]);
    } else {
      // if error is not present, then push the event to successfulEventsChunk
      successfulEventsChunk.push(item);
     }
  }
   // Push the last successfulEventsChunk to resultArray
  if (successfulEventsChunk.length > 0) {
    resultArray.push(successfulEventsChunk);
  }
  return resultArray;
};


const convertMetadataToArray = (eventList ) => {
  const processedEvents = eventList.map((event) => ({
    ...event,
    metadata: Array.isArray(event.metadata) ? event.metadata : [event.metadata],
  }));
  return processedEvents;
}

  /**
   * Takes in two arrays, eachUserSuccessEventslist and eachUserErrorEventsList, and returns an ordered array of events.
   * If there are no error events, it returns the array of transformed events.
   * If there are no successful responses, it returns the error events.
   * If there are both successful and erroneous events, it orders them based on the jobId property of the events' metadata array.
   * considering error responses are built with @handleRtTfSingleEventError
   *
   * @param {Array} eachUserSuccessEventslist - An array of events representing successful responses for a user.
   * @param {Array} eachUserErrorEventsList - An array of events representing error responses for a user.
   * @returns {Array} - An ordered array of events.
   *
   * @example
   * const eachUserSuccessEventslist = [{track, jobId: 1}, {track, jobId: 2}, {track, jobId: 5}];
   * const eachUserErrorEventsList = [{identify, jobId: 3}, {identify, jobId: 4}];
   * Output: [[{track, jobId: 1}, {track, jobId: 2}],[{identify, jobId: 3}],[{identify, jobId: 4}], {track, jobId: 5}]]
   */
  const HandleEventOrdering = (eachUserSuccessEventslist, eachUserErrorEventsList) => {
    // Convert 'metadata' to an array if it's not already
    const processedSuccessfulEvents = convertMetadataToArray(eachUserSuccessEventslist);
    const processedErrorEvents = convertMetadataToArray(eachUserErrorEventsList);

    // if there are no error events, then return the batched response
    if (eachUserErrorEventsList.length === 0) {
      return [processedSuccessfulEvents];
    }
    // if there are no batched response, then return the error events
    if (eachUserSuccessEventslist.length === 0) {
      return [processedErrorEvents];
    }

    // if there are both batched response and error events, then order them
    const combinedTransformedEventList = [...processedSuccessfulEvents, ...processedErrorEvents].flat();
    
    const sortedEvents = _.sortBy(combinedTransformedEventList, (event) => event.metadata[0].jobId);
    const finalResp = filterAndSplitEvents(sortedEvents);

    return finalResp;
  }

module.exports = { networkHandler, generateUserJourneys, HandleEventOrdering  };

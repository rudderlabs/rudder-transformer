const {
  NetworkError,
  AbortedError,
  ThrottledError,
  RetryableError,
  UnhandledStatusCodeError,
  InstrumentationError,
} = require('@rudderstack/integrations-lib');
const stats = require('../../../util/stats');
const { httpGET, httpPOST } = require('../../../adapters/network');
const {
  getDynamicErrorType,
  processAxiosResponse,
} = require('../../../adapters/utils/networkUtils');
const { isHttpStatusSuccess } = require('../../util/index');
const tags = require('../../util/tags');

/**
 * The error codes that are generated by Marketo are present in the mentioned link:
 * https://developers.marketo.com/rest-api/error-codes/
 */

const ERROR_CODE_TO_PASS = ['1015'];

const MARKETO_RETRYABLE_CODES = ['601', '602', '604', '611'];
const MARKETO_ABORTABLE_CODES = [
  '600',
  '603',
  '605',
  '609',
  '610',
  '612',
  '1006',
  '1013',
  '1004',
  '1001',
];
const MARKETO_THROTTLED_CODES = ['502', '606', '607', '608', '615'];

// Keeping here for reference const RECORD_LEVEL_ABORTBALE_ERRORS = [
//   '1001',
//   '1002',
//   '1003',
//   '1004',
//   '1005',
//   '1006',
//   '1007',
//   '1008',
//   '1011',
//   '1013',
//   '1014',
//   '1016',
//   '1017',
//   '1018',
//   '1021',
//   '1026',
//   '1027',
//   '1028',
//   '1036',
//   '1049',
// ];

const { DESTINATION, FETCH_TOKEN_METRIC } = require('./config');
const logger = require('../../../logger');

// handles marketo application level failures
const marketoApplicationErrorHandler = (marketoResponse, sourceMessage, destination) => {
  const { response } = marketoResponse;
  const { errors } = response;
  if (errors && MARKETO_ABORTABLE_CODES.includes(errors[0].code)) {
    throw new AbortedError(
      `Request Failed for ${destination}, ${errors[0].message} (Aborted).${sourceMessage}`,
      400,
      marketoResponse,
    );
  }
  if (errors && MARKETO_THROTTLED_CODES.includes(errors[0].code)) {
    throw new ThrottledError(
      `Request Failed for ${destination}, ${errors[0].message} (Throttled).${sourceMessage}`,
      marketoResponse,
    );
  }
  if (errors && MARKETO_RETRYABLE_CODES.includes(errors[0].code)) {
    throw new RetryableError(
      `Request Failed for ${destination}, ${errors[0].message} (Retryable).${sourceMessage}`,
      500,
      marketoResponse,
    );
  }
};
/**
 * this function checks the status of individual responses and throws error if any
 * response status does not match the expected status
 * doc1: https://developers.marketo.com/rest-api/lead-database/custom-objects/#create_and_update
 * doc2: https://developers.marketo.com/rest-api/lead-database/#create_and_update
 * Structure of marketoResponse: {
    "requestId":"e42b#14272d07d78",
    "success":true,
    "result":[
        {
          "seq":0,
          "status": "updated",
          "marketoGUID":"dff23271-f996-47d7-984f-f2676861b5fb"
        },
        {
          "seq":1,
          "status": "created",
          "marketoGUID":"cff23271-f996-47d7-984f-f2676861b5fb"
        },
        {
          "seq":2,
          "status": "skipped"
          "reasons":[
              {
                "code":"1004",
                "message":"Lead not found"
              }
          ]
        }
    ]
  }
 *
 * @param {*} marketoResponse
 * @param {*} sourceMessage
 */
const nestedResponseHandler = (marketoResponse, sourceMessage) => {
  const checkStatus = (res) => {
    const { status } = res;
    const allowedStatus = ['updated', 'added', 'removed', 'created'];
    if (
      status &&
      !allowedStatus.includes(status)
      // we need to check the case where the id are not in list
    ) {
      const { reasons } = res;
      let statusCode = 400;
      if (reasons) {
        const errorCodesFromDest = reasons.map((reason) => reason.code);
        const filteredErrorCode = errorCodesFromDest.find(
          (errorCode) => !ERROR_CODE_TO_PASS.includes(errorCode),
        );
        if (!filteredErrorCode) {
          return;
        }
        if (MARKETO_THROTTLED_CODES.includes(filteredErrorCode)) {
          statusCode = 429;
        } else if (MARKETO_RETRYABLE_CODES.includes(filteredErrorCode)) {
          statusCode = 500;
        }
      }
      throw new InstrumentationError(
        `Request failed during: ${sourceMessage}, error: ${
          JSON.stringify(reasons) || 'Reason(s) not Found'
        }`,
        statusCode,
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(statusCode),
        },
        marketoResponse,
      );
    }
  };
  const { result } = marketoResponse;
  if (Array.isArray(result)) {
    result.forEach((resultElement) => {
      checkStatus(resultElement);
    });
  } else {
    checkStatus(result);
  }
};

const marketoResponseHandler = (
  destResponse,
  sourceMessage,
  rudderJobMetadata,
  authCache,
  destination = DESTINATION,
) => {
  const { status, response } = destResponse;
  // if the responsee from destination is not a success case build an explicit error
  if (!isHttpStatusSuccess(status)) {
    throw new NetworkError(
      `Request failed  with status: ${status}`,
      status,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
      },
      destResponse,
    );
  }
  if (isHttpStatusSuccess(status)) {
    // for authentication requests
    if (response && response.access_token) {
      /* This scenario will handle the case when we get the foloowing response
    status: 200
    respnse: {"access_token":"86e6c440-1c2e-4a67-8b0d-53496bfaa510:sj","token_type":"bearer","expires_in":0,"scope":"a@b.com"}
    wherein "expires_in":0 denotes that we should refresh the accessToken but its not expired yet.
    */
      if (response.expires_in === 0) {
        throw new RetryableError(
          `Request Failed for ${destination}, Access Token Expired (Retryable).${sourceMessage}`,
          500,
          response,
        );
      }
      return response;
    }
    // marketo application level success
    if (response && response.success) {
      nestedResponseHandler(response, sourceMessage);
      return response;
    }
    // marketo application level failure
    if (response && !response.success) {
      // checking for invalid/expired token errors and evicting cache in that case
      // rudderJobMetadata contains some destination info which is being used to evict the cache
      if (response.errors && rudderJobMetadata?.destInfo) {
        const { authKey } = rudderJobMetadata.destInfo;
        if (
          authCache &&
          authKey &&
          response.errors.some((errorObj) => errorObj.code === '601' || errorObj.code === '602')
        ) {
          logger.info(
            `${destination} Cache token evicting due to invalid/expired access_token for destinationId`,
          );
          authCache.del(authKey);
        }
      }
      marketoApplicationErrorHandler(destResponse, sourceMessage, destination);
    }
  }
  // More readable error message
  let message = `Error occurred ${sourceMessage}`;
  if (response.errors.length > 0 && response.errors[0].message) {
    message += ` -> ${response.errors[0].message}`;
  }
  // Marketo sent us some failure which is not handled
  throw new UnhandledStatusCodeError(message, destResponse);
};

/**
 *
 * @param {*} url
 * @param {*} options
 * @returns { response, status }
 */
const sendGetRequest = async (url, options, metadata) => {
  const clientResponse = await httpGET(url, options, {
    destType: 'marketo',
    feature: 'transformation',
    endpointPath: `/v1/leads`,
    requestMethod: 'GET',
    module: 'router',
    metadata,
  });
  const processedResponse = processAxiosResponse(clientResponse);
  return processedResponse;
};

/**
 *
 * @param {*} url
 * @param {*} options
 * @returns { response, status }
 */
const sendPostRequest = async (url, data, options, metadata) => {
  const clientResponse = await httpPOST(url, data, options, {
    destType: 'marketo',
    feature: 'transformation',
    endpointPath: `/v1/leads`,
    requestMethod: 'POST',
    module: 'router',
    metadata,
  });
  const processedResponse = processAxiosResponse(clientResponse);
  return processedResponse;
};

const getResponseHandlerData = (clientResponse, lookupMessage, formattedDestination, authCache) =>
  marketoResponseHandler(
    clientResponse,
    lookupMessage,
    { destInfo: { authKey: formattedDestination.ID } },
    authCache,
  );

// //////////////////////////////////////////////////////////////////////
// BASE URL REF: https://developers.marketo.com/rest-api/base-url/
// //////////////////////////////////////////////////////////////////////

// calls Marketo Auth API and fetches bearer token
// fails the transformer if auth fails
// ------------------------
// Ref: https://developers.marketo.com/rest-api/authentication/#creating_an_access_token
const getAuthToken = async (authCache, formattedDestination, metadata) =>
  authCache.get(formattedDestination.ID, async () => {
    const { accountId, clientId, clientSecret } = formattedDestination;
    const clientResponse = await sendGetRequest(
      `https://${accountId}.mktorest.com/identity/oauth/token`,
      {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'client_credentials',
        },
      },
      metadata,
    );
    const data = marketoResponseHandler(clientResponse, 'During fetching auth token');
    stats.increment(FETCH_TOKEN_METRIC, { status: 'success' });
    return { value: data.access_token, age: data.expires_in };
  });

module.exports = {
  getAuthToken,
  marketoResponseHandler,
  sendGetRequest,
  sendPostRequest,
  getResponseHandlerData,
};

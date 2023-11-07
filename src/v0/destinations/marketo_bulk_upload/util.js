const { handleHttpRequest } = require('../../../adapters/network');
const {
  AbortedError,
  RetryableError,
  NetworkError,
  TransformationError,
} = require('../../util/errorTypes');
const tags = require('../../util/tags');
const { isHttpStatusSuccess, generateUUID } = require('../../util');
const { getDynamicErrorType } = require('../../../adapters/utils/networkUtils');
const stats = require('../../../util/stats');
const {
  ABORTABLE_CODES,
  THROTTLED_CODES,
  POLL_ACTIVITY,
  UPLOAD_FILE,
  FETCH_ACCESS_TOKEN,
  POLL_STATUS_ERR_MSG,
  FILE_UPLOAD_ERR_MSG,
  ACCESS_TOKEN_FETCH_ERR_MSG,
} = require('./config');
const Cache = require('../../util/cache');
const logger = require('../../../logger');

const { AUTH_CACHE_TTL } = require('../../util/constant');

const authCache = new Cache(AUTH_CACHE_TTL);

const getMarketoFilePath = () =>
  `${__dirname}/uploadFile/${Date.now()}_marketo_bulk_upload_${generateUUID()}.csv`;

// Server only aborts when status code is 400
const hydrateStatusForServer = (statusCode, context) => {
  const status = Number(statusCode);
  if (Number.isNaN(status)) {
    throw new TransformationError(`${context}: Couldn't parse status code ${statusCode}`);
  }
  if (status >= 400 && status <= 499) {
    return 400;
  }
  return status;
};

const getAccessTokenCacheKey = (config = {}) => {
  const { munchkinId, clientId, clientSecret } = config;
  return `${munchkinId}-${clientId}-${clientSecret}`;
};

/**
 * Handles common error responses returned from API calls.
 * Checks the error code and throws the appropriate error object based on the code.
 *
 * @param {object} resp - The response object containing the error information.
 * @param {string} OpErrorMessage - The error message to be used if the error code is not recognized.
 * @param {string} OpActivity - The activity name for tracking purposes.
 * @throws {AbortedError} - If the error code is abortable.
 * @throws {ThrottledError} - If the error code is within the range of throttled codes.
 * @throws {RetryableError} - If the error code is neither abortable nor throttled.
 *
 * @example
 * const resp = {
 *   response: {
 *     errors: [
 *       {
 *         code: "1003",
 *         message: "Empty File"
 *       }
 *     ]
 *   }
 * };
 *
 * try {
 *   handleCommonErrorResponse(resp, "Error message", "Activity");
 * } catch (error) {
 *   console.log(error);
 * }
 */
const handleCommonErrorResponse = (apiCallResult, OpErrorMessage, OpActivity, config) => {
  // checking for invalid/expired token errors and evicting cache in that case
  // rudderJobMetadata contains some destination info which is being used to evict the cache
  if (
    authCache &&
    apiCallResult.response?.errors &&
    apiCallResult.response?.errors?.length > 0 &&
    apiCallResult.response?.errors.some(
      (errorObj) => errorObj.code === '601' || errorObj.code === '602',
    )
  ) {
    // Special handling for 601 and 602 error codes for access token
    authCache.del(getAccessTokenCacheKey(config));
    if (apiCallResult.response?.errors.some((errorObj) => errorObj.code === '601')) {
      throw new AbortedError(
        `[${OpErrorMessage}]Error message: ${apiCallResult.response?.errors[0]?.message}`,
      );
    }
    if (apiCallResult.response?.errors.some((errorObj) => errorObj.code === '602')) {
      throw new RetryableError(
        `[${OpErrorMessage}]Error message: ${apiCallResult.response?.errors[0]?.message}`,
      );
    }
  }
  if (
    apiCallResult.response?.errors?.length > 0 &&
    apiCallResult.response?.errors[0] &&
    ((apiCallResult.response?.errors[0]?.code >= 1000 &&
      apiCallResult.response?.errors[0]?.code <= 1077) ||
      ABORTABLE_CODES.includes(apiCallResult.response?.errors[0]?.code))
  ) {
    // for empty file the code is 1003 and that should be retried
    stats.increment(OpActivity, {
      status: 400,
      state: 'Abortable',
    });
    throw new AbortedError(apiCallResult.response?.errors[0]?.message || OpErrorMessage, 400);
  } else if (THROTTLED_CODES.includes(apiCallResult.response?.errors[0]?.code)) {
    // for more than 10 concurrent uses the code is 615 and that should be retried
    stats.increment(OpActivity, {
      status: 429,
      state: 'Retryable',
    });
    throw new RetryableError(
      `[${OpErrorMessage}]Error message: ${apiCallResult.response?.errors[0]?.message}`,
      500,
    );
  }
  // by default every thing will be retried
  stats.increment(OpActivity, {
    status: 500,
    state: 'Retryable',
  });
  throw new RetryableError(
    `[${OpErrorMessage}]Error message: ${apiCallResult.response?.errors[0]?.message}`,
    500,
  );
};

const getAccessTokenURL = (config) => {
  const { clientId, clientSecret, munchkinId } = config;
  const url = `https://${munchkinId}.mktorest.com/identity/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`;
  return url;
};

// Fetch access token from client id and client secret
// DOC: https://developers.marketo.com/rest-api/authentication/
const getAccessToken = async (config) =>
  authCache.get(getAccessTokenCacheKey(config), async () => {
    const url = getAccessTokenURL(config);
    const { processedResponse: accessTokenResponse } = await handleHttpRequest('get', url, {
      destType: 'marketo_bulk_upload',
      feature: 'transformation',
    });

    // sample response : {response: '[ENOTFOUND] :: DNS lookup failed', status: 400}
    if (!isHttpStatusSuccess(accessTokenResponse.status)) {
      throw new NetworkError(
        'Could not retrieve authorisation token',
        hydrateStatusForServer(accessTokenResponse.status, FETCH_ACCESS_TOKEN),
        {
          [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(accessTokenResponse.status),
        },
        accessTokenResponse,
      );
    }
    if (accessTokenResponse.response?.success === false) {
      handleCommonErrorResponse(
        accessTokenResponse,
        ACCESS_TOKEN_FETCH_ERR_MSG,
        FETCH_ACCESS_TOKEN,
        config,
      );
    }

    // when access token is present
    if (accessTokenResponse.response.access_token) {
      /* This scenario will handle the case when we get the foloowing response
      status: 200  
      respnse: {"access_token":"<dummy-access-token>","token_type":"bearer","expires_in":0,"scope":"dummy@scope.com"}
      wherein "expires_in":0 denotes that we should refresh the accessToken but its not expired yet. 
      */
      if (accessTokenResponse.response?.expires_in === 0) {
        throw new RetryableError(
          `Request Failed for marketo_bulk_upload, Access Token Expired (Retryable).`,
          500,
        );
      }
      return accessTokenResponse.response.access_token;
    }
    throw new AbortedError('Could not retrieve authorisation token', 400);
  });

/**
 * Handles the response of a polling operation.
 * Checks for any errors in the response and calls the `handleCommonErrorResponse` function to handle them.
 * If the response is successful, increments the stats and returns the response.
 * Otherwise, returns null.
 *
 * @param {object} pollStatus - The response object from the polling operation.
 * @returns {object|null} - The response object if the polling operation was successful, otherwise null.
 */
const handlePollResponse = (pollStatus, config) => {
  // DOC: https://developers.marketo.com/rest-api/error-codes/
  if (pollStatus.response.errors) {
    /* Sample error response for poll is:

            {
              "requestId": "e42b#14272d07d78",
              "success": false,
              "errors": [
                   {
                      "code": "601",
                      "message": "Unauthorized"
                   }
                  ]
              }
           */
    handleCommonErrorResponse(pollStatus, POLL_STATUS_ERR_MSG, POLL_ACTIVITY, config);
  }

  /*
    Sample Successful Poll response structure:
    {
      "requestId":"8136#146daebc2ed",
      "success":true,
      "result":[
          {
              "batchId":<batch-id>,
              "status":"Complete",
              "numOfLeadsProcessed":2,
              "numOfRowsFailed":1,
              "numOfRowsWithWarning":0,
              "message":"Import completed with errors, 2 records imported (2 members), 1 failed"
          }
      ]
    }
  */
  if (pollStatus.response?.success) {
    stats.counter(POLL_ACTIVITY, 1, {
      status: 200,
      state: 'Success',
    });

    if (pollStatus.response?.result?.length > 0) {
      return pollStatus.response;
    }
  }

  return null;
};

const handleFetchJobStatusResponse = (resp, type) => {
  const marketoResponse = resp.response;
  const marketoReposnseStatus = resp.status;

  if (!isHttpStatusSuccess(marketoReposnseStatus)) {
    logger.info('[Network Error]:Failed during fetching job status', { marketoResponse, type });
    throw new NetworkError(
      'Unable to fetch job status',
      hydrateStatusForServer(marketoReposnseStatus, 'During fetching job status'),
    );
  }

  if (marketoResponse?.success === false) {
    logger.info('[Application Error]Failed during fetching job status', { marketoResponse, type });
    throw new RetryableError('Failure during fetching job status', 500, resp);
  }

  /*
  successful response :
  {
    response: 'city,  email,Import Failure ReasonChennai,s…a,Value for lookup field 'email' not found',
    status: 200
  }

  */

  return marketoResponse;
};

/**
 * Handles the response received after a file upload request.
 * Checks for errors in the response and throws appropriate error objects based on the error codes.
 * If the response indicates a successful upload, extracts the importId and returns it along with other job details.
 *
 * @param {object} resp - The response object received after a file upload request.
 * @param {array} successfulJobs - An array to store details of successful jobs.
 * @param {array} unsuccessfulJobs - An array to store details of unsuccessful jobs.
 * @param {number} requestTime - The time taken for the request in milliseconds.
 * @returns {object} - An object containing the importId, successfulJobs, and unsuccessfulJobs.
 */
const handleFileUploadResponse = (resp, successfulJobs, unsuccessfulJobs, requestTime, config) => {
  /*
    For unsuccessful response
    {
        "requestId": "e42b#14272d07d78",
        "success": false,
        "errors": [
            {
                "code": "1003",
                "message": "Empty File"
            }
        ]
    }
   */
  if (resp.response?.errors) {
    if (resp.response?.errors[0]?.code === '1003') {
      stats.increment(UPLOAD_FILE, {
        status: 500,
        state: 'Retryable',
      });
      throw new RetryableError(
        `[${FILE_UPLOAD_ERR_MSG}]:Error Message ${resp.response.errors[0]?.message}`,
        500,
      );
    } else {
      handleCommonErrorResponse(resp, FILE_UPLOAD_ERR_MSG, UPLOAD_FILE, config);
    }
  }

  /**
   * SuccessFul Upload Response :
    {
        "requestId": "d01f#15d672f8560",
        "result": [
            {
                "batchId": 3404,
                "importId": "3404",
                "status": "Queued"
            }
        ],
        "success": true
    }
  */
  if (
    resp.response?.success &&
    resp.response?.result?.length > 0 &&
    resp.response?.result[0]?.importId
  ) {
    const { importId } = resp.response.result[0];
    stats.histogram('marketo_bulk_upload_upload_file_time', requestTime);

    stats.increment(UPLOAD_FILE, {
      status: 200,
      state: 'Success',
    });
    return { importId, successfulJobs, unsuccessfulJobs };
  }
  // if neither successful, nor the error message is appropriate sending importId as default null
  return { importId: null, successfulJobs, unsuccessfulJobs };
};

/**
 * Retrieves the field schema mapping for a given access token and munchkin ID from the Marketo API.
 *
 * @param {string} accessToken - The access token used to authenticate the API request.
 * @param {string} munchkinId - The munchkin ID of the Marketo instance.
 * @returns {object} - The field schema mapping retrieved from the Marketo API.
 */
const getFieldSchemaMap = async (accessToken, munchkinId) => {
  let fieldArr = [];
  const fieldMap = {}; // map to store field name and data type
  // ref: https://developers.marketo.com/rest-api/endpoint-reference/endpoint-index/#:~:text=Describe%20Lead2,leads/describe2.json
  const { processedResponse: fieldSchemaMapping } = await handleHttpRequest(
    'get',
    `https://${munchkinId}.mktorest.com/rest/v1/leads/describe2.json`,
    {
      params: {
        access_token: accessToken,
      },
    },
    {
      destType: 'marketo_bulk_upload',
      feature: 'transformation',
    },
  );

  if (fieldSchemaMapping.response.errors) {
    handleCommonErrorResponse(
      fieldSchemaMapping,
      'Error while fetching Marketo Field Schema',
      'FieldSchemaMapping',
    );
  }
  if (
    fieldSchemaMapping.response?.success &&
    fieldSchemaMapping.response?.result.length > 0 &&
    fieldSchemaMapping.response?.result[0]
  ) {
    fieldArr =
      fieldSchemaMapping.response.result && Array.isArray(fieldSchemaMapping.response.result)
        ? fieldSchemaMapping.response.result[0]?.fields
        : [];

    fieldArr.forEach((field) => {
      fieldMap[field?.name] = field?.dataType;
    });
  } else {
    throw new RetryableError('Failed to fetch Marketo Field Schema', 500, fieldSchemaMapping);
  }
  return fieldMap;
};

/**
 * Compares the data types of the fields in an event message with the expected data types defined in the field schema mapping.
 * Identifies any mismatched fields and returns them as a map of job IDs and the corresponding invalid fields.
 *
 * @param {object} event - An object containing an `input` array of events. Each event has a `message` object with field-value pairs and a `metadata` object with a `job_id` property.
 * @param {object} fieldSchemaMapping - An object containing the field schema mapping, which includes the expected data types for each field.
 * @returns {object} - An object containing the job IDs as keys and the corresponding invalid fields as values.
 */
const checkEventStatusViaSchemaMatching = (event, fieldMap) => {
  const mismatchedFields = {};
  const events = event.input;
  events.forEach((ev) => {
    const { message, metadata } = ev;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { job_id } = metadata;

    Object.entries(message).forEach(([paramName, paramValue]) => {
      let expectedDataType = fieldMap[paramName];
      const actualDataType = typeof paramValue;

      // If expectedDataType is not one of the primitive data types, treat it as a string
      if (!['string', 'number', 'boolean', 'undefined'].includes(expectedDataType)) {
        expectedDataType = 'string';
      }

      if (!mismatchedFields[job_id] && actualDataType !== expectedDataType) {
        mismatchedFields[job_id] = `invalid ${paramName}`;
      }
    });
  });
  return mismatchedFields;
};

module.exports = {
  checkEventStatusViaSchemaMatching,
  handlePollResponse,
  handleFetchJobStatusResponse,
  handleFileUploadResponse,
  handleCommonErrorResponse,
  hydrateStatusForServer,
  getAccessToken,
  getMarketoFilePath,
  getFieldSchemaMap,
};

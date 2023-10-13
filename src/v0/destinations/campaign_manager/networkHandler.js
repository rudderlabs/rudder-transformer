/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
const { prepareProxyRequest, proxyRequest } = require('../../../adapters/network');
const { isHttpStatusSuccess, getAuthErrCategoryFromStCode } = require('../../util/index');

const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { AbortedError, RetryableError, NetworkError } = require('../../util/errorTypes');
const tags = require('../../util/tags');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function checkIfFailuresAreRetryable(response, proxyOutputObj) {
  const { status } = response;
  try {
    if (Array.isArray(status)) {
      // iterate over each status, and if found retryable in conversations ..retry else discard
      /* status : [{
        "conversion": {
          object (Conversion)
        },
        "errors": [
          {
            object (ConversionError)
          }
        ],
        "kind": string
      }] */
      for (const st of status) {
        for(const err of st.errors) {
          // if code is any of these, event is not retryable
          if (
            err.code === 'PERMISSION_DENIED' ||
            err.code === 'INVALID_ARGUMENT' ||
            err.code === 'NOT_FOUND'
          ) {
            return false;
          }
        }
      }
    }
    return true;
  } catch (e) {
    return false;
  }
}

function isEventRetryable(element, proxyOutputObj) {
  let flag = false;
  let errorMsg = "";
  // success event
  if (!element.errors) {
    return flag;
  }
  for(const err of element.errors) {
    errorMsg += `${err.message}, `;
    if (err.code === 'INTERNAL') {
      flag = true;
    }
  }
  if (errorMsg) {
    proxyOutputObj.error = errorMsg;
  }
  return flag;
}

function isEventAbortable(element, proxyOutputObj) {
  let flag = false;
  let errorMsg = "";
  // success event
  if (!element.errors) {
    return flag;
  }
  for(const err of element.errors) {
    errorMsg += `${err.message}, `;
    // if code is any of these, event is not retryable
    if (
      err.code === 'PERMISSION_DENIED' ||
      err.code === 'INVALID_ARGUMENT' ||
      err.code === 'NOT_FOUND'
    ) {
      flag = true;
    }
  }
  if (errorMsg) {
    proxyOutputObj.error = errorMsg;
  }
  return flag;
}

const responseHandler = (destinationResponse) => {
  const message = `[CAMPAIGN_MANAGER Response Handler] - Request Processed Successfully`;
  const responseForPartialEventHandling = []
  // destinationResponse = {
  //   response: {
  //     hasFailures: true,
  //     status: [
  //       {
  //         conversion: {
  //           floodlightConfigurationId: "213123123",
  //           floodlightActivityId: "456543345245",
  //           timestampMicros: "1668624722555000",
  //           value: 756234234234,
  //           quantity: "3",
  //           ordinal: "1",
  //           limitAdTracking: false,
  //           childDirectedTreatment: false,
  //           gclid: "123",
  //           nonPersonalizedAd: false,
  //           treatmentForUnderage: false,
  //           kind: "dfareporting#conversion",
  //         },
  //         kind: "dfareporting#conversionStatus",
  //       },
  //       {
  //         conversion: {
  //           floodlightConfigurationId: "213123123",
  //           floodlightActivityId: "456543345245",
  //           timestampMicros: "1668624722555000",
  //           value: 756234234234,
  //           quantity: "3",
  //           ordinal: "1",
  //           limitAdTracking: false,
  //           childDirectedTreatment: false,
  //           gclid: "123",
  //           nonPersonalizedAd: false,
  //           treatmentForUnderage: false,
  //           kind: "dfareporting#conversion",
  //         },
  //         errors: [
  //           {
  //             code: "NOT_FOUND",
  //             message: "Floodlight config id: 213123123 was not found.",
  //             kind: "dfareporting#conversionError",
  //           },
  //           {
  //             code: "INVALID_ARGUMENT",
  //             message: "gclid: 123 was not found.",
  //             kind: "dfareporting#conversionError",
  //           }
  //         ],
  //         kind: "dfareporting#conversionStatus",
  //       },
  //       {
  //         conversion: {
  //           floodlightConfigurationId: "213123123",
  //           floodlightActivityId: "456543345245",
  //           timestampMicros: "1668624722555000",
  //           value: 756234234234,
  //           quantity: "3",
  //           ordinal: "1",
  //           limitAdTracking: false,
  //           childDirectedTreatment: false,
  //           gclid: "123",
  //           nonPersonalizedAd: false,
  //           treatmentForUnderage: false,
  //           kind: "dfareporting#conversion",
  //         },
  //         errors: [
  //           {
  //             code: "NOT_FOUND",
  //             message: "Floodlight config id: 213123123 was not found.",
  //             kind: "dfareporting#conversionError",
  //           },
  //         ],
  //         kind: "dfareporting#conversionStatus",
  //       },
  //     ],
  //     kind: "dfareporting#conversionsBatchInsertResponse",
  //   },
  //   status: 200,
  //   rudderJobMetadata: [{
  //     jobId: 10,
  //     attemptNum: 0,
  //     userId: "",
  //     sourceId: "24242",
  //     destinationId: "24242",
  //     workspaceId: "242424",
  //     secret: {
  //       access_token: "atoken",
  //       refresh_token: "rtoken",
  //       developer_token: "developer_Token",
  //     },
  //   },
  //   {
  //     jobId: 11,
  //     attemptNum: 0,
  //     userId: "",
  //     sourceId: "2424",
  //     destinationId: "24242",
  //     workspaceId: "24242",
  //     secret: {
  //       access_token: "atoken",
  //       refresh_token: "rtoken",
  //       developer_token: "developer_Token",
  //     },
  //   },
  //   {
  //     jobId: 12,
  //     attemptNum: 0,
  //     userId: "",
  //     sourceId: "24242",
  //     destinationId: "234234",
  //     workspaceId: "34324",
  //     secret: {
  //       access_token: "atoken",
  //       refresh_token: "rtoken",
  //       developer_token: "developer_Token",
  //     },
  //   }],
  // };


  // destinationResponse = {
  //   response: {
  //     error: {
  //       code: 401,
  //       message: "Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.",
  //       errors: [
  //         {
  //           message: "Invalid Credentials",
  //           domain: "global",
  //           reason: "authError",
  //           location: "Authorization",
  //           locationType: "header",
  //         },
  //       ],
  //       status: "UNAUTHENTICATED",
  //     },
  //   },
  //   status: 401,
  // };

  const { response, status, rudderJobMetadata } = destinationResponse;
  if (isHttpStatusSuccess(status)) {
    // check for Partial Event failures and Successes 
    const destPartialStatus = response.status;
    
    for (const [idx, element] of destPartialStatus.entries()) {
      const proxyOutputObj = {
        statusCode: 200,
        metadata: rudderJobMetadata[idx],
        error: "success"
      };
      // update status of partial event as per retriable or abortable
      if (isEventRetryable(element, proxyOutputObj)) {
        proxyOutputObj.statusCode = 500;
      } else if (isEventAbortable(element, proxyOutputObj)) { 
        proxyOutputObj.statusCode = 400;
      }
      responseForPartialEventHandling.push(proxyOutputObj);
    }

    return {
      status,
      message,
      destinationResponse,
      response: responseForPartialEventHandling
    };
  }

  throw new RetryableError(
    `Campaign Manager: Retrying during CAMPAIGN_MANAGER response transformation`,
    500,
    destinationResponse,
    getAuthErrCategoryFromStCode(status),
  );

  // retry entire batch incase of entire batch delivery failure (eg. oauth error)
  // throw new NetworkError(
  //   `Campaign Manager: ${response.error?.message} during CAMPAIGN_MANAGER response transformation`,
  //   status,
  //   {
  //     [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
  //   },
  //   destinationResponse,
  //   getAuthErrCategoryFromStCode(status),
  // );
};

function networkHandler() {
  this.prepareProxy = prepareProxyRequest;
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.responseHandler = responseHandler;
}

module.exports = { networkHandler };

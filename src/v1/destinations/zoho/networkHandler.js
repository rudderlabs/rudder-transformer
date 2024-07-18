const { TransformerProxyError } = require('../../../v0/util/errorTypes');
const { proxyRequest, prepareProxyRequest } = require('../../../adapters/network');
const {
  processAxiosResponse,
  getDynamicErrorType,
} = require('../../../adapters/utils/networkUtils');
const { isHttpStatusSuccess, getAuthErrCategoryFromStCode } = require('../../../v0/util/index');
const tags = require('../../../v0/util/tags');

/**
 * upsert response : 
 
   {
  "data": [
      {
          "code": "INVALID_DATA",
          "details": {
              "expected_data_type": "integer",
              "api_name": "No_of_Employees",
              "json_path": "$.data[0].No_of_Employees"
          },
          "message": "invalid data",
          "status": "error"
      },
      {
          "code": "SUCCESS",
          "duplicate_field": "Email",
          "action": "update",
          "details": {
              "Modified_Time": "2024-07-14T10:54:15+05:30",
              "Modified_By": {
                  "name": "dummy user",
                  "id": "724445000000323001"
              },
              "Created_Time": "2024-07-01T21:25:36+05:30",
              "id": "724445000000349039",
              "Created_By": {
                  "name": "dummy user",
                  "id": "724445000000323001"
              }
          },
          "message": "record updated",
          "status": "success"
      }
  ]
}

* delete response :

  {
    "data": [
        {
            "code": "SUCCESS",
            "details": {
                "id": "724445000000445001"
            },
            "message": "record deleted",
            "status": "success"
        },
        {
            "code": "INVALID_DATA",
            "details": {
                "id": "724445000000323001"
            },
            "message": "record not deleted",
            "status": "error"
        }
    ]
}
 */

const checkIfEventIsAbortableAndExtractErrorMessage = (element) => {
  if (element.status === 'success') {
    return { isAbortable: false, errorMsg: '' };
  }

  const errorMsg = `message: ${element.messaege} ${JSON.stringify(element.details)}`;
  return { isAbortable: true, errorMsg };
};

const responseHandler = (responseParams) => {
  const { destinationResponse, rudderJobMetadata } = responseParams;

  const message = '[ZOHO Response V1 Handler] - Request Processed Successfully';
  const responseWithIndividualEvents = [];
  const { response, status } = destinationResponse;
  if (isHttpStatusSuccess(status)) {
    // check for Partial Event failures and Successes
    const { data } = response;
    data.forEach((event, idx) => {
      const proxyOutput = {
        statusCode: 200,
        metadata: rudderJobMetadata[idx],
        error: 'success',
      };
      // update status of partial event if abortable
      const { isAbortable, errorMsg } = checkIfEventIsAbortableAndExtractErrorMessage(event);
      if (isAbortable) {
        proxyOutput.statusCode = 400;
        proxyOutput.error = errorMsg;
      }
      responseWithIndividualEvents.push(proxyOutput);
    });
    return {
      status,
      message,
      destinationResponse,
      response: responseWithIndividualEvents,
    };
  }

  if (response?.code === 'INVALID_TOKEN') {
    throw new TransformerProxyError(
      `Zoho: Error transformer proxy v1 during Zoho response transformation. ${response.message}`,
      500,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(500),
      },
      destinationResponse,
      getAuthErrCategoryFromStCode(status),
      response.message,
    );
  }
  throw new TransformerProxyError(
    `ZOHO: Error encountered in transformer proxy V1`,
    status,
    {
      [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(status),
    },
    destinationResponse,
    '',
    responseWithIndividualEvents,
  );
};
function networkHandler() {
  this.proxy = proxyRequest;
  this.processAxiosResponse = processAxiosResponse;
  this.prepareProxy = prepareProxyRequest;
  this.responseHandler = responseHandler;
}
module.exports = { networkHandler };

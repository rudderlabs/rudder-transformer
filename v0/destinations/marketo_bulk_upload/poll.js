const { removeUndefinedValues } = require("../../util");
const { getAccessToken, ABORTABLE_CODES, THROTTLED_CODES } = require("./util");
const { send } = require("../../../adapters/network");
const { CustomError } = require("../../util");

const getPollStatus = async event => {
  const accessToken = await getAccessToken(event.config);

  // To see the status of the import job polling is done
  // DOC: https://developers.marketo.com/rest-api/bulk-import/bulk-lead-import/#polling_job_status
  const requestOptions = {
    url: `https://585-AXP-425.mktorest.com/bulk/v1/leads/batch/${event.importId}.json`,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    }
  };

  const resp = await send(requestOptions);
  if (resp.success) {
    if (resp.response && resp.response.data.success) {
      return resp.response;
    }
    // DOC: https://developers.marketo.com/rest-api/error-codes/
    if (resp.response && resp.response.data) {
      // Abortable jobs
      // Errors from polling come as
      /**
       * {
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
      if (
        resp.response.data.errors[0] &&
        ((resp.response.data.errors[0].code >= 1000 &&
          resp.response.data.errors[0].code <= 1077) ||
          ABORTABLE_CODES.indexOf(resp.response.data.errors[0].code))
      ) {
        throw new CustomError(
          resp.response.data.errors[0].message || "Could not poll status",
          400
        );
      } else if (THROTTLED_CODES.indexOf(resp.response.response.status)) {
        throw new CustomError(
          resp.response.response.statusText || "Could not poll status",
          429
        );
      }
      throw new CustomError(
        resp.response.response.statusText || "Error during polling status",
        500
      );
    }
  }
  throw new CustomError("Could not poll status", 400);
};

const responseHandler = async event => {
  const pollResp = await getPollStatus(event);
  let pollSuccess;
  let success;
  let statusCode;
  let hasFailed;
  let failedJobsURL;
  let hasWarnings;
  let warningJobsURL;
  let errorResponse;
  // Server expects :
  /**
  * 
  * {
    "success": true,
    "statusCode": 200,
    "hasFailed": true,
    "failedJobsURL": "<some-url>", // transformer URL
    "hasWarnings": false,
    "warningJobsURL": "<some-url>", // transformer URL
} // Succesful Upload     
{
    "success": false,
    "statusCode": 400,
    "errorResponse": <some-error-response>
} // Failed Upload
{
    "success": false,
} // Importing or Queue

  */
  if (pollResp && pollResp.data) {
    pollSuccess = pollResp.data.success;
    if (pollSuccess) {
      const {
        status,
        numOfRowsFailed,
        numOfRowsWithWarning
      } = pollResp.data.result[0];
      if (status === "Complete") {
        success = true;
        statusCode = 200;
        hasFailed = numOfRowsFailed > 0;
        failedJobsURL = "/getFailedJobs";
        warningJobsURL = "/getWarningJobs";
        hasWarnings = numOfRowsWithWarning > 0;
      } else if (status === "Importing" || status === "Queued") {
        success = false;
      }
    } else {
      success = false;
      statusCode = 400;
      errorResponse = pollResp.data.errors
        ? pollResp.data.errors[0].message
        : "Error in importing jobs";
    }
  }
  const response = {
    success,
    statusCode,
    hasFailed,
    failedJobsURL,
    hasWarnings,
    warningJobsURL,
    errorResponse
  };
  return removeUndefinedValues(response);
};

const processPolling = async event => {
  const resp = await responseHandler(event);
  return resp;
};

module.exports = { processPolling };

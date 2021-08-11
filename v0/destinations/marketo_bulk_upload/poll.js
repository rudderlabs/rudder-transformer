const axios = require("axios");
const { removeUndefinedValues } = require("../../util");
const { getAccessToken } = require("./util");

const getPollStatus = async event => {
  const accessToken = await getAccessToken(event.config);

  const resp = await axios.get(
    `https://585-AXP-425.mktorest.com/bulk/v1/leads/batch/${event.importId}.json`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
  return resp;
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
        statusCode = 500;
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

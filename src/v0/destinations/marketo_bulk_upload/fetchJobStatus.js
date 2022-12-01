/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */
const { CustomError } = require("../../util");
const {
  getAccessToken,
  ABORTABLE_CODES,
  THROTTLED_CODES,
  RETRYABLE_CODES,
  JOB_STATUS_ACTIVITY
} = require("./util");
const { httpGET } = require("../../../adapters/network");
const stats = require("../../../util/stats");

const getFailedJobStatus = async event => {
  const { config, importId } = event;
  const accessToken = await getAccessToken(config);
  const { munchkinId } = event.config;
  // Get status of each lead for failed leads
  // DOC: https://developers.marketo.com/rest-api/bulk-import/bulk-lead-import/#failures
  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    }
  };
  const failedLeadUrl = `https://${munchkinId}.mktorest.com/bulk/v1/leads/batch/${importId}/failures.json`;
  const startTime = Date.now();
  const resp = await httpGET(failedLeadUrl, requestOptions);
  const endTime = Date.now();
  const requestTime = endTime - startTime;
  stats.gauge("marketo_bulk_upload_fetch_job_time", requestTime, {
    integration: "Marketo_bulk_upload"
  });
  if (resp.success) {
    if (resp.response && resp.response.data) {
      stats.increment(JOB_STATUS_ACTIVITY, 1, {
        integration: "Marketo_bulk_upload",
        status: 200,
        state: "Success"
      });
      return resp.response;
    }
    stats.increment(JOB_STATUS_ACTIVITY, 1, {
      integration: "Marketo_bulk_upload",

      status: 400,
      state: "Abortable"
    });
    throw new CustomError("Could not fetch failure job status", 400);
  }
  if (resp.response) {
    if (
      ABORTABLE_CODES.indexOf(resp.response.code) > -1 ||
      (resp.response.code >= 400 && resp.response.code <= 499)
    ) {
      stats.increment(JOB_STATUS_ACTIVITY, 1, {
        integration: "Marketo_bulk_upload",
        status: 400,
        state: "Abortable"
      });
      throw new CustomError(resp.response.code, 400);
    } else if (RETRYABLE_CODES.indexOf(resp.response.code) > -1) {
      stats.increment(JOB_STATUS_ACTIVITY, 1, {
        integration: "Marketo_bulk_upload",
        status: 500,
        state: "Retryable"
      });
      throw new CustomError(resp.response.code, 500);
    } else if (resp.response.response) {
      if (ABORTABLE_CODES.indexOf(resp.response.response.status) > -1) {
        stats.increment(JOB_STATUS_ACTIVITY, 1, {
          integration: "Marketo_bulk_upload",
          status: 400,
          state: "Abortable"
        });
        throw new CustomError(
          resp.response.response.statusText ||
            "Error during fetching failure job status",
          400
        );
      } else if (THROTTLED_CODES.indexOf(resp.response.response.status) > -1) {
        stats.increment(JOB_STATUS_ACTIVITY, 1, {
          integration: "Marketo_bulk_upload",
          status: 500,
          state: "Retryable"
        });
        throw new CustomError(
          resp.response.response.statusText ||
            "Error during fetching failure job status",
          500
        );
      }
      stats.increment(JOB_STATUS_ACTIVITY, 1, {
        integration: "Marketo_bulk_upload",
        status: 500,
        state: "Retryable"
      });
      throw new CustomError(
        resp.response.response.statusText ||
          "Error during fetching failure job status",
        500
      );
    }
    stats.increment(JOB_STATUS_ACTIVITY, 1, {
      integration: "Marketo_bulk_upload",
      status: 400,
      state: "Abortable"
    });
    throw new CustomError("Could not fetch failure job status", 400);
  }
  stats.increment(JOB_STATUS_ACTIVITY, 1, {
    integration: "Marketo_bulk_upload",
    status: 400,
    state: "Abortable"
  });
  throw new CustomError("Could not fetch failure job status", 400);
};

const getWarningJobStatus = async event => {
  const { config, importId } = event;
  const accessToken = await getAccessToken(config);
  const { munchkinId } = event.config;
  // Get status of each lead for warning leads
  // DOC: https://developers.marketo.com/rest-api/bulk-import/bulk-lead-import/#warnings
  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    }
  };
  const startTime = Date.now();
  const warningJobStatusUrl = `https://${munchkinId}.mktorest.com/bulk/v1/leads/batch/${importId}/warnings.json`;
  const resp = await httpGET(warningJobStatusUrl, requestOptions);
  const endTime = Date.now();
  const requestTime = endTime - startTime;
  stats.gauge("marketo_bulk_upload_fetch_job_time", requestTime, {
    integration: "Marketo_bulk_upload"
  });
  if (resp.success) {
    if (resp.response && resp.response.data) {
      stats.increment(JOB_STATUS_ACTIVITY, 1, {
        integration: "Marketo_bulk_upload",
        status: 200,
        state: "Success"
      });
      return resp.response;
    }
    stats.increment(JOB_STATUS_ACTIVITY, 1, {
      integration: "Marketo_bulk_upload",
      status: 400,
      state: "Abortable"
    });
    throw new CustomError("Could not fetch warning job status", 400);
  }
  if (resp.response) {
    if (
      ABORTABLE_CODES.indexOf(resp.response.code) > -1 ||
      (resp.response.code >= 400 && resp.response.code <= 499)
    ) {
      stats.increment(JOB_STATUS_ACTIVITY, 1, {
        integration: "Marketo_bulk_upload",
        status: 400,
        state: "Abortable"
      });
      throw new CustomError(resp.response.code, 400);
    } else if (RETRYABLE_CODES.indexOf(resp.response.code) > -1) {
      stats.increment(JOB_STATUS_ACTIVITY, 1, {
        integration: "Marketo_bulk_upload",
        status: 500,
        state: "Retryable"
      });
      throw new CustomError(resp.response.code, 500);
    } else if (resp.response.response) {
      if (ABORTABLE_CODES.indexOf(resp.response.response.status) > -1) {
        stats.increment(JOB_STATUS_ACTIVITY, 1, {
          integration: "Marketo_bulk_upload",
          status: 400,
          state: "Abortable"
        });
        throw new CustomError(
          resp.response.response.statusText ||
            "Error during fetching warning job status",
          400
        );
      } else if (THROTTLED_CODES.indexOf(resp.response.response.status) > -1) {
        stats.increment(JOB_STATUS_ACTIVITY, 1, {
          integration: "Marketo_bulk_upload",
          status: 500,
          state: "Retryable"
        });
        throw new CustomError(
          resp.response.response.statusText ||
            "Error during fetching warning job status",
          500
        );
      }
      stats.increment(JOB_STATUS_ACTIVITY, 1, {
        integration: "Marketo_bulk_upload",
        status: 500,
        state: "Retryable"
      });
      throw new CustomError(
        resp.response.response.statusText ||
          "Error during fetching warning job status",
        500
      );
    }
    stats.increment(JOB_STATUS_ACTIVITY, 1, {
      integration: "Marketo_bulk_upload",
      status: 400,
      state: "Abortable"
    });
    throw new CustomError("Could not fetch warning job status", 400);
  }
  stats.increment(JOB_STATUS_ACTIVITY, 1, {
    integration: "Marketo_bulk_upload",
    status: 400,
    state: "Abortable"
  });
  throw new CustomError("Could not fetch warning job status", 400);
};

const responseHandler = async (event, type) => {
  let failedKeys = [];
  let failedReasons = {};
  let warningKeys = [];
  let warningReasons = {};

  /**
   * {
	"failedKeys" : [jobID1,jobID3],
	"failedReasons" : {
		"jobID1" : "failure-reason-1",
		"jobID3" : "failure-reason-2",
	},
	"warningKeys" : [jobID2,jobID4],
	"warningReasons" : {
		"jobID2" : "warning-reason-1",
		"jobID4" : "warning-reason-2",
	},
	"succeededKeys" : [jobID5]
}
   */

  const responseStatus =
    type === "fail"
      ? await getFailedJobStatus(event)
      : await getWarningJobStatus(event);
  const responseArr = responseStatus.data.split("\n");
  const { input, metadata } = event;
  let headerArr;
  if (metadata && metadata.csvHeader) {
    headerArr = metadata.csvHeader.split(",");
  } else {
    throw new CustomError("No csvHeader in metadata", 400);
  }
  const data = {};
  input.forEach(i => {
    const response = headerArr
      .map(fieldName => Object.values(i)[0][fieldName])
      .join(",");
    data[i.metadata.job_id] = response;
  });
  const unsuccessfulJobIdsArr = [];
  const reasons = {};
  const startTime = Date.now();
  for (const element of responseArr) {
    // split response by comma but ignore commas inside double quotes
    const elemArr = element.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const reasonMessage = elemArr.pop();
    // match response data with received data from server
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const val = data[key];
        if (val === `${elemArr.join()}`) {
          // add job keys if warning/failure

          if (!unsuccessfulJobIdsArr.includes(key)) {
            unsuccessfulJobIdsArr.push(key);
          }
          reasons[key] = reasonMessage;
        }
      }
    }
  }

  const successfulJobIdsArr = Object.keys(data).filter(
    x => !unsuccessfulJobIdsArr.includes(x)
  );

  if (type === "fail") {
    failedKeys = unsuccessfulJobIdsArr;
    failedReasons = reasons;
  } else if (type === "warn") {
    warningKeys = unsuccessfulJobIdsArr;
    warningReasons = reasons;
  }
  const succeededKeys = successfulJobIdsArr;
  const endTime = Date.now();
  const requestTime = endTime - startTime;
  stats.gauge(
    "marketo_bulk_upload_fetch_job_create_response_time",
    requestTime,
    {
      integration: "Marketo_bulk_upload"
    }
  );
  const response = {
    statusCode: 200,
    metadata: {
      failedKeys,
      failedReasons,
      warningKeys,
      warningReasons,
      succeededKeys
    }
  };
  return response;
};

const processJobStatus = async (event, type) => {
  const resp = await responseHandler(event, type);
  return resp;
};
module.exports = { processJobStatus };

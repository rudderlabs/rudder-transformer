/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */
const { CustomError } = require("../../util");
const {
  getAccessToken,
  ABORTABLE_CODES,
  THROTTLED_CODES,
  RETRYABLE_CODES
} = require("./util");
const { send } = require("../../../adapters/network");

const getFailedJobStatus = async event => {
  const { config, importId } = event;
  const accessToken = await getAccessToken(config);
  // Get status of each lead for failed leads
  // DOC: https://developers.marketo.com/rest-api/bulk-import/bulk-lead-import/#failures
  const requestOptions = {
    url: `https://585-AXP-425.mktorest.com/bulk/v1/leads/batch/${importId}/failures.json`,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    }
  };

  const resp = await send(requestOptions);
  if (resp.success) {
    if (resp.response && resp.response.data) {
      return resp.response;
    }
    throw new CustomError("Could fetch failure job status", 400);
  }
  if (resp.response) {
    if (
      ABORTABLE_CODES.indexOf(resp.response.code) > -1 ||
      (resp.response.code >= 400 && resp.response.code <= 499)
    ) {
      throw new CustomError(resp.response.code, 400);
    } else if (RETRYABLE_CODES.indexOf(resp.response.code) > -1) {
      throw new CustomError(resp.response.code, 500);
    } else if (resp.response.response) {
      if (ABORTABLE_CODES.indexOf(resp.response.response.status)) {
        throw new CustomError(
          resp.response.response.statusText ||
            "Error during fetching failure job status",
          400
        );
      } else if (THROTTLED_CODES.indexOf(resp.response.response.status)) {
        throw new CustomError(
          resp.response.response.statusText ||
            "Error during fetching failure job status",
          429
        );
      }
      throw new CustomError(
        resp.response.response.statusText ||
          "Error during fetching failure job status",
        500
      );
    }
    throw new CustomError("Could fetch failure job status", 400);
  }
  throw new CustomError("Could fetch failure job status", 400);
};

const getWarningJobStatus = async event => {
  const { config, importId } = event;
  const accessToken = await getAccessToken(config);
  // Get status of each lead for warning leads
  // DOC: https://developers.marketo.com/rest-api/bulk-import/bulk-lead-import/#warnings
  const requestOptions = {
    url: `https://585-AXP-425.mktorest.com/bulk/v1/leads/batch/${importId}/warnings.json`,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    }
  };
  const resp = await send(requestOptions);
  if (resp.success) {
    if (resp.response && resp.response.data) {
      return resp.response;
    }
    throw new CustomError("Could fetch warning job status", 400);
  }
  if (resp.response) {
    if (
      ABORTABLE_CODES.indexOf(resp.response.code) > -1 ||
      (resp.response.code >= 400 && resp.response.code <= 499)
    ) {
      throw new CustomError(resp.response.code, 400);
    } else if (RETRYABLE_CODES.indexOf(resp.response.code) > -1) {
      throw new CustomError(resp.response.code, 500);
    } else if (resp.response.response) {
      if (ABORTABLE_CODES.indexOf(resp.response.response.status)) {
        throw new CustomError(
          resp.response.response.statusText ||
            "Error during fetching warning job status",
          400
        );
      } else if (THROTTLED_CODES.indexOf(resp.response.response.status)) {
        throw new CustomError(
          resp.response.response.statusText ||
            "Error during fetching warning job status",
          429
        );
      }
      throw new CustomError(
        resp.response.response.statusText ||
          "Error during fetching warning job status",
        500
      );
    }
    throw new CustomError("Could fetch warning job status", 400);
  }
  throw new CustomError("Could fetch warning job status", 400);
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

  const headerArr = metadata.csvHeader.split(",");
  const data = {};
  input.forEach(i => {
    const response = headerArr
      .map(fieldName => Object.values(i)[0][fieldName])
      .join(",");
    data[i.metadata.job_id] = response;
  });
  const unsuccessfulJobIdsArr = [];
  const reasons = {};

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

  const response = {
    statuCode: 200,
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

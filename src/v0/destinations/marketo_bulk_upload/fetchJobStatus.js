/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */
const { getAccessToken } = require('./util');
const { JOB_STATUS_ACTIVITY } = require('./config');
const { handleHttpRequest } = require('../../../adapters/network');
const { AbortedError, PlatformError } = require('../../util/errorTypes');
const stats = require('../../../util/stats');
const { JSON_MIME_TYPE } = require('../../util/constant');
const { handleFetchJobStatusResponse } = require('./util');

const FETCH_FAILURE_JOB_STATUS_ERR_MSG = 'Could not fetch failure job status';
const FETCH_WARNING_JOB_STATUS_ERR_MSG = 'Could not fetch warning job status';

const getJobsStatus = async (event, type) => {
  const { config, importId } = event;
  const accessToken = await getAccessToken(config);
  const { munchkinId } = config;
  let url;
  // Get status of each lead for failed leads
  // DOC: https://developers.marketo.com/rest-api/bulk-import/bulk-lead-import/#failures
  const requestOptions = {
    headers: {
      'Content-Type': JSON_MIME_TYPE,
      Authorization: `Bearer ${accessToken}`,
    },
  };
  if (type === 'fail') {
    url = `https://${munchkinId}.mktorest.com/bulk/v1/leads/batch/${importId}/failures.json`;
  } else {
    url = `https://${munchkinId}.mktorest.com/bulk/v1/leads/batch/${importId}/warnings.json`;
  }
  const startTime = Date.now();
  const { processedResponse: resp } = await handleHttpRequest('get', url, requestOptions, {
    destType: 'marketo_bulk_upload',
    feature: 'transformation',
  });
  const endTime = Date.now();
  const requestTime = endTime - startTime;

  stats.histogram('marketo_bulk_upload_fetch_job_time', requestTime);
  try {
    return handleFetchJobStatusResponse(resp, 'fail');
  } catch (err) {
    stats.increment(JOB_STATUS_ACTIVITY, {
      status: 400,
      state: 'Abortable',
    });
    if (type === 'fail') {
      throw new AbortedError(FETCH_FAILURE_JOB_STATUS_ERR_MSG, 400, resp);
    } else {
      throw new AbortedError(FETCH_WARNING_JOB_STATUS_ERR_MSG, 400, resp);
    }
  }
};

  /**
   * Handles the response from the server based on the provided type.
   * Retrieves the job status using the getJobsStatus function and processes the response data.
   * Matches the response data with the data received from the server.
   * Returns a response object containing the failed keys, failed reasons, warning keys, warning reasons, and succeeded keys.
   * @param {Object} event - An object containing the input data and metadata.
   * @param {string} type - A string indicating the type of job status to retrieve ("fail" or "warn").
   * @returns {Object} - A response object with the failed keys, failed reasons, warning keys, warning reasons, and succeeded keys.
   */
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
    type === 'fail' ? await getJobsStatus(event, 'fail') : await getJobsStatus(event, 'warn');
  const responseArr = responseStatus.toString().split('\n'); // responseArr = ['field1,field2,Import Failure Reason', 'val1,val2,reason',...]
  const { input, metadata } = event;
  let headerArr;
  if (metadata?.csvHeader) {
    headerArr = metadata.csvHeader.split(',');
  } else {
    throw new PlatformError('No csvHeader in metadata');
  }
  const data = {};
  // create a map of job_id and data sent from server
  // {<jobId>: '<param-val1>,<param-val2>'}
  input.forEach((i) => {
    const response = headerArr.map((fieldName) => Object.values(i)[0][fieldName]).join(',');
    data[i.metadata.job_id] = response;
  });
  const unsuccessfulJobIdsArr = [];
  const reasons = {};
  const startTime = Date.now();
  // match marketo response data with received data from server
  for (const element of responseArr) {
    // split response by comma but ignore commas inside double quotes
    const elemArr = element.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    // ref :
    // https://developers.marketo.com/rest-api/bulk-import/bulk-custom-object-import/#:~:text=Now%20we%E2%80%99ll%20make%20Get%20Import%20Custom%20Object%20Failures%20endpoint%20call%20to%20get%20additional%20failure%20detail%3A
    const reasonMessage = elemArr.pop(); // get the column named "Import Failure Reason"

    for (const [key, val] of Object.entries(data)) {
      // joining the parameter values sent from marketo match it with received data from server
      if (val === `${elemArr.join()}`) {
        // add job keys if warning/failure
        if (!unsuccessfulJobIdsArr.includes(key)) {
          unsuccessfulJobIdsArr.push(key);
        }
        reasons[key] = reasonMessage;
      }
    }
  }

  const successfulJobIdsArr = Object.keys(data).filter((x) => !unsuccessfulJobIdsArr.includes(x));

  if (type === 'fail') {
    failedKeys = unsuccessfulJobIdsArr;
    failedReasons = reasons;
  } else if (type === 'warn') {
    warningKeys = unsuccessfulJobIdsArr;
    warningReasons = reasons;
  }
  const succeededKeys = successfulJobIdsArr;
  const endTime = Date.now();
  const requestTime = endTime - startTime;
  stats.histogram('marketo_bulk_upload_fetch_job_create_response_time', requestTime);
  const response = {
    statusCode: 200,
    metadata: {
      failedKeys,
      failedReasons,
      warningKeys,
      warningReasons,
      succeededKeys,
    },
  };
  return response;
};

const processJobStatus = async (event, type) => {
  const resp = await responseHandler(event, type);
  return resp;
};
module.exports = { processJobStatus };

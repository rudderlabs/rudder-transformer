const FormData = require("form-data");
const fs = require("fs");
const {
  getAccessToken,
  ABORTABLE_CODES,
  THROTTLED_CODES,
  MERKETO_FILE_SIZE,
  getMarketoFilePath,
  UPLOAD_FILE
} = require("./util");
const { CustomError, getHashFromArray } = require("../../util");
const { send } = require("../../../adapters/network");
const stats = require("../../../util/stats");

const getHeaderFields = config => {
  const { columnFieldsMapping } = config;
  const columnField = getHashFromArray(
    columnFieldsMapping,
    "from",
    "to",
    false
  );
  return Object.keys(columnField);
};

const getFileData = (input, config) => {
  const messageArr = [];
  input.forEach(i => {
    const inputData = i;
    const jobId = inputData.metadata.job_id;
    const data = {};
    data[jobId] = inputData.message;
    messageArr.push(data);
  });
  const headerArr = getHeaderFields(config);
  if (!Object.keys(headerArr).length) {
    throw new CustomError("Header fields not present", 400);
  }
  const csv = [];
  csv.push(headerArr.toString());
  const unsuccessfulJobs = [];
  const successfulJobs = [];
  const MARKETO_FILE_PATH = getMarketoFilePath();
  messageArr.map(row => {
    const csvSize = JSON.stringify(csv).replace(/[\[\]\,\"]/g, ""); // stringify and remove all "stringification" extra data
    const response = headerArr
      .map(fieldName => JSON.stringify(Object.values(row)[0][fieldName], ""))
      .join(",");
    if (csvSize.length <= MERKETO_FILE_SIZE) {
      csv.push(response);
      successfulJobs.push(Object.keys(row)[0]);
    } else {
      unsuccessfulJobs.push(Object.keys(row)[0]);
    }
    return response;
  });
  const fileSize = Buffer.from(csv.join("\n")).length;
  if (csv.length > 1) {
    fs.writeFileSync(MARKETO_FILE_PATH, csv.join("\n"));
    const readStream = fs.createReadStream(MARKETO_FILE_PATH);
    fs.unlinkSync(MARKETO_FILE_PATH);
    return { readStream, successfulJobs, unsuccessfulJobs, fileSize };
  }
  return { successfulJobs, unsuccessfulJobs, fileSize };
};

const getImportID = async (input, config) => {
  const {
    readStream,
    successfulJobs,
    unsuccessfulJobs,
    fileSize
  } = getFileData(input, config);
  try {
    const formReq = new FormData();
    const { munchkinId } = config;
    // create file for multipart form
    if (readStream) {
      formReq.append("format", "csv");
      formReq.append("file", readStream, "marketo_bulk_upload.csv");
      formReq.append("access_token", await getAccessToken(config));
      // Upload data received from server as files to marketo
      // DOC: https://developers.marketo.com/rest-api/bulk-import/bulk-lead-import/#import_file
      const requestOptions = {
        url: `https://${munchkinId}.mktorest.com/bulk/v1/leads.json`,
        method: "post",
        data: formReq,
        headers: {
          ...formReq.getHeaders()
        }
      };
      const startTime = Date.now();
      const resp = await send(requestOptions);
      const endTime = Date.now();
      const requestTime = endTime - startTime;
      if (resp.success) {
        /**
       * 
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
          resp.response &&
          resp.response.data.success &&
          resp.response.data.result.length > 0 &&
          resp.response.data.result[0] &&
          resp.response.data.result[0].importId
        ) {
          const { importId } = await resp.response.data.result[0];
          stats.increment(UPLOAD_FILE, 1, {
            integration: "Marketo_bulk_upload",
            requestTime,
            fileSize,
            successfulJobs,
            unsuccessfulJobs,
            status: 200,
            state: "Success"
          });
          return { importId, successfulJobs, unsuccessfulJobs };
        }
        if (resp.response && resp.response.data) {
          if (
            resp.response.data.errors[0] &&
            resp.response.data.errors[0].message ===
              "There are 10 imports currently being processed. Please try again later"
          ) {
            stats.increment(UPLOAD_FILE, 1, {
              integration: "Marketo_bulk_upload",
              requestTime,
              fileSize,
              successfulJobs,
              unsuccessfulJobs,
              status: 500,
              state: "Retryable"
            });
            throw new CustomError(
              resp.response.data.errors[0].message || "Could not upload file",
              500,
              { successfulJobs, unsuccessfulJobs }
            );
          }
          if (
            resp.response.data.errors[0] &&
            ((resp.response.data.errors[0].code >= 1000 &&
              resp.response.data.errors[0].code <= 1077) ||
              ABORTABLE_CODES.indexOf(resp.response.data.errors[0].code))
          ) {
            if (resp.response.data.errors[0].message === "Empty file") {
              stats.increment(UPLOAD_FILE, 1, {
                integration: "Marketo_bulk_upload",
                requestTime,
                fileSize,
                successfulJobs,
                unsuccessfulJobs,
                status: 500,
                state: "Retryable"
              });
              throw new CustomError(
                resp.response.data.errors[0].message || "Could not upload file",
                500,
                { successfulJobs, unsuccessfulJobs }
              );
            }
            stats.increment(UPLOAD_FILE, 1, {
              integration: "Marketo_bulk_upload",
              requestTime,
              fileSize,
              successfulJobs,
              unsuccessfulJobs,
              status: 400,
              state: "Abortable"
            });
            throw new CustomError(
              resp.response.data.errors[0].message || "Could not upload file",
              400,
              { successfulJobs, unsuccessfulJobs }
            );
          } else if (
            THROTTLED_CODES.indexOf(resp.response.data.errors[0].code)
          ) {
            stats.increment(UPLOAD_FILE, 1, {
              integration: "Marketo_bulk_upload",
              requestTime,
              fileSize,
              successfulJobs,
              unsuccessfulJobs,
              status: 500,
              state: "Retryable"
            });
            throw new CustomError(
              resp.response.response.statusText || "Could not upload file",
              500,
              { successfulJobs, unsuccessfulJobs }
            );
          }
          stats.increment(UPLOAD_FILE, 1, {
            integration: "Marketo_bulk_upload",
            requestTime,
            fileSize,
            successfulJobs,
            unsuccessfulJobs,
            status: 500,
            state: "Retryable"
          });
          throw new CustomError(
            resp.response.response.statusText || "Error during uploading file",
            500,
            { successfulJobs, unsuccessfulJobs }
          );
        }
      }
    }
    return { successfulJobs, unsuccessfulJobs };
  } catch (err) {
    stats.increment(UPLOAD_FILE, 1, {
      integration: "Marketo_bulk_upload",
      status: err.response.status,
      errorMessage: err.message || "Error during uploading file"
    });
    throw new CustomError(
      err.message || "Error during uploading file",
      err.response.status,
      { successfulJobs, unsuccessfulJobs }
    );
  }
};

const responseHandler = async (input, config) => {
  /**
  * {
  "importId" : <some-id>,
  "pollURL" : <some-url-to-poll-status>,
}
  */
  const { importId, successfulJobs, unsuccessfulJobs } = await getImportID(
    input,
    config
  );
  if (importId) {
    const response = {};
    response.statusCode = 200;
    response.importId = importId;
    response.pollURL = "/pollStatus";
    const csvHeader = getHeaderFields(config).toString();
    response.metadata = { successfulJobs, unsuccessfulJobs, csvHeader };
    return response;
  }
  stats.increment(UPLOAD_FILE, 1, {
    integration: "Marketo_bulk_upload",
    status: 500,
    state: "Retryable"
  });
  throw new CustomError("No import id received", 500);
};
const processFileData = async event => {
  const { input, config } = event;
  const resp = await responseHandler(input, config);
  return resp;
};

module.exports = { processFileData };

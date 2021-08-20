const FormData = require("form-data");
const fs = require("fs");
const {
  getAccessToken,
  ABORTABLE_CODES,
  THROTTLED_CODES,
  MERKETO_FILE_SIZE,
  MARKETO_FILE_PATH
} = require("./util");
const { CustomError, getHashFromArray } = require("../../util");
const { send } = require("../../../adapters/network");

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

const getFileData = async (input, config) => {
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
  if (csv.length > 1) {
    const file = fs.createWriteStream(MARKETO_FILE_PATH);
    file.on("error", err => {
      throw new CustomError(err.message, 400, {
        successfulJobs,
        unsuccessfulJobs
      });
    });
    fs.appendFileSync(MARKETO_FILE_PATH, csv.join("\n"), err => {
      if (err) {
        throw new CustomError(err.message, 400, {
          successfulJobs,
          unsuccessfulJobs
        });
      }
    });
    file.end();
    const readStream = fs.createReadStream(MARKETO_FILE_PATH);
    fs.unlinkSync(MARKETO_FILE_PATH);

    return { readStream, successfulJobs, unsuccessfulJobs };
  }
  return { successfulJobs, unsuccessfulJobs };
};

const getImportID = async (input, config) => {
  const formReq = new FormData();
  const { munchkinId } = config;
  const { readStream, successfulJobs, unsuccessfulJobs } = await getFileData(
    input,
    config
  );
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
    const resp = await send(requestOptions);
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
        resp.response.data.result[0] &&
        resp.response.data.result[0].importId
      ) {
        const { importId } = resp.response.data.result[0];
        return { importId, successfulJobs, unsuccessfulJobs };
      }

      if (resp.response && resp.response.data) {
        if (
          resp.response.data.errors[0] &&
          ((resp.response.data.errors[0].code >= 1000 &&
            resp.response.data.errors[0].code <= 1077) ||
            ABORTABLE_CODES.indexOf(resp.response.data.errors[0].code))
        ) {
          if (resp.response.data.errors[0].message === "Empty file") {
            throw new CustomError(
              resp.response.data.errors[0].message || "Could not upload file",
              500,
              { successfulJobs, unsuccessfulJobs }
            );
          }
          throw new CustomError(
            resp.response.data.errors[0].message || "Could not upload file",
            400,
            { successfulJobs, unsuccessfulJobs }
          );
        } else if (THROTTLED_CODES.indexOf(resp.response.response.status)) {
          throw new CustomError(
            resp.response.response.statusText || "Could not upload file",
            429,
            { successfulJobs, unsuccessfulJobs }
          );
        }
        throw new CustomError(
          resp.response.response.statusText || "Error during uploading file",
          500,
          { successfulJobs, unsuccessfulJobs }
        );
      }
    }
  } else {
    return { successfulJobs, unsuccessfulJobs };
  }
  throw new CustomError("Error during uploading file", 400);
};

const responseHandler = async (input, config) => {
  const response = {};
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
  response.statusCode = 200;
  response.importId = importId;
  response.pollURL = "/pollStatus";
  const headerArr = getHeaderFields(config);
  response.metadata = { successfulJobs, unsuccessfulJobs, headerArr };
  return response;
};
const processFileData = async event => {
  const { input, config } = event;
  const resp = await responseHandler(input, config);
  return resp;
};

module.exports = { processFileData };

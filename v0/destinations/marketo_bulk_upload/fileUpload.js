const FormData = require("form-data");
const fs = require("fs");
const { getAccessToken, ABORTABLE_CODES, THROTTLED_CODES } = require("./util");
const { getHashFromArray, CustomError } = require("../../util");
const { send } = require("../../../adapters/network");

const getFileData = async (data, columnFields) => {
  const fieldHashmap = getHashFromArray(columnFields, "from", "to", false);
  if (Object.values(fieldHashmap).length > 0) {
    data = `${Object.values(fieldHashmap).toString()}|${data}`;
    const dataArr = data.split("|");
    try {
      const file = fs.createWriteStream("marketo_bulk_upload.csv");
      file.on("error", err => {
        throw new CustomError(err.message, 400);
      });
      dataArr.forEach(v => {
        fs.appendFileSync("marketo_bulk_upload.csv", `${v}\n`, err => {
          if (err) throw err;
        });
      });
      file.end();

      return fs.createReadStream("marketo_bulk_upload.csv");
    } catch (error) {
      throw new CustomError(error.message, 400);
    }
  }
  throw new CustomError("Header fields not present", 400);
};

const getImportID = async (data, config) => {
  const formReq = new FormData();
  const { columnFieldsMapping, munchkinId } = config;
  // create file for multipart form
  formReq.append("format", "csv");
  formReq.append(
    "file",
    await getFileData(data, columnFieldsMapping),
    "marketo_bulk_upload.csv"
  );
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
    if (resp.response && resp.response.data.success) {
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
        return resp.response.data.result[0].importId;
      }
      return resp.response;
    }
    if (resp.response && resp.response.data) {
      if (
        resp.response.data.errors[0] &&
        ((resp.response.data.errors[0].code >= 1000 &&
          resp.response.data.errors[0].code <= 1077) ||
          ABORTABLE_CODES.indexOf(resp.response.data.errors[0].code))
      ) {
        throw new CustomError(
          resp.response.data.errors[0].message || "Could not upload file",
          400
        );
      } else if (THROTTLED_CODES.indexOf(resp.response.response.status)) {
        throw new CustomError(
          resp.response.response.statusText || "Could not upload file",
          429
        );
      }
      throw new CustomError(
        resp.response.response.statusText || "Error during uploading file",
        500
      );
    }
  }
  throw new CustomError("Error during uploading file", 400);
};

const responseHandler = async (data, config) => {
  const response = {};
  /**
  * {
  "importId" : <some-id>,
  "pollURL" : <some-url-to-poll-status>,
}
  */
  response.importId = await getImportID(data, config);
  response.pollURL = "/pollStatus";
  return response;
};
const processFileData = async event => {
  const { data, config } = event;
  const resp = await responseHandler(data, config);
  return resp;
};

module.exports = { processFileData };

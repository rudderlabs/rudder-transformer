const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const { getAccessToken } = require("./util");
const { getHashFromArray } = require("../../util");

const getFileData = async (data, columnFields) => {
  const fieldHashmap = getHashFromArray(columnFields, "from", "to", false);
  data = `${Object.values(fieldHashmap).toString()}|${data}`;
  const dataArr = data.split("|");
  const file = fs.createWriteStream("marketo_bulk_upload.csv");
  file.on("error", err => {
    console.log(err);
  });
  dataArr.forEach(v => {
    fs.appendFileSync("marketo_bulk_upload.csv", `${v}\n`, err => {
      if (err) throw err;
    });
  });
  file.end();

  return fs.createReadStream("marketo_bulk_upload.csv");
};

const getImportID = async (data, config) => {
  const formReq = new FormData();
  const { columnFieldsMapping, munchkinId } = config;
  formReq.append("format", "csv");
  formReq.append(
    "file",
    await getFileData(data, columnFieldsMapping),
    "marketo_bulk_upload.csv"
  );
  formReq.append("access_token", await getAccessToken(config));

  const resp = await axios.post(
    `https://${munchkinId}.mktorest.com/bulk/v1/leads.json`,
    formReq,
    {
      headers: {
        ...formReq.getHeaders()
      }
    }
  );

  if (resp.data && resp.data.result[0] && resp.data.result[0].importId) {
    return resp.data.result[0].importId;
  }
  return null;
};

const responseHandler = async (data, config) => {
  const response = {};
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

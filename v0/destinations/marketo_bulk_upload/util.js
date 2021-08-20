const { CustomError } = require("../../util");
const { send } = require("../../../adapters/network");

const ABORTABLE_CODES = ["ENOTFOUND", "ECONNREFUSED", 603, 605, 609, 610];
const RETRYABLE_CODES = [
  "EADDRINUSE",
  "ECONNRESET",
  "ETIMEDOUT",
  713,
  601,
  602,
  604,
  611
];
const THROTTLED_CODES = [502, 606, 607, 608, 615];

const MERKETO_FILE_SIZE = 1048576;
const MARKETO_FILE_PATH = `${__dirname}/uploadFile/marketo_bulkupload.csv`;

const getMarketoFilePath = () => {
  return MARKETO_FILE_PATH;
}
// Fetch access token from client id and client secret
// DOC: https://developers.marketo.com/rest-api/authentication/
const getAccessToken = async config => {
  const { clientId, clientSecret, munchkinId } = config;
  const requestOptions = {
    url: `https://${munchkinId}.mktorest.com/identity/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    method: "get"
  };
  const resp = await send(requestOptions);
  if (resp.success) {
    if (
      resp.response &&
      resp.response.data &&
      resp.response.data.access_token
    ) {
      return resp.response.data.access_token;
    }
    throw new CustomError("Could not retrieve authorisation token", 400);
  }
  if (resp.response) {
    // handle for abortable codes
    if (
      ABORTABLE_CODES.indexOf(resp.response.code) > -1 ||
      (resp.response.code >= 400 && resp.response.code <= 499)
    ) {
      throw new CustomError(resp.response.code, 400);
    } // handle for retryable codes
    else if (RETRYABLE_CODES.indexOf(resp.response.code) > -1) {
      throw new CustomError(resp.response.code, 500);
    } // handle for abortable codes
    else if (resp.response.response) {
      if (ABORTABLE_CODES.indexOf(resp.response.response.status)) {
        throw new CustomError(
          resp.response.response.statusText ||
            "Error during fetching access token",
          400
        );
      } // handle for throttled codes
      else if (THROTTLED_CODES.indexOf(resp.response.response.status)) {
        throw new CustomError(
          resp.response.response.statusText ||
            "Error during fetching access token",
          500
        );
      }
      // Assuming none we should retry the remaining errors
      throw new CustomError(
        resp.response.response.statusText ||
          "Error during fetching access token",
        500
      );
    }
    throw new CustomError("Could not retrieve authorisation token", 400);
  }
  throw new CustomError("Could not retrieve authorisation token", 400);
};

module.exports = {
  getAccessToken,
  ABORTABLE_CODES,
  RETRYABLE_CODES,
  THROTTLED_CODES,
  MERKETO_FILE_SIZE,
  getMarketoFilePath
};

const axios = require("axios");
const { handleResponseRules } = require("./index");

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.response = { status: statusCode };
  }
}
const getAxiosResponse = async (url, params, responseRules, errorMessage) => {
  const resp = await axios.get(url, params).catch(error => {
    throw error;
  });
  resp.data = {
    requestId: "1629e#1774791e46d",
    success: false,
    errors: [{ code: "607", message: "Daily quota '50000' reached" }]
  };
  if (resp.data) {
    const { success, errors } = resp.data;
    if (success === false) {
      const getResponseCode = handleResponseRules(
        responseRules,
        errors[0].code
      );
      if (getResponseCode === 500) {
        throw new CustomError(
          `${errors[0].message}. ${errorMessage}. Retryable`,
          500
        );
      }
      if (getResponseCode === 400) {
        throw new CustomError(
          `${errors[0].message}. ${errorMessage}. Abortable`,
          400
        );
      }
    }
    return resp.data;
  }
  return null;
};
const postAxiosResponse = async (
  url,
  data,
  params,
  responseRules,
  errorMessage
) => {
  const resp = await axios.post(url, data, params).catch(error => {
    throw error;
  });
  if (resp.data) {
    const { success, errors } = resp.data;
    if (success === false) {
      const getResponseCode = handleResponseRules(
        responseRules,
        errors[0].code
      );
      if (getResponseCode === 500) {
        throw new CustomError(
          `${errors[0].message}. ${errorMessage}. Retryable`,
          500
        );
      }
      if (getResponseCode === 400) {
        throw new CustomError(
          `${errors[0].message}. ${errorMessage}. Abortable`,
          400
        );
      }
    }
    return resp.data;
  }
  return null;
};
module.exports = {
  getAxiosResponse,
  postAxiosResponse
};

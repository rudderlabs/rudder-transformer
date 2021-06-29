const axios = require("axios");
const stats = require("../../util/stats");
const { getHashFromArray } = require("./index");
const { API_CALL } = require("./constant");

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.response = { status: statusCode };
  }
}

// handle response rules
function handleResponseRules(responseRules, errorCode, url) {
  const { responseType, rules } = responseRules;
  // handle for json
  if (responseType === "JSON") {
    const abortable = getHashFromArray(
      rules.abortable,
      "errors.0.code",
      "success",
      false
    );
    const retryable = getHashFromArray(
      rules.retryable,
      "errors.0.code",
      "success",
      false
    );
    const throttled = getHashFromArray(
      rules.throttled,
      "errors.0.code",
      "success",
      false
    );
    if (abortable[errorCode] === "false") {
      stats.increment(API_CALL, 1, {
        integration: "Marketo",
        url,
        status: 400,
        state: "Abortable"
      });
      return 400;
    }
    if (retryable[errorCode] === "false") {
      stats.increment(API_CALL, 1, {
        integration: "Marketo",
        url,
        status: 500,
        state: "Retryable"
      });
      return 500;
    }
    if (throttled[errorCode] === "false") {
      stats.increment(API_CALL, 1, {
        integration: "Marketo",
        url,
        status: 429,
        state: "Throttled"
      });
      return 429;
    }
    // is there any case possible that non of the above matches? if there is what should we send?
  }
  // default to retry
  return 500;
}

const getAxiosResponse = async (url, params, responseRules, errorMessage) => {
  const resp = await axios.get(url, params).catch(error => {
    const { response } = error;
    if (response) {
      throw new CustomError(response.data, response.status);
    } else {
      throw new CustomError(error.message, 400);
    }
  });
  // resp.data = {
  //   requestId: "1629e#1774791e46d",
  //   success: false,
  //   errors: [{ code: "607", message: "Daily quota '50000' reached" }]
  // };
  if (resp.data) {
    const { success, errors } = resp.data;
    if (success === false) {
      const getResponseCode = handleResponseRules(
        responseRules,
        errors[0].code,
        url
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
      if (getResponseCode === 429) {
        throw new CustomError(
          `${errors[0].message}. ${errorMessage}. Throttled`,
          429
        );
      }
    }
    stats.increment(API_CALL, 1, {
      integration: "Marketo",
      url,
      status: 200,
      state: "Succeeded"
    });
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
    const { response } = error;
    if (response) {
      throw new CustomError(response.data, response.status);
    } else {
      throw new CustomError(error.message, 400);
    }
  });
  if (resp.data) {
    const { success, errors } = resp.data;
    if (success === false) {
      const getResponseCode = handleResponseRules(
        responseRules,
        errors[0].code,
        url
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
      if (getResponseCode === 429) {
        throw new CustomError(
          `${errors[0].message}. ${errorMessage}. Throttled`,
          429
        );
      }
    }
    stats.increment(API_CALL, 1, {
      integration: "Marketo",
      url,
      status: 200,
      state: "Succeeded"
    });
    return resp.data;
  }
  return null;
};

module.exports = {
  getAxiosResponse,
  postAxiosResponse
};

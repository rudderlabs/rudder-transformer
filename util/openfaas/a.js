const axios = require("axios");
const logger = require("../../logger");
const { RespStatusError, RetryRequestError } = require("../utils");

const OPENFAAS_GATEWAY_URL = "http://localhost:8000";

const delayInMs = async (ms = 2000) =>
  new Promise(resolve => setTimeout(resolve, ms));

const callWithRetry = async (fn, count = 0, ...args) => {
  try {
    console.log(...args);
    return await fn(...args);
  } catch (err) {
    if (count > 1) {
      throw err;
    }
    await delayInMs();
    return callWithRetry(fn, count + 1, ...args);
  }
};

const parseAxiosError = error => {
  // console.log(error);
  console.log('++++++++++++++++++++');
  if (error.response) {
    const status = error.response.status || 400;
    const errorData = error.response?.data;
    const message =
      (errorData && (errorData.message || errorData)) || error.message;
    return new RespStatusError(message, status);
  }
  if (error.request) {
    return new RetryRequestError(error.message);
  }
  return error;
};

const getFunction = async functionName => {
  try {
    console.log(functionName);
    const url = `${OPENFAAS_GATEWAY_URL}/system/function/${functionName}`;
    const res = await axios.get(url);
    logger.debug(`[Faas] Fetched ${functionName} successfully`);
    return res.data;
  } catch (err) {
    throw parseAxiosError(err);
  }
};

// const getFunction = async functionName => {
//   return new Promise((resolve, reject) => {
//     const url = `${OPENFAAS_GATEWAY_URL}/system/function/${functionName}`;
//     axios
//       .get(url)
//       .then(resp => resolve(resp.data))
//       .catch(err => reject(parseAxiosError(err)));
//   });
// };

(async function() {
  try {
    // const res = getFunction("test");
    const res = await callWithRetry(getFunction, 0, "fn-3at61jjxm49vsaixi6kcecszfcz-2gf2kiwppmilmesimpiagoug54r", "payload");
    console.log(res);
    console.log(11111);
  } catch(err) {
    console.log('***************');
    console.log(err.message, err.statusCode);
    console.log(err);
  }
})();

const axios = require('axios');
const { RespStatusError, RetryRequestError } = require('../utils');

const logger = require('../../logger');

const OPENFAAS_GATEWAY_URL = process.env.OPENFAAS_GATEWAY_URL || 'http://localhost:8080';
const OPENFAAS_GATEWAY_USERNAME = process.env.OPENFAAS_GATEWAY_USERNAME || '';
const OPENFAAS_GATEWAY_PASSWORD = process.env.OPENFAAS_GATEWAY_PASSWORD || '';

const basicAuth = {
  username: OPENFAAS_GATEWAY_USERNAME,
  password: OPENFAAS_GATEWAY_PASSWORD,
};

const parseAxiosError = (error) => {
  if (error.response) {
    const status = error.response.status || 500;
    const errorData = error.response?.data;
    const message =
      (errorData && (errorData.message || errorData.error || errorData)) || error.message;
    return new RespStatusError(message, status);
  }
  if (error.request) {
    return new RetryRequestError(error.message);
  }
  return error;
};

const deleteFunction = async (functionName) =>
  new Promise((resolve, reject) => {
    const url = `${OPENFAAS_GATEWAY_URL}/system/functions`;
    axios
      .delete(url, { data: { functionName }, auth: basicAuth })
      .then(() => resolve())
      .catch((err) => reject(parseAxiosError(err)));
  });

const getFunction = async (functionName) =>
  new Promise((resolve, reject) => {
    const url = `${OPENFAAS_GATEWAY_URL}/system/function/${functionName}`;
    axios
      .get(url, { auth: basicAuth })
      .then((resp) => resolve(resp.data))
      .catch((err) => reject(parseAxiosError(err)));
  });

const getFunctionList = async () =>
  new Promise((resolve, reject) => {
    const url = `${OPENFAAS_GATEWAY_URL}/system/functions`;
    axios
      .get(url, { auth: basicAuth })
      .then((resp) => resolve(resp.data))
      .catch((err) => reject(parseAxiosError(err)));
  });

const invokeFunction = async (functionName, payload) =>
  new Promise((resolve, reject) => {
    const url = `${OPENFAAS_GATEWAY_URL}/function/${functionName}`;
    axios
      .post(url, payload, { auth: basicAuth })
      .then((resp) => resolve(resp.data))
      .catch((err) => reject(parseAxiosError(err)));
  });

const checkFunctionHealth = async (functionName) => {
  logger.debug(`Checking function health: ${functionName}`);

  return new Promise((resolve, reject) => {
    const url = `${OPENFAAS_GATEWAY_URL}/function/${functionName}`;
    axios
      .get(
        url,
        {
          headers: { 'X-REQUEST-TYPE': 'HEALTH-CHECK' },
        },
        { auth: basicAuth },
      )
      .then((resp) => resolve(resp))
      .catch((err) => reject(parseAxiosError(err)));
  });
};

const deployFunction = async (payload) => {
  logger.debug(`Deploying function: ${payload?.name}`);

  return new Promise((resolve, reject) => {
    const url = `${OPENFAAS_GATEWAY_URL}/system/functions`;
    axios
      .post(url, payload, { auth: basicAuth })
      .then((resp) => resolve(resp.data))
      .catch((err) => {
        reject(parseAxiosError(err));
      });
  });
};

const updateFunction = async (fnName, payload) => {
  logger.debug(`Updating function: ${fnName}`);

  return new Promise((resolve, reject) => {
    const url = `${OPENFAAS_GATEWAY_URL}/system/functions`;
    axios
      .put(url, payload, { auth: basicAuth })
      .then((resp) => resolve(resp.data))
      .catch((err) => {
        reject(parseAxiosError(err));
      });
  });
};

module.exports = {
  deleteFunction,
  deployFunction,
  getFunction,
  getFunctionList,
  invokeFunction,
  checkFunctionHealth,
  updateFunction,
};

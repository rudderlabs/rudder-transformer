const axios = require('axios');
const { RespStatusError, RetryRequestError } = require('../utils');

const OPENFAAS_GATEWAY_URL = process.env.OPENFAAS_GATEWAY_URL || 'http://localhost:8080';

const parseAxiosError = (error) => {
  if (error.response) {
    const status = error.response.status || 400;
    const errorData = error.response?.data;
    const message = (errorData && (errorData.message || errorData)) || error.message;
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
      .delete(url, { data: { functionName } })
      .then(() => resolve())
      .catch((err) => reject(parseAxiosError(err)));
  });

const getFunction = async (functionName) =>
  new Promise((resolve, reject) => {
    const url = `${OPENFAAS_GATEWAY_URL}/system/function/${functionName}`;
    axios
      .get(url)
      .then((resp) => resolve(resp.data))
      .catch((err) => reject(parseAxiosError(err)));
  });

const getFunctionList = async () =>
  new Promise((resolve, reject) => {
    const url = `${OPENFAAS_GATEWAY_URL}/system/functions`;
    axios
      .get(url)
      .then((resp) => resolve(resp.data))
      .catch((err) => reject(parseAxiosError(err)));
  });

const invokeFunction = async (functionName, payload) =>
  new Promise((resolve, reject) => {
    const url = `${OPENFAAS_GATEWAY_URL}/function/${functionName}`;
    axios
      .post(url, payload)
      .then((resp) => resolve(resp.data))
      .catch((err) => reject(parseAxiosError(err)));
  });

const deployFunction = async (payload) =>
  new Promise((resolve, reject) => {
    const url = `${OPENFAAS_GATEWAY_URL}/system/functions`;
    axios
      .post(url, payload)
      .then((resp) => resolve(resp.data))
      .catch((err) => reject(parseAxiosError(err)));
  });

module.exports = {
  deleteFunction,
  deployFunction,
  getFunction,
  getFunctionList,
  invokeFunction,
};

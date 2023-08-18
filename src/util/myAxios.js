const axios = require('axios');
const stats = require('./stats');

const fireLatencyStat = (startTime, statTags) => {
  const destType = statTags.destType ? statTags.destType : '';
  const feature = statTags.feature ? statTags.feature : '';
  const endpointPath = statTags.endpointPath ? statTags.endpointPath : '';
  stats.timing('outgoing_request_latency', startTime, {
    feature,
    destType,
    endpointPath,
  });
};

const send = async (options, statTags = {}) => {
  const startTime = new Date();
  let response;
  try {
    response = await axios(options);
  } finally {
    fireLatencyStat(startTime, statTags);
  }
  return response;
};

const get = async (url, options, statTags = {}) => {
  const startTime = new Date();
  let response;
  try {
    response = await axios.get(url, options);
  } finally {
    fireLatencyStat(startTime, statTags);
  }
  return response;
};

const del = async (url, options, statTags = {}) => {
  const startTime = new Date();
  let response;
  try {
    response = await axios.delete(url, options);
  } finally {
    fireLatencyStat(startTime, statTags);
  }
  return response;
};

const post = async (url, data, options, statTags = {}) => {
  const startTime = new Date();
  let response;
  try {
    response = await axios.post(url, data, options);
  } finally {
    fireLatencyStat(startTime, statTags);
  }
  return response;
};

const put = async (url, data, options, statTags = {}) => {
  const startTime = new Date();
  let response;
  try {
    response = await axios.put(url, data, options);
  } finally {
    fireLatencyStat(startTime, statTags);
  }
  return response;
};

const patch = async (url, data, options, statTags = {}) => {
  const startTime = new Date();
  let response;
  try {
    response = await axios.patch(url, data, options);
  } finally {
    fireLatencyStat(startTime, statTags);
  }
  return response;
};

module.exports = {
  send,
  get,
  del,
  post,
  put,
  patch,
};

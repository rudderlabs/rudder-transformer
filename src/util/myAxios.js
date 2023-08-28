const {
  httpSend,
  httpGET,
  httpDELETE,
  httpPOST,
  httpPUT,
  httpPATCH,
} = require('../adapters/network');

const send = async (options, statTags = {}) => {
  const res = await httpSend(options, statTags);
  if (res.success) {
    return res.response;
  }

  throw res.response;
};

const get = async (url, options, statTags = {}) => {
  const res = await httpGET(url, options, statTags);
  if (res.success) {
    return res.response;
  }

  throw res.response;
};

const del = async (url, options, statTags = {}) => {
  const res = await httpDELETE(url, options, statTags);
  if (res.success) {
    return res.response;
  }

  throw res.response;
};

const post = async (url, data, options, statTags = {}) => {
  const res = await httpPOST(url, data, options, statTags);
  if (res.success) {
    return res.response;
  }

  throw res.response;
};

const put = async (url, data, options, statTags = {}) => {
  const res = await httpPUT(url, data, options, statTags);
  if (res.success) {
    return res.response;
  }

  throw res.response;
};

const patch = async (url, data, options, statTags = {}) => {
  const res = await httpPATCH(url, data, options, statTags);
  if (res.success) {
    return res.response;
  }

  throw res.response;
};

module.exports = {
  send,
  get,
  del,
  post,
  put,
  patch,
};

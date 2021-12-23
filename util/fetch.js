const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');
const _ = require('lodash');
const TIMEOUT = process.env.FETCH_TIMEOUT ? parseInt(process.env.FETCH_TIMEOUT, 10) : 0;

const fetchWithProxy =(url, options = {}) => {
  const instanceOptions = {
    ...options
  };

  if (!options.agent && process.env.HTTPS_PROXY) {
    instanceOptions.agent = new HttpsProxyAgent(process.env.HTTPS_PROXY);
  }

  if(_.isEmpty(instanceOptions)) {
      return fetch(url);
  } else {
      return fetch(url, instanceOptions);
  }
};

const fetchWithTimeout = async (...args) => {
  return new Promise((resolve, reject) => {
    fetch(...args).then(resolve, reject);

    if (TIMEOUT) {
      setTimeout(reject, TIMEOUT, new Error("Timeout"));
    }
  });
};

module.exports = { fetchWithProxy, fetchWithTimeout };

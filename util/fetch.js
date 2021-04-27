const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');
const _ = require('lodash')

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

exports.fetchWithProxy = fetchWithProxy;
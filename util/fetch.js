const fetch = require("node-fetch");
const HttpsProxyAgent = require("https-proxy-agent");
const _ = require("lodash");
const { RetryRequestError } = require("./utils");

const fetchWithProxy = async (url, options = {}) => {
  try {
    const instanceOptions = {
      ...options
    };

    if (!options.agent && process.env.HTTPS_PROXY) {
      instanceOptions.agent = new HttpsProxyAgent(process.env.HTTPS_PROXY);
    }

    if (_.isEmpty(instanceOptions)) {
      return await fetch(url);
    }
    return await fetch(url, instanceOptions);
  } catch (err) {
    throw new RetryRequestError(`Invalid url: ${url}`);
  }
};

exports.fetchWithProxy = fetchWithProxy;

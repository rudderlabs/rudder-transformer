const fetch = require("node-fetch");
const HttpsProxyAgent = require("https-proxy-agent");
const _ = require("lodash");
const logger = require("../logger");

const fetchWithProxy = (url, options = {}) => {
  const instanceOptions = {
    ...options
  };
  logger.debug("logging existing agent", JSON.stringify(options));
  logger.debug("fetch with proxy detecting proxy: ", process.env.HTTPS_PROXY);
  if (!options.agent && process.env.HTTPS_PROXY) {
    instanceOptions.agent = new HttpsProxyAgent(process.env.HTTPS_PROXY);
    logger.debug(
      "added proxy to instance options: ",
      JSON.stringify(instanceOptions)
    );
  }

  if (_.isEmpty(instanceOptions)) {
    return fetch(url);
  }

  return fetch(url, instanceOptions);
};

exports.fetchWithProxy = fetchWithProxy;

const fetch = require("node-fetch");
const HttpsProxyAgent = require("https-proxy-agent");
const _ = require("lodash");
const logger = require("../logger");

const skipProxy = url => {
  const domain = new URL(url).hostname;
  if (process.env.NO_PROXY) {
    const noProxyList = process.env.NO_PROXY.split(",");
    // eslint-disable-next-line no-restricted-syntax
    for (const noProxyItem of noProxyList) {
      if (domain.trim().endsWith(noProxyItem.trim())) {
        logger.info(`Skipping proxy for ${domain}`);
        return true;
      }
    }
  }
  return false;
};

const fetchWithProxy = (url, options = {}) => {
  const instanceOptions = {
    ...options
  };
  logger.info("logging existing agent", JSON.stringify(options));
  logger.info("fetch with proxy detecting proxy: ", process.env.HTTPS_PROXY);
  if (!options.agent && !skipProxy(url) && process.env.HTTPS_PROXY) {
    instanceOptions.agent = new HttpsProxyAgent(process.env.HTTPS_PROXY);
    logger.info(
      "added proxy to instance options: ",
      JSON.stringify(instanceOptions)
    );
  }

  if (_.isEmpty(instanceOptions)) {
    return fetch(url);
  }

  return fetch(url, instanceOptions);
};

module.exports = {
  fetchWithProxy,
  skipProxy
};

const uaParser = require('ua-parser-js');
const { removeUndefinedAndNullValues } = require('../../util');

const getUAInfo = (message) => {
  const ua = uaParser(message.context?.userAgent);
  return removeUndefinedAndNullValues({
    browser: ua.browser?.name,
    browser_version: ua.browser?.version,
    os: ua.os?.name,
    device: ua.device?.model,
  });
};

module.exports = { getUAInfo };

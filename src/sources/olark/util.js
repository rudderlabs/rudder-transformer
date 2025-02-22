/**
 * @param {Object} browserInfo
 * @return the browser name and version
 */
const getBrowserInfo = (browserInfo) => {
  const browserInfoArray = browserInfo.split(' ');
  const browserVersion = browserInfoArray.slice(-1).join(' ');
  browserInfoArray.pop();
  const browserName = browserInfoArray.join(' ');
  return { name: browserName, version: browserVersion };
};

module.exports = { getBrowserInfo };

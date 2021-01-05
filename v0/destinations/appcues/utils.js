const get = require("get-value");

function utcTimeToEpoch(d) {
  var date = new Date(d);
  return (date.getTime() - date.getMilliseconds()) / 1000;
}

module.exports = {
  utcTimeToEpoch
};
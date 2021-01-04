const get = require("get-value");

function utcTimeToEpoch(d) {
  var date = new Date(d);
  return (date.getTime() - date.getMilliseconds()) / 1000;
}

function removeEmptyUndefinedandNullValues(inputObject) {
  let outputObject = {};

  Object.keys(inputObject).forEach(key => {
    let value = get(inputObject, key);
    if (!!value) {
      outputObject[key] = value;
    }
  });

  return outputObject;
}

module.exports = {
  utcTimeToEpoch,
  removeEmptyUndefinedandNullValues
};
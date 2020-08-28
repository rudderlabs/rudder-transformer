const v0 = require("./v0/util");
const v1 = require("./v1/util");

const isObject = value => {
  const type = typeof value;
  return (
    value != null &&
    (type === "object" || type === "function") &&
    !Array.isArray(value)
  );
};

// https://www.myintervals.com/blog/2009/05/20/iso-8601-date-validation-that-doesnt-suck/
// make sure to disable prettier for regex expression
// prettier-ignore
const timestampRegex = new RegExp(
  // eslint-disable-next-line no-useless-escape
  /^([\+-]?\d{4})((-)((0[1-9]|1[0-2])(-([12]\d|0[1-9]|3[01])))([T\s]((([01]\d|2[0-3])((:)[0-5]\d))([\:]\d+)?)?(:[0-5]\d([\.]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)$/
);

function validTimestamp(input) {
  return timestampRegex.test(input);
}

function getVersionedUtils(schemaVersion) {
  switch (schemaVersion) {
    case "v0":
      return v0;
    case "v1":
      return v1;
    default:
      return v1;
  }
}

module.exports = {
  isObject,
  timestampRegex,
  validTimestamp,
  getVersionedUtils
};

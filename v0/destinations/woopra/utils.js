const { set } = require("lodash");
const { getBrowserInfo } = require("../../util");
/**
 *
 * @param {*} object
 * concatenates only values of the object
 * @returns the concatenated string
 */
const mergeObjectValues = object => {
  let res;
  Object.keys(object).forEach(v => {
    if (object[v]) {
      res.concat(object[v], " ");
    }
  });
  return res;
};

/**
 * it adds the field requiring some manipulation to the payload
 * @param {*} message
 * @param {*} payload
 */
const refinePayload = (message, payload) => {
  const app = message.context?.app?.name + message.context?.app?.build;
  const browser = mergeObjectValues(getBrowserInfo(message.context.userAgent));
  set(payload, "app", app);
  set(payload, "browser", browser);
};
module.exports = { refinePayload };

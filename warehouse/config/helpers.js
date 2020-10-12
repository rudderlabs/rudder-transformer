const _ = require("lodash");
const get = require("get-value");

const isNull = x => {
  return x === null || x === undefined;
};

const isBlank = value => {
  return _.isEmpty(_.toString(value));
};

const coalesce = (message, props) => {
  for (let index = 0; index < props.length; index += 1) {
    if (!isBlank(get(message, props[index]))) {
      return get(message, props[index]);
    }
  }
  return get(message, props[props.length - 1]);
};

module.exports = {
  isNull,
  coalesce
};

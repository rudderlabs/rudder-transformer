const _ = require("lodash");
const get = require("get-value");

const isNull = x => {
  return x === null || x === undefined;
};

const isBlank = value => {
  return _.isEmpty(_.toString(value));
};

const getFirstValidValue = (message, props) => {
  let currVal = null;
  for (let index = 0; index < props.length; index += 1) {
    currVal = get(message, props[index]);
    if (!isBlank(currVal)) {
      break;
    }
  }

  return currVal;
};

module.exports = {
  isNull,
  getFirstValidValue
};

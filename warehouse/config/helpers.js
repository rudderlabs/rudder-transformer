const get = require("get-value");

const isNull = x => {
  return x === null || x === undefined;
};

const coalesce = (message, props) => {
  return props.reduce(
    (accumulator, current) =>
      isNull(accumulator) ? get(message, current) : accumulator,
    null
  );
};

module.exports = {
  isNull,
  coalesce
};

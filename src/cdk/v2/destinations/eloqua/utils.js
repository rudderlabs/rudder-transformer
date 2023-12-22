const stringifyValues = (data) => {
  const output = data;
  Object.keys(output).forEach((key) => {
    if (typeof output[key] !== 'string') {
      output[key] = JSON.stringify(output[key]);
    }
  });
  return output;
};
module.exports = {
  stringifyValues,
};

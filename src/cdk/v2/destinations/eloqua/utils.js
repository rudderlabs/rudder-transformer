const stringifyValues = (data) => {
  Object.keys(data).forEach((key) => {
    if (typeof data[key] !== 'string') {
      data[key] = JSON.stringify(data[key]);
    }
  });
  return data;
};
module.exports = {
  stringifyValues,
};

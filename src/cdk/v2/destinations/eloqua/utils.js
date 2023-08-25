// transform webapp dynamicForm custom floodlight variable
// into {property1: u1, property2: u2, ...}
// Ref - https://support.google.com/campaignmanager/answer/2823222?hl=en
const stringifyValues = (data) => {
  Object.keys(data).forEach((key) => {
    data[key] = JSON.stringify(data[key]);
  });
  return data;
};
module.exports = {
  stringifyValues,
};

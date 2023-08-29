const { ACTION_TYPES } = require('./config');

const prepareIdentifiersList = (listData, identifier) => {
  const list = {};
  const processList = (actionData) =>
    actionData
      .filter((item) => item.hasOwnProperty(identifier))
      .map((item) => ({ id: item[identifier] }));
  ACTION_TYPES.forEach((action) => {
    list[action] = listData[action] ? processList(listData[action]) : [];
  });
  return list;
};

module.exports = { prepareIdentifiersList };

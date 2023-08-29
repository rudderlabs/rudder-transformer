const { ACTION_TYPES } = require('./config');

/**
 * Prepares a list of identifiers based on the provided data and identifier key.
 * @param {*} listData The data containing lists of members to be added or removed from the audience.
 * @param {*} identifier The unique identifier key for each member. For example, email.
 * @returns
 * {
      "add": [
          {
          "id": "test@gmail.com"
          }
      ],
      "remove": []
   }
 */
const prepareIdentifiersList = (listData, identifier) => {
  const list = {};
  const processList = (actionData) =>
    actionData
      .filter((member) => member.hasOwnProperty(identifier))
      .map((member) => ({ id: member[identifier] }));
  ACTION_TYPES.forEach((action) => {
    list[action] = listData[action] ? processList(listData[action]) : [];
  });
  return list;
};

module.exports = { prepareIdentifiersList };

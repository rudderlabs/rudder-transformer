const { ACTION_TYPES, IDENTIFIER_KEY } = require('./config');

/**
 * Prepares a list of identifiers based on the provided data and identifier key.
 * @param {*} listData The data containing lists of members to be added or removed from the audience.
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
const prepareIdentifiersList = (listData) => {
  const list = {};
  const processList = (actionData) =>
    actionData
      .filter((member) => member.hasOwnProperty(IDENTIFIER_KEY))
      .map((member) => ({ id: member[IDENTIFIER_KEY] }));
  ACTION_TYPES.forEach((action) => {
    list[action] = listData[action] ? processList(listData[action]) : [];
  });
  return list;
};

module.exports = { prepareIdentifiersList };

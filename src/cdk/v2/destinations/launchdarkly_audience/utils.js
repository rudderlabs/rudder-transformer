const lodash = require('lodash');
const { ACTION_TYPES, IDENTIFIER_KEY, MAX_IDENTIFIERS } = require('./config');

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
      .filter((member) => member.hasOwnProperty(IDENTIFIER_KEY) && member[IDENTIFIER_KEY])
      .map((member) => ({ id: member[IDENTIFIER_KEY] }));
  ACTION_TYPES.forEach((action) => {
    list[action] = listData?.[action] ? processList(listData[action]) : [];
  });
  return list;
};

/**
 * Batch the identifiers list based on the maximum number of identifiers allowed per request.
 * @param {*} listData The data containing lists of members to be added or removed from the audience.
 * @returns
 * For MAX_IDENTIFIERS = 2 
 * [
      {
        "add": [
          {
            "id": "test1@gmail.com"
          }
        ],
        "remove": [
          {
            "id": "test2@gmail.com"
          }
        ]
      },
      {
        "add": [
          {
            "id": "test3@gmail.com"
          }
        ],
        "remove": []
      }
   ]
 */
const batchIdentifiersList = (listData) => {
  const audienceList = prepareIdentifiersList(listData);
  const combinedList = [
    ...audienceList.add.map((item) => ({ ...item, type: 'add' })),
    ...audienceList.remove.map((item) => ({ ...item, type: 'remove' })),
  ];

  const chunkedData = lodash.chunk(combinedList, MAX_IDENTIFIERS);

  // Group the chunks by action type (add/remove)
  const groupedData = chunkedData.map((chunk) => {
    const groupedChunk = {
      add: [],
      remove: [],
    };

    chunk.forEach((item) => {
      if (item.type === 'add') {
        groupedChunk.add.push({ id: item.id });
      } else if (item.type === 'remove') {
        groupedChunk.remove.push({ id: item.id });
      }
    });

    return groupedChunk;
  });

  return groupedData;
};

module.exports = { prepareIdentifiersList, batchIdentifiersList };

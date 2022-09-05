const { httpPOST } = require("../../../adapters/network");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const { CustomError } = require("../../util");

const getGroupId = (groupTitle, board) => {
  const { groups } = board?.boards[0];
  let groupId;
  groups.forEach(group => {
    if (group.title === groupTitle) {
      groupId = group.id;
    }
  });
  if (groupId) {
    return groupId;
  }
  throw new CustomError(`Group ${groupTitle} doesn't exist in the board`, 400);
};

const getColumnId = (columnTitle, board) => {
  const { columns } = board?.boards[0];
  let columnId;
  columns.forEach(column => {
    if (column.title === columnTitle) {
      columnId = column.id;
    }
  });
  if (columnId) {
    return columnId;
  }
  throw new CustomError(
    `Column ${columnTitle} doesn't exist in the board`,
    400
  );
};

//   const columnValues = JSON.stringify({
//     status: { index: 1 },
//     date4: { date: "2021-01-01" },
//     person: { personsAndTeams: [{ id: 9603417, kind: "person" }] }
//   });
const mapColumnValues = (properties, columnToPropertyMapping, board) => {
  const columnValues = {};
  columnToPropertyMapping.forEach(mapping => {
    columnValues[getColumnId(mapping.from, board)] = properties[mapping.to];
  });
  return JSON.stringify(columnValues);
};

const getBoardDetails = async (url, boardID, apiToken) => {
  const clientResponse = await httpPOST(
    url,
    {
      query: `query { boards (ids: ${boardID}) { name, columns {id title type description settings_str}, groups {id title} }}`
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${apiToken}`
      }
    }
  );
  const processedResponse = processAxiosResponse(clientResponse);
  return processedResponse;
};

const populatePayload = (message, Config, processedResponse) => {
  const { boardId, groupTitle, columnToPropertyMapping } = Config;
  const payload = {};
  if (processedResponse.status === 200) {
    const columnValues = mapColumnValues(
      message.properties,
      columnToPropertyMapping,
      processedResponse.response?.data
    );
    if (groupTitle) {
      const groupId = getGroupId(groupTitle, processedResponse.response?.data);
      payload.query = `mutation { create_item (board_id: ${boardId}, group_id: ${groupId} item_name: "default", column_values: ${JSON.stringify(
        columnValues
      )}) {id}}`;
    } else {
      payload.query = `mutation { create_item (board_id: ${boardId},  item_name: "default", column_values: ${JSON.stringify(
        columnValues
      )}) {id}}`;
    }
  }
  return payload;
};

module.exports = {
  getBoardDetails,
  populatePayload
};

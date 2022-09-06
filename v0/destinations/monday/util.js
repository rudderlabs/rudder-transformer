const { isNumber } = require("lodash");
const { httpPOST } = require("../../../adapters/network");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const { CustomError, getDestinationExternalID } = require("../../util");

/**
 * This function is taking the board(received from the lookup call) and groupTitle as parameter
 * and returning the groupId.
 * @param {*} groupTitle
 * @param {*} board
 * @returns
 */
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

/**
 * This function is taking the board(received from the lookup call) and columnTitle as parameter
 * and returning the columnId.
 * @param {*} columnTitle
 * @param {*} board
 * @returns
 */
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

/**
 * This function is used to get the ColumnValue for a particular columnId
 * @param {*} properties - this is {message.properties} of the input payload
 * @param {*} columnName - The columnName from the web-app mapping that needs to be updated
 * @param {*} key - key from the web-app the user has mapped the columnName to.
 * @param {*} board - boardData from the lookup call
 * @returns
 */
const getColumnValue = (properties, columnName, key, board) => {
  const { columns } = board?.boards[0];
  let columnValue;
  columns.forEach(column => {
    if (column.title === columnName && properties[key]) {
      switch (column.type) {
        case "color":
          columnValue = { label: properties[key] };
          break;
        case "boolean":
          columnValue = { checked: true };
          break;
        case "numeric":
          if (isNumber(parseInt(properties[key], 10))) {
            columnValue = properties[key];
          }
          break;
        case "text":
          columnValue = properties[key];

          break;
        case "country":
          if (properties.countryCode) {
            columnValue = {
              countryName: properties[key],
              countryCode: properties.countryCode
            };
          }
          break;
        case "email":
          columnValue = {
            email: properties[key],
            text: properties.emailText
          };
          if (!columnValue.text) {
            columnValue.text = columnValue.email;
          }
          break;
        case "location":
          if (
            properties.latitude &&
            properties.longitude &&
            parseFloat(properties.latitude) < 90.0 &&
            parseFloat(properties.latitude) >= -90.0 &&
            parseFloat(properties.longitude) < 180.0 &&
            parseFloat(properties.longitude) >= -180.0
          )
            columnValue = {
              address: properties[key],
              lat: properties.latitude,
              lng: properties.longitude
            };
          break;
        case "phone":
          if (properties[key] && properties?.countryShortName) {
            columnValue = {
              phone: properties[key],
              countryShortName: properties.countryShortName
            };
          }
          break;
        case "rating":
          if (isNumber(parseInt(properties[key], 10))) {
            columnValue = parseInt(properties[key], 10);
          }
          break;
        case "link":
          columnValue = { url: properties[key], text: properties.linkText };
          if (!columnValue.text) {
            columnValue.text = columnValue.url;
          }
          break;
        case "long-text":
          columnValue = { text: properties[key] };
          break;
        case "timezone":
          columnValue = { timezone: properties[key] };
          break;
        default:
      }
    }
  });
  return columnValue;
};

/**
 * This function is used to map all the columnValues that in the item to be created.
 * eg. output - columnValues = {
 *   status: { label: Done },
 *   checkbox: { checked: "true" }
 * }
 * @param {*} properties
 * @param {*} columnToPropertyMapping
 * @param {*} board
 * @returns
 */
const mapColumnValues = (properties, columnToPropertyMapping, board) => {
  const columnValues = {};
  columnToPropertyMapping.forEach(mapping => {
    columnValues[getColumnId(mapping.from, board)] = getColumnValue(
      properties,
      mapping.from,
      mapping.to,
      board
    );
  });
  return JSON.stringify(columnValues);
};

/**
 * This function is used to do the lookup call to get the board Details using the board Id.
 * @param {*} url
 * @param {*} boardID
 * @param {*} apiToken
 * @returns
 */
const getBoardDetails = async (url, boardID, apiToken) => {
  const clientResponse = await httpPOST(
    url,
    {
      query: `query { boards (ids: ${boardID}) { name, columns {id title type settings_str}, groups {id title} }}`
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${apiToken}`
      }
    }
  );
  const boardDeatailsResponse = processAxiosResponse(clientResponse);
  if (boardDeatailsResponse.status !== 200) {
    throw new CustomError(
      `The lookup call could not be completed with the error:
      ${JSON.stringify(boardDeatailsResponse.response)}`, // Recheck this
      boardDeatailsResponse.status
    );
  }
  return boardDeatailsResponse;
};

/**
 * This function is used to populate the final payload to be sent to the destination.
 * @param {*} message
 * @param {*} Config
 * @param {*} boardDeatailsResponse
 * @returns
 */
const populatePayload = (message, Config, boardDeatailsResponse) => {
  const { groupTitle, columnToPropertyMapping } = Config;
  const payload = {};
  let boardId = getDestinationExternalID(message, "boardId");
  if (!boardId) {
    boardId = Config.boardId;
  }

  const columnValues = mapColumnValues(
    message.properties,
    columnToPropertyMapping,
    boardDeatailsResponse.response?.data
  );
  if (groupTitle) {
    if (!message.properties?.name) {
      throw new CustomError(`Item name is required to create an item`, 400);
    }
    const groupId = getGroupId(
      groupTitle,
      boardDeatailsResponse.response?.data
    );
    payload.query = `mutation { create_item (board_id: ${boardId}, group_id: ${groupId} item_name: ${JSON.stringify(
      message.properties?.name
    )}, column_values: ${JSON.stringify(columnValues)}) {id}}`;
  } else {
    payload.query = `mutation { create_item (board_id: ${boardId},  item_name: ${JSON.stringify(
      message.properties?.name
    )}, column_values: ${JSON.stringify(columnValues)}) {id}}`;
  }
  return payload;
};

const checkAllowedEventNameFromUI = (event, Config) => {
  const { whitelistedEvents } = Config;
  let allowEvent;
  if (whitelistedEvents && whitelistedEvents.length > 0) {
    allowEvent = whitelistedEvents.some(
      whiteListedEvent =>
        whiteListedEvent.eventName.toLowerCase() === event.toLowerCase()
    );
  }
  return !!allowEvent;
};

module.exports = {
  getBoardDetails,
  populatePayload,
  checkAllowedEventNameFromUI
};

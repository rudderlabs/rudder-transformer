const get = require("get-value");
const { EventType } = require("../../../constants");
const { ENDPOINT } = require("./config");
const {
  defaultRequestConfig,
  defaultPostRequestConfig,
  removeUndefinedAndNullValues,
  CustomError,
  getErrorRespEvents,
  getSuccessRespEvents
} = require("../../util");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const { httpPOST } = require("../../../adapters/network");

const responseBuilder = (payload, endpoint, apiToken) => {
  if (payload) {
    const response = defaultRequestConfig();
    response.endpoint = endpoint;
    response.headers = {
      "Content-Type": "application/json",
      Authorization: `${apiToken}`
    };
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = removeUndefinedAndNullValues(payload);
    return response;
  }
  throw new CustomError(
    "Payload could not be populated due to wrong input",
    400
  );
};

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

/**
 * This function is used to build the response for track call.
 * @param {*} message
 * @param {*} param1
 * @returns
 */
const trackResponseBuilder = async (message, { Config }) => {
  const { apiToken, boardId, groupTitle, columnToPropertyMapping } = Config;
  const event = get(message, "event");
  const endpoint = ENDPOINT;
  if (!event) {
    throw new CustomError(
      "[Monday]: event is not present in the input payloads",
      400
    );
  }
  const payload = {};
  const getBoardDetails = async (url, boardID) => {
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
  const processedResponse = await getBoardDetails(endpoint, boardId);
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
    return responseBuilder(payload, endpoint, apiToken);
  }
};

const processEvent = async (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  if (!destination.Config.apiToken) {
    throw new CustomError("[Monday]: apiToken is a required field", 400);
  }
  if (!destination.Config.boardId) {
    throw new CustomError("[Monday]: boardId is a required field", 400);
  }
  const messageType = message.type.toLowerCase();
  let response;
  switch (messageType) {
    case EventType.TRACK:
      response = await trackResponseBuilder(message, destination);
      break;
    default:
      throw new CustomError(`Message type ${messageType} not supported`, 400);
  }
  return response;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = inputs => {
  if (!Array.isArray(inputs) || inputs.length === 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const respList = Promise.all(
    inputs.map(async input => {
      try {
        const message = input.message.statusCode
          ? input.message
          : process(input);
        return getSuccessRespEvents(
          message,
          [input.metadata],
          input.destination
        );
      } catch (error) {
        return getErrorRespEvents(
          [input.metadata],
          error.response
            ? error.response.status
            : error.code
            ? error.code
            : 400,
          error.message || "Error occurred while processing payload."
        );
      }
    })
  );
  return respList;
};

module.exports = { process, processRouterDest };

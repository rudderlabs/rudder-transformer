const {
  getHashFromArray,
  getFieldValueFromMessage,
  getSuccessRespEvents,
  getErrorRespEvents,
  CustomError,
  marketoBulkUploadRequestConfig
} = require("../../util");
const { EventType } = require("../../../constants");

function responseBuilderSimple(message, destination) {
  const payload = {};

  /**     
  * "columnFieldsMapping": [
    {
        "from": "marketoColumnName",
        "to": "traitsName"
    },
    {
        "from": "firstName",
        "to": "name"
    }
]
*/
  const fieldHashmap = getHashFromArray(
    destination.Config.columnFieldsMapping,
    "from",
    "to",
    false
  );

  const traits = getFieldValueFromMessage(message, "traits");

  // columnNames with trait's values from rudder payload
  Object.keys(fieldHashmap).forEach(key => {
    const val = traits[fieldHashmap[key]];
    if (val) {
      payload[key] = val;
    }
  });

  const response = marketoBulkUploadRequestConfig();
  // Take only values to create each row to be sent to server
  const payloadValues = Object.values(payload);
  // Format to send "value1,value2,value3"
  response.body.CSVRow = payloadValues.toString();
  return response;
}

const processEvent = (message, destination) => {
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }

  const messageType = message.type.toLowerCase();
  let response;
  // Only identify type of events are processed
  switch (messageType) {
    case EventType.IDENTIFY:
      response = responseBuilderSimple(message, destination);
      break;
    default:
      throw new CustomError("Message type not supported", 400);
  }

  return response;
};
const process = event => {
  return processEvent(event.message, event.destination);
};

const processRouterDest = async inputs => {
  if (!Array.isArray(inputs) || inputs.length <= 0) {
    const respEvents = getErrorRespEvents(null, 400, "Invalid event array");
    return [respEvents];
  }

  const respList = await Promise.all(
    inputs.map(async input => {
      try {
        if (input.message.statusCode) {
          // already transformed event
          return getSuccessRespEvents(
            input.message,
            [input.metadata],
            input.destination
          );
        }
        // if not transformed
        return getSuccessRespEvents(
          await process(input),
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

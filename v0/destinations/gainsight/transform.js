const get = require('get-value');
const { EventType } = require("../../../constants");
const { identifyMapping } = require("./config");

const identifyResponseBuilder = (message, { Config }) => {
  
};


const process = event => {
  const { message, destination } = event;
  const messageType = get(message, "type")
    .toLowerCase()
    .trim();

  let response;
  switch (messageType) {
    case EventType.IDENTIFY:
      response = identifyResponseBuilder(message, destination);
      break;
    case EventType.GROUP:
      // group method
      break;
    default:
      throw new Error("message type not supported");
  }
  return response;
};

exports.process = process;

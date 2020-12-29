const _ = require("lodash");
const Message = require("../message");

const { removeUndefinedAndNullValues } = require("../../util");

function processEvent(event) {
  const messageType = "track";

  if (event.event_name) {
    const eventName = event.event_name;
    const message = new Message(`Appsflyer`);

    message.setEventType(messageType);

    //const eventName = eventNameMap[eventType] || eventType;
    message.setEventName(eventName);

    if (event.event_time) {
      message.setProperty("originalTimestamp", event.event_time);
    }

    const properties = {...event};
    message.setProperty("properties", properties);

    if (event.customer_user_id) {
      message.userId = event.customer_user_id;
    }

    if (message.userId && message.userId !== "") {
      return message;
    }
    return null;
  }
  throw new Error("Unknwon event type from Auth0");
}

function process(event) {
  //console.log(JSON.stringify(event));
  /* events.forEach(event => {
    try {
      const resp = processEvent(event);
      if (resp) {
        responses.push(removeUndefinedAndNullValues(resp));
      }
    } catch (error) {
      // TODO: figure out a way to handle partial failures within batch
      // responses.push({
      //   statusCode: 400,
      //   error: error.message || "Unknwon error"
      // });
    }
  });
  if (responses.length === 0) {
    throw new Error("All requests in the batch failed");
  } else {
    return responses;
  } */
  const response = processEvent(event);
  const returnValue = removeUndefinedAndNullValues(response);
  console.log(JSON.stringify(returnValue));
  return returnValue;
}

exports.process = process;

const Message = require("../message");

const { removeUndefinedAndNullValues } = require("../../util");

function processEvent(event) {
  const messageType = "track";

  if (event.event_name) {
    const eventName = event.event_name;
    const message = new Message(`Appsflyer`);

    message.setEventType(messageType);

    message.setEventName(eventName);

    if (event.event_time) {
      message.setProperty("originalTimestamp", event.event_time);
      message.setProperty("timestamp", event.event_time);
    }

    const properties = { ...event };
    message.setProperty("properties", properties);

    if (event.customer_user_id) {
      message.userId = event.customer_user_id;
    }

    if (message.userId && message.userId !== "") {
      return message;
    }
    return null;
  }
  throw new Error("Unknwon event type from Appsflyer");
}

function process(event) {
  let returnValue = {};
  try {
    const response = processEvent(event);
    returnValue = removeUndefinedAndNullValues(response);
  } catch (error) {
    returnValue = {
      statusCode: 400,
      error: error.message || "Unknwon error"
    };
  }
  return returnValue;
}

exports.process = process;

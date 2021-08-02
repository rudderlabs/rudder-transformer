const { removeUndefinedAndNullValues, generateUUID } = require("../../util");

function processEvent(events) {
  const payload = {
    type: "track",
    event: "custom_source_event",
    properties: events,
    anonymousId: generateUUID()
  };
  return payload;
}

function process(event) {
  const response = processEvent(event);
  return removeUndefinedAndNullValues(response);
}

exports.process = process;

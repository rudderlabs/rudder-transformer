const { EventType } = require("../../../constants");
const { getFieldValueFromMessage, flattenJson } = require("../../util");

const getPropertyParams = message => {
  if (message.type === EventType.IDENTIFY) {
    return flattenJson(getFieldValueFromMessage(message, "traits"));
  }
  return flattenJson(message.properties);
};

module.exports = {
  getPropertyParams
};

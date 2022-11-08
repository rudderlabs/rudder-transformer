const ErrorBuilder = require("../../util/error");

/**
 * Verifies whether the input payload is in right format or not
 * @param {Object} message
 * @returns
 */
const validatePayload = message => {
  if (!message.type) {
    throw new ErrorBuilder()
      .setMessage(
        "[snapchat_custom_audience]::Message Type is not present. Aborting message."
      )
      .setStatus(400)
      .build();
  }
  if (!message.properties) {
    throw new ErrorBuilder()
      .setMessage(
        "[snapchat_custom_audience]::Message properties is not present. Aborting message."
      )
      .setStatus(400)
      .build();
  }
  if (!message.properties.listData) {
    throw new ErrorBuilder()
      .setMessage(
        "[snapchat_custom_audience]::listData is not present inside properties. Aborting message."
      )
      .setStatus(400)
      .build();
  }
  if (message.type.toLowerCase() !== "audiencelist") {
    throw new ErrorBuilder()
      .setMessage(
        `[snapchat_custom_audience]::Message Type ${message.type} not supported.`
      )
      .setStatus(400)
      .build();
  }
  if (!message.properties.listData.add && !message.properties.listData.remove) {
    throw new ErrorBuilder()
      .setMessage(
        "[snapchat_custom_audience]::Neither 'add' nor 'remove' property is present inside 'listData'. Aborting message."
      )
      .setStatus(400)
      .build();
  }
};

const validateFields = (schema, data) => {
  // if required field is not present in all the cases
  if (data[0].length === 0) {
    throw new ErrorBuilder()
      .setMessage(
        `[snapchat_custom_audience]::${schema} is required for the chosen schema.`
      )
      .setStatus(400)
      .build();
  }
};

module.exports = { validatePayload, validateFields };

const { EVENT_REGEX } = require("./config");

const UNSUPPORTED_ERROR_MESSAGE =
  "event property not supported, ref:https://apidocs.kustomer.com/#fe1b29a6-7f3c-40a7-8f54-973ecd0335e8";

const eventNameValidate = RegExp(EVENT_REGEX.EVENT);
const numVadiate = RegExp(EVENT_REGEX.NUMBER);
const stringValidate = RegExp(EVENT_REGEX.STRING);
const dateTimeValidate = RegExp(EVENT_REGEX.DATE_TIME);

const validateEvent = event => {
  const { name, meta } = event;
  if (!eventNameValidate.test(name)) {
    throw new Error("Invalid Event name provided");
  }
  Object.keys(meta).map(key => {
    switch (typeof meta[key]) {
      case "string":
        if (!dateTimeValidate.test(key) && !stringValidate.test(key)) {
          throw new Error(`Property: ${key}, ${UNSUPPORTED_ERROR_MESSAGE}`);
        }
        break;
      case "number":
        if (!numVadiate.test(key)) {
          throw new Error(`Property: ${key}, ${UNSUPPORTED_ERROR_MESSAGE}`);
        }
        break;
      default:
        throw new Error(`Property: ${key}, ${UNSUPPORTED_ERROR_MESSAGE}`);
    }
  });
};

module.exports = {
  validateEvent
};

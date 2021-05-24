const axios = require("axios");
const { BASE_ENDPOINT } = require("./config");

// const UNSUPPORTED_ERROR_MESSAGE =
//   "event property not supported, ref:https://apidocs.kustomer.com/#fe1b29a6-7f3c-40a7-8f54-973ecd0335e8";

// const eventNameValidate = RegExp(EVENT_REGEX.EVENT);
// const numVadiate = RegExp(EVENT_REGEX.NUMBER);
// const stringValidate = RegExp(EVENT_REGEX.STRING);
// const dateTimeValidate = RegExp(EVENT_REGEX.DATE_TIME);

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.response = { status: statusCode };
  }
}

// A validation function responsible for validating
// various parameters of an event payload based on
// which type of data they are storing.
// -------------------------------------------------
// Ref: https://apidocs.kustomer.com/#fe1b29a6-7f3c-40a7-8f54-973ecd0335e8
/*
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
*/
const handleResponse = response => {
  const { status, data } = response;
  switch (status) {
    case 200:
      if (data && data.data && data.data.id) {
        return {
          userExists: true,
          targetUrl: `${BASE_ENDPOINT}/v1/customers/${data.data.id}?replace=false`
        };
      }
      throw new CustomError(
        `Error while lookingUp Kustomer ${
          data.data ? JSON.stringify(data.data) : ""
        }`,
        400
      );
    case 404:
      return { userExists: false };
    default:
      throw new CustomError(
        data ? JSON.stringify(data) : "Error while lookingUp Kustomer",
        status || 400
      );
  }
};

const fetchKustomer = async (url, destination) => {
  let response;
  try {
    response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${destination.Config.apiKey}`
      }
    });
  } catch (err) {
    if (err.response) {
      return handleResponse(err.response);
    }
    throw new CustomError(err.message, 400);
  }
  return handleResponse(response);
};

module.exports = {
  fetchKustomer,
  CustomError
};

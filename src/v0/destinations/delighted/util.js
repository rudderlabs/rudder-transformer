const axios = require("axios");
const { getDynamicErrorType } = require("../../../adapters/utils/networkUtils");
const { getValueFromMessage } = require("../../util");
const {
  NetworkInstrumentationError,
  AbortedError,
  RetryableError,
  InstrumentationError,
  NetworkError
} = require("../../util/errorTypes");
const { ENDPOINT } = require("./config");
const tags = require("../../util/tags");

const isValidEmail = email => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
const isValidPhone = phone => {
  const phoneformat = /^\+[1-9]\d{10,14}$/;
  return phoneformat.test(String(phone));
};

const isValidUserIdOrError = (channel, userId) => {
  if (channel === "email") {
    if (!isValidEmail(userId)) {
      throw new InstrumentationError(
        "Channel is set to email. Enter correct email."
      );
    }
  } else if (channel === "sms") {
    if (!isValidPhone(userId)) {
      throw new InstrumentationError(
        "Channel is set to sms. Enter correct phone number i.e. E.164"
      );
    }
  } else {
    throw new InstrumentationError("Invalid Channel type");
  }

  return {
    userIdType: channel === "sms" ? "phone_number" : "email",
    userIdValue: userId
  };
};

const userValidity = async (channel, Config, userId) => {
  const paramsdata = {};
  if (channel === "email") {
    paramsdata.email = userId;
  } else if (channel === "sms") {
    paramsdata.phone_number = userId;
  }

  const basicAuth = Buffer.from(Config.apiKey).toString("base64");
  let response;
  try {
    response = await axios.get(`${ENDPOINT}`, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json"
      },
      params: paramsdata
    });
    if (
      response &&
      response.data &&
      response.status === 200 &&
      Array.isArray(response.data)
    ) {
      return response.data.length !== 0;
    }
    throw new NetworkInstrumentationError("Invalid response");
  } catch (error) {
    let errMsg = "";
    let errStatus = 400;
    if (error.response && error.response.data) {
      errMsg = JSON.stringify(error.response.data);
      switch (error.response.status) {
        case 422:
        case 401:
        case 406:
        case 403:
          errStatus = 400;
          break;
        case 500:
        case 503:
          errStatus = 500;
          break;
        default:
          errStatus = 400;
      }
    }
    throw new NetworkError(
      `Error occurred while checking user : ${errMsg}`,
      errStatus,
      {
        [tags.TAG_NAMES.ERROR_TYPE]: getDynamicErrorType(errStatus)
      }
    );
  }
};
const eventValidity = (Config, message) => {
  const event = getValueFromMessage(message, "event");
  if (!event) {
    throw new InstrumentationError("No event found.");
  }
  let flag = false;
  Config.eventNamesSettings.forEach(eventName => {
    if (eventName.event && eventName.event.trim().length !== 0) {
      if (eventName.event.trim().toLowerCase() === event.toLowerCase()) {
        flag = true;
      }
    }
  });
  return flag;
};

module.exports = {
  isValidUserIdOrError,
  eventValidity,
  userValidity,
  isValidEmail,
  isValidPhone
};

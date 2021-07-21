const axios = require("axios");
const { CustomError, getValueFromMessage } = require("../../util");
const { ENDPOINT } = require("./config");

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
      throw new CustomError("Email format in userId is not correct.", 400);
    }
  } else if (channel === "sms") {
    if (!isValidPhone(userId)) {
      throw new CustomError(
        "Phone number format in userId must be E.164.",
        400
      );
    }
  } else {
    throw new CustomError("Invalid Channel type", 400);
  }
};

const userValidity = async (channel, Config, userId) => {
  const payload = {};
  if (channel === "email") {
    payload.email = userId;
  } else if (channel === "sms") {
    payload.phone = userId;
  }
  let response;
  const basicAuth = Buffer.from(`${Config.apiKey}`).toString("base64");
  try {
    response = await axios.get(`${ENDPOINT}`, payload, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json"
      }
    });
    if (
      response &&
      response.data &&
      response.status === 200 &&
      Array.isArray(response.data)
    ) {
      return response.data.length !== 0;
    }
    throw new CustomError("Invalid response", 400);
  } catch (error) {
    let errMsg = "";
    let errStatus = 400;
    if (error.response && error.response.data) {
      errMsg = JSON.stringify(error.response.data);
    }
    if (error.response.status) {
      errStatus = error.response.status;
    }
    throw new CustomError(
      `Error occurred while checking userId : ${errMsg}`,
      errStatus
    );
  }
};
const eventValidity = (Config, message) => {
  const event = getValueFromMessage(message, "event");
  if (!event) {
    throw new CustomError("No event found.", 400);
  }
  Config.eventNameSettings.forEach(eventName => {
    if (eventName.event && eventName.event.trim().length !== 0) {
      if (eventName.event.trim().toLowerCase() === event.toLowerCase()) {
        return true;
      }
    }
    return false;
  });
};

module.exports = {
  isValidUserIdOrError,
  eventValidity,
  userValidity,
  isValidEmail,
  isValidPhone
};

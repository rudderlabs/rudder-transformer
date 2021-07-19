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

const isValidUserId = (channel, userId) => {
  if (channel === "email") {
    if (!isValidEmail(userId)) {
      throw new CustomError("Email format is not correct.", 400);
    }
  } else if (channel === "phone") {
    if (!isValidPhone(userId)) {
      throw new CustomError("Phone number format must be E.164.", 400);
    }
  } else {
    throw new CustomError("User Id is not matching the channel type.", 400);
  }
};

const userValidity = async (channel, Config, userId) => {
  const payload = {};
  if (channel === "email") {
    payload.email = userId;
  } else if (channel === "phone") {
    payload.phone = userId;
  } else {
    throw new CustomError("Unable to generate payload for GET request.", 400);
  }
  let response;
  try {
    response = await axios.get(`${ENDPOINT}`, payload, {
      headers: {
        Authorization: `Basic ${Config.apiKey}`,
        "Content-Type": "application/json"
      }
    });
    if (response && response.status === 200) {
      if (Array.isArray(response.data) && response.data.length === 0) {
        return false;
      }
      return true;
    }
  } catch (error) {
    throw new CustomError(
      "Error occured while searching user",
      JSON.stringify(error.response.data)
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
  isValidUserId,
  eventValidity,
  userValidity,
  isValidEmail,
  isValidPhone
};

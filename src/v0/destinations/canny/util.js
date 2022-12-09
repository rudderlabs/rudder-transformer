const qs = require("qs");
const { httpPOST } = require("../../../adapters/network");
const { getDestinationExternalID } = require("../../util");
const {
  InstrumentationError,
  NetworkInstrumentationError
} = require("../../util/errorTypes");

/**
 * Function to retrieve userId from canny using axios
 * @param apiKey
 * @param message
 * @returns canny userId
 */
const retrieveUserId = async (apiKey, message) => {
  try {
    const cannyId = getDestinationExternalID(message, "cannyUserId");
    if (cannyId) {
      return cannyId;
    }

    const url = "https://canny.io/api/v1/users/retrieve";
    let response;

    const email =
      message.traits?.email ||
      message.context?.traits?.email ||
      message.properties?.email;
    const { userId } = message;

    const header = {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json"
    };

    const requestBody = {
      apiKey: `${apiKey}`
    };
    if (email) {
      requestBody.email = `${email}`;
    } else {
      requestBody.userID = `${userId}`;
    }
    response = await httpPOST(url, qs.stringify(requestBody), header);
    // If the request fails, throwing error.
    if (response.success === false) {
      throw new NetworkInstrumentationError(
        `[Canny]:: CannyUserID can't be gnerated due to ${response.data.error}`
      );
    }
    return (
      response?.response?.data?.data?.id || response?.response?.data?.id || null
    );
  } catch (error) {
    throw new NetworkInstrumentationError(
      "Unable to retrieve userid from Canny"
    );
  }
};

/**
 * Function to validate required fields for making identify call(i.e, create or update user)
 * @param payload
 */
const validateIdentifyFields = payload => {
  if (!payload.userID) {
    throw new InstrumentationError("UserId is not present. Aborting message.");
  }
  if (!payload.name) {
    throw new InstrumentationError("Name is not present. Aborting message.");
  }
};

/**
 * Function to validate required fields for creating a post
 * @param payload
 */
const validateCreatePostFields = payload => {
  if (!payload.boardID) {
    throw new InstrumentationError("BoardID is not present. Aborting message.");
  }
  if (!payload.title) {
    throw new InstrumentationError("Title is not present. Aborting message.");
  }
  if (!payload.details) {
    throw new InstrumentationError("Details is not present. Aborting message.");
  }
};

/**
 * Function to validate event mapping
 * @param configuredEventsMap
 * @param event
 */
const validateEventMapping = (configuredEventsMap, event) => {
  if (!event) {
    throw new InstrumentationError("Event name is required");
  }

  if (!configuredEventsMap[event]) {
    throw new InstrumentationError(
      `Event name (${event}) is not present in the mapping`
    );
  }
};

module.exports = {
  retrieveUserId,
  validateIdentifyFields,
  validateCreatePostFields,
  validateEventMapping
};

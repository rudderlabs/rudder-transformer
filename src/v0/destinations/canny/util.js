const qs = require("qs");
const { httpPOST } = require("../../../adapters/network");
const { CustomError, getDestinationExternalID } = require("../../util");

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
    const userId = message.userId;

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
      throw new CustomError(
        `[Canny]:: CannyUserID can't be gnerated due to ${response.data.error}`,
        400
      );
    }
    return (
      response?.response?.data?.data?.id || response?.response?.data?.id || null
    );
  } catch (error) {
    throw new CustomError("Unable to retrieve userid from Canny", 400);
  }
};

/**
 * Function to validate required fields for making identify call(i.e, create or update user)
 * @param payload
 */
const validateIdentifyFields = payload => {
  if (!payload.userID) {
    throw new CustomError("UserId is not present. Aborting message.", 400);
  }
  if (!payload.name) {
    throw new CustomError("Name is not present. Aborting message.", 400);
  }
};

/**
 * Function to validate required fields for creating a post
 * @param payload
 */
const validateCreatePostFields = payload => {
  if (!payload.boardID) {
    throw new CustomError("BoardID is not present. Aborting message.", 400);
  }
  if (!payload.title) {
    throw new CustomError("Title is not present. Aborting message.", 400);
  }
  if (!payload.details) {
    throw new CustomError("Details is not present. Aborting message.", 400);
  }
};

/**
 * Function to validate event mapping
 * @param configuredEventsMap
 * @param event
 */
const validateEventMapping = (configuredEventsMap, event) => {
  if (!event) {
    throw new CustomError("Event name is required", 400);
  }

  if (!configuredEventsMap[event]) {
    throw new CustomError(
      `Event name (${event}) is not present in the mapping`,
      400
    );
  }
};

module.exports = {
  retrieveUserId,
  validateIdentifyFields,
  validateCreatePostFields,
  validateEventMapping
};

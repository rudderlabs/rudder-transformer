const qs = require("qs");
const { httpPOST } = require("../../../adapters/network");
const { CustomError } = require("../../util");

/**
 * Function to retrieve userId from canny using axios
 * @param apiKey
 * @param message
 * @returns canny userId
 */
const retrieveUserId = async (apiKey, message) => {
  try {
    if (message?.context?.externalId?.type === "cannyUserId") {
      const cannyId = message.context.externalId.value;
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

    if (email) {
      response = await httpPOST(
        url,
        qs.stringify({
          apiKey: `${apiKey}`,
          email: `${email}`
        }),
        header
      );

      // If the request fails, throwing error.
      if (response.success === false) {
        throw new CustomError(
          `[Canny]:: CannyUserID can't be gnerated due to ${response.data.error}`,
          400
        );
      }

      return (
        response?.response?.data?.data?.id ||
        response?.response?.data?.id ||
        null
      );
    }
    response = await httpPOST(
      url,
      qs.stringify({
        apiKey: `${apiKey}`,
        userID: `${userId}`
      }),
      header
    );

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

module.exports = { retrieveUserId };

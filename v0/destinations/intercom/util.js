const axios = require("axios");
const {
  getFieldValueFromMessage,
  getDestinationExternalID
} = require("../../util");
const { ENDPOINTS } = require("./config");

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.response = { status: statusCode };
  }
}

/**
 * @param {*} field
 * @param {*} value
 * @param {*} Config
 * @returns
 */
const searchUser = async (field, value, Config) => {
  const lookupPayload = {
    query: {
      operator: "=",
      field,
      value
    }
  };
  let resp;
  try {
    resp = await axios.post(
      `${ENDPOINTS.IDENTIFY_ENDPOINT}/search`,
      lookupPayload,
      {
        headers: {
          Authorization: `Bearer ${Config.apiToken}`
        }
      }
    );
  } catch (error) {
    let errorMessage = "user search failed";
    let errorStatus;
    if (error.response) {
      errorMessage = JSON.stringify(error.response);
      errorStatus = error.response.status;
    }
    throw new CustomError(errorMessage, errorStatus || 500);
  }

  if (!resp || !resp.data || !resp.data.data || resp.status !== 200) {
    throw new CustomError("user search failed. invalid response", 500);
  }

  return resp.data.data.length ? resp.data.data[0].id : null;
};

const createOrUpdateCompany = async (payload, Config) => {
  let resp;
  try {
    resp = await axios.post(ENDPOINTS.GROUP_ENDPOINT, payload, {
      headers: {
        Authorization: Config.apiToken
      }
    });
  } catch (error) {
    let errorMessage = "failed to create/update company";
    let errorStatus;
    if (error.response) {
      errorMessage = JSON.stringify(error.response);
      errorStatus = error.response.status;
    }
    throw new CustomError(errorMessage, errorStatus || 500);
  }

  if (!resp || resp.status !== 200 || !resp.data || !resp.data.id) {
    throw new CustomError("failed to create/update company", 500);
  }

  return resp.data.id;
};

/**
 * Returns destination side User Id.
 * Checks for atleast one of the following: intercomUserId, userId, email.
 * If none of them are present, throws error.
 * @param {*} message
 * @returns
 */

const getdestUserIdOrError = async (message, Config, method) => {
  const externalUserId = getDestinationExternalID(message, "intercomUserId");
  const userId = getFieldValueFromMessage(message, "userIdOnly");
  const email = getFieldValueFromMessage(message, "email");

  const idsObject = {};
  let destUserId;
  if (externalUserId) {
    destUserId = externalUserId;
    idsObject.id = destUserId;
  } else if (userId) {
    destUserId = await searchUser("external_id", userId, Config);
    idsObject.user_id = destUserId;
  } else if (email) {
    destUserId = await searchUser("email", email, Config);
    idsObject.email = destUserId;
  } else {
    throw new CustomError(
      `externalId, userId or email is required for ${method}`,
      400
    );
  }
  return { destUserId, idsObject };
};

module.exports = {
  CustomError,
  searchUser,
  createOrUpdateCompany,
  getdestUserIdOrError
};

/* eslint-disable prettier/prettier */
const axios = require("axios");
const { ENDPOINTS } = require("./config");

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.response = { status: statusCode };
  }
}

const handleErrorResponse = (
  error,
  customErrMessage,
  expectedErrStatus,
  defaultStatus = 500
) => {
  let errMessage = "";
  let errorStatus = defaultStatus;

  if (error.response && error.response.data) {
    errMessage = error.response.data.externalapierror
      ? JSON.stringify(error.response.data.externalapierror)
      : JSON.stringify(error.response.data);

    errorStatus = error.response.status;

    if (error.response.status === expectedErrStatus) {
      return { success: false, err: errMessage };
    }
  }
  throw new CustomError(`${customErrMessage}: ${errMessage}`, errorStatus);
};

/**
 * Checks if user or account exists
 * @param {*} id
 * @param {*} Config
 * @param {*} objectType
 * @returns
 */
const objectExists = async (id, Config, objectType) => {
  let url = `${ENDPOINTS.USERS_ENDPOINT}/${id}`;
  let err = "invalid response while searching user";

  if (objectType === "account") {
    url = `${ENDPOINTS.ACCOUNTS_ENDPOINT}/${id}`;
    err = "invalid response while searching account";
  }

  let response;
  try {
    response = await axios.get(url, {
      headers: {
        "X-APTRINSIC-API-KEY": Config.apiKey,
        "Content-Type": "application/json"
      }
    });
    if (response && response.status === 200) {
      return { success: true, err: null };
    }
    throw new Error(err);
  } catch (error) {
    return handleErrorResponse(error, `error while fetching ${objectType}`, 404);
  }
};

const createAccount = async (payload, Config) => {
  let response;
  try {
    response = await axios.post(ENDPOINTS.ACCOUNTS_ENDPOINT, payload, {
      headers: {
        "X-APTRINSIC-API-KEY": Config.apiKey,
        "Content-Type": "application/json"
      }
    });
    if (response && response.status === 201) {
      return { success: true, err: null };
    }
    throw new Error("invalid response while creating account");
  } catch (error) {
    return handleErrorResponse(error, "error while creating account", 400);
  }
};

const updateAccount = async (accountId, payload, Config) => {
  let response;
  try {
    response = await axios.put(
      `${ENDPOINTS.ACCOUNTS_ENDPOINT}/${accountId}`,
      payload,
      {
        headers: {
          "X-APTRINSIC-API-KEY": Config.apiKey,
          "Content-Type": "application/json"
        }
      }
    );
    if (response && response.status === 204) {
      return { success: true, err: null };
    }
    throw new Error("invalid response while updating account");
  } catch (error) {
    return handleErrorResponse(error, "error while updating account", 400);
  }
};

/**
 * Performs key mapping for Custom Attributes Object.
 * Keys for which mapping is not provided in webapp are dropped.
 * @param {*} payload
 * @param {*} userCustomFieldsMap
 * @returns
 */
const renameCustomFields = (payload, userCustomFieldsMap) => {
  const renamedPayload = {};
  const mapKeys = Object.keys(userCustomFieldsMap);
  Object.keys(payload).forEach(key => {
    if (mapKeys.includes(key)) {
      renamedPayload[userCustomFieldsMap[key]] = payload[key];
    }
  });
  return renamedPayload;
};

module.exports = {
  CustomError,
  renameCustomFields,
  createAccount,
  updateAccount,
  objectExists
};

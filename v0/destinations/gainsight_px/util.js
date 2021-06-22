/* eslint-disable prettier/prettier */
const axios = require("axios");
const { ENDPOINTS } = require("./config");
// const { isEmpty } = require("../../util");

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.response = { status: statusCode };
  }
}

const handleErrorResponse = (error, customErrMessage, expectedErrStatus, defaultStatus=500) => {
  let errMessage = "";
  let errorStatus = defaultStatus;
  if (error.response && error.response.data) {
    if (error.response.status === expectedErrStatus) {
      return false;
    }
    errMessage = error.response.data.externalapierror
      ? error.response.data.externalapierror.message
      : errMessage;
    errorStatus = error.response.status;
  }
  throw new CustomError(
    `${customErrMessage}: ${errMessage}`,
    errorStatus
  );
};

const removeKeysFromPayload = (payload, keys) => {
  const updatedPayload = {};
  Object.keys(payload).forEach(key => {
    if (!keys.includes(key)) {
      updatedPayload[key] = payload[key];
    }
  });
  return updatedPayload;
};

// const getProductTagKeys = propertyKeys => {
//   if (!propertyKeys || propertyKeys.length === 0) {
//     return null;
//   }
//   return propertyKeys
//   .filter(item => !isEmpty(item.productTagKey))
//   .map(iten => iten.productTagKey);
// }

/**
 * Returns true if user is already identified. Else returns false
 * @param {*} identifyId
 * @param {*} Config
 * @returns
 */
const userExists = async (identifyId, Config) => {
  let response;
  try {
    response = await axios.get(`${ENDPOINTS.USERS_ENDPOINT}/${identifyId}`, {
      headers: {
        "X-APTRINSIC-API-KEY": Config.apiKey,
        "Content-Type": "application/json"
      }
    });
    if (response && response.status === 200) {
      return true;
    }
    throw new Error("invalid response while searching user");
  } catch (error) {
    return handleErrorResponse(error, "error while fetching user", 404);
  }
};

const companyExists = async (accountId, Config) => {
  let response;
  try {
    response = await axios.get(`${ENDPOINTS.ACCOUNTS_ENDPOINT}/${accountId}`, {
      headers: {
        "X-APTRINSIC-API-KEY": Config.apiKey,
        "Content-Type": "application/json"
      }
    });
    if (response && response.status === 200) {
      return true;
    }
    throw new Error("invalid response while searching account");
  } catch (error) {
    return handleErrorResponse(error, "error while fetching account", 404);
  }
};

const createAccount = async (payload, Config) => {
  let response;
  try {
    response = await axios.post(
      ENDPOINTS.ACCOUNTS_ENDPOINT,
      payload,
      {
        headers: {
          "X-APTRINSIC-API-KEY": Config.apiKey,
          "Content-Type": "application/json"
        }
      }
    );
    if (response && response.status === 201) {
      return true;
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
      return true;
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
  userExists,
  renameCustomFields,
  removeKeysFromPayload,
  companyExists,
  createAccount,
  updateAccount
};

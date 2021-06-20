/* eslint-disable prettier/prettier */
const axios = require("axios");
const { ENDPOINTS } = require("./config");
const logger = require("../../../logger");
const { isEmpty } = require("../../util");

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.response = { status: statusCode };
  }
}

const removeKeysFromPayload = (payload, keys) => {
  const updatedPayload = {};
  Object.keys(payload).forEach(key => {
    if (!keys.includes(key)) {
      updatedPayload[key] = payload[key];
    }
  });
  return updatedPayload;
};

const getProductTagKeys = propertyKeys => {
  if (!propertyKeys || propertyKeys.length === 0) {
    return null;
  }
  return propertyKeys
  .filter(item => !isEmpty(item.productTagKey))
  .map(iten => iten.productTagKey);
}

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

    logger.info("invalid response while searching user");
    throw new Error("invalid response while searching user");
  } 
  catch (error) {
    let errMessage = "";
    let errorStatus = 500;
    if (error.response && error.response.data) {
      if (error.response.status === 404) {
        return false;
      }
      errMessage =
        error.response.data.externalapierror &&
        error.response.data.externalapierror.message;
      errorStatus = error.response.status;
    }
    throw new CustomError(`error while fetching user ${errMessage}`, errorStatus);
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
    if(mapKeys.includes(key)) {
      renamedPayload[userCustomFieldsMap[key]] = payload[key];
    }
  });
  return renamedPayload;
};

module.exports = {
  CustomError,
  userExists,
  renameCustomFields,
  getProductTagKeys,
  removeKeysFromPayload
};

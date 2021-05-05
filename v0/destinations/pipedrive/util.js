/* eslint-disable array-callback-return */
/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
const axios = require("axios");
const get = require("get-value");
const set = require("set-value");
const logger = require("../../../logger");
const { getFieldValueFromMessage, getDestinationExternalID } = require("../../util");
const {
  ORGANISATION_ENDPOINT,
  PERSONS_ENDPOINT,
} = require("./config");

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.response = { status: statusCode };
  }
}

const handleAxiosError = (err, errorMessage) => {
  if (err.response) {
    throw new CustomError(
      errorMessage,
      err.response.status || 500
    );
  }

  throw new CustomError(`${errorMessage} Abortable`, 400);
};

/**
 * Search for person with Custom UserId value
 * @param {*} userIdValue
 * @param {*} destination
 * @returns
 */
const searchPersonByCustomId = async (userIdValue, Config) => {
  let response;
  try {
    response = await axios.get(`${PERSONS_ENDPOINT}/search`, {
      params: {
        term: userIdValue,
        field: Config.userIdToken,
        api_token: Config.apiToken
      },
      headers: {
        Accept: "application/json"
      }
    });
  } 
  catch (err) {
    handleAxiosError(err, "failed to search person");
  }

  if(!response.data || !response.data.data) {
    throw new CustomError("response data not found: Retryable", 500);
  }
  else if (response.data.data.items.length === 0) {
    return null;
  }
  else
    return response.data.data.items[0].item;
};

const updatePerson = async (userIdvalue, data, Config) => {
  let response;
  try {
    response = await axios.put(
      `${PERSONS_ENDPOINT}/${userIdvalue}`,
      data,
      {
        params: {
          api_token: Config.apiToken
        },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }
    );
  } catch (err) {
    handleAxiosError(err, "failed to update person");
  }

  if (response.status === 200) {
    return response.data.data;
  }

  // fallback
  throw new CustomError(`error while updating person: Abortable`, 500);
};

const searchOrganisationByCustomId = async (groupId, Config) => {
  let response;
  try {
    response = await axios.get(`${ORGANISATION_ENDPOINT}/search`, {
      params: {
        term: groupId,
        field: Config.groupIdToken,
        api_token: Config.apiToken
      },
      headers: {
        Accept: "application/json"
      }
    });
  } catch (err) {
    handleAxiosError(err, "failed to search organization");
  }

  if(!response.data || !response.data.data) {
    throw new CustomError("response data not found: Retyrable", 500);
  }
  else if (response.data.data.items.length === 0) {
    return null;
  }
  else
    return response.data.data.items[0].item;
};

const createNewOrganisation = async (data, Config) => {
  const resp = await axios
    .post(ORGANISATION_ENDPOINT, data, {
      params: {
        api_token: Config.apiToken
      },
      headers: {
        "Content-Type": "application/json"
      }
    })
    .catch(err => {
      handleAxiosError(err, "failed to create organization");
    });

  if (resp.status === 201) {
    return resp.data.data;
  }

  // fallback
  throw new CustomError("failed to create new organisation, Retryable", 500);
};

/**
 * Updates already existing organisation with
 * the supplied payload and groupId
 * @param {*} groupId
 * @param {*} groupPayload
 * @param {*} destination
 */
const updateOrganisationTraits = async (orgId, groupPayload, Config) => {
  let response;
  try {
    response = await axios.put(
      `${ORGANISATION_ENDPOINT}/${orgId}`,
      groupPayload,
      {
        params: {
          api_token: Config.apiToken
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err) {
    handleAxiosError(err, "failed to update organization");
  }

  if (response.status === 200) {
    return response.data.data;
  }

  // fallback
  throw new CustomError("org update failed: Retryable", 500);
};

/**
 * Wrapper on top of getFieldValueFromMessage
 * If value is not found, throws custom error
 * @param {*} message
 * @param {*} field
 * @param {*} err
 * @returns
 */
const getFieldValueOrThrowError = (message, field, err) => {
  const val = getFieldValueFromMessage(message, field);
  if (!val) {
    throw err;
  }
  return val;
};

/**
 * Util function to rename the custom fields
 * based on fields Map in destination Config
 * @param {*} message
 * @param {*} fieldsMap
 * @param {*} type
 * @returns
 */
const renameCustomFields = (message, Config, type, exclusionKeys) => {
  /**
   * Util function to reshape Config fields map to
   * usable format
   */
  function reshapeMap(fieldMap, isLowerCase=true) {
    const resMap = new Map();
    fieldMap.map(item => {
      resMap.set(isLowerCase ? item.from.toLowerCase() : item.from, item.to);
    });
    return resMap;
  }

  /**
   * inner function needed for cases where field map is not provided
   * but payload still contains custom key-val pairs.
   * Filters out all such pairs
   */
  function filterOutCustomKeys(payload, allowedKeys) {
    const filteredPayload = {};
    Object.keys(payload).forEach(key => {
      if (allowedKeys.has(key)) {
        set(filteredPayload, key, payload[key]);
      }
    });
    return filteredPayload;
  }

  const exclusionSet = new Set(exclusionKeys);
  let specificMap = Config[type];

  if (!specificMap || specificMap.length === 0) {
    return filterOutCustomKeys(message, exclusionSet);
  }

  specificMap = reshapeMap(specificMap, false);
  const payload = {};

  Object.keys(message).map(key => {
    if (exclusionSet.has(key)) {
      set(payload, key, message[key]);
    } else if (specificMap.has(key)) {
      set(payload, specificMap.get(key), message[key]);
    } else {
      logger.info(`custom field ${key} not specified in fields Map, skipped`);
    }
  });

  return payload;
};

/**
 * Util function to create price mapping
 * returns a new Object
 * @param {*} payload 
 * @returns 
 */
const createPriceMapping = payload => {
  // creating the prices mapping only when both price and currency provided
  // to avoid discrepancy
  const mappedPayload = { ...payload };

  if(mappedPayload.price && mappedPayload.currency) {
    const prices = {
      price: mappedPayload.price,
      currency: mappedPayload.currency
    };
    set(mappedPayload, "prices", [prices]);
  }
  delete mappedPayload.price;
  delete mappedPayload.currency;

  return mappedPayload;
}

/**
 * Gets ExternalId if present. 
 * Else gets userId and also checks if person exists for that userId
 * Else throws provided custom error.
 * Note: UserId token is required if external id is not present.
 * @param {*} message 
 * @param {*} Config 
 * @returns 
 */
const getUserIDorExternalID = async (message, Config, error) => {
  const pipedrivePersonId = getDestinationExternalID(message, "person_id");
  
  let destUserId;
  if(!pipedrivePersonId) {
    if (!get(Config, "userIdToken")) {
      throw new CustomError("userId Token is required", 400);
    }

    const userId = getFieldValueFromMessage(message, "userIdOnly");
    if(!userId) {
      throw new CustomError("userId or person_id required", 400);
    }
    
    const person = await searchPersonByCustomId(userId, Config);
    if (!person) {
      throw new CustomError(`person not found ${error || ""}`, 400);
    }
    destUserId = person.id;
  }
  else {
    destUserId = pipedrivePersonId;
  }

  return destUserId;
};

const createPerson = async (data, Config) => {
  let resp;
  try {
    resp = await axios.post(PERSONS_ENDPOINT, data, {
      params: {
        api_token: Config.apiToken
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    });
  }
  catch (err) {
    handleAxiosError(err, "create person failed");
  }
  if (resp && resp.status === 201) {
    return resp.data.data;
  }
  
  // fallback
  throw new CustomError("org update failed: Retryable", 500);
};


module.exports = {
  createNewOrganisation,
  updateOrganisationTraits,
  searchOrganisationByCustomId,
  searchPersonByCustomId,
  getFieldValueOrThrowError,
  updatePerson,
  renameCustomFields,
  createPriceMapping,
  getUserIDorExternalID,
  createPerson,
  CustomError
};

/* eslint-disable prefer-object-spread */
/* eslint-disable array-callback-return */
/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
const axios = require("axios");
const get = require("get-value");
const set = require("set-value");
const logger = require("../../../logger");
const {
  getFieldValueFromMessage,
  constructPayload,
  extractCustomFields,
  getValueFromMessage,
  flattenJson
} = require("../../util");
const {
  ORGANISATION_ENDPOINT,
  PERSONS_ENDPOINT,
  PIPEDRIVE_IDENTIFY_EXCLUSION,
  userDataMapping,
  identifyDataMapping
} = require("./config");

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.response = { status: statusCode };
  }
}

const handleAxiosError = (err, errorMessage) => {
  if (err.response) {
    throw new CustomError(errorMessage, err.response.status || 500);
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
  } catch (err) {
    handleAxiosError(err, "failed to search person");
  }

  if (!response.data || !response.data.data) {
    throw new CustomError("response data not found: Retryable", 500);
  } else if (response.data.data.items.length === 0) {
    return null;
  } else return response.data.data.items[0].item;
};

const updatePerson = async (userIdvalue, data, Config) => {
  let response;
  try {
    response = await axios.put(`${PERSONS_ENDPOINT}/${userIdvalue}`, data, {
      params: {
        api_token: Config.apiToken
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    });
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

  if (!response.data || !response.data.data) {
    throw new CustomError("response data not found: Retyrable", 500);
  } else if (response.data.data.items.length === 0) {
    return null;
  } else return response.data.data.items[0].item;
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
 * Creates new Person
 * @param {*} data
 * @param {*} Config
 * @returns
 */
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
  } catch (err) {
    handleAxiosError(err, "create person failed");
  }
  if (resp && resp.status === 201) {
    return resp.data.data;
  }

  // fallback
  return null;
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
  function reshapeMap(fieldMap, isLowerCase = true) {
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

  if (mappedPayload.price && mappedPayload.currency) {
    const prices = {
      price: mappedPayload.price,
      currency: mappedPayload.currency
    };
    set(mappedPayload, "prices", [prices]);
  }
  delete mappedPayload.price;
  delete mappedPayload.currency;

  return mappedPayload;
};

/**
 * Util Function to extract person data from all event payloads
 * @param {*} message
 * @param {*} Config
 * @param {*} keys
 * @param {*} identifyEvent
 * @returns
 */
const extractPersonData = (message, Config, keys, identifyEvent = false) => {
  let payload;

  if (!identifyEvent) {
    payload = constructPayload(message, userDataMapping);
  } 
  else {
    payload = constructPayload(message, identifyDataMapping);
  }

  if (!get(payload, "name")) {
    let fname;
    let lname;

    if (identifyEvent) {
      fname = getFieldValueFromMessage(message, "firstName");
      lname = getFieldValueFromMessage(message, "lastName");
    } 
    else {
      fname = getValueFromMessage(message, [
        "context.traits.firstName",
        "context.traits.firstname",
        "context.traits.first_name"
      ]);
      lname = getValueFromMessage(message, [
        "context.traits.lastName",
        "context.traits.lastname",
        "context.traits.last_name"
      ]);
    }

    if (!fname && !lname) {
      throw new CustomError("no name field found", 400);
    }
    const name = `${fname || ""} ${lname || ""}`.trim();
    set(payload, "name", name);
  }

  const renameExclusionKeys = Object.keys(payload);

  payload = extractCustomFields(
    message,
    payload,
    keys,
    PIPEDRIVE_IDENTIFY_EXCLUSION,
    true
  );

  payload = renameCustomFields(
    payload,
    Config,
    "personsMap",
    renameExclusionKeys
  );

  return payload;
};

// const retryable = async (func, args, maxWaitout=5) => {

//   let waitTill = new Date(new Date().getTime() + maxWaitout * 1000);
//   while(waitTill > new Date()){
//     // creating delay
//   }

//   const resp = await func(...args);
//   if(resp) {
//     logger.info("found");
//     return resp;
//   }

//   logger.info("waitOut expired: not found");
//   return null;

//   // let retries = 0;
//   // while(retries < maxRetries) {
//   //   // eslint-disable-next-line no-await-in-loop
//   //   const resp = await func(...args);
//   //   if(resp) {
//   //     logger.info(`found on retry number: ${retries}`);
//   //     return resp;
//   //   }
//   //   retries += 1;
//   // }

//   // logger.info("retries exhausted: Stopping retry");
//   // return null;
// };

function selectAndFlatten(obj, keys) {
  if(!keys || keys.length === 0) {
    return flattenJson(obj);
  }

  const keySet = new Set(keys);
  const copy = Object.assign({}, obj);
  const toFlatten = {};
  const keepFixed = {};

  Object.keys(copy).forEach(key => {
    if(!keySet.has(key)) {
      keepFixed[key] = copy[key];
    } else {
      toFlatten[key] = copy[key];
    }
  })

  const flattened = flattenJson(toFlatten);
  return Object.assign({}, keepFixed, flattened);
}


module.exports = {
  createNewOrganisation,
  updateOrganisationTraits,
  searchOrganisationByCustomId,
  searchPersonByCustomId,
  getFieldValueOrThrowError,
  updatePerson,
  renameCustomFields,
  createPriceMapping,
  createPerson,
  extractPersonData,
  selectAndFlatten,
  CustomError
};

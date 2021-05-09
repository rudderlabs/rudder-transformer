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
  identifyDataMapping,
  getMergeEndpoint
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
 * Search Person by Pipedrive internal Id
 * @param {*} pid
 * @param {*} Config
 * @returns
 */
const searchPersonByPipedriveId = async (pipedriveId, Config) => {
  let response;
  try {
    response = await axios.get(`${PERSONS_ENDPOINT}/${pipedriveId}`, {
      params: {
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
  }
  return response.data.data;
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
        fields: "custom_fields",
        exact_match: true,
        api_token: Config.apiToken
      },
      headers: {
        Accept: "application/json"
      }
    });
  } catch (err) {
    handleAxiosError(err, "failed to search person");
  }

  if (!response || !response.data || !response.data.data) {
    throw new CustomError("response data not found: Retryable", 500);
  } else if (response.data.data.items.length === 0) {
    return null;
  } else {
    // return response.data.data.items[0].item;
    let retPerson = null;
    // workaround for Promise.any()

    // eslint-disable-next-line no-restricted-syntax
    for (const personItem of response.data.data.items) {
      const pid = personItem.item.id;
      // eslint-disable-next-line no-await-in-loop
      const person = await searchPersonByPipedriveId(pid, Config);
      if (person && get(person, Config.userIdToken) === userIdValue) {
        retPerson = person;
        break;
      }
    }
    return retPerson;

    // await Promise.any(
    //   response.data.data.items.map(async personItem => {
    //     const pid = personItem.item.id;
    //     const person = await searchPersonByPipedriveId(pid, Config);
    //     if(person && get(person, Config.userIdToken) === userIdValue) {
    //       retPerson = person;
    //       return Promise.resolve();
    //     }
    //     return Promise.reject();
    //   })
    // );
  }
};

// /**
//  * Search for person with Custom UserId value
//  * @param {*} userIdValue
//  * @param {*} destination
//  * @returns
//  */
// const searchPersonByCustomId = async (userIdValue, Config) => {
//   let response;
//   try {
//     response = await axios.get(`${PERSONS_ENDPOINT}/search`, {
//       params: {
//         term: userIdValue,
//         fields: "custom_fields",
//         exact_match: true,
//         api_token: Config.apiToken
//       },
//       headers: {
//         Accept: "application/json"
//       }
//     });
//   } catch (err) {
//     handleAxiosError(err, "failed to search person");
//   }

//   if (!response.data || !response.data.data) {
//     throw new CustomError("response data not found: Retryable", 500);
//   } else if (response.data.data.items.length === 0) {
//     return null;
//   } else return response.data.data.items[0].item;
// };

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

/**
 * Search Org by Pipedrive ID
 * @param {*} pipedriveId
 * @param {*} Config
 */
const searchOrganisationByPipedriveId = async (pipedriveId, Config) => {
  let response;
  try {
    response = await axios.get(`${ORGANISATION_ENDPOINT}/${pipedriveId}`, {
      params: {
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
    throw new CustomError("response data not found: Retryable", 500);
  }
  return response.data.data;
};

/**
 * Search Organization by custom id
 * @param {*} groupId
 * @param {*} Config
 * @returns
 */
const searchOrganisationByCustomId = async (groupId, Config) => {
  let response;
  try {
    response = await axios.get(`${ORGANISATION_ENDPOINT}/search`, {
      params: {
        term: groupId,
        fields: "custom_fields",
        exact_match: true,
        api_token: Config.apiToken
      },
      headers: {
        Accept: "application/json"
      }
    });
  } catch (err) {
    handleAxiosError(err, "failed to search organization");
  }

  if (!response || !response.data || !response.data.data) {
    throw new CustomError("response data not found: Retyrable", 500);
  } else if (response.data.data.items.length === 0) {
    return null;
  } else {
    // response.data.data.items[0].item;
    let res = null;
    // eslint-disable-next-line no-restricted-syntax
    for (const orgItem of response.data.data.items) {
      const orgId = orgItem.item.id;
      // eslint-disable-next-line no-await-in-loop
      const org = await searchOrganisationByPipedriveId(orgId, Config);
      if (org && get(org, Config.groupIdToken) === groupId) {
        res = org;
        break;
      }
    }
    return res;
  }
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

  /**
   * Function to flatten object except the keys
   * in exclusionKeys. If nestedPriority is true, nested keys
   * will get priority in the final payload.
   * Example if set to true:
   * {
   *  "address.city": "flat",
   *  "address": {
   *    "city": "nested"
   *  }
   * }
   * Flattened object will contain
   * { "address.city" : "nested" }
   * @param {*} obj
   * @param {*} nestedPriority
   * @returns
   */
  function selectAndFlatten(obj, nestedPriority = true) {
    const emptyExclusions = !exclusionKeys || exclusionKeys.length === 0;
    const copy = Object.assign({}, obj);
    const toFlatten = {};
    const keepFixed = {};

    Object.keys(copy).forEach(key => {
      if (!emptyExclusions && exclusionKeys.includes(key)) {
        keepFixed[key] = copy[key];
      } else {
        toFlatten[key] = copy[key];
      }
    });

    const flattened = flattenJson(toFlatten, false);
    return nestedPriority
      ? Object.assign({}, keepFixed, flattened)
      : Object.assign({}, flattened, keepFixed);
  }

  const exclusionSet = new Set(exclusionKeys);
  let specificMap = Config[type];

  if (!specificMap || specificMap.length === 0) {
    return filterOutCustomKeys(message, exclusionSet);
  }

  specificMap = reshapeMap(specificMap, false);

  const flattenedMessage = selectAndFlatten(message);
  const payload = {};

  Object.keys(flattenedMessage).map(key => {
    if (exclusionSet.has(key)) {
      set(payload, key, flattenedMessage[key]);
    } else if (specificMap.has(key)) {
      set(payload, specificMap.get(key), flattenedMessage[key]);
    } else {
      logger.info(`custom field ${key} not specified in fields Map, skipped`);
    }
  });

  return payload;
};

/**
 * Util Function to extract person data from all event payloads
 * If newUser is true, valid name must be present.
 * Updating a user does not need name as a required field.
 * @param {*} message
 * @param {*} Config
 * @param {*} keys
 * @param {*} identifyEvent
 * @param {*} newUser
 * @returns
 */
const extractPersonData = (
  message,
  Config,
  keys,
  identifyEvent = false,
  newUser = true
) => {
  let payload;

  if (!identifyEvent) {
    payload = constructPayload(message, userDataMapping);
  } else {
    payload = constructPayload(message, identifyDataMapping);
  }

  if (newUser && !get(payload, "name")) {
    let fname;
    let lname;

    if (identifyEvent) {
      fname = getFieldValueFromMessage(message, "firstName");
      lname = getFieldValueFromMessage(message, "lastName");
    } else {
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

const mergeTwoPersons = async (prevId, currId, Config) => {
  let resp;
  try {
    resp = await axios.put(
      getMergeEndpoint(prevId),
      {
        merge_with_id: currId
      },
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
    handleAxiosError(err, "failed to merge persons");
  }
  if (resp && resp.status === 200) {
    return true;
  }
  return null;
};

module.exports = {
  createNewOrganisation,
  updateOrganisationTraits,
  searchOrganisationByCustomId,
  searchPersonByCustomId,
  getFieldValueOrThrowError,
  updatePerson,
  renameCustomFields,
  createPerson,
  extractPersonData,
  mergeTwoPersons,
  searchPersonByPipedriveId,
  CustomError
};

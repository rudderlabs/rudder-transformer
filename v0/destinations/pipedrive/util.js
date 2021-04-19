/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
const axios = require("axios");
const logger = require("../../../logger");
const { getFieldValueFromMessage } = require("../../util");
const {
  ORGANISATION_ENDPOINT,
  PERSONS_ENDPOINT,
  getMergeEndpoint
} = require("./config");

const findPersonById = async (id, destination) => {
  try {
    const axiosResponse = await axios.get(`${PERSONS_ENDPOINT}/${id}`, {
      params: {
        api_token: destination.Config.api_token
      },
      headers: {
        "Content-Type": "application/json"
      }
    });
    return axiosResponse.data;
  } catch (err) {
    logger.warn(`Error while searching person by Id: ${err}`);
    return null;
  }
};

/**
 * Utility function to find person with max score
 */
// const findPersonWithMaxScore = persons => {
//   if (!persons || persons.length === 0) return null;

//   const maxScorePerson = {
//     data: null,
//     score: Number.MIN_VALUE
//   };

//   persons.forEach(obj => {
//     if (obj.result_score > maxScorePerson.score) {
//       maxScorePerson.score = obj.result_score;
//       maxScorePerson.data = obj.item;
//     }
//   });

//   return maxScorePerson.data;
// };

/**
 * Search for person with Custom UserId value
 * @param {*} userIdValue
 * @param {*} destination
 * @returns
 */
const searchPersonByCustomId = async (userIdValue, destination) => {
  try {
    const response = await axios.get(`${PERSONS_ENDPOINT}/search`, {
      params: {
        term: userIdValue,
        field: destination.Config.userIdKey,
        api_token: destination.Config.api_token
      },
      headers: {
        Accept: "application/json"
      }
    });

    if (response && response.status === 200) {
      if (response.data.data.items.length === 0) return null;
      return response.data.data.items[0].item;
    }

    return null;
  } catch (err) {
    logger.warn(`error while searching person: ${err}`);
    return null;
  }
};

const updatePerson = async (userIdvalue, data, destination) => {
  try {
    const response = await axios.put(`${PERSONS_ENDPOINT}/${userIdvalue}`, data, {
      params: {
        api_token: destination.Config.api_token
      },
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    if (!response || response.status !== 200)
      throw new Error("error while updating person");

  } catch (err) {
    throw new Error(`error while updating person: ${err}`);
  }
};

const searchOrganisationByCustomId = async (groupId, destination) => {
  try {
    const response = await axios.get(`${ORGANISATION_ENDPOINT}/search`, {
      params: {
        term: groupId,
        field: destination.Config.groupIdKey,
        api_token: destination.Config.api_token
      },
      headers: {
        Accept: "application/json"
      }
    });
    if (response && response.status === 200) {
      if (response.data.data.items.length === 0) return null;
      return response.data.data.items[0].item;
    }
    return null;
  } catch (err) {
    logger.warn(`error while searching organisation: ${err}`);
    return null;
  }
};

const createNewOrganisation = async (data, destination) => {
  const resp = await axios
    .post(ORGANISATION_ENDPOINT, data, {
      params: {
        api_token: destination.Config.api_token
      },
      headers: {
        "Content-Type": "application/json"
      }
    })
    .catch(err => {
      throw new Error(`failed to create new organisation: ${err}`);
    });

  if (resp && resp.status === 201) return resp.data.data;
  throw new Error("failed to create new organisation");
};

/**
 * Updates already existing organisation with
 * the supplied payload and groupId
 * @param {*} groupId
 * @param {*} groupPayload
 * @param {*} destination
 */
const updateOrganisationTraits = async (groupId, groupPayload, destination) => {
  try {
    const response = await axios.put(
      `${ORGANISATION_ENDPOINT}/${groupId}`,
      groupPayload,
      {
        params: {
          api_token: destination.Config.api_token
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    if (!response || response.status !== 200)
      throw new Error("error while updating group");
  } catch (err) {
    throw new Error(`error while updating group: ${err}`);
  }
};

const mergeTwoPersons = async (previousId, userId, destination) => {
  const payload = {
    merge_with_id: userId
  };
  try {
    const mergeResponse = await axios.put(
      getMergeEndpoint(previousId),
      payload,
      {
        params: {
          api_token: destination.Config.api_token
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    if (!mergeResponse || mergeResponse.status !== 200)
      throw new Error("merge failed");
  } catch (err) {
    throw new Error(`error while merging persons: ${err}`);
  }
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
  if (!val) throw err;
  return val;
};

module.exports = {
  findPersonById,
  createNewOrganisation,
  updateOrganisationTraits,
  searchOrganisationByCustomId,
  searchPersonByCustomId,
  mergeTwoPersons,
  getFieldValueOrThrowError,
  updatePerson
};

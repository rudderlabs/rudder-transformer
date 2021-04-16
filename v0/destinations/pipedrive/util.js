/* eslint-disable camelcase */
const axios = require("axios");
const logger = require("../../../logger");
const { ORGANISATION_ENDPOINT, PERSONS_ENDPOINT } = require("./config");

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

const searchOrganisationByCustomId = async (orgIdValue, destination) => {
  try {
    const response = await axios.get(`${ORGANISATION_ENDPOINT}/search`, {
      params: {
        term: orgIdValue,
        field: destination.Config.orgIdKey,
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

module.exports = {
  findPersonById,
  createNewOrganisation,
  searchOrganisationByCustomId,
  searchPersonByCustomId
};

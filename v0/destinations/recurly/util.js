const btoa = require("btoa");
const axios = require("axios");
const logger = require("../../../logger");
const { ACCEPT_HEADERS, DEFAULT_BASE_ENDPOINT } = require("./config");
const { ErrorMessage, stripTrailingSlash } = require("../../util");

/**
 * Backup Code If required
 * @param {*} isSubDomain
 * @param {*} name
 * @returns
 */
const appendSubDomain = (isSubDomain, name) => {
  return isSubDomain ? `subdomain-${name}` : "";
};

const fetchAccount = async (code, config) => {
  let response = null;
  const accountUrl = `${stripTrailingSlash(config.siteId) ||
    DEFAULT_BASE_ENDPOINT}/accounts`;
  try {
    response = await axios.get(`${accountUrl}/code-${code}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: ACCEPT_HEADERS,
        Authorization: `Basic ${btoa(`${config.apiKey}:`)}`
      }
    });
  } catch (err) {
    logger.debug(ErrorMessage.ObjectNotFound);
  }
  if (response && response.status === 200 && response.data.id) {
    return {
      isExist: true,
      httpMethod: "PUT",
      endPoint: `${accountUrl}/code-${code}`
    };
  }
  return {
    isExist: false,
    httpMethod: "POST",
    endPoint: accountUrl
  };
};

const createAccount = async (data, config) => {
  let response = null;
  const accountUrl = `${stripTrailingSlash(config.siteId) ||
    DEFAULT_BASE_ENDPOINT}/accounts`;

  try {
    response = await axios.post(`${accountUrl}`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: ACCEPT_HEADERS,
        Authorization: `Basic ${btoa(`${config.apiKey}:`)}`
      }
    });
  } catch (err) {
    logger.debug(ErrorMessage.InvalidRequest);
  }
  return (response && response.id) || null;
};

const createCustomFields = payloadCustomFields => {
  const customFields = [];
  Object.keys(payloadCustomFields).forEach(key => {
    const customFieldObject = { name: key, value: payloadCustomFields[key] };
    customFields.push(customFieldObject);
  });
  return customFields;
};

module.exports = {
  fetchAccount,
  createAccount,
  createCustomFields
};

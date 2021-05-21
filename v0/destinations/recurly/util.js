const btoa = require("btoa");
const axios = require("axios");
const logger = require("../../../logger");
const { ACCEPT_HEADERS, DEFAULT_BASE_ENDPOINT } = require("./config");
const { ErrorMessage, stripTrailingSlash } = require("../../util");

const createItem = async (data, config, relativePath) => {
  let response = null;
  const itemUrl =
    `${stripTrailingSlash(config.siteId) || DEFAULT_BASE_ENDPOINT}` +
    `${relativePath}`;
  try {
    response = await axios.post(itemUrl, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: ACCEPT_HEADERS,
        Authorization: `Basic ${btoa(`${config.apiKey}:`)}`
      }
    });
  } catch (err) {
    logger.debug(ErrorMessage.ObjectNotFound);
  }
  if (response && response.status === 201 && response.data.id) {
    return response.data.id;
  }
  return null;
};

const fetchData = async (code, config, relativePath) => {
  let response = null;
  const accountUrl =
    `${stripTrailingSlash(config.siteId) || DEFAULT_BASE_ENDPOINT}` +
    `${relativePath}`;
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
      id: response.data.id,
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

const fetchAccount = async (code, config) => {
  const accountObj = await fetchData(code, config, "/accounts");
  return accountObj;
};

const fetchItem = async (name, config) => {
  const itemObj = await fetchData(name, config, "/items");
  return itemObj;
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
  createCustomFields,
  fetchItem,
  createItem
};

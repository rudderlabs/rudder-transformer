const btoa = require("btoa");
const axios = require("axios");
const { ACCEPT_HEADERS, DEFAULT_BASE_ENDPOINT } = require("./config");
const {
  HttpStatusCode,
  isDefinedAndNotNullAndNotEmpty,
  getValueFromMessage,
  ErrorMessage
} = require("../../util");

const createItem = async (data, config, relativePath) => {
  let response = null;
  const itemUrl = `${DEFAULT_BASE_ENDPOINT}${relativePath}`;
  try {
    response = await axios.post(itemUrl, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: ACCEPT_HEADERS,
        Authorization: `Basic ${btoa(`${config.apiKey}:`)}`
      }
    });
  } catch (err) {
    throw Error(
      (err.response &&
        err.response.data &&
        JSON.stringify(err.response.data.error)) ||
        ErrorMessage.InternalServerError
    );
  }
  if (
    response &&
    response.status === HttpStatusCode.Created &&
    response.data.id
  ) {
    return response.data.id;
  }
  return null;
};

const fetchData = async (code, config, relativePath) => {
  let response = null;
  const accountUrl = `${DEFAULT_BASE_ENDPOINT}${relativePath}`;
  try {
    response = await axios.get(`${accountUrl}/code-${code}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: ACCEPT_HEADERS,
        Authorization: `Basic ${btoa(`${config.apiKey}:`)}`
      }
    });
  } catch (err) {
    response = null;
  }
  if (response && response.status === HttpStatusCode.Ok && response.data.id) {
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

const createCustomFields = (payload, mappingConfig) => {
  const customFields = [];
  mappingConfig.forEach(m => {
    if (
      isDefinedAndNotNullAndNotEmpty(m.to) &&
      isDefinedAndNotNullAndNotEmpty(m.from)
    ) {
      const val = getValueFromMessage(payload, m.from);
      if (isDefinedAndNotNullAndNotEmpty(val)) {
        const customFieldObject = {
          name: m.to,
          value: val
        };
        customFields.push(customFieldObject);
      }
    }
  });
  return customFields;
};

module.exports = {
  fetchAccount,
  createCustomFields,
  fetchItem,
  createItem
};

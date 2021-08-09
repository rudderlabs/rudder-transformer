const axios = require("axios");
const logger = require("../../../logger");
const { CustomError, constructPayload } = require("../../util");
const { ENDPOINT, productMapping } = require("./config");

const isValidEmail = email => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const isValidTimestamp = timestamp => {
  const re = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;
  return re.test(String(timestamp));
};

const userExists = async (Config, id) => {
  const basicAuth = Buffer.from(Config.apiKey).toString("base64");
  let response;
  try {
    response = await axios.get(
      `${ENDPOINT}/v2/${Config.accountId}/subscribers/${id}`,
      {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/json"
        }
      }
    );
    if (response && response.status) {
      return response.status === 200;
    }
    throw new Error("Invalid response.");
  } catch (error) {
    let errMsg = "";
    let errStatus = 400;
    if (error.response) {
      errStatus = error.response.status || 400;
      errMsg = error.response.data
        ? JSON.stringify(error.response.data)
        : "error response not found";
    }
    throw new CustomError(
      `Error occurred while checking user : ${errMsg}`,
      errStatus
    );
  }
};

const createUpdateUser = async (finalpayload, Config, basicAuth) => {
  try {
    const response = await axios.post(
      `${ENDPOINT}/v2/${Config.accountId}/subscribers`,
      finalpayload,
      {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/json"
        }
      }
    );
    if (response) {
      return response.status === 200 || response.status === 201;
    }
    throw new Error("Invalid response.");
  } catch (error) {
    let errMsg = "";
    const errStatus = 400;
    if (error.response && error.response.data) {
      errMsg = JSON.stringify(error.response.data);
    }
    throw new CustomError(
      `Error occurred while creating or updating user : ${errMsg}`,
      errStatus
    );
  }
};

const createList = productList => {
  const itemList = [];
  if (productList.length > 0) {
    productList.forEach((product, index) => {
      const itemPayload = constructPayload(product, productMapping);
      if (itemPayload.name && itemPayload.price) {
        itemList.push(itemPayload);
      } else {
        logger.error(
          `Item at index ${index} dropped. Name and price is required`
        );
      }
    });
  }
  return itemList;
};

module.exports = {
  userExists,
  isValidEmail,
  isValidTimestamp,
  createUpdateUser,
  createList
};

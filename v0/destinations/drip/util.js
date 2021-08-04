const axios = require("axios");
const logger = require("../../../logger");
const { CustomError, removeUndefinedAndNullValues } = require("../../util");
const { ENDPOINT } = require("./config");

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
    if (response) {
      return response.status === 200;
    }
    throw new Error("Invalid response.");
  } catch (error) {
    let errMsg = "";
    const errStatus = 400;
    if (error.response && error.response.data) {
      errMsg = JSON.stringify(error.repsonse.data);
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
    throw new Error("Unable to create account");
  } catch (error) {
    let errMsg = "";
    const errStatus = 400;
    if (error.response && error.response.data) {
      errMsg = JSON.stringify(error.response.data);
    }
    throw new CustomError(
      `Error occurred while creating user : ${errMsg}`,
      errStatus
    );
  }
};

const createList = productList => {
  const itemList = [];
  if (productList.length > 0) {
    productList.forEach(product => {
      let props = {};
      props.product_id = product.product_id;
      props.sku = product.sku;
      props.name = product.name;
      props.product_variant_id = product.product_variant_id;
      props.brand = product.brand;
      props.price = product.price;
      props.quantity = product.quantity;
      props.categories = product.categories;
      props.discounts = product.discounts;
      props.taxes = product.taxes;
      props.fees = product.fees;
      props.shipping = product.shipping;
      props.total = product.total;
      props.product_url = product.url;
      props.image_url = product.image_url;
      props = removeUndefinedAndNullValues(props);
      if (!props.name || !props.price) {
        logger.error(
          "List rejected. Name and price is mandatory for the item field."
        );
      } else {
        itemList.push(props);
      }
      props = {};
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

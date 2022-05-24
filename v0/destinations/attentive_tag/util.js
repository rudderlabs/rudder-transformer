const { default: axios } = require("axios");
const get = require("get-value");
const {
  CustomError,
  constructPayload,
  isDefinedAndNotNull,
  getDestinationExternalID,
  getFieldValueFromMessage
} = require("../../util");
const { BASE_URL } = require("./config");
const { mappingConfig, ConfigCategory } = require("./config");

async function getUserExistence(message, apiKey) {
  const userPhone = getFieldValueFromMessage(message, "phone");
  const userEmail = getFieldValueFromMessage(message, "email");
  try {
    await axios.get(`${BASE_URL}/subscriptions`, {
      params: { phone: userPhone, email: userEmail },
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });
  } catch (err) {
    // check if exists err.response && err.response.status else 500
    if (err.response && err.response.status) {
      throw new CustomError(err.response.statusText, err.response.status);
    }
    throw new CustomError("[Attentive_Tag] :: Failed to make request", 500);
  }
}
function getExternalIdentifiersMapping(message) {
  const externalIdentifiers = ["clientUserId", "shopifyId", "klaviyoId"];
  const externalId = get(message, "context.externalId");
  const idObj = {};
  const customIdentifiers = [];
  if (externalId && Array.isArray(externalId)) {
    externalId.forEach(id => {
      const idType = id.type;
      const val = getDestinationExternalID(message, idType);
      if (val && externalIdentifiers.includes(idType)) {
        idObj[idType] = val;
      } else if (val) {
        customIdentifiers.push({ name: idType, value: val });
      }
    });
    if (customIdentifiers.length) {
      idObj.customIdentifiers = customIdentifiers;
    }
  }
  return idObj;
}

function getDestinationItemProperties(message, isItemsRequired) {
  let items;
  const products = get(message, "properties.products");
  if (!products) {
    items = [];
    const price = [];
    const props = {};
    const pricing = {};
    const properties = get(message, "properties");
    props.productId = properties.productId;
    props.variant = properties.variant;
    props.name = properties.name;
    props.productImage = properties.image_url;
    props.productUrl = properties.url;
    props.quantity = properties.quantity;
    pricing.value = properties.price;
    pricing.currency = properties.currency;
    price.push(pricing);
    props.price = price;
    items.push(props);
    return items;
  }
  if ((!products && isItemsRequired) || (products && products.length === 0)) {
    throw new CustomError(
      `Products is an required field for '${message.event}' event`,
      400
    );
  }
  if (products && Array.isArray(products)) {
    items = [];
    products.forEach(item => {
      const element = constructPayload(
        item,
        mappingConfig[ConfigCategory.ITEMS.name]
      );
      const price = [];
      const properties = get(message, "properties");
      const pricing = {};
      pricing.value = properties.price;
      pricing.currency = properties.currency;
      price.push(pricing);
      if (
        isDefinedAndNotNull(element.product_id) &&
        isDefinedAndNotNull(element.variant) &&
        isDefinedAndNotNull(pricing.value)
      ) {
        throw new CustomError(
          "product_id and product_variant and price are required",
          400
        );
      }
      element.price = price;
      items.push(element);
    });
  } else if (products && !Array.isArray(products)) {
    throw new CustomError("Invalid type. Expected Array of products", 400);
  }
  return items;
}

module.exports = {
  getDestinationItemProperties,
  getExternalIdentifiersMapping,
  getUserExistence
};

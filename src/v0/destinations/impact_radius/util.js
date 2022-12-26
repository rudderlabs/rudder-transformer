const { array } = require("is");
const { isDefinedAndNotNull } = require("../../util");

const checkConfigurationError = Config => {
  let emptyField;
  if (!Config.accountSID) {
    emptyField = "accountSID";
  } else if (!Config.apiKey) {
    emptyField = "apiKey";
  } else if (!Config.campaignId) {
    emptyField = "campaignId";
  }
  return isDefinedAndNotNull(emptyField) ? emptyField : false;
};

const getPropertyName = (itemName, index) => {
  const propertyName = `${itemName}[${index}]`;
  return propertyName;
};

const populateProductProperties = properties => {
  const { products } = properties;
  const productProperties = {};
  if (products && Array.isArray(products)) {
    products.forEach((item, index) => {
      productProperties[getPropertyName("ItemBrand", index + 1)] = item.brand;
      productProperties[getPropertyName("ItemCategory", index + 1)] =
        item.category;
      productProperties[getPropertyName("ItemName", index + 1)] = item.name;
      productProperties[getPropertyName("ItemPrice", index + 1)] = item.price;
      productProperties[getPropertyName("ItemPromoCode", index + 1)] =
        item.coupon;
      productProperties[getPropertyName("ItemQuantity", index + 1)] =
        item.quantity;
      productProperties[getPropertyName("ItemSku", index + 1)] = item.sku;
    });
  } else {
    const index = 1;
    productProperties[getPropertyName("ItemBrand", index)] = properties.brand;
    productProperties[getPropertyName("ItemCategory", index)] =
      properties.category;
    productProperties[getPropertyName("ItemName", index)] = properties.name;
    productProperties[getPropertyName("ItemPrice", index)] = properties.price;
    productProperties[getPropertyName("ItemPromoCode", index)] =
      properties.coupon;
    productProperties[getPropertyName("ItemQuantity", index)] =
      properties.quantity;
    productProperties[getPropertyName("ItemSku", index)] = properties.sku;
  }
  return productProperties;
};

const populateAdditionalParameters = parameters => {
  const additionalParameters = {};
  parameters.forEach(mapping => {
    additionalParameters[mapping.from] = mapping.to;
  });
  return additionalParameters;
};

module.exports = {
  checkConfigurationError,
  populateProductProperties,
  populateAdditionalParameters
};

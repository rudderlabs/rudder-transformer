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
  products.forEach((item, index) => {
    productProperties[getPropertyName("ItemBrand", index)] = item.brand;
    productProperties[getPropertyName("ItemCategory", index)] = item.category;
    productProperties[getPropertyName("ItemName", index)] = item.name;
    productProperties[getPropertyName("ItemPrice", index)] = item.price;
    productProperties[getPropertyName("ItemPromoCode", index)] = item.coupon;
    productProperties[getPropertyName("ItemQuantity", index)] = item.quantity;
    productProperties[getPropertyName("ItemSku", index)] = item.sku;
  });
};
module.exports = {
  checkConfigurationError,
  populateProductProperties
};

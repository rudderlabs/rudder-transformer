const { getMappingConfig } = require("../../util");

const CONFIG_CATEGORIES = {
  PAGELOAD: {
    name: "ImpactPageLoadConfig",
    endPoint: "https://trkapi.impact.com/PageLoad"
  },

  CONVERSION: {
    name: "ImpactConversionConfig",
    base_url: "https://api.impact.com/Advertisers/"
  }
};

const itemMapping = {
  ItemBrand: "brand",
  ItemCategory: "category",
  ItemName: "name",
  ItemPrice: "price",
  ItemPromoCode: "coupon",
  ItemQuantity: "quantity",
  ItemSku: "sku"
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  itemMapping
};

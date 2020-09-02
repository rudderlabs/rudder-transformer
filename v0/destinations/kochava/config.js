const { getMappingConfig } = require("../../util");

const eventNameMapping = {
  "product added": "Add to Cart",
  "add to wishlist": "Add to Wishlist",
  "checkout started": "Checkout Start",
  "order completed": "Purchase",
  "product reviewed": "Rating",
  "products searched": "Search"
};

const KOCHAVA_ENDPOINT = "https://control.kochava.com/track/json";

const mappingConfig = getMappingConfig(
  {
    KochavaGeneric: {
      name: "KochavaGenericEvent"
    }
  },
  __dirname
);

module.exports = {
  KOCHAVA_ENDPOINT,
  mappingConfig,
  eventNameMapping
};

const { InstrumentationError } = require('@rudderstack/integrations-lib');

const validateEventPayload = (message) => {
  const { event } = message;
  const { properties } = message;
  if (event === 'Products Searched' && !properties?.query) {
    throw new InstrumentationError("Missing 'query' property in properties. Aborting");
  }

  if (
    (event === 'Product Added' ||
      event === 'Product Removed' ||
      event === 'Product Viewed' ||
      event === 'Category Viewed') &&
    !properties?.product_id
  ) {
    throw new InstrumentationError("Missing 'product_id' property in properties. Aborting");
  }
};

module.exports = { validateEventPayload };

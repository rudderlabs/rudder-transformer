const { InstrumentationError } = require('@rudderstack/integrations-lib');

const mapProductToDestination = (product) => {
  const mappedProduct = {
    productId: product.product_id, // Map to productId
    quantity: product.quantity, // Map to quantity
    unitPrice: product.price, // Map to unitPrice
    vendorId: product.vendor_id, // Map to vendorId
  };

  // If any of the required fields are missing, throw an error
  if (!mappedProduct.productId && !mappedProduct.unitPrice) {
    throw new InstrumentationError('One of productId or unitPrice is required');
  }

  return mappedProduct;
};

module.exports = {
  mapProductToDestination,
};

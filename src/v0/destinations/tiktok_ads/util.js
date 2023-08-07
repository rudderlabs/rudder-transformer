const { removeUndefinedAndNullValues } = require('../../util');

/**
 * Prepare contents array from products array
 * @param {*} message
 * @returns
 */
const getContents = (message) => {
  const contents = [];
  const { properties } = message;
  const { products, content_type, contentType } = properties;
  if (products && Array.isArray(products) && products.length > 0) {
    products.forEach((product) => {
      const singleProduct = {
        content_type:
          product.contentType || contentType || product.content_type || content_type || 'product',
        content_id: String(product.product_id),
        content_category: product.category,
        content_name: product.name,
        price: product.price,
        quantity: product.quantity,
        description: product.description,
      };
      contents.push(removeUndefinedAndNullValues(singleProduct));
    });
  }
  return contents;
};

module.exports = { getContents };

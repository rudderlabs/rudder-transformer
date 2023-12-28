const { SHA256 } = require('crypto-js');
const { removeUndefinedAndNullValues } = require('../../util');
/**
 * This returns content type from properties object if nothing is present in payload it return default values 'product
 * @param {*} properties message.proeprties
 * @returns
 */
const getContentTypeOnly = (properties) =>
  properties.contentType || properties.content_type || 'product';

/**
 * Prepare contents array from products array
 * @param {*} message
 * @param {*} getContentType if true contents.$.content_type is mapped otherwise not
 * @returns
 */
const getContents = (message, getContentType = true) => {
  const contents = [];
  const { properties } = message;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { products, content_type, contentType } = properties;
  if (products && Array.isArray(products) && products.length > 0) {
    products.forEach((product) => {
      const singleProduct = {
        content_type: getContentType
          ? product.contentType || contentType || product.contentType || content_type || 'product'
          : undefined,
        content_id: String(product.product_id),
        content_category: product.category,
        content_name: product.name,
        price: product.price,
        quantity: product.quantity,
        description: product.description,
        brand: product.brand,
      };
      contents.push(removeUndefinedAndNullValues(singleProduct));
    });
  }
  return contents;
};

/*
 * Hashing user related detail i.e external_id, email, phone_number
 */
const hashUserField = (user) => {
  const updatedUser = { ...user };
  // hashing external_id
  const { email, phone, external_id: externalId } = user;
  if (externalId) {
    // if there are multiple externalId's in form of array that tiktok supports then hashing every
    if (Array.isArray(externalId)) {
      updatedUser.external_id = externalId.map((extId) =>
        SHA256(extId.toString().trim()).toString(),
      );
    } else {
      updatedUser.external_id = SHA256(externalId.toString().trim()).toString();
    }
  }
  // hashing email
  if (email && email.length > 0) {
    updatedUser.email = SHA256(email).toString();
  }
  // hashing phone
  if (phone && phone.length > 0) {
    if (Array.isArray(phone)) {
      updatedUser.phone = phone.map((num) => SHA256(num).toString());
    } else {
      updatedUser.phone = SHA256(phone).toString();
    }
  }
  return updatedUser;
};
module.exports = { getContents, getContentTypeOnly, hashUserField };

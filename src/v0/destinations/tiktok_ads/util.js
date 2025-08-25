const { removeUndefinedAndNullValues, hashToSha256 } = require('../../util');

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
const hashString = (input) => hashToSha256(input.toString().trim());
/*
 * Hashing user related detail i.e external_id, email, phone_number
 */
const hashUserField = (user) => {
  const updatedUser = { ...user };
  // hashing external_id
  const { email, phone, external_id: externalId, idfa, gaid } = user;
  if (externalId) {
    // if there are multiple externalId's in form of array that tiktok supports then hashing every
    if (Array.isArray(externalId)) {
      updatedUser.external_id = externalId.map((extId) => hashString(extId).toString());
    } else {
      updatedUser.external_id = hashString(externalId).toString();
    }
  }
  // hashing email
  if (email && email.length > 0) {
    updatedUser.email = hashString(email).toString();
  }
  // hashing phone
  if (phone && phone.length > 0) {
    if (Array.isArray(phone)) {
      updatedUser.phone = phone.map((num) => hashString(num).toString());
    } else {
      updatedUser.phone = hashString(phone).toString();
    }
  }
  if (idfa) {
    updatedUser.idfa = hashString(idfa).toString().toLowerCase();
  }

  if (gaid) {
    updatedUser.gaid = hashString(gaid).toString();
  }

  return updatedUser;
};

/**
 * Get event source from message properties or channel. We have considered the following doc
 * https://business-api.tiktok.com/portal/docs?id=1771100779668482
 * @param {*} message
 * @returns (string): The resolved, valid event source — one of 'web', 'app', 'offline', or 'crm'. Defaults to 'web' if none are valid.
 */
const getEventSource = ({ properties }) => {
  const supportedSources = ['web', 'app', 'offline', 'crm'];

  const { eventSource, event_source: eventSourceV2 } = properties || {};

  // Helper function to resolve source with mapping
  const resolveSource = (source) => {
    if (!source) return null;

    // First check if it's a direct supported source
    if (supportedSources.includes(source)) {
      return source;
    }

    return null;
  };

  return resolveSource(eventSource) || resolveSource(eventSourceV2) || 'web';
};

module.exports = { getContents, hashUserField, getEventSource };

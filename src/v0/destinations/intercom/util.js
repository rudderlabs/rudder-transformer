const { MetadataTypes } = require('./config');

/**
 * Separates reserved metadata from rest of the metadata based on the metadata types
 * ref:- https://developers.intercom.com/intercom-api-reference/v1.4/reference/event-metadata-types
 * @param {*} metadata
 * @returns
 */
function separateReservedAndRestMetadata(metadata) {
  const reservedMetadata = {};
  const restMetadata = {};
  if (metadata) {
    Object.entries(metadata).forEach(([key, value]) => {
      if (value && typeof value === 'object') {
        const hasMonetaryAmountKeys = MetadataTypes.monetaryAmount.every((type) => type in value);
        const hasRichLinkKeys = MetadataTypes.richLink.every((type) => type in value);
        if (hasMonetaryAmountKeys || hasRichLinkKeys) {
          reservedMetadata[key] = value;
        } else {
          restMetadata[key] = value;
        }
      } else {
        restMetadata[key] = value;
      }
    });
  }

  // Return the separated metadata objects
  return { reservedMetadata, restMetadata };
}

module.exports = { separateReservedAndRestMetadata };

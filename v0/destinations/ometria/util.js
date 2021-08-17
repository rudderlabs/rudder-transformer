const {
  lineitemsMapping,
  variantMapping,
  listingMapping
} = require("./config");
const logger = require("../../../logger");
const {
  constructPayload,
  removeUndefinedAndNullAndEmptyValues,
  getValueFromMessage
} = require("../../util");

const isValidTimestamp = timestamp => {
  const re = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;
  return re.test(String(timestamp));
};

const createVariantList = variants => {
  const variantList = [];
  if (variants.length > 0) {
    variants.forEach((variant, index) => {
      const variantPayload = constructPayload(variant, variantMapping);
      if (variantPayload.id && variantPayload.type && variantPayload.label) {
        variantList.push(removeUndefinedAndNullAndEmptyValues(variantPayload));
      } else {
        logger.error(
          `Varinat at index ${index} dropped. Id, type and label is required.`
        );
      }
    });
  }
  return variantList;
};

const createList = items => {
  const itemList = [];
  if (items.length > 0) {
    items.forEach((item, index) => {
      const itemPayload = constructPayload(item, lineitemsMapping);
      if (itemPayload.product_id && itemPayload.quantity) {
        const variantList = getValueFromMessage(item, "variantOptions");
        if (variantList) {
          const variantOptions = createVariantList(variantList);
          if (variantOptions && variantOptions.length > 0) {
            itemPayload.variant_options = variantOptions;
          }
        }
        itemList.push(removeUndefinedAndNullAndEmptyValues(itemPayload));
      } else {
        logger.error(
          `Item at index ${index} dropped. Product id and quantity is required`
        );
      }
    });
  }
  return itemList;
};

const createAttributeList = attributes => {
  const attributeList = [];
  if (attributes.length > 0) {
    attributes.forEach((attribute, index) => {
      const attributePayload = constructPayload(attribute, variantMapping); // mapping is same as variant object
      if (
        attributePayload.id &&
        attributePayload.type &&
        attributePayload.label
      ) {
        attributeList.push(
          removeUndefinedAndNullAndEmptyValues(attributePayload)
        );
      } else {
        logger.error(
          `Attribute at index ${index} dropped. Id, type and label is required.`
        );
      }
    });
  }
  return attributeList;
};

const createListingList = listings => {
  const listingList = [];
  if (listings.length > 0) {
    listings.forEach((listing, index) => {
      const listingPayload = constructPayload(listing, listingMapping);
      if (
        listingPayload.title &&
        listingPayload.price &&
        listingPayload.store &&
        listingPayload.currency
      ) {
        listingList.push(removeUndefinedAndNullAndEmptyValues(listingPayload));
      } else {
        logger.error(
          `Listing at index ${index} dropped. Title, price , store and currency is required.`
        );
      }
    });
  }
  return listingList;
};

module.exports = {
  isValidTimestamp,
  createList,
  createAttributeList,
  createListingList
};

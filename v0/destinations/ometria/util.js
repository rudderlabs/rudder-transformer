const {
  lineitemsMapping,
  variantMapping,
  LINEITEMS_EXCLUSION_FIELDS
} = require("./config");
const logger = require("../../../logger");
const {
  constructPayload,
  removeUndefinedAndNullValues,
  extractCustomFields,
  isEmptyObject
} = require("../../util");

const isValidTimestamp = timestamp => {
  const re = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;
  return re.test(String(timestamp));
};

const isValidPhone = phone => {
  const phoneformat = /^\+[1-9]\d{10,14}$/;
  return phoneformat.test(String(phone));
};

const createVariantList = variants => {
  const variantList = [];
  if (variants.length > 0) {
    variants.forEach((variant, index) => {
      const variantPayload = constructPayload(variant, variantMapping);
      if (variantPayload.id && variantPayload.type && variantPayload.label) {
        variantList.push(variantPayload);
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
      if (
        itemPayload.product_id &&
        itemPayload.quantity &&
        (itemPayload.unit_price || itemPayload.subtotal)
      ) {
        const variantList = item.variant_options;
        if (!isEmptyObject(variantList)) {
          const variantOptions = createVariantList(variantList);
          if (variantOptions && variantOptions.length > 0) {
            itemPayload.variant_options = variantOptions;
          }
        }
        if (!itemPayload.properties) {
          let customFields = {};
          customFields = extractCustomFields(
            item,
            customFields,
            "root",
            LINEITEMS_EXCLUSION_FIELDS
          );
          if (!isEmptyObject(customFields)) {
            itemPayload.properties = customFields;
          }
        }
        if (
          itemPayload.is_on_sale &&
          (itemPayload.is_on_sale !== true || itemPayload.is_on_sale !== false)
        ) {
          itemPayload.is_on_sale = null;
        }
        itemList.push(removeUndefinedAndNullValues(itemPayload));
      } else {
        logger.error(
          `Item at index ${index} dropped. Product id , quantity and either unit_price or subtotal are required.`
        );
      }
    });
  }
  return itemList;
};

module.exports = {
  isValidTimestamp,
  createList,
  isValidPhone
};

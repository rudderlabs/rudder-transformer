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
  isEmptyObject,
  getValueFromMessage,
  isObject,
  isDefinedAndNotNull
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
          `variant at index ${index} dropped. Id, type and label are required.`
        );
      }
    });
  }
  return variantList;
};

const createLineItems = items => {
  const itemList = [];
  if (items.length > 0) {
    items.forEach((item, index) => {
      const itemPayload = constructPayload(item, lineitemsMapping);
      if (
        itemPayload.product_id &&
        itemPayload.quantity &&
        (isDefinedAndNotNull(itemPayload.unit_price) ||
          isDefinedAndNotNull(itemPayload.subtotal))
      ) {
        const variantList = item.variant_options;
        if (!variantList || !Array.isArray(variantList)) {
          logger.error("variant options must be an array of objects.");
        } else {
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
          typeof itemPayload.is_on_sale !== "boolean"
        ) {
          itemPayload.is_on_sale = null;
        }
        itemList.push(removeUndefinedAndNullValues(itemPayload));
      } else {
        logger.error(
          `item at index ${index} dropped. Product id , quantity and either unit_price or subtotal are required.`
        );
      }
    });
  }
  return itemList;
};

const addressMappper = address => {
  if (!isObject(address)) {
    logger.error("billing address or shipping address should be an object.");
    return null;
  }
  const res = {
    city: getValueFromMessage(address, "city"),
    state: getValueFromMessage(address, "state"),
    country_code: getValueFromMessage(address, [
      "country_code",
      "country",
      "countryCode"
    ]),
    postcode: getValueFromMessage(address, [
      "postcode",
      "postalCode",
      "postalcode"
    ])
  };
  return res;
};

const contactPayloadValidator = payload => {
  const updatedPayload = payload;
  if (payload["@force_optin"] && typeof payload["@force_optin"] !== "boolean") {
    updatedPayload["@force_optin"] = null;
    logger.error("forceOptin must contain only boolean value.");
  }
  if (payload.phone_number && !isValidPhone(payload.phone_number)) {
    updatedPayload.phone_number = null;
    logger.error("phone number format must be E.164.");
  }
  if (
    payload.timestamp_acquired &&
    !isValidTimestamp(payload.timestamp_acquired)
  ) {
    updatedPayload.timestamp_acquired = null;
    logger.error("timestamp format must be ISO 8601.");
  }
  if (
    payload.timestamp_subscribed &&
    !isValidTimestamp(payload.timestamp_subscribed)
  ) {
    updatedPayload.timestamp_subscribed = null;
    logger.error("timestamp format must be ISO 8601.");
  }
  if (
    payload.timestamp_unsubscribed &&
    !isValidTimestamp(payload.timestamp_unsubscribed)
  ) {
    updatedPayload.timestamp_unsubscribed = null;
    logger.error("timestamp format must be ISO 8601.");
  }
  return updatedPayload;
};

module.exports = {
  isValidTimestamp,
  createLineItems,
  isValidPhone,
  addressMappper,
  contactPayloadValidator
};

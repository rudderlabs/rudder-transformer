const {
  lineitemsMapping,
  variantMapping,
  LINEITEMS_EXCLUSION_FIELDS
} = require("./config");
const logger = require("../../../logger");
const {
  constructPayload,
  removeUndefinedAndNullAndEmptyValues,
  extractCustomFields,
  isEmptyObject
} = require("../../util");

const isValidTimestamp = timestamp => {
  const re = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;
  return re.test(String(timestamp));
};

const isValidCurrency = currency => {
  const re = /^AED|AFN|ALL|AMD|ANG|AOA|ARS|AUD|AWG|AZN|BAM|BBD|BDT|BGN|BHD|BIF|BMD|BND|BOB|BRL|BSD|BTN|BWP|BYR|BZD|CAD|CDF|CHF|CLP|CNY|COP|CRC|CUC|CUP|CVE|CZK|DJF|DKK|DOP|DZD|EGP|ERN|ETB|EUR|FJD|FKP|GBP|GEL|GGP|GHS|GIP|GMD|GNF|GTQ|GYD|HKD|HNL|HRK|HTG|HUF|IDR|ILS|IMP|INR|IQD|IRR|ISK|JEP|JMD|JOD|JPY|KES|KGS|KHR|KMF|KPW|KRW|KWD|KYD|KZT|LAK|LBP|LKR|LRD|LSL|LYD|MAD|MDL|MGA|MKD|MMK|MNT|MOP|MRO|MUR|MVR|MWK|MXN|MYR|MZN|NAD|NGN|NIO|NOK|NPR|NZD|OMR|PAB|PEN|PGK|PHP|PKR|PLN|PYG|QAR|RON|RSD|RUB|RWF|SAR|SBD|SCR|SDG|SEK|SGD|SHP|SLL|SOS|SPL|SRD|STD|SVC|SYP|SZL|THB|TJS|TMT|TND|TOP|TRY|TTD|TVD|TWD|TZS|UAH|UGX|USD|UYU|UZS|VEF|VND|VUV|WST|XAF|XCD|XDR|XOF|XPF|YER|ZAR|ZMW|ZWD$/;
  return re.test(String(currency));
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
      if (itemPayload.product_id && itemPayload.quantity) {
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

module.exports = {
  isValidTimestamp,
  createList,
  isValidCurrency
};

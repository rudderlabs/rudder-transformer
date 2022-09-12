const { getFieldValueFromMessage } = require("../../util");

/**
 * @param {*} message
 * @returns addres1 and address2
 * Constructs the address1 and address2 field
 * if address is given as string or object
 * */
const deduceAddressFields = message => {
  let extractedAddress = getFieldValueFromMessage(message, "address");
  let address1;
  let address2;
  if (extractedAddress) {
    if (typeof extractedAddress === "object") {
      if (
        Object.keys(extractedAddress).includes("addressLine1") &&
        Object.keys(extractedAddress).includes("addressLine2")
      ) {
        address1 = extractedAddress.addressLine1;
        address2 = extractedAddress.addressLine2;
        return { address1, address2 };
      }
      extractedAddress = Object.keys(extractedAddress).reduce((res, v) => {
        return res.concat(extractedAddress[v], " ");
      }, "");
    }
    address1 = extractedAddress.substring(0, 150);
    address2 = extractedAddress.substring(151, extractedAddress.length);
  }
  return { address1, address2 };
};

module.exports = {
  deduceAddressFields
};

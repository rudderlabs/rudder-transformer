const get = require("get-value");
const { CustomError, getFieldValueFromMessage } = require("../../util");
const { lookupFieldMap } = require("./config");
const { httpGET } = require("../../../adapters/network");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
/** @param {*} subDomainName
 * @param {*} propertyName
 * @param {*} value
 * @returns  Axios call Url
 * creates the axios url using the subDomainName for basic url
 * and propertyName and Value for filters
 */
function createAxiosUrl(subDomainName, propertyName, value, baseUrl) {
  return `${baseUrl}/contacts?where%5B0%5D%5Bcol%5D=${propertyName}&where%5B0%5D%5Bexpr%5D=eq&where%5B0%5D%5Bval%5D=${value}`;
}
/**
 * @param {*} inputText
 * @returns Boolean Value
 * for validating email match function outdated
 */
function validateEmail(inputText) {
  const mailformat = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
  return mailformat.test(inputText);
}
const getFieldForLookup = (message, lookUpField) => {
  let field = null;
  let fieldValue = null;
  // eslint-disable-next-line no-restricted-syntax
  for (const fieldIterator of lookupFieldMap[lookUpField].sourceKeys) {
    fieldValue = get(message, fieldIterator);
    if (fieldValue) {
      break;
    }
  }
  if (fieldValue) {
    field = lookupFieldMap[lookUpField].destKeys;
  } else {
    fieldValue = getFieldValueFromMessage(message, "email");
    if (fieldValue) {
      field = "email";
    } else {
      return { field, fieldValue };
    }
  }
  return { field, fieldValue };
};

/**
 * @param {*} inputText
 * @returns Boolean Value
 * for validating Phone match function outdated
 * */
function validatePhone(inputText) {
  const phoneno = /^\d{10}$/;
  return phoneno.test(inputText);
}
/**
 * @param {*} message
 * @returns address! and address2
 * Constructs the address1 and address2 field
 * if address is given as string or object
 * */
const deduceAddressFields = message => {
  const { traits, context } = message;
  let address1;
  let address2;
  if (
    (traits !== undefined && traits?.address) ||
    (context.traits && context.traits?.address)
  ) {
    let add =
      traits && traits?.address
        ? message.traits.address
        : message.context.traits.address;
    if (typeof add === "object") {
      add = Object.keys(add).reduce(function(res, v) {
        return res.concat(add[v], " ");
      }, "");
    }
    const validLengthAddress = add.length > 128 ? add.substring(0, 127) : add;
    address1 = validLengthAddress.substring(0, 63);
    address2 = validLengthAddress.substring(64, validLengthAddress.length);
  }
  return { address1, address2 };
};

/**
 * @param {*} payload
 * @returns true if no error is there
 * else, throws an error
 * Validates the generated payload for specific fields
 */
const validatePayload = payload => {
  // checking for message details validations

  if (payload.phone && !validatePhone(payload.phone)) {
    throw new CustomError("Invalid Phone No. Provided.", 400);
  }
  if (payload.state && payload.state[0] !== payload.state[0].toUpperCase()) {
    // eslint-disable-next-line no-param-reassign
    payload.state = payload.state[0].toUpperCase() + payload.state.substring(1);
  }
  if (payload.email && !validateEmail(payload.email)) {
    // eslint-disable-next-line no-param-reassign
    delete payload.email;
  }
  return true;
};

/**
 *
 * @param {*} message
 * @param {*} destination
 * @returns contactId
 * If contactId is not provided via externalId, we look for the lookup key
 * inside webapp config.
 * We have put two level dynamic mapping here.
 * If the lookup key is not found we fallback to email. If email is also not given,we will return undefined
 *
 */
const searchContactId = async (message, Config, baseUrl) => {
  const { lookUpField, userName, password, subDomainName } = Config;

  const traits = getFieldValueFromMessage(message, "traits");
  if (!traits) {
    throw new CustomError("Invalid traits value for lookup field", 400);
  }
  if (lookUpField && !Object.keys(lookupFieldMap).includes(lookUpField)) {
    throw new CustomError("lookup Field is not supported", 400);
  }
  const { field, fieldValue } = getFieldForLookup(message, lookUpField);
  if (!field) {
    return null;
  }
  const basicAuth = Buffer.from(`${userName}:${password}`).toString("base64");
  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${basicAuth}`
    }
  };
  let searchContactsResponse = await httpGET(
    createAxiosUrl(subDomainName, field, fieldValue, baseUrl),
    requestOptions
  );
  searchContactsResponse = processAxiosResponse(searchContactsResponse);
  if (searchContactsResponse.status !== 200) {
    throw new CustomError(
      `Failed to get Mautic contacts: ${JSON.stringify(
        searchContactsResponse.response
      )}`,
      searchContactsResponse.status
    );
  }
  const { contacts } = searchContactsResponse?.response;
  return Object.keys(contacts);
};

module.exports = {
  validateEmail,
  validatePhone,
  deduceAddressFields,
  validatePayload,
  searchContactId
};

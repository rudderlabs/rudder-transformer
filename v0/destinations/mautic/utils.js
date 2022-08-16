const { CustomError } = require("../../util");
const { BASE_URL } = require("./config");
const { httpGET } = require("../../../adapters/network");


// Includes the fields that can be lookUpfields
const Fields = [
  "",
  "id",
  "title",
  "role",
  "firstname",
  "nps__recommend",
  "lastname",
  "cart_status",
  "company",
  "sandbox",
  "car_or_truck",
  "position",
  "email",
  "company_size",
  "mobile",
  "prospect_or_customer",
  "datetime",
  "phone",
  "points",
  "subscription_status",
  "fax",
  "b2b_or_b2c",
  "products",
  "address1",
  "address2",
  "haspurchased",
  "city",
  "crm_id",
  "state",
  "zipcode",
  "country",
  "preferred_locale",
  "timezone",
  "last_active",
  "attribution_date",
  "attribution",
  "website",
  "facebook",
  "foursquare",
  "instagram",
  "linkedin",
  "skype",
  "twitter"
];

const titles = ["Mr", "Mrs", "Miss", "Mr.", "Mrs.", "Miss."];

const isDate = date => {
  return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
};

// for validating email match function outdated
function ValidateEmail(inputText) {
  console.log(inputText);
  return true;
  // const mailformat = new RegExp"/^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/";
  // // console.log(inputText.value);
  // if (inputText.value.Match(mailformat)) {
  //   return true;
  // }
  // return false;
}

// for validating Phone match function outdated
function validatePhone(inputText) {
  const phoneno = /^\d{10}$/;
  if (inputText.match(phoneno)) {
    return true;
  }
  return false;
}

const deduceAddressFields = message => {
  let address1;
  let address2;
  if (message.traits.address || message.context.traits.address) {
    const add = message.traits.address || message.context.traits.address;
    const validLengthAddress = add.length > 128 ? add.substring(0, 127) : add;
    address1 = validLengthAddress.substring(0, 63);
    address2 = validLengthAddress.substring(64, validLengthAddress.length);
  }
  return { address1, address2 };
};

const validatePayload = payload => {
  // checking for message details validations
  if (payload.email && !ValidateEmail(payload.email)) {
    throw new CustomError("Invalid Mail Provided", 400);
  }
  if (payload.phone && !validatePhone(payload.phone)) {
    throw new CustomError("Invalid Phone No. Provided", 400);
  }
  if (payload.title && !titles.includes(payload.title)) {
    throw new CustomError("This title is not supported", 400);
  }
  if (payload.last_active && !isDate(payload.last_active)) {
    throw new CustomError("Date is Invalid", 400);
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
 * If the lookup key is not found we fallback to email. If email is also not provided, we throw error.
 */

const searchContactId = async (message, destination) => {
  const { lookupField, username, password, subDomainName } = destination.Config;
  let searchContactsResponse;
  let contactId;
  const traits = getFieldValueFromMessage(message, "traits");
  let propertyName;

  if (!traits) {
    throw new CustomError(
      "[HS]:: Identify - Invalid traits value for lookup field",
      400
    );
  }

  // lookupField key provided in Config.lookupField not found in traits
  // then default it to email
  if (!traits[`${lookupField}`]) {
    propertyName = "email";

    if (!traits.email) {
      throw new CustomError(
        "[HS] Identify:: email i.e a deafult lookup field for contact lookup not found in traits",
        400
      );
    }
  } else {
    // look for propertyName (key name) in traits
    // Config.lookupField -> lookupField
    // traits: { lookupField: email }
    propertyName = traits[`${Config.lookupField}`];
  }

  // extract its value from the known propertyName (key name)
  // if not found in our structure then look for it in traits
  // Config.lookupField -> lookupField
  // eg: traits: { lookupField: email, email: "test@test.com" }
  const value =
    getFieldValueFromMessage(message, propertyName) ||
    traits[`${propertyName}`];

  if (!value) {
    throw new CustomError(
      `[HS] Identify:: '${propertyName}' lookup field for contact lookup not found in traits`,
      400
    );
  }
  const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

  let requestParams = {};
  const colParam = `where[0][col]`;
  const expressionParam = `where[0][expr]`;
  const valParam = `[0][val]`;
  requestParams[colParam] = propertyName;
  requestParams[expressionParam] =`in`;
  requestParams [valParam] = value;

    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${basicAuth}`
      }
    };
    searchContactsResponse = await httpGET(
      BASE_URL.replace("subDomainName",subDomainName),
      requestParams,
      requestOptions
    );
    searchContactsResponse = processAxiosResponse(searchContactsResponse);
  

  if (searchContactsResponse.status !== 200) {
    throw new CustomError(
      `Failed to get hubspot contacts: ${JSON.stringify(
        searchContactsResponse.response
      )}`,
      searchContactsResponse.status
    );
  }

  // throw error if more than one contact is found as it's ambiguous
  //TODO: see the results structure
  if (searchContactsResponse.response?.total > 1) {
    throw new CustomError(
      "Unable to get single Hubspot contact. More than one contacts found. Retry with unique lookupPropertyName and lookupValue",
      400
    );
  } else if (searchContactsResponse.response?.total === 1) {
    // a single and unique contact found
    contactId = Object.keys(searchContactsResponse.response?.contacts)[0];
  } else {
    // contact not found
    contactId = null;
  }

  return contactId;
};

module.exports = {
  Fields,
  titles,
  isDate,
  getEncodedAuth,
  ValidateEmail,
  validatePhone,
  deduceAddressFields,
  validatePayload,
  searchContacts
  
};

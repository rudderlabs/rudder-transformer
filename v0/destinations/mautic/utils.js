const { CustomError } = require("../../util");
const { BASE_URL } = require("./config");
const { httpGET } = require("../../../adapters/network");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const _ = require("lodash");
const { getFieldValueFromMessage } = require("../../util");
const { set } = require("lodash");

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
const poc = ["Prospect", "Customer"];

const subscription_statuses = ["New", "Existing"];

const roles = [
  "Individual Contributor",
  "Manager",
  "Director",
  "Executive",
  "Consultant"
];

// for validating email match function outdated
function validateEmail(inputText) {
  return true;
  // console.log(inputText);
  // const mailformat = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
  // return  mailformat.test(mailformat);
}
// for validating Phone match function outdated
function validatePhone(inputText) {
  const phoneno = /^\d{10}$/;
  if (phoneno.test(inputText)) {
    return true;
  }
  return false;
}
const addInPayload = (payload, message) => {
  const { traits, context } = message;
  if (
    (traits && traits?.hasPurchased) ||
    (context.traits && context.traits?.hasPurchased)
  ) {
    let purchased_status = traits?.hasPurchased || context.traits?.hasPurchased;
    purchased_status = purchased_status.toLowerCase();
    if (purchased_status === "yes" || purchased_status === "no") {
      set(payload, "haspurchased", purchased_status);
    } else {
      throw new CustomError("Invalid Purchase Status", 400);
    }
  }
  if ((traits && traits?.role) || (context && context.traits?.role)) {
    const Role =
      traits && traits?.role
        ? message.traits?.role
        : message.context.traits?.role;
    if (!roles.includes(Role)) {
      throw new CustomError("This Role is not supported", 400);
    }
    set(payload, "role", Role);
  }
  if (
    (traits && traits?.subscriptionStatus) ||
    (context.traits && context.traits?.subscriptionStatus)
  ) {
    const status =
      traits && traits?.subscriptionStatus
        ? message.traits?.subscriptionStatus
        : message.context.traits?.subscriptionStatus;
    if (!subscription_statuses.includes(status)) {
      throw new CustomError("This Subscription status is not supported.", 400);
    }
    set(payload, "subscription_status", status);
  }
  if (
    (traits && traits?.prospectOrCustomer) ||
    context.traits?.prospectOrCustomer
  ) {
    const POC =
      message.traits?.prospectOrCustomer ||
      message.context.traits?.prospectOrCustomer;
    if (!poc.includes(POC)) {
      throw new CustomError(
        "prospectOrCustomer can only be either prospect or customer or null ",
        400
      );
    }
    set(payload, "prospect_or_customer", POC);
  }
  return payload;
};
const deduceAddressFields = message => {
  const { traits, context } = message;
  let address1;
  let address2;
  if (
    (traits !== undefined && traits?.address) ||
    (context.traits && context.traits?.address)
  ) {
    const add =
      traits && traits?.address
        ? message.traits.address
        : message.context.traits.address;
    if (typeof add === "string") {
      const validLengthAddress = add.length > 128 ? add.substring(0, 127) : add;
      address1 = validLengthAddress.substring(0, 63);
      address2 = validLengthAddress.substring(64, validLengthAddress.length);
    }
  }
  return { address1, address2 };
};

const validatePayload = payload => {
  // checking for message details validations
  if (payload.email && !validateEmail(payload.email)) {
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
  if(payload.state && !payload.state[0]===payload.state[0].toUpperCase()){
    throw new CustomError("State is Invalid", 400);
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

const searchContactId = async (message, destination,identifyFlag) => {
  const { lookUpField, userName, password, subDomainName } = destination.Config;
  let searchContactsResponse;
  let contactId;
  const traits = getFieldValueFromMessage(message, "traits");
  let propertyName;

  if (!traits) {
    throw new CustomError(
      "Invalid traits value for lookup field",
      400
    );
  }

  // lookupField key provided in Config.lookupField not found in traits
  // then default it to email
  if (!traits[`${lookUpField}`]) {
    propertyName = "email";

    if (!traits?.email) {
      if(identifyFlag){
        return null;
      }
      console.log
      throw new CustomError(
        "email i.e a default lookup field for contact lookup not found in traits",
        400
      );
    }
  } else {
    // look for propertyName (key name) in traits
    // Config.lookupField -> lookupField
    // traits: { lookupField: email }
    propertyName = lookUpField;
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
      ` '${propertyName}' lookup field for contact lookup not found in traits`,
      400
    );
  }
  const basicAuth = Buffer.from(`${userName}:${password}`).toString("base64");
  console.log(basicAuth, " basic");
  let requestParams = {};
  const colParam = `where[0][col]`;
  const expressionParam = `where[0][expr]`;
  const valParam = `[0][val]`;
  requestParams[colParam] = propertyName;
  requestParams[expressionParam] = `in`;
  requestParams[valParam] = value;

  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic YW5hbnRqYWluNDU4MjNAZ21haWwuY29tOm0zZEczMjVDNTFDMVJQcQ==`
    }
  };
  console.log(`${BASE_URL.replace(
    "subDomainName",
    subDomainName
  )}/contacts/`);
  // console.log(requestParams);
  // console.log(requestOptions);
  searchContactsResponse = await httpGET(
    "https://testapi3.mautic.net/api/contacts/",
    requestOptions
  );
  searchContactsResponse = processAxiosResponse(searchContactsResponse);
    console.log(searchContactsResponse);
  if (searchContactsResponse.status !== 200) {
    throw new CustomError(
      `Failed to get Mautic contacts: ${JSON.stringify(
        searchContactsResponse.response
      )}`,
      searchContactsResponse.status
    );
  }

  // throw error if more than one contact is found as it's ambiguous
  //TODO: see the results structure
  console.log(searchContactsResponse);
  if (searchContactsResponse.response?.total > 1) {
    throw new CustomError(
      "Unable to get single Mautic contact. More than one contacts found. Retry with unique lookupPropertyName and lookupValue",
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
  validateEmail,
  validatePhone,
  deduceAddressFields,
  validatePayload,
  searchContactId,
  addInPayload
};

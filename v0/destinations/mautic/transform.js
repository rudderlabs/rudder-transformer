// const { config } = require("dotenv/types");
const set = require("set-value");
// const get = require("get-value");
const {
  defaultRequestConfig,
  CustomError,
  constructPayload,
  // isDefinedAndNotNull,
  // getIntegrationsObj,
  removeUndefinedAndNullValues
  // isDefinedAndNotNullAndNotEmpty,
  // getErrorRespEvents,
  // getSuccessRespEvents
} = require("../../util");

const titles = ["Mr", "Mrs", "Miss", "Mr.", "Mrs.", "Miss."];
const isDate = date => {
  return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
};
// const POC=["Prospect","Customer"];

const { EventType } = require("../../../constants");

const { BASEURL, mappingConfig, ConfigCategories } = require("./config");

function getEncodedAuth(destination) {
  const { Config } = destination;
  let tempString = `${Config.userName}:${Config.password}`;
  console.log(tempString);
  tempString = btoa(tempString);
  console.log(tempString);
  return tempString;
}

// ReponseBuilderforIdentifyCall
const responseBuilderIdentify = async (
  payload,
  endpoint,
  method,
  destination
) => {
  if (payload) {
    const response = defaultRequestConfig();
    response.body.FORM = removeUndefinedAndNullValues(payload);
    response.endpoint = endpoint;
    const authKey = await getEncodedAuth(destination);
    response.headers = {
      Authorization: `Basic ${authKey}`
    };
    response.method = method;
    return response;
  }
  throw new CustomError("Payload could not be Constructed");
};
const responseBuilderGroup = async (endpoint, destination) => {
  const response = defaultRequestConfig();
  response.endpoint = endpoint;
  const authKey = await getEncodedAuth(destination);
  response.headers = {
    Authorization: `Basic ${authKey}`
  };
  response.method = "POST";
  return response;
};

let BASE_URL;

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

const groupResponseBuilder = (message, destination) => {
  console.log("Inside");
  let groupClass;
  switch (message.traits.type.toLowerCase()) {
    case "segments":
      groupClass = "segemnts";
      break;
    case "campaigns":
      groupClass = "campaigns";
      break;
    case "companies":
      groupClass = "companies";
      break;
    default:
      throw new CustomError("This grouping is npt supported");
  }
  const endpoint = `${BASE_URL}/${groupClass}/${message.groupId}/contact/${message.context.externalId}/add`;
  return responseBuilderGroup(endpoint, destination);
};
const identifyResponseBuilder = (message, destination) => {
  const { Config } = destination;
  // checking for message details validations
  if (
    message.context.traits.email &&
    !ValidateEmail(message.context.traits.email)
  ) {
    throw CustomError("Invalid Mail Provided", 400);
  }
  if (
    message.context.traits.Phone &&
    !validatePhone(message.context.traits.Phone)
  ) {
    throw CustomError("Invalid Phone No. Provided", 400);
  }
  if (message.context.traits.title && !titles.includes(message.title)) {
    throw CustomError("This title is not supported", 400);
  }
  if (message.originalTimestamp && !isDate(message.originalTimestamp)) {
    throw CustomError("Date is Invalid", 400);
  }
  const payload = constructPayload(
    message,
    mappingConfig[ConfigCategories.IDENTIFY.name]
  );
  if (message.traits.address || message.context.traits.address) {
    let add;
    if (message.traits.address) {
      add = message.traits.address;
    } else {
      add = message.context.traits.address;
    }
    const len = add.length;
    if (len > 128) {
      throw new CustomError(
        "Please provide an Address with less than 128 char ",
        400
      );
    }
    set(payload, "address1", add.substr(0, len / 2));
    set(payload, "address2", add.substr(len / 2 + 1, len - 1));
  }
  console.log("Payload:", payload);
  const endpoint = `${BASE_URL}/contacts/new`;
  return responseBuilderIdentify(
    payload,
    endpoint,
    ConfigCategories.IDENTIFY.method,
    destination
  );
};
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
const process = async event => {
  // console.log(event);
  const { message, destination } = event;
  const { Config } = destination;
  // checking for the configurations validations
  if (!Fields.includes(Config.lookUpField)) {
    throw new CustomError("Invalid Lookup Field", 400);
  }
  if (!Config.password) {
    throw new CustomError("Password field can not be empty", 400);
  }
  if (!Config.subDomainName) {
    throw new CustomError("Sub-Domain Name field can not be empty", 400);
  }
  if (!ValidateEmail(Config.userName)) {
    throw new CustomError("User Name is not Valid", 400);
  }

  // Validating if message type is even given or not
  if (!message.type) {
    throw new CustomError(
      "Message Type is not present. Aborting message.",
      400
    );
  }
  const messageType = message.type.toLowerCase();
  let response;
  // Switching to particular Message Event
  BASE_URL = BASEURL.replace("subDomainName", Config.subDomainName);

  switch (messageType) {
    case EventType.IDENTIFY:
      response = await identifyResponseBuilder(message, destination);
      break;
    case EventType.GROUP:
      response = await groupResponseBuilder(message, destination);
      break;
    default:
      throw new CustomError(`Message type ${messageType} not supported`, 400);
  }
  console.log("Response: ",response);
  return response;
};
module.exports = { process };

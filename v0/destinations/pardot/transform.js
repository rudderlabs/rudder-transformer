// const parser = require("fast-xml-parser");
const _ = require("lodash");
const { axios } = require("axios");
const { identifyConfig } = require("./config");
const {
  defaultRequestConfig,
  constructPayload,
  defaultPostRequestConfig,
  getFieldValueFromMessage,
  isDefinedAndNotNullAndNotEmpty,
  CustomError,
  removeUndefinedValues
} = require("../../util");

const { CONFIG_CATEGORIES } = require("./config");

// const options = {
//   attributeNamePrefix: "@_",
//   attrNodeName: "attr",
//   textNodeName: "#text",
//   ignoreAttributes: true,
//   ignoreNameSpace: false,
//   allowBooleanAttributes: false,
//   parseNodeValue: true,
//   parseAttributeValue: false,
//   trimValues: true,
//   cdataTagName: "__cdata",
//   cdataPositionChar: "\\c",
//   parseTrueNumberOnly: false,
//   arrayMode: false, // "strict"
//   attrValueProcessor: (val, attrName) =>
//     he.decode(val, { isAttributeValue: true }),
//   tagValueProcessor: (val, tagName) => he.decode(val),
//   stopNodes: ["parse-me-as-string"]
// };

// converting the array of objects to an array of field names
const convertObjectToArray = (objectInput, propertyName) => {
  return objectInput
    .map(objectItem => objectItem[propertyName])
    .filter(e => isDefinedAndNotNullAndNotEmpty(e));
};

// checking if the prospect exists or not

const checkProspectExistence = async (
  destination,
  category,
  traits,
  accessToken
) => {
  const sortedLookUpList = {};
  const { lookupFields, businessUnitId } = destination.Config;

  const FormattedLookupFields = convertObjectToArray(
    lookupFields,
    "lookupFields"
  );

  // creating the query params object using message.traits
  FormattedLookupFields.forEach(field => {
    if (Object.prototype.hasOwnProperty.call(traits, field)) {
      sortedLookUpList[field] = traits[field];
    }
  });

  // if the fields specified to make the query do not exist, we will look for id or fid
  if (_.isEmpty(sortedLookUpList)) {
    sortedLookUpList.id = traits.id;
    sortedLookUpList.fid = traits.fid;
  }
  // finding if the prospect exists
  const response = await axios.get(
    category.queryUrl,
    {
      params: removeUndefinedValues(sortedLookUpList)
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Bearer ${accessToken}`,
        "Pardot-Business-Unit-Id": businessUnitId
      }
    }
  );

  // give proper response
};

const responseBuilderSimple = (
  payload,
  category,
  destination,
  accessToken,
  prospectExists
) => {
  const responseBody = payload;
  const response = defaultRequestConfig();
  response.endpoint = prospectExists ? category.updateUrl : category.createUrl;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    Authorization: `Bearer ${accessToken}`
  };
  response.headers["Pardot-Business-Unit-Id"] =
    destination.Config.businessUnitId;
  response.body.JSON = responseBody;
  return response;

  // fail-safety for developer error
  // throw new Error("Payload could not be constructed");
};

// Consider only Identify call for Pardot for now

const getAccessToken = async destination => {
  const { pardotAccountEmail, pardotAccountPassword } = destination.Config;

  const authResponse = await axios.post(
    "https://login.salesforce.com//api/login/version/4",
    {
      username: pardotAccountEmail,
      password: pardotAccountPassword,
      clientId: "",
      clientSecret: "",
      grantType: "password"
    }
  );
  // if (parser.validate(authResponse) === true) {
  // const authResponseJson = parser.parse(authResponse, options);
  // return authResponseJson.access_token;
  return authResponse.access_token;
  // }
  // return null;
};

const processIdentify = (message, destination, category) => {
  const accessToken = getAccessToken(destination);
  if (!accessToken) {
    throw new Error(" authentication fail");
  }
  const traits = getFieldValueFromMessage(message, "traits");
  const prospectExists = checkProspectExistence(
    destination,
    category,
    traits,
    accessToken
  );
  if (!prospectExists) {
    const prospectEmail = getFieldValueFromMessage(message, "email");
    if (!prospectEmail) {
      throw new CustomError(
        " Email is a required field for creating new prospect",
        400
      );
    }
  }
  const prospectObject = constructPayload(traits, identifyConfig);
  return responseBuilderSimple(
    prospectObject,
    category,
    destination,
    accessToken,
    prospectExists
  );
};

const processEvent = (message, destination) => {
  let response;
  if (!message.type) {
    throw new Error("Message Type is not present. Aborting message.");
  }
  if (message.type === "identify") {
    const category = CONFIG_CATEGORIES.IDENTIFY;
    response = processIdentify(message, destination, category);
  }
  return response;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;

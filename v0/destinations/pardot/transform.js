/* eslint-disable no-lonely-if */
/* eslint-disable no-else-return */
// const parser = require("fast-xml-parser");
const { axios } = require("axios");
const { identifyConfig } = require("./config");
const logger = require("../../../logger");
const {
  defaultRequestConfig,
  constructPayload,
  defaultPostRequestConfig,
  getFieldValueFromMessage,
  isDefinedAndNotNullAndNotEmpty,
  CustomError,
  removeUndefinedValues,
  getDestinationExternalID
} = require("../../util");

const { CONFIG_CATEGORIES } = require("./config");

const responseBuilderSimple = (
  payload,
  category,
  destination,
  accessToken,
  prospectExists,
  operationField,
  operationValue
) => {
  const responseBody = removeUndefinedValues(payload);
  const response = defaultRequestConfig();
  response.endpoint = prospectExists
    ? `${category.updateUrl}/${operationField}/${operationValue}?format=json`
    : category.createUrl;
  response.method = defaultPostRequestConfig.requestMethod;
  response.headers = {
    Authorization: `Bearer ${accessToken}`
  };
  response.headers["Pardot-Business-Unit-Id"] =
    destination.Config.businessUnitId;
  response.body.FORM = responseBody;
  return response;
};

//********   OAUTH PART NEEDS TO BE ADDRESSED *********************//

// const getAccessToken = async destination => {
//   const { pardotAccountEmail, pardotAccountPassword } = destination.Config;

//   const authResponse = await axios.post(
//     "https://login.salesforce.com//api/login/version/4",
//     {
//       username: pardotAccountEmail,
//       password: pardotAccountPassword,
//       clientId: "",
//       clientSecret: "",
//       grantType: "password"
//     }
//   );
//   if (!authResponse.access_token) {
//     throw new CustomError(
//       `Authorization failed : ${authResponse.error_description}`,
//       400
//     );
//   }
//   return authResponse.access_token;
// };

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

// in case both id and fid is provided, checking if both of them belongs from the same prospect. 
// If yes, then return true, else false.
const checkDataConsistency = async (
  category,
  destination,
  accessToken,
  id,
  fid
) => {
  const { businessUnitId } = destination.Config;
  let response;

  try {
    response = await axios.get(category.readUrl.replace(":id", id), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Pardot-Business-Unit-Id": businessUnitId
      }
    });
    if (!response.prospect) {
      throw new CustomError(
        `No prospect information available with id : ${id}`,
        400
      );
    } else {
      const fieldValueMatch = getKeyByValue(response.prospect, fid);
      if (
        isDefinedAndNotNullAndNotEmpty(fieldValueMatch) &&
        fieldValueMatch.includes("_fid") &&
        fieldValueMatch !== "crm_fid"
      ) {
        return true;
      } else {
        return false;
      }
    }
  } catch (e) {
    throw new CustomError(response.err, 400);
  }
};
const processIdentify = (message, destination, category) => {
  const accessToken = getAccessToken(destination);
  const { campaignId } = destination.Config;
  // let prospectExists;
  if (!accessToken) {
    throw new Error("authentication fail");
  }

  const id = getDestinationExternalID(message, "pardotProspectId");
  const fid = getDestinationExternalID(message, "pardotFid");

  const traits = getFieldValueFromMessage(message, "traits");
  const prospectObject = constructPayload(traits, identifyConfig);

  const email = getFieldValueFromMessage(message, "email");
  if (!id && !fid && !email) {
    throw new CustomError(
      "Any one of prospect id, prospect fid or email is required for prospect creation or updation",
      400
    );
  } else if (!fid && !id) {
    // when ONLY email is present we will consider to create a prospect every time
    if (!prospectObject.campaign_id) {
      prospectObject.campaign_id = campaignId;
    }
    return responseBuilderSimple(
      prospectObject,
      category,
      destination,
      accessToken,
      false,
      "email",
      email
    );
  } else if (id && fid) {
    // read with id and check if the fid provided matches with prospect data
    const dataConsistencyResult = checkDataConsistency(
      category,
      destination,
      accessToken,
      id,
      fid
    );
    if (dataConsistencyResult) {
      // if it matches, update the prospect using the prospect id
      return responseBuilderSimple(
        prospectObject,
        category,
        destination,
        accessToken,
        true,
        "id",
        id
      );
    } else {
      // otherwise ignore update operation and keep log
      logger.debug("id and fid do not exist in the same prospect");
    }
  } else if (id) {
    // if ONLY id is present update with id
    return responseBuilderSimple(
      prospectObject,
      category,
      destination,
      accessToken,
      true,
      "id",
      id
    );
  } else if (fid) {
    // if only fid is present, update with fid
    return responseBuilderSimple(
      prospectObject,
      category,
      destination,
      accessToken,
      true,
      "fid",
      fid
    );
  }
};

const processEvent = (message, destination) => {
  let response;
  if (!message.type) {
    throw new Error("Message Type is not present. Aborting message.");
  }
  if (!destination.Config.campaignId) {
    throw new CustomError("Campaign Id is mandatory", 400);
  }

  if (!destination.Config.businessUnitId) {
    throw new CustomError("Business Unit Id is mandatory", 400);
  }

  if (message.type === "identify") {
    const category = CONFIG_CATEGORIES.IDENTIFY;

    response = processIdentify(message, destination, category);
  } else {
    throw new CustomError(`${message.type} is not supported in Pardot`, 400);
  }
  return response;
};

const process = event => {
  return processEvent(event.message, event.destination);
};

exports.process = process;

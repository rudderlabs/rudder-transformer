const get = require("get-value");
const {
  COMAPNY_ENDPOINT,
  ConfigCategory,
  MappingConfig,
  ReservedTraitsProperties,
  ReservedCompanyProperties
} = require("./config");
const { httpPOST } = require("../../../adapters/network");
const {
  processAxiosResponse
} = require("../../../adapters/utils/networkUtils");
const {
  CustomError,
  getFieldValueFromMessage,
  removeUndefinedAndNullValues,
  constructPayload
} = require("../../util");
const { MAPPING_CONFIG } = require("../freshmarketer/config");

/**
 *
 * Craete or update company based on the group call parameters
 * @param {*} companyPayload
 * @param {*} param1
 */
const createUpdateCompany = async (companyPayload, Config) => {
  const companyResponse = await httpPOST(COMAPNY_ENDPOINT, companyPayload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Config.apiKey}`
    }
  });
  const processedCompanyResponse = processAxiosResponse(companyResponse);
  if (processedCompanyResponse.status !== 200) {
    const errMessage = JSON.stringify(processedCompanyResponse.response) || "";
    const errorStatus = processedCompanyResponse.status || 500;
    throw new CustomError(
      `[Group]: failed create/update company details ${errMessage}`,
      errorStatus
    );
  }
};

const getCompanyAttribute = companyId => {
  const companiesList = [];

  companiesList.push({
    company_id: companyId
  });

  return companiesList;
};

const postPorcessUserPayload = (userPayload, message) => {
  const finalPayload = userPayload;

  if (!userPayload.user_id) {
    throw new CustomError("userId or anonymousId is mandatory", 400);
  }
  if (userPayload.name === undefined || userPayload.name === "") {
    const firstName = getFieldValueFromMessage(message, "firstName");
    const lastName = getFieldValueFromMessage(message, "lastName");
    if (firstName && lastName) {
      finalPayload.name = `${firstName} ${lastName}`;
    } else {
      finalPayload.name = firstName || lastName;
    }
  }

  finalPayload.companies = getCompanyAttribute(
    get(finalPayload, "custom_attributes.company.id") || message.groupId
  );

  if (finalPayload.custom_attributes) {
    ReservedTraitsProperties.forEach(trait => {
      delete finalPayload.custom_attributes[trait];
    });
  }

  return removeUndefinedAndNullValues(finalPayload);
};

const processIdentify = message => {
  const userPayload = constructPayload(
    message,
    MappingConfig[ConfigCategory.IDENTIFY.name]
  );
  return postPorcessUserPayload(userPayload, message);
};

const processTrack = message => {
  const eventPayload = constructPayload(
    message,
    MappingConfig[ConfigCategory.TRACK.name]
  );
  // pass only string, number, boolean properties
  if (eventPayload.user_id || eventPayload.email) {
    const metadata = {};
    const { properties } = message;
    if (properties) {
      eventPayload.company_id =
        properties.organization_id || properties.company_id;

      Object.keys(properties).forEach(key => {
        const val = properties[key];
        if (val && typeof val !== "object" && !Array.isArray(val)) {
          metadata[key] = val;
        }
      });
    }
    if (eventPayload.user_id && !metadata.user_id && !metadata.userId) {
      metadata.user_id = eventPayload.user_id;
    }

    return removeUndefinedAndNullValues({ ...eventPayload, metadata });
  }
  throw new CustomError("Email or userId is mandatory", 400);
};

const processGroup = async (message, { Config }) => {
  let companyPayload = constructPayload(
    message,
    MappingConfig[ConfigCategory.GROUP_COMPANY.name]
  );
  if (!companyPayload.company_id) {
    throw new CustomError("groupId Id is mandatory", 400);
  }
  if (companyPayload.custom_attributes) {
    ReservedCompanyProperties.forEach(trait => {
      delete companyPayload.custom_attributes[trait];
    });
  }
  companyPayload = removeUndefinedAndNullValues(companyPayload);
  await createUpdateCompany(companyPayload, Config);
  const userPayload = constructPayload(
    message,
    MAPPING_CONFIG[ConfigCategory.GROUP_USER.name]
  );
  const processsedUserPayload = postPorcessUserPayload(userPayload, message);
  return processsedUserPayload;
};

module.exports = {
  createUpdateCompany,
  processIdentify,
  processTrack,
  processGroup
};

const get = require("get-value");
const {
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
  constructPayload,
  isHttpStatusSuccess
} = require("../../util");

/**
 *
 * Craete or update company based on the group call parameters
 * @param {*} companyPayload
 * @param {*} param1
 */
const createUpdateCompany = async (companyPayload, Config) => {
  const companyResponse = await httpPOST(
    ConfigCategory.GROUP_COMPANY.endpoint,
    companyPayload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Config.apiKey}`
      }
    }
  );
  const processedCompanyResponse = processAxiosResponse(companyResponse);
  if (!isHttpStatusSuccess(processedCompanyResponse.status)) {
    const errMessage = JSON.stringify(processedCompanyResponse.response) || "";
    const errorStatus = processedCompanyResponse.status || 500;
    throw new CustomError(
      `[Group]: failed create/update company details ${errMessage}`,
      errorStatus
    );
  }
};

const getCompanyAttribute = (companyId, remove = false) => {
  if (companyId) {
    const companiesList = [];
    companiesList.push({
      company_id: companyId,
      remove
    });
    return companiesList;
  }
  return null;
};

const postPorcessUserPayload = (userPayload, message) => {
  const finalPayload = userPayload;

  if (!userPayload.user_id && !userPayload.email) {
    throw new CustomError("Email or userId is mandatory", 400);
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
    get(finalPayload, "custom_attributes.company.id") || message.groupId,
    get(finalPayload, "custom_attributes.company.remove")
  );

  if (finalPayload.custom_attributes) {
    ReservedTraitsProperties.forEach(trait => {
      delete finalPayload.custom_attributes[trait];
    });

    Object.keys(finalPayload.custom_attributes).forEach(key => {
      const val = finalPayload.custom_attributes[key];
      if (typeof val === "object" || Array.isArray(val)) {
        delete finalPayload.custom_attributes[key];
      }
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

const processTrack = (message, { Config }) => {
  const eventPayload = constructPayload(
    message,
    MappingConfig[ConfigCategory.TRACK.name]
  );
  // pass only string, number, boolean properties
  if (!eventPayload.user_id && !eventPayload.email) {
    throw new CustomError("Email or userId is mandatory", 400);
  }
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

  if (Config.enablededuplication) {
    eventPayload.deduplication_id =
      get(message, `${Config.deduplicationField}`) || get(message, "messageId");
  }

  return removeUndefinedAndNullValues({ ...eventPayload, metadata });
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

    Object.keys(companyPayload.custom_attributes).forEach(key => {
      const val = companyPayload.custom_attributes[key];
      if (typeof val === "object" || Array.isArray(val)) {
        delete companyPayload.custom_attributes[key];
      }
    });
  }
  companyPayload = removeUndefinedAndNullValues(companyPayload);
  await createUpdateCompany(companyPayload, Config);
  const userPayload = constructPayload(
    message,
    MappingConfig[ConfigCategory.GROUP_USER.name]
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

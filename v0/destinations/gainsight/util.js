/* eslint-disable prettier/prettier */
const axios = require("axios");
const logger = require("../../../logger");
const { ENDPOINTS, getLookupPayload } = require("./config");

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.response = { status: statusCode };
  }
}

const searchGroup = async (groupName, Config) => {
  let resp;
  try {
    resp = await axios.post(
      `${ENDPOINTS.groupSearchEndpoint(Config.domain)}`,
      getLookupPayload(groupName),
      {
        headers: {
          Accesskey: Config.accessKey,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    let errMessage = "";
    let errorStatus = 500;
    if (error.response && error.response.data) {
      errMessage = error.response.data.errorDesc;
      errorStatus = error.response.status;
    }
    throw new CustomError(`failed to search group ${errMessage}`, errorStatus);
  }
  
  if (!resp || !resp.data || resp.status !== 200) {
    throw new CustomError("failed to search group", 500);
  }
  return resp;
};

const createGroup = async (payload, Config) => {
  let resp;
  try {
    resp = await axios.post(
      `${ENDPOINTS.groupCreateEndpoint(Config.domain)}`,
      {
        records: [payload]
      },
      {
        headers: {
          Accesskey: Config.accessKey,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    let errMessage = "";
    let errorStatus = 500;
    if (error.response && error.response.data) {
      errMessage = error.response.data.errorDesc;
      errorStatus = error.response.status;
    }
    throw new CustomError(`failed to create group ${errMessage}`, errorStatus);
  }
  
  if (!resp || !resp.data || resp.status !== 200) {
    throw new CustomError("failed to create group", 500);
  }
  return resp.data.data.records[0].Gsid;
};

const updateGroup = async (payload, Config) => {
  let resp;
  try {
    resp = await axios.put(
      `${ENDPOINTS.groupUpdateEndpoint(Config.domain)}`,
      {
        records: [payload]
      },
      {
        headers: {
          Accesskey: Config.accessKey,
          "Content-Type": "application/json"
        },
        params: {
          keys: "Name"
        }
      }
    );
  } catch (error) {
    let errMessage = "";
    let errorStatus = 500;
    if (error.response && error.response.data) {
      errMessage = error.response.data.errorDesc;
      errorStatus = error.response.status;
    }
    throw new CustomError(`failed to update group ${errMessage}`, errorStatus);
  }
  
  if (!resp || !resp.data || resp.status !== 200) {
    throw new CustomError("failed to update group", 500);
  }
  return resp.data.data.records[0].Gsid;
};

/**
 * Provides Custom Field name mappping. If map is empty, only keeps
 * the default keys and removes all other keys from payload.
 * @param {*} payload
 * @param {*} fieldsMap
 * @param {*} exlusionKeys
 * @returns
 */
const renameCustomFieldsFromMap = (payload, fieldsMap, exlusionKeys) => {
  const mappedPayload = {};

  if (!fieldsMap || Object.keys(fieldsMap).length === 0) {
    Object.keys(payload).forEach(key => {
      if (exlusionKeys.includes(key)) {
        mappedPayload[key] = payload[key];
      }
    });
    return mappedPayload;
  }

  const fieldMapKeys = Object.keys(fieldsMap);
  Object.keys(payload).forEach(key => {
    if (exlusionKeys.includes(key)) {
      mappedPayload[key] = payload[key];
    } else if (fieldMapKeys.includes(key)) {
      mappedPayload[fieldsMap[key]] = payload[key];
    } else {
      logger.info(`dropping key ${key}`);
    }
  });
  return mappedPayload;
};

const getConfigOrThrowError = (Config, requiredKeys, methodName) => {
  const retObj = {};
  requiredKeys.forEach(key => {
    if (!Config[key]) {
      throw new CustomError(`${key} is required for ${methodName}`, 500);
    }
    retObj[key] = Config[key];
  });
  return retObj;
};

module.exports = {
  searchGroup,
  createGroup,
  updateGroup,
  renameCustomFieldsFromMap,
  getConfigOrThrowError,
  CustomError
};

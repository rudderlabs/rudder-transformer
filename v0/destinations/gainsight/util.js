/* eslint-disable prettier/prettier */
const axios = require("axios");
const { ENDPOINTS, getLookupPayload } = require("./config");

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
    if (!resp || !resp.data || resp.status !== 200) {
      throw new Error();
    }
  } catch (error) {
    throw new Error("failed to search group");
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
    if (!resp || !resp.data || resp.status !== 200) {
      throw new Error();
    }
  } catch (error) {
    throw new Error("failed to search group");
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
    if (!resp || !resp.data || resp.status !== 200) {
      throw new Error();
    }
  } catch (error) {
    throw new Error("failed to search group");
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
    }
    else if (fieldMapKeys.includes(key)) {
      mappedPayload[fieldsMap[key]] = payload[key];
    } 
    else {
      // drop the key in this case
    }
  });
  return mappedPayload;
};

const getConfigOrThrowError = (Config, requiredKeys, methodName) => {
  const retObj = {};
  requiredKeys.forEach(key => {
    if (!Config[key]) {
      throw new Error(`${key} is required for ${methodName}`);
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
  getConfigOrThrowError
};

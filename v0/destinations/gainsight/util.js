const axios = require("axios");
const { ENDPOINTS, getLookupPayload } = require("./config");

const searchGroup = (groupName, Config) => {
  let resp;
  try {
    resp = axios.get(
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

const createGroup = (payload, Config) => {
  let resp;
  try {
    resp = axios.get(
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

const updateGroup = (payload, Config) => {
  let resp;
  try {
    resp = axios.get(
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

module.exports = {
  searchGroup,
  createGroup,
  updateGroup
};

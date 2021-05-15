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

module.exports = {
  searchGroup,
  createGroup,
  updateGroup
};

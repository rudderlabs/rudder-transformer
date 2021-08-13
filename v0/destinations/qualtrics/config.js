const { getMappingConfig, isDefinedAndNotNull } = require("../../util");

const getEndpoint = (datacenterId, directoryId, contactId) => {
  let endpoint;

  if (isDefinedAndNotNull(contactId)) {
    endpoint = `https://${datacenterId}.qualtrics.com/API/v3/directories/${directoryId}/contacts/${contactId}`;
  } else {
    endpoint = `https://${datacenterId}.qualtrics.com/API/v3/directories/${directoryId}/contacts`;
  }
  return endpoint;
};

const CONFIG_CATEGORIES = {
  CONTACT: {
    name: "contactConfig"
  }
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

module.exports = {
  CONFIG_CATEGORIES,
  MAPPING_CONFIG,
  getEndpoint
};

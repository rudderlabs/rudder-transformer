const axios = require("axios");
const { MAPPING_CONFIG } = require("./config");

const {
  CustomError,
  constructPayload,
  getFieldValueFromMessage,
  isDefinedAndNotNull
} = require("../../util");

const CONTACT_KEY_LIST = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "extRef",
  "lanuage",
  "unsubscribed",
  "contactId",
  "userId"
];

// embeddedData contains every other trait fields that are not listed inside schema
const populateEmbeddedData = traitsObject => {
  const embeddedDataBlock = {};
  Object.keys(traitsObject).forEach(key => {
    if (!CONTACT_KEY_LIST.includes(key))
      embeddedDataBlock[key] = traitsObject[key];
  });

  return embeddedDataBlock;
};

// function responsible to check if the contact exists wrt the extRef key
const contactExists = async (dataCenterId, directoryId, apiToken, extRef) => {
  let flag = true;
  let res;
  let contactInfo;
  const url = `https://${dataCenterId}.qualtrics.com/API/v3/directories/${directoryId}/contacts/search`;
  const searchCallBody = {
    filter: {
      comparison: "eq",
      filterType: "extRef",
      value: extRef
    }
  };

  const searchCallHeader = {
    headers: {
      "X-API-TOKEN": apiToken,
      "Content-Type": "application/json"
    }
  };

  try {
    // eslint-disable-next-line no-unused-vars
    res = await axios.post(url, searchCallBody, searchCallHeader);
    if (res.data.result.elements.length === 0) {
      flag = false;
      contactInfo = null;
    } else {
      contactInfo = res.data.result.elements[0].id;
    }
  } catch (error) {
    throw new CustomError("Axios call fails", 400);
  }

  const contactUpdate = {
    contactId: contactInfo,
    requireUpdate: flag
  };

  return contactUpdate;
};
// function responsible to prepare the payload
const prepareResponse = (message, category) => {
  let embeddedData = {};

  let outputPayload = {};

  outputPayload = constructPayload(message, MAPPING_CONFIG[category.name]);

  const traits = getFieldValueFromMessage(message, "traits");
  if (isDefinedAndNotNull(traits)) {
    embeddedData = populateEmbeddedData(traits);
  }
  outputPayload.embeddedData = embeddedData;

  return outputPayload;
};
module.exports = {
  populateEmbeddedData,
  contactExists,
  prepareResponse
};

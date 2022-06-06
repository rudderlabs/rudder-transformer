const axios = require("axios");
const md5 = require("md5");
const logger = require("../../../logger");
const { CustomError } = require("../../util");

function getMailChimpEndpoint(datacenterId, audienceId) {
  const mailChimpApi = "api.mailchimp.com";
  const listsUrl = `https://${datacenterId}.${mailChimpApi}/3.0/lists`;
  return `${listsUrl}/${audienceId}`;
}

// Converts to upper case and removes spaces
function filterTagValue(tag) {
  const maxLength = 10;
  const newTag = tag.replace(/[^\w\s]/gi, "");
  if (newTag.length > maxLength) {
    return newTag.slice(0, 10);
  }
  return newTag.toUpperCase();
}

async function checkIfMailExists(apiKey, datacenterId, audienceId, email) {
  if (!email) {
    return false;
  }
  const hash = md5(email);
  const url = `${getMailChimpEndpoint(
    datacenterId,
    audienceId
  )}/members/${hash}`;

  let status = false;
  try {
    await axios.get(url, {
      auth: {
        username: "apiKey",
        password: `${apiKey}`
      }
    });
    status = true;
  } catch (error) {
    logger.error("axios error");
  }
  return status;
}

async function checkIfDoubleOptIn(apiKey, datacenterId, audienceId) {
  let response;
  const url = `${getMailChimpEndpoint(datacenterId, audienceId)}`;
  try {
    response = await axios.get(url, {
      auth: {
        username: "apiKey",
        password: `${apiKey}`
      }
    });
  } catch (error) {
    throw new CustomError(
      "User does not have access to the requested operation",
      error.status || 400
    );
  }
  return !!response.data.double_optin;
}

module.exports = {
  getMailChimpEndpoint,
  filterTagValue,
  checkIfMailExists,
  checkIfDoubleOptIn
};

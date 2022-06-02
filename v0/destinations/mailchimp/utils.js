const axios = require("axios");
const md5 = require("md5");
const logger = require("../../../logger");
const { CustomError } = require("../../util");

function getMailChimpEndpoint(datacenterId, audienceId) {
  const BASE_URL = `https://${datacenterId}.api.mailchimp.com/3.0/lists/${audienceId}`;
  return BASE_URL;
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
  checkIfMailExists,
  checkIfDoubleOptIn
};

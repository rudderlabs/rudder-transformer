const axios = require("axios");
const { ENDPOINTS } = require("./config");

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.response = { status: statusCode };
  }
}

/**
 * @param {*} field 
 * @param {*} value 
 * @param {*} Config 
 * @returns 
 */
const searchUser = async (field, value, Config) => {
  const lookupPayload = {
    query:  {
      operator: "=",
      field, 
      value
    }
  }
  let resp;
  try {
    resp = await axios.post(
      `${ENDPOINTS.IDENTIFY_ENDPOINT}/search`,
      lookupPayload,
      {
        headers: {
          Authorization: `Bearer ${Config.apiToken}`
        }
      }
    );
  }
  catch (err) {
    let errorMessage = "user search failed";
    let errorStatus
    if (error.response) {
      errorMessage = JSON.stringify(error.response);
      errorStatus = error.response.status;
    }
    throw new CustomError(errorMessage, errorStatus || 500);
  }

  if (!resp || !resp.data || !resp.data.data || resp.status !== 200) {
    throw new CustomError("user search failed. invalid response", 500)
  }

  return resp.data.data.length ? 
    resp.data.data[0].id :
    null;
};


module.exports = {
  CustomError,
  searchUser
}
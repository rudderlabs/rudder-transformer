const axios = require("axios");
const { BASE_ENDPOINT } = require("./config");

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.response = { status: statusCode };
  }
}

const handleResponse = response => {
  const { status, data } = response;
  switch (status) {
    case 200:
      if (data && data.data && data.data.id) {
        return {
          userExists: true,
          targetUrl: `${BASE_ENDPOINT}/v1/customers/${data.data.id}?replace=false`
        };
      }
      throw new CustomError(
        `Error while lookingUp Kustomer ${
          data.data ? JSON.stringify(data.data) : ""
        }`,
        400
      );
    case 404:
      return { userExists: false };
    default:
      throw new CustomError(
        data ? JSON.stringify(data) : "Error while lookingUp Kustomer",
        status || 400
      );
  }
};

const fetchKustomer = async (url, destination) => {
  let response;
  try {
    response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${destination.Config.apiKey}`
      }
    });
  } catch (err) {
    if (err.response) {
      return handleResponse(err.response);
    }
    throw new CustomError(err.message, 400);
  }
  return handleResponse(response);
};

module.exports = {
  fetchKustomer,
  CustomError
};

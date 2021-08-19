const axios = require("axios");
const { CustomError } = require("../../util");

const getAccessToken = async config => {
  const { clientId, clientSecret, munchkinId } = config;

  try {
    const resp = await axios.get(
      `https://${munchkinId}.mktorest.com/identity/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`
    );
    if (resp && resp.data) {
      return resp.data.access_token;
    }
    throw new CustomError("Could not retrieve authorisation token", 400);
  } catch (error) {
    throw new CustomError("Could not retrieve authorisation token", 400);
  }
};

module.exports = { getAccessToken };

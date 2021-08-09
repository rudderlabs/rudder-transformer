const axios = require("axios");

const getAccessToken = async config => {
  const { clientId, clientSecret, munchkinId } = config;

  const resp = await axios.get(
    `https://${munchkinId}.mktorest.com/identity/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`
  );

  return resp.data.access_token;
};

module.exports = { getAccessToken };

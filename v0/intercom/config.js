const destinationConfigKeys = {
  accessToken: "apiKey",
  appId: "appId",
  mobileApiKey: "mobileApiKey",
  collectContext: "collectContext"
};

const baseEndpoint = "https://api.intercom.io";
const endpoints = {
  userUrl: `${baseEndpoint}/users`, //Create, Update a user with a company | Identify
  eventsUrl: `${baseEndpoint}/events`, //track events | Track
  companyUrl: `${baseEndpoint}/companies`, //create, update, delete a company | Group
  conversationsUrl: `${baseEndpoint}/conversations?open=true` // get all conversations | Page
  // identityVerificationUrl: `${baseEndpoint}`
};

module.exports = {
  destinationConfigKeys,
  endpoints
};

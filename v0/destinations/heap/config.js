const destinationConfigKeys = {
  appId: "appId"
};

const baseEndpoint = "https://heapanalytics.com/api";
const endpoints = {
  trackUrl: `${baseEndpoint}/track`, // track properties, | Track
  identifyUrl: `${baseEndpoint}/add_user_properties` // identify a user| Identify
};

module.exports = {
  destinationConfigKeys,
  endpoints
};

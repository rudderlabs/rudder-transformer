const destinationConfigKeys = {
  apiKey: "apiKey",
  triggerId: "triggerId"
};

const baseEndpoint = "https://api2.autopilothq.com/v1";
const endpoints = {
  addContactUrl: `${baseEndpoint}/contact`, // add a contact, | Identify
  triggerJourneyUrl: `${baseEndpoint}/trigger` // trigger a journey | Track
};

module.exports = {
  destinationConfigKeys,
  endpoints
};

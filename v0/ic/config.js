const destinationConfigKeys = {
  apiKey: "apiKey",
  appId: "appId",
  mobileApiKey: "mobileAppId"
};

const baseEndpoint = "https://api.intercom.io";
const endpoints = {
  userUrl: `${baseEndpoint}/users`, //Create, Update a user with a company | Identify
  eventsUrl: `${baseEndpoint}/events`, //track events | Track
  companyUrl: `${baseEndpoint}/companies` //create, update, delete a company | Group
};

const trackSubPayload = [{ rudderKey: "price", expectedKey: "amount" }];
const identifySubPayload = [{ rudderKey: "id", expectedKey: "company_id" }];
const identifyMainPayload = [
  { rudderKey: "anonymousId", expectedKey: "user_id" }
];
const groupMainPayload = [
  { rudderKey: "traits", expectedKey: "custom_attributes" }
];

const mapPayload = {
  track: {
    sub: trackSubPayload
  },
  identify: {
    sub: identifySubPayload,
    main: identifyMainPayload
  },
  group: {
    main: groupMainPayload
  }
};

module.exports = {
  destinationConfigKeys,
  endpoints,
  mapPayload
};

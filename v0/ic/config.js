const destinationConfigKeys = {
  apiKey: "apiKey",
  appId: "appId",
  mobileApiKey: "mobileAppId"
};

const endpoints = {
  userUrl: "https://api.intercom.io/users", //Create, Update a user with a company | Identify
  eventsUrl: "https://api.intercom.io/events", //track events | Track
  companyUrl: "https://api.intercom.io/companies" //create, update, delete a company | Group
};

const trackSubPayload = [{ rudderKey: "price", expectedKey: "amount" }];
const identifySubPayload = [{ rudderKey: "id", expectedKey: "company_id" }];
const groupMainPayload = [
  { rudderKey: "traits", expectedKey: "custom_attributes" }
];

const mapPayload = {
  track: {
    sub: trackSubPayload
  },
  identify: {
    sub: identifySubPayload
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

const destinationConfigKeys = {
  apiKey: "apiKey",
  appId: "appId",
  mobileApiKey: "mobileAppId"
};

const baseEndpoint = "https://api.intercom.io";
const endpoints = {
  userUrl: `${baseEndpoint}/users`, //Create, Update a user with a company | Identify
  eventsUrl: `${baseEndpoint}/events`, //track events | Track
  companyUrl: `${baseEndpoint}/companies`, //create, update, delete a company | Group
  conversationsUrl: `${baseEndpoint}/conversations` // get all conversations | Page
  // identityVerificationUrl: `${baseEndpoint}`
};

const trackSubPayload = [{ rudderKey: "price", expectedKey: "amount" }];
const identifySubPayload = [{ rudderKey: "id", expectedKey: "company_id" }];
const identifyMainPayload = [
  { rudderKey: "anonymousId", expectedKey: "user_id" }
];
const groupMainPayload = [
  { rudderKey: "traits", expectedKey: "custom_attributes" }
];
const deviceContextKeys = [
  { rudderKey: "manufacturer", expectedKey: "device_manufacturer" },
  { rudderKey: "model", expectedKey: "device_model" },
  { rudderKey: "name", expectedKey: "device_name" }
];
const osContextkeys = [
  { rudderKey: "name", expectedKey: "os_name" },
  { rudderKey: "version", expectedKey: "os_version" }
];
const appContextkeys = [
  { rudderKey: "name", expectedKey: "app_name" },
  { rudderKey: "version", expectedKey: "app_version" }
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
  },
  collectContext: {
    device: deviceContextKeys,
    os: osContextkeys,
    app: appContextkeys
  }
};

module.exports = {
  destinationConfigKeys,
  endpoints,
  mapPayload
};

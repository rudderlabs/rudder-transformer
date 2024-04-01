const _ = require("lodash");

const trackMessage = {
  destination: { Config: {} },
  message: {
    type: "track",
    messageId: "my-track-message-id-1",
    userId: "9bb5d4c2-a7aa-4a36-9efb-dd2b1aec5d33",
    anonymousId: "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
    channel: "web",
    context: {
      app: {
        build: "1.0.0",
        name: "RudderLabs JavaScript SDK",
        namespace: "com.rudderlabs.javascript",
        version: "1.0.5"
      },
      ip: "0.0.0.0",
      library: {
        name: "RudderLabs JavaScript SDK",
        version: "1.0.5"
      },
      locale: "en-GB",
      os: {
        name: "",
        version: ""
      },
      screen: { density: 2 },
      traits: {
        city: "Disney",
        country: "USA",
        email: "mickey@disney.com",
        firstname: "Mickey"
      },
      userAgent: "Mozilla/5.0 Chrome/79.0.3945.117 Safari/537.36"
    },
    event: "groups",
    integrations: { All: true },
    originalTimestamp: "2020-01-24T06:29:02.364Z",
    properties: { currency: "USD" },
    receivedAt: "2020-01-24T11:59:02.403+05:30",
    request_ip: "[::1]:53708",
    sentAt: "2020-01-24T06:29:02.364Z",
    timestamp: "2020-01-24T11:59:02.403+05:30"
  },
  request: { query: { whSchemaVersion: "v1" } }
};

const identifyMessage = {
  destination: { Config: {} },
  message: {
    type: "identify",
    messageId: "my-identify-message-id-1",
    sentAt: "2021-01-03T17:02:53.195Z",
    userId: "user123",
    channel: "web",
    integrations: { All: true },
    context: {
      os: {
        "name": "android",
        "version": "1.12.3"
      },
      app: {
        name: "RudderLabs JavaScript SDK",
        build: "1.0.0",
        version: "1.1.11",
        namespace: "com.rudderlabs.javascript"
      },
      traits: {
        email: "user123@email.com",
        phone: "+917836362334",
        userId: "user123"
      },
      locale: "en-US",
      device: {
        token: "token",
        id: "id",
        type: "ios"
      },
      library: {
        name: "RudderLabs JavaScript SDK",
        version: "1.1.11"
      },
      userAgent: "Gecko/20100101 Firefox/84.0"
    },
    rudderId: "8f8fa6b5-8e24-489c-8e22-61f23f2e364f",
    anonymousId: "97c46c81-3140-456d-b2a9-690d70aaca35",
    originalTimestamp: "2020-01-24T06:29:02.364Z",
    receivedAt: "2020-01-24T11:59:02.403+05:30",
    request_ip: "[::1]:53708",
    timestamp: "2020-01-24T11:59:02.403+05:30"
  },
  request: { query: { whSchemaVersion: "v1" } }
};

const scenarios = [
  {
    name: "track event is not skipped when options are not provided",
    skipUsersTable: null,
    skipTracksTable: null,
    event: _.cloneDeep(trackMessage),
    expected: [
      {
        id: "my-track-message-id-1",
        table: "tracks"
      },
      {
        id: "my-track-message-id-1",
        table: "_groups"
      }
    ]
  },
  {
    name: "track event is not skipped when skipTracksTable is false",
    skipUsersTable: null,
    skipTracksTable: false,
    event: _.cloneDeep(trackMessage),
    expected: [
      {
        id: "my-track-message-id-1",
        table: "tracks"
      },
      {
        id: "my-track-message-id-1",
        table: "_groups"
      }
    ]
  },
  {
    name: "track event is skipped when skipTracksTable is true",
    skipUsersTable: null,
    skipTracksTable: true,
    event: _.cloneDeep(trackMessage),
    expected: [
      {
        id: "my-track-message-id-1",
        table: "_groups"
      }
    ]
  },
  {
    name: "track event is not affected by skipUsersTable",
    skipUsersTable: true,
    skipTracksTable: null,
    event: _.cloneDeep(trackMessage),
    expected: [
      {
        id: "my-track-message-id-1",
        table: "tracks"
      },
      {
        id: "my-track-message-id-1",
        table: "_groups"
      }
    ]
  },
  {
    name: "user event is not skipped when options are not provided",
    skipUsersTable: null,
    skipTracksTable: null,
    event: _.cloneDeep(identifyMessage),
    expected: [
      {
        id: "my-identify-message-id-1",
        table: "identifies"
      },
      {
        id: "user123",
        table: "users"
      }
    ]
  },
  {
    name: "user event is not skipped when skipUsersTable is false",
    skipUsersTable: false,
    skipTracksTable: null,
    event: _.cloneDeep(identifyMessage),
    expected: [
      {
        id: "my-identify-message-id-1",
        table: "identifies"
      },
      {
        id: "user123",
        table: "users"
      }
    ]
  },
  {
    name: "user event is skipped when skipUsersTable is true",
    skipUsersTable: true,
    skipTracksTable: null,
    event: _.cloneDeep(identifyMessage),
    expected: [
      {
        id: "my-identify-message-id-1",
        table: "identifies"
      }
    ]
  },
  {
    name: "user event is not affected by skipTracksTable",
    skipUsersTable: null,
    skipTracksTable: true,
    event: _.cloneDeep(identifyMessage),
    expected: [
      {
        id: "my-identify-message-id-1",
        table: "identifies"
      },
      {
        id: "user123",
        table: "users"
      }
    ]
  },
];

module.exports = {
  scenarios: function() {
    return _.cloneDeep(scenarios);
  }
};
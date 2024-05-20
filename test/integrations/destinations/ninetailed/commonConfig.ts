export const destination = {
  ID: 'random_id',
  Name: 'ninetailed',
  DestinationDefinition: {
    Config: {
      cdkV2Enabled: true,
    },
  },
  Config: {
    organisationId: 'dummyOrganisationId',
    environment: 'main',
  },
};

export const metadata = {
  destinationId: 'dummyDestId',
};
export const commonProperties = {
  segment: 'SampleSegment',
  shipcountry: 'USA',
  shipped: '20240129_1500',
  sitename: 'SampleSiteName',
  storeId: '12345',
  storecat: 'Electronics',
};
export const traits = {
  email: 'test@user.com',
  firstname: 'John',
  lastname: 'Doe',
  phone: '+1(123)456-7890',
  gender: 'Male',
  birthday: '1980-01-02',
  city: 'San Francisco',
};
export const context = {
  app: {
    name: 'RudderLabs JavaScript SDK',
    version: '1.0.0',
  },
  campaign: {
    name: 'campign_123',
    source: 'social marketing',
    medium: 'facebook',
    term: '1 year',
  },
  library: {
    name: 'RudderstackSDK',
    version: 'Ruddderstack SDK version',
  },
  locale: 'en-US',
  page: {
    path: '/signup',
    referrer: 'https://rudderstack.medium.com/',
    search: '?type=freetrial',
    url: 'https://app.rudderstack.com/signup?type=freetrial',
  },
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
  location: {
    coordinates: {
      latitude: 40.7128,
      longitude: -74.006,
    },
    city: 'San Francisco',
    postalCode: '94107',
    region: 'CA',
    regionCode: 'CA',
    country: '  United States',
    countryCode: 'United States of America',
    continent: 'North America',
    timezone: 'America/Los_Angeles',
  },
};
export const contextWithNoLocation = {
  app: {
    name: 'RudderLabs JavaScript SDK',
    version: '1.0.0',
  },
  campaign: {
    name: 'campign_123',
    source: 'social marketing',
    medium: 'facebook',
    term: '1 year',
  },
  library: {
    name: 'RudderstackSDK',
    version: 'Ruddderstack SDK version',
  },
  locale: 'en-US',
  page: {
    path: '/signup',
    referrer: 'https://rudderstack.medium.com/',
    search: '?type=freetrial',
    url: 'https://app.rudderstack.com/signup?type=freetrial',
  },
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
};
export const commonInputWithNoLocationAndChannel = {
  anonymousId: 'anon_123',
  messageId: 'dummy_msg_id',
  context: contextWithNoLocation,
  integrations: {
    All: true,
  },
  originalTimestamp: '2021-01-25T15:32:56.409Z',
};
export const commonInput = {
  anonymousId: 'anon_123',
  messageId: 'dummy_msg_id',
  context,
  channel: 'web',
  integrations: {
    All: true,
  },
  originalTimestamp: '2021-01-25T15:32:56.409Z',
};

export const commonOutput = {
  anonymousId: 'anon_123',
  messageId: 'dummy_msg_id',
  context,
  channel: 'web',
  originalTimestamp: '2021-01-25T15:32:56.409Z',
};

export const endpoint =
  'https://experience.ninetailed.co/v2/organizations/dummyOrganisationId/environments/main/events';
export const routerInstrumentationErrorStatTags = {
  destType: 'NINETAILED',
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'router',
  implementation: 'cdkV2',
  module: 'destination',
};
export const processInstrumentationErrorStatTags = {
  destType: 'NINETAILED',
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'processor',
  implementation: 'cdkV2',
  module: 'destination',
  destinationId: 'dummyDestId',
};

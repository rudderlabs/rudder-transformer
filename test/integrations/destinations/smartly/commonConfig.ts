export const destination = {
  ID: 'random_id',
  Name: 'smartly',
  DestinationDefinition: {
    Config: {
      cdkV2Enabled: true,
    },
  },
  Config: {
    apiToken: 'testAuthToken',
  },
};

export const routerInstrumentationErrorStatTags = {
  destType: 'SMARTLY',
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'router',
  implementation: 'cdkV2',
  module: 'destination',
};
export const processInstrumentationErrorStatTags = {
  destType: 'SMARTLY',
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'processor',
  implementation: 'cdkV2',
  module: 'destination',
  destinationId: 'dummyDestId',
};

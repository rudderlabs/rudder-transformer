const defaultMockFns = () => {
  jest.spyOn(Date, 'now').mockImplementation(() => new Date(Date.UTC(2020, 0, 25)).valueOf());
};

const sampleDestination = {
  Config: {
    apiKey: 'dummyApiKey',
    token: 'dummyApiKey',
    prefixProperties: true,
    useNativeSDK: false,
  },
  DestinationDefinition: {
    DisplayName: 'Mixpanel',
    ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
    Name: 'MP',
  },
  Enabled: true,
  ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
  Name: 'MP',
  Transformations: [],
};

const destinationWithSetOnceProperty = {
  ID: '2Xz4szkZeBMJRgO5TfvLclsxkxz',
  Name: 'Mixpanel Dev',
  DestinationDefinition: {
    ID: '2WcAA63MqbQVSIrgPR0mXuxF4ut',
    Name: 'MP',
    DisplayName: 'Mixpanel',
    ResponseRules: {}
  },
  Config: {
    apiSecret: 'dummySecret',
    dataResidency: 'us',
    eventDelivery: false,
    eventDeliveryTS: 1699848284554,
    identityMergeApi: 'simplified',
    setOnceProperties: [
      {
        property: 'nationality'
      },
      {
        property: 'firstName'
      },
      {
        property: 'address.city'
      }
    ],
    superProperties: [
      {
        property: 'random'
      }
    ],
    token: 'dummyToken',
    useNativeSDK: false,
    useNewMapping: false,
    userDeletionApi: 'engage',
    whitelistedEvents: []
  },
  Enabled: true,
  WorkspaceID: 123345,
  Transformations: [],
  IsProcessorEnabled: true,
  RevisionID: 12345
}

export { sampleDestination, defaultMockFns, destinationWithSetOnceProperty };

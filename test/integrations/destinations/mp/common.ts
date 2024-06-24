import { Destination } from '../../../../src/types';

const defaultMockFns = () => {
  jest.spyOn(Date, 'now').mockImplementation(() => new Date(Date.UTC(2020, 0, 25)).valueOf());
};

const sampleDestination: Destination = {
  Config: {
    apiKey: 'dummyApiKey',
    token: 'test_api_token',
    prefixProperties: true,
    useNativeSDK: false,
  },
  DestinationDefinition: {
    DisplayName: 'Mixpanel',
    ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
    Name: 'MP',
    Config: {},
  },
  Enabled: true,
  ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
  Name: 'MP',
  Transformations: [],
  WorkspaceID: '',
  IsProcessorEnabled: true,
};

const destinationWithSetOnceProperty: Destination = {
  Config: {
    apiSecret: 'dummySecret',
    dataResidency: 'us',
    identityMergeApi: 'simplified',
    setOnceProperties: [
      {
        property: 'nationality',
      },
      {
        property: 'firstName',
      },
      {
        property: 'address.city',
      },
    ],
    superProperties: [
      {
        property: 'random',
      },
    ],
    token: 'dummyToken',
    useNativeSDK: false,
    useNewMapping: false,
    userDeletionApi: 'engage',
    whitelistedEvents: [],
  },
  DestinationDefinition: {
    DisplayName: 'Kiss Metrics',
    ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
    Name: 'MIXPANEL',
    Config: {},
  },
  Enabled: true,
  ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
  Name: 'Kiss Metrics',
  Transformations: [],
  IsProcessorEnabled: true,
  WorkspaceID: 'workspaceId',
};

export { sampleDestination, defaultMockFns, destinationWithSetOnceProperty };

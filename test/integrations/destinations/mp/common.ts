import { Destination } from '../../../../src/types';
import { secret1, secret2 } from './maskedSecrets';
const defaultMockFns = () => {
  jest.spyOn(Date, 'now').mockReturnValue(new Date(Date.UTC(2020, 0, 25)).valueOf());
};

const sampleDestination: Destination = {
  Config: {
    apiKey: secret1,
    token: secret2,
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
};

const destinationWithSetOnceProperty = {
  Config: {
    apiSecret: secret1,
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
    token: secret2,
    useNativeSDK: false,
    useNewMapping: false,
    userDeletionApi: 'engage',
    whitelistedEvents: [],
  },
  DestinationDefinition: {
    DisplayName: 'Kiss Metrics',
    ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
    Name: 'MIXPANEL',
  },
  Enabled: true,
  ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
  Name: 'Kiss Metrics',
  Transformations: [],
};

export { sampleDestination, defaultMockFns, destinationWithSetOnceProperty };

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
  hasDynamicConfig: false,
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
  hasDynamicConfig: false,
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

const destinationWithUnionAndAppendProperty = {
  ...destinationWithSetOnceProperty,
  Config: {
    ...destinationWithSetOnceProperty.Config,
    unionProperties: [
      { property: 'unionProperty1' },
      { property: 'unionProperty2' },
      { property: 'unionProperty3' },
      { property: 'unionProperty4' },
    ],
    appendProperties: [
      { property: 'appendProperty1' },
      { property: 'appendProperty2' },
      { property: 'appendProperty3' },
    ],
  },
};

export {
  sampleDestination,
  defaultMockFns,
  destinationWithSetOnceProperty,
  destinationWithUnionAndAppendProperty,
};

import { Destination } from '../../../../src/types';
import { generateMetadata } from '../../testUtils';
import { secret1 } from './maskedSecrets';

export const destType = 'dummy';
export const destTypeInUpperCase = 'DUMMY';
export const displayName = 'Dummy Destination';
export const channel = 'web';

export const destination: Destination = {
  Config: {
    apiKey: secret1,
    enableBatching: true,
    maxBatchSize: 10,
    maxRetries: 3,
    retryInterval: 1000,
    dynamicConfig: true,
  },
  DestinationDefinition: {
    DisplayName: displayName,
    ID: '123',
    Name: destTypeInUpperCase,
    Config: {},
  },
  Enabled: true,
  ID: '123',
  Name: destTypeInUpperCase,
  Transformations: [],
  WorkspaceID: 'test-workspace-id',
};

export const getDestination = (configVariation: number): Destination => {
  return {
    Config: {
      apiKey: secret1,
      flag: `config_${configVariation}`,
    },
    DestinationDefinition: {
      DisplayName: displayName,
      ID: '123',
      Name: destTypeInUpperCase,
      Config: {},
    },
    Enabled: true,
    ID: '123',
    Name: destTypeInUpperCase,
    Transformations: [],
    WorkspaceID: 'test-workspace-id',
  };
};

export const processorInstrumentationErrorStatTags = {
  destType: destTypeInUpperCase,
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'processor',
  implementation: 'native',
  module: 'destination',
  destinationId: 'dummyDestId',
};

const temporaryMetaData = generateMetadata(1);
export const routerInstrumentationErrorStatTags = {
  destType: destTypeInUpperCase,
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'router',
  implementation: 'native',
  module: 'destination',
  destinationId: temporaryMetaData.destinationId,
  workspaceId: temporaryMetaData.workspaceId,
};

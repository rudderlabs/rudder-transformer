import { Destination, Metadata } from '../../../../src/types';
import { secret1 } from './maskedSecrets';
import { generateMetadata } from '../../testUtils';

export const destination: Destination = {
  ID: 'snapchat-conversion-destination-id',
  Name: 'SNAPCHAT_CONVERSION',
  DestinationDefinition: {
    ID: '123',
    Name: 'SNAPCHAT_CONVERSION',
    DisplayName: 'Snapchat Conversion',
    Config: {
      cdkV2Enabled: false,
    },
  },
  Config: {
    apiKey: secret1,
    pixelId: 'dummyPixelId',
  },
  Enabled: true,
  Transformations: [],
  WorkspaceID: 'test-workspace-id',
};

export const metadata: Metadata = generateMetadata(1);

export const processorConfigurationErrorStatTags = {
  destType: 'SNAPCHAT_CONVERSION',
  destinationId: 'default-destinationId',
  errorCategory: 'dataValidation',
  errorType: 'configuration',
  feature: 'processor',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
};

export const processorInstrumentationErrorStatTags = {
  destType: 'SNAPCHAT_CONVERSION',
  destinationId: 'default-destinationId',
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'processor',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
};

export const mockFns = (_) => {
  // @ts-ignore
  Date.now = jest.fn(() => new Date('2022-04-23T10:57:58Z'));
};

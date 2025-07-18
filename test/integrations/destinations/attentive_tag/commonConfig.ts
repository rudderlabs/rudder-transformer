import { Destination, Metadata } from '../../../../src/types';
import { defaultApiKey } from '../../common/secrets';
import { generateMetadata } from '../../testUtils';

export const destination: Destination = {
  ID: 'ATTENTIVE_TAG',
  Name: 'Attentive Tag Destination',
  DestinationDefinition: {
    ID: 'ATTENTIVE_TAG',
    Name: 'Attentive Tag',
    DisplayName: 'Attentive Tag',
    Config: {},
  },
  Config: {
    apiKey: defaultApiKey,
    signUpSourceId: '241654',
  },
  Enabled: true,
  WorkspaceID: 'attentive-workspace',
  Transformations: [],
  RevisionID: 'attentive-revision',
};

export const headers = {
  Authorization: `Bearer ${defaultApiKey}`,
  'Content-Type': 'application/json',
};

export const metadata: Metadata = generateMetadata(1);

export const mockFns = (_) => {
  // Use Jest's fake timers to mock system time
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2023-10-14T00:00:00.000Z'));
};

export const statTags = {
  destType: 'ATTENTIVE_TAG',
  destinationId: 'default-destinationId',
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'processor',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
};

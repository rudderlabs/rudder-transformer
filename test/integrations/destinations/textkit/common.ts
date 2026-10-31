import { Metadata } from '../../../../src/types';
import { secret1 } from './maskedSecrets';

export const metadata: Partial<Metadata> = {
  destinationId: 'default-destination',
  workspaceId: 'default-workspace',
  jobId: 1,
};

export const destination = (config: Record<string, unknown> = {}) => ({
  ID: 'default-destination-id',
  Name: 'Default Destination',
  DestinationDefinition: {
    ID: 'default-dest-def-id',
    Name: 'TEXTKIT',
    DisplayName: 'TextKit',
    Config: {},
  },
  Config: { apiKey: secret1, ...config },
  Enabled: true,
  WorkspaceID: 'default-workspace',
  Transformations: [],
  RevisionID: 'default-revision',
  IsProcessorEnabled: true,
  IsConnectionEnabled: true,
});

export const requestBody = (JSON: Record<string, unknown>) => ({
  JSON,
  JSON_ARRAY: {},
  XML: {},
  FORM: {},
});

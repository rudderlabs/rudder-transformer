import { Destination } from '../../../../src/types/controlPlaneConfig';

export const destinationConfig: Destination = {
  ID: 'default-destination-id',
  Name: 'Default Destination',
  DestinationDefinition: {
    ID: 'default-dest-def-id',
    Name: 'Default Destination Definition',
    DisplayName: 'Default Display Name',
    Config: {},
  },
  Enabled: true,
  WorkspaceID: 'default-workspaceId',
  Transformations: [],
  RevisionID: 'default-revision',
  IsProcessorEnabled: true,
  IsConnectionEnabled: true,
  Config: {},
  hasDynamicConfig: false,
};

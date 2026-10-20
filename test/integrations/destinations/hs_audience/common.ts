import { Connection, Destination } from '../../../../src/types';
import { accessToken } from './maskedSecrets';

const destType = 'hs_audience';
const destTypeInUpperCase = 'HS_AUDIENCE';
const displayName = 'HubSpot Audience';

const destination: Destination = {
  Config: {
    accessToken,
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

const listConnection = (audienceId: string, sourceId = 'dummy-source-id'): Connection =>
  ({
    sourceId,
    destinationId: 'dummy-destination-id',
    enabled: true,
    config: {
      destination: {
        audienceId,
        identifierMappings: [],
      },
    },
  }) as Connection;

const connection = listConnection('10');
const otherListConnection = listConnection('20');
// A second rETL sync on the same destination: its own source and its own list.
const secondSyncConnection = listConnection('30', 'second-sync-source-id');

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${accessToken}`,
};

const membershipEndpoint = (listId: string) =>
  `https://api.hubapi.com/crm/v3/lists/${listId}/memberships/add-and-remove`;

const endpointPath = '/crm/v3/lists/:listId/memberships/add-and-remove';

const routerInstrumentationErrorStatTags = {
  destType: destTypeInUpperCase,
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'router',
  implementation: 'native',
  module: 'destination',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
};

export {
  destType,
  destTypeInUpperCase,
  destination,
  connection,
  otherListConnection,
  secondSyncConnection,
  headers,
  membershipEndpoint,
  endpointPath,
  routerInstrumentationErrorStatTags,
};

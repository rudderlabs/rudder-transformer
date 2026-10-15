import { Connection, Destination } from '../../../../src/types';
import { clientId, clientSecret, rejectedClientSecret } from './maskedSecrets';

const destType = 'marketo_audience';
const destTypeInUpperCase = 'MARKETO_AUDIENCE';

const accountId = '123-ABC-456';
// A second instance, so the rejected-credential case does not share the cached token.
const rejectedAccountId = '123-ABC-457';

const destination: Destination = {
  Config: {
    rudderAccountId: '2zpVFCz3Os4uCbLEZXkhFX3tmJq',
    accountId,
    clientId,
    clientSecret,
    connectionMode: { warehouse: 'cloud' },
  },
  DestinationDefinition: {
    DisplayName: 'Marketo Audience',
    ID: '2zpVF8HIWyNUkSAXWBH2bPfWxyz',
    Name: destTypeInUpperCase,
    Config: {},
  },
  Enabled: true,
  ID: '2zpVFHG3RnfV1ZP3XwgA0QYmQYn',
  Name: destTypeInUpperCase,
  Transformations: [],
  WorkspaceID: 'test-workspace-id',
};

const rejectedCredentialsDestination: Destination = {
  ...destination,
  ID: '2zpVFRejectedCredentials0001',
  Config: {
    ...destination.Config,
    accountId: rejectedAccountId,
    clientSecret: rejectedClientSecret,
  },
};

const invalidAccountIdDestination: Destination = {
  ...destination,
  ID: '2zpVFInvalidMunchkinId000001',
  Config: { ...destination.Config, accountId: 'evil.example/x?' },
};

// The connection `/setup` returns for an existing static list (§2.1 of the spec).
const listConnection = (audienceId?: string): Connection =>
  ({
    sourceId: '2zpVEyZW6LaYWuJ9i3RqDxjFrJk',
    destinationId: destination.ID,
    enabled: true,
    config: {
      destination: {
        createAudience: 'no',
        syncMode: 'mirror',
        ...(audienceId === undefined ? {} : { audienceId }),
        identifierMappings: [
          { from: 'MARKETO_LEAD_ID', to: 'id' },
          { from: 'EMAIL', to: 'email' },
        ],
        schemaVersion: '1.1',
        eventType: 'record',
      },
    },
  }) as Connection;

const connection = listConnection('1234');
const otherListConnection = listConnection('5678');
const noListConnection = listConnection();

const listEndpoint = (listId: string) =>
  `https://${accountId}.mktorest.com/rest/v1/lists/${listId}/leads.json`;
const endpointPath = '/rest/v1/lists/:listId/leads.json';
const lookupUrl = `https://${accountId}.mktorest.com/rest/v1/leads.json?_method=GET`;

const routerStatTags = (errorCategory: string, errorType: string) => ({
  destType: destTypeInUpperCase,
  errorCategory,
  errorType,
  feature: 'router',
  implementation: 'native',
  module: 'destination',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
});

export {
  destType,
  destTypeInUpperCase,
  accountId,
  rejectedAccountId,
  destination,
  rejectedCredentialsDestination,
  invalidAccountIdDestination,
  connection,
  otherListConnection,
  noListConnection,
  listEndpoint,
  endpointPath,
  lookupUrl,
  routerStatTags,
};

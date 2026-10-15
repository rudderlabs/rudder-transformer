import sha256 from 'sha256';
import { generateMetadata } from '../../testUtils';
import { accessToken } from './maskedSecrets';

export const destType = 'pinterest_audience';

// Ids from the Pinterest OpenAPI v5.28.0 examples (`ad_account_id`, `CustomerList.id`).
export const adAccountId = '549756359984';
export const customerListId = '643';
export const otherCustomerListId = '644';
export const audienceId = '2542620905476';

export const destination = {
  Config: { rudderAccountId: 'pinterest-audience-account-1' },
  DestinationDefinition: {
    Config: {},
    ConfigSchema: {},
    ResponseRules: {},
    DisplayName: 'Pinterest Audience',
    ID: 'pinterest-audience-def',
    Name: 'PINTEREST_AUDIENCE',
  },
  Enabled: true,
  ID: 'pinterest-audience-dest-1',
  Name: 'pinterest_audience',
  Transformations: [],
  WorkspaceID: 'workspace-id',
};

export const connectionFor = (
  listId: string = customerListId,
  overrides: Record<string, unknown> = {},
) => ({
  sourceId: 'src-1',
  destinationId: destination.ID,
  enabled: true,
  config: {
    destination: {
      adAccountId,
      customerListId: listId,
      audienceId,
      isHashRequired: true,
      syncMode: 'mirror',
      schemaVersion: '1.1',
      identifierMappings: [
        { from: 'email', to: 'EMAIL' },
        { from: 'maid', to: 'MAID' },
        { from: 'phone', to: 'PHONE' },
      ],
      ...overrides,
    },
  },
});

export const connection = connectionFor();
export const otherListConnection = connectionFor(otherCustomerListId);
/** Warehouse already stores 64-hex SHA-256 values. */
export const preHashedConnection = connectionFor(customerListId, { isHashRequired: false });
/** A connection whose ad account id would traverse the URL path. */
export const badAdAccountConnection = connectionFor(customerListId, { adAccountId: '../x' });

export const endpointFor = (listId: string) =>
  `https://api.pinterest.com/v5/ad_accounts/${adAccountId}/customer_lists/${listId}`;
export const endpoint = endpointFor(customerListId);
export const endpointPath = '/ad_accounts/{ad_account_id}/customer_lists/{customer_list_id}';

export const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${accessToken}`,
};

/** generateMetadata with this destination's distinctive token. */
export const metadataFor = (jobId: number) => ({
  ...generateMetadata(jobId),
  secret: { accessToken },
});

export const RAW_EMAIL = '  Alice@Example.COM ';
export const EMAIL_SHA256 = sha256('alice@example.com');
export const RAW_MAID = 'CDDA802E-FB9C-47AD-9866-0794D394C912';
export const MAID_SHA256 = sha256('cdda802e-fb9c-47ad-9866-0794d394c912');
export const RAW_PHONE = '+1 (415) 555-0132';
export const PHONE_SHA256 = sha256('14155550132');

const routerErrorStatTags = (errorType: 'instrumentation' | 'configuration') => ({
  destType: 'PINTEREST_AUDIENCE',
  destinationId: 'default-destinationId',
  errorCategory: 'dataValidation',
  errorType,
  feature: 'router',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
});

export const RouterInstrumentationErrorStatTags = routerErrorStatTags('instrumentation');
export const RouterConfigurationErrorStatTags = routerErrorStatTags('configuration');

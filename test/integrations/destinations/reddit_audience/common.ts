import { defaultAccessToken } from '../../common/secrets';

export const destType = 'reddit_audience';

export const audienceId = 'ca.129482487242828';
export const adAccountId = 'a2_abcdefg';

export const destination = {
  Config: {
    rudderAccountId: 'reddit-audience-account-1',
    adAccountId,
  },
  DestinationDefinition: {
    Config: {},
    ConfigSchema: {},
    ResponseRules: {},
    DisplayName: 'Reddit Audience',
    ID: 'reddit-audience-def',
    Name: 'REDDIT_AUDIENCE',
  },
  Enabled: true,
  ID: 'reddit-audience-dest-1',
  Name: 'reddit_audience',
  Transformations: [],
  WorkspaceID: 'workspace-id',
};

export const connection = {
  sourceId: 'src-1',
  destinationId: destination.ID,
  enabled: true,
  config: {
    destination: {
      audienceId,
      isHashRequired: true,
      syncMode: 'mirror',
      identifierMappings: [{ from: 'email', to: 'EMAIL_SHA256' }],
    },
  },
};

/** Connection whose warehouse already stores 64-hex SHA-256 values. */
export const preHashedConnection = {
  ...connection,
  config: {
    destination: { ...connection.config.destination, isHashRequired: false },
  },
};

export const endpoint = `https://ads-api.reddit.com/api/v3/custom_audiences/${audienceId}/users`;
export const endpointPath = '/custom_audiences/{audience_id}/users';

// `generateMetadata` puts `defaultAccessToken` on metadata.secret.accessToken.
export const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Authorization: `Bearer ${defaultAccessToken}`,
  'User-Agent': 'web:com.rudderstack.reddit-audience:v1.0.0 (by /u/rudderstack)',
};

// Reddit's own published canonicalization vectors (Manual Advanced Matching for
// Developers). Reused here so the component tests assert the same digests the
// unit tests pin — a change to normalization breaks both.
export const ALICE_EMAIL = 'alice@example.com';
export const ALICE_EMAIL_SHA256 =
  'ff8d9819fc0e12bf0d24892e45987e249a28dce836a85cad60e28eaaa8c6d976';
export const IDFA = 'EA7583CD-A667-48BC-B806-42ECB2B48606';
export const IDFA_SHA256 = '70574fa9c8f498a7b2e5c8712b1126de7b1406fd02fdc591821c5bd33092fd1c';
export const AAID = 'cdda802e-fb9c-47ad-9866-0794d394c912';
export const AAID_SHA256 = 'f23b554b2a8fb732a8b973733832e70f018da7bc294dfea289735a07d5dd2c9f';

export const RouterInstrumentationErrorStatTags = {
  destType: 'REDDIT_AUDIENCE',
  destinationId: 'default-destinationId',
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'router',
  implementation: 'native',
  module: 'destination',
  workspaceId: 'default-workspaceId',
};

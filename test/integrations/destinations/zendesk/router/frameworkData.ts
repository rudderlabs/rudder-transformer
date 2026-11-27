import type MockAxiosAdapter from 'axios-mock-adapter';
import { authHeader1, secret1, secret2 } from '../maskedSecrets';

// Keep the legacy cases in data.ts unchanged. These cases exercise workspace enrollment on the
// /routerTransform (v0) route; destination.version is the integration major, not the route version.
const workspaceId = 'zendesk-framework-fixture';
const destinationId = 'xxxxxxxxxxxxxxxxxxxxxxxO51P';
const destinationDefinition = {
  DisplayName: 'Zendesk',
  ID: '1YknZ1ENqB8UurJQJE2VrEA61tr',
  Name: 'ZENDESK',
};
const destinationV1 = {
  Config: {
    apiToken: secret1,
    domain: 'rudderlabshelp',
    email: 'myDummyUserName1',
    sourceName: 'abc',
  },
  DestinationDefinition: destinationDefinition,
  Enabled: true,
  ID: destinationId,
  Name: 'zendesk',
  Transformations: [],
  WorkspaceID: workspaceId,
  version: 1,
};
const oauthToken = secret2;
const destinationV2 = {
  ...destinationV1,
  version: 2,
  Config: { domain: 'rudderlabshelp', sourceName: 'abc', rudderAccountId: 'zendesk-oauth-account' },
  deliveryAccount: {
    id: 'zendesk-oauth-account',
    options: {},
    secret: {},
    accountDefinitionName: 'DESTINATION_ZENDESK_OAUTH_AUTH_CODE',
  },
};
const message = {
  anonymousId: '297b0750-934b-4411-b66c-9b418cdbc0c9',
  channel: 'web',
  context: { traits: { email: 'example124@email.com', name: 'abcd124' } },
  event: 'test-track-event124',
  messageId: '1c272800-d4f2-4fe6-af81-6429b7cb029f',
  properties: { test_prop: 'test_prop_value_124' },
  type: 'track',
  userId: 'abcd-124',
};
const metadataV1 = { jobId: 101, userId: 'u1', destinationId, workspaceId };
const metadataV2 = {
  jobId: 102,
  userId: 'u1',
  destinationId,
  workspaceId,
  secret: { accessToken: oauthToken },
};
const messageV2 = {
  ...message,
  context: { traits: { email: 'oauth-v2@example.com', name: 'abcd124' } },
};
const endpoint = 'https://rudderlabshelp.zendesk.com/api/v2/users/900113780483/events';
const marketplaceHeaders = {
  'X-Zendesk-Marketplace-Name': 'RudderStack',
  'X-Zendesk-Marketplace-Organization-Id': '3339',
  'X-Zendesk-Marketplace-App-Id': '263241',
};
const expectedBody = (email: string) => ({
  event: {
    description: 'test-track-event124',
    type: 'test-track-event124',
    source: 'abc',
    properties: { test_prop: 'test_prop_value_124' },
  },
  profile: {
    type: 'test-track-event124',
    source: 'abc',
    identifiers: [{ type: 'email', value: email }],
  },
});
const expectedRequest = (authorization: string, email: string, destinationVersion = 1) => ({
  destinationVersion,
  version: '1',
  type: 'REST',
  method: 'POST',
  endpoint,
  endpointPath: '/users/:id/events',
  headers: {
    Authorization: authorization,
    'Content-Type': 'application/json',
    ...marketplaceHeaders,
  },
  params: {},
  body: { JSON: expectedBody(email), XML: {}, JSON_ARRAY: {}, FORM: {} },
  files: {},
});

// Framework lookups omit the legacy mock's `params: undefined` matcher. Keep these local
// to avoid changing the un-enrolled legacy fixtures.
const mockUserLookup = (email: string) => (mock: MockAxiosAdapter) => {
  mock
    .onGet(
      `https://rudderlabshelp.zendesk.com/api/v2/users/search.json?query=${encodeURIComponent(email)}`,
    )
    .reply(200, { count: 1, next_page: null, previous_page: null, users: [{ id: 900113780483 }] });
};
const mockFieldList = (mock: MockAxiosAdapter) => {
  mock
    .onGet('https://rudderlabshelp.zendesk.com/api/v2/user_fields.json')
    .reply(200, { user_fields: [], next_page: null });
};
const mockOrgFields = (mock: MockAxiosAdapter) => {
  mock
    .onGet('https://rudderlabshelp.zendesk.com/api/v2/organization_fields.json')
    .reply(200, { organization_fields: [], next_page: null });
};
const mockIdentify = (mock: MockAxiosAdapter) => {
  mockFieldList(mock);
  mock
    .onPost('https://rudderlabshelp.zendesk.com/api/v2/users/create_or_update.json')
    .reply(200, { user: { id: 900113780483 } });
};
const mockGroup = (mock: MockAxiosAdapter) => {
  mockOrgFields(mock);
  mock
    .onPost('https://rudderlabshelp.zendesk.com/api/v2/organizations/create_or_update.json')
    .reply(200, { organization: { id: 98 } });
  mockUserLookup('example124@email.com')(mock);
  mock
    .onGet(
      'https://rudderlabshelp.zendesk.com/api/v2/users/900113780483/organization_memberships.json',
    )
    .reply(200, { organization_memberships: [] });
};

export const frameworkData = [
  {
    id: 'zendesk-framework-identify',
    name: 'zendesk',
    description: 'Enrolled identify completes its writes and emits a request-free 299',
    scenario: 'Workspace enrolled in the batching framework, integration major 1',
    successCriteria: 'Identify returns a success marker without a delivery request',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    envOverrides: { ZENDESK_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS: workspaceId },
    mockFns: mockIdentify,
    input: {
      request: {
        method: 'POST',
        body: {
          destType: 'zendesk',
          input: [
            {
              message: {
                type: 'identify',
                userId: 'abcd-124',
                traits: { name: 'N', email: 'n@example.com' },
              },
              metadata: metadataV1,
              destination: destinationV1,
            },
          ],
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              metadata: [metadataV1],
              destination: destinationV1,
              batched: false,
              statusCode: 299,
            },
          ],
        },
      },
    },
  },
  {
    id: 'zendesk-framework-group',
    name: 'zendesk',
    description: 'Enrolled group upserts an organization and delivers a membership',
    scenario: 'Workspace enrolled in the batching framework, integration major 1',
    successCriteria: 'Group returns a membership REST request following organization lookup',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    envOverrides: { ZENDESK_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS: workspaceId },
    mockFns: mockGroup,
    input: {
      request: {
        method: 'POST',
        body: {
          destType: 'zendesk',
          input: [
            {
              message: {
                type: 'group',
                userId: 'abcd-124',
                groupId: 'group-124',
                traits: { name: 'Org' },
                context: { traits: { email: 'example124@email.com' } },
              },
              metadata: metadataV1,
              destination: destinationV1,
            },
          ],
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: {
                ...expectedRequest(authHeader1, 'example124@email.com'),
                endpoint: 'https://rudderlabshelp.zendesk.com/api/v2/organization_memberships.json',
                endpointPath: '/organization_memberships.json',
                body: {
                  JSON: { organization_membership: { user_id: 900113780483, organization_id: 98 } },
                  XML: {},
                  JSON_ARRAY: {},
                  FORM: {},
                },
              },
              metadata: [metadataV1],
              destination: destinationV1,
              batched: true,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
  {
    id: 'zendesk-framework-v1-track',
    name: 'zendesk',
    description: 'Enrolled v1 track uses the framework with legacy Basic auth',
    scenario: 'Workspace enrolled in the batching framework, integration major 1',
    successCriteria: 'The track event produces a framework REST request with Basic authentication',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    envOverrides: { ZENDESK_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS: workspaceId },
    mockFns: mockUserLookup('example124@email.com'),
    input: {
      request: {
        method: 'POST',
        body: {
          destType: 'zendesk',
          input: [{ message, metadata: metadataV1, destination: destinationV1 }],
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: expectedRequest(authHeader1, 'example124@email.com'),
              metadata: [metadataV1],
              batched: true,
              statusCode: 200,
              destination: destinationV1,
            },
          ],
        },
      },
    },
  },
  {
    id: 'zendesk-framework-v2-oauth-track',
    name: 'zendesk',
    description: 'Enrolled v2 track uses OAuth credentials instead of the v1 API token',
    scenario:
      'Workspace enrolled in the batching framework, integration major 2 with OAuth account',
    successCriteria: 'The track event produces a framework REST request with Bearer authentication',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    envOverrides: { ZENDESK_BATCHING_FRAMEWORK_ENABLED_WORKSPACE_IDS: workspaceId },
    mockFns: mockUserLookup('oauth-v2@example.com'),
    input: {
      request: {
        method: 'POST',
        body: {
          destType: 'zendesk',
          input: [{ message: messageV2, metadata: metadataV2, destination: destinationV2 }],
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: expectedRequest(`Bearer ${oauthToken}`, 'oauth-v2@example.com', 2),
              metadata: [metadataV2],
              batched: true,
              statusCode: 200,
              destination: destinationV2,
            },
          ],
        },
      },
    },
  },
];

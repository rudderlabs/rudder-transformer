import { NetworkError } from '@rudderstack/integrations-lib';
import { processDestinationIntegration } from '../../../services/destination/destinationIntegration/processDestinationIntegration';
import type { RouterTransformationRequestData } from '../../../types';
import { Integration } from './routerTransform';
import { ensureFields } from './lookup';

jest.mock('./lookup', () => ({ ensureFields: jest.fn().mockResolvedValue(undefined) }));

const request = jest.fn();
const baseUrl = 'https://example.zendesk.com/api/v2/';
const destination = {
  ID: 'test-dest',
  Name: 'zendesk',
  Enabled: true,
  WorkspaceID: 'zendesk-test',
  Transformations: [],
  version: 1,
  Config: { domain: 'example', email: 'u@example.com', apiToken: 'token' },
  DestinationDefinition: { Name: 'ZENDESK' },
} as unknown as RouterTransformationRequestData['destination'];
const input = (
  jobId: number,
  message: Record<string, unknown>,
  overrides: Record<string, unknown> = {},
) =>
  ({
    destination: { ...destination, ...overrides },
    metadata: { jobId, workspaceId: 'zendesk-test', destinationId: 'test-dest' },
    message,
  }) as RouterTransformationRequestData;

beforeEach(() => {
  jest.clearAllMocks();
  request.mockReset();
  (ensureFields as jest.Mock).mockResolvedValue(undefined);
});

// Use the real router orchestration and schema, but intercept only the Zendesk HTTP client.
// Each response explicitly follows the exact request sequence expected in the scenario.
jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  createClient: (event: RouterTransformationRequestData) => ({
    baseUrl,
    destinationId: event.destination.ID,
    subdomain: 'example',
    accountId: (event.destination.Config as { rudderAccountId?: string }).rudderAccountId,
    headers: { Authorization: 'test' },
    request,
  }),
}));

const run = (...events: RouterTransformationRequestData[]) =>
  processDestinationIntegration(events, Integration, {});

describe('Zendesk framework router', () => {
  it('completes identify writes at transform time and emits exactly one request-free 299', async () => {
    request.mockResolvedValueOnce({ user: { id: 123 } });
    const event = input(1, {
      type: 'identify',
      userId: 'uid',
      traits: { name: 'N', email: 'n@example.com', custom: 'v' },
    });

    const responses = await run(event);

    expect(ensureFields).toHaveBeenCalledWith(
      expect.anything(),
      'user_fields',
      event.message.traits,
    );
    expect(request).toHaveBeenCalledWith('post', 'users/create_or_update.json', {
      user: {
        name: 'N',
        email: 'n@example.com',
        external_id: 'uid',
        user_fields: { id: 'uid', custom: 'v' },
      },
    });
    expect(responses).toEqual([
      {
        metadata: [event.metadata],
        destination: event.destination,
        batched: false,
        statusCode: 299,
      },
    ]);
    expect(responses[0]).not.toHaveProperty('batchedRequest');
  });

  it('keeps a failed identify separate from a track request in a mixed batch', async () => {
    request.mockResolvedValueOnce({ user: {} }).mockResolvedValueOnce({ users: [{ id: 22 }] });
    const identify = input(1, { type: 'identify', userId: 'uid', traits: { name: 'N' } });
    const track = input(2, {
      type: 'track',
      userId: 'uid',
      event: 'Bought',
      context: { traits: { email: 'n@example.com' } },
    });

    const responses = await run(identify, track);

    expect(responses).toHaveLength(2);
    expect(responses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          metadata: [identify.metadata],
          error: 'Zendesk did not return a user ID',
        }),
        expect.objectContaining({ metadata: [track.metadata], statusCode: 200 }),
      ]),
    );
    expect(
      (responses.find((response) => response.statusCode === 200)?.batchedRequest as any)?.endpoint,
    ).toBe(`${baseUrl}users/22/events`);
  });

  it('creates an organization and delivers a membership request when absent', async () => {
    request
      .mockResolvedValueOnce({ organization: { id: 99 } })
      .mockResolvedValueOnce({ users: [{ id: 12 }] })
      .mockResolvedValueOnce({ organization_memberships: [] });
    const event = input(3, {
      type: 'group',
      userId: 'uid',
      groupId: 'org',
      traits: { name: 'Org' },
      context: { traits: { email: 'n@example.com' } },
    });

    const [response] = await run(event);

    expect(request).toHaveBeenNthCalledWith(1, 'post', 'organizations/create_or_update.json', {
      organization: { name: 'Org', external_id: 'org', organization_fields: { id: 'org' } },
    });
    expect((response.batchedRequest as any)?.endpoint).toBe(
      `${baseUrl}organization_memberships.json`,
    );
    expect((response.batchedRequest as any)?.body.JSON).toEqual({
      organization_membership: { user_id: 12, organization_id: 99 },
    });
  });

  it('propagates a duplicate-name rejection without a groupId and never creates a membership', async () => {
    request.mockRejectedValueOnce(new NetworkError('duplicate organization name', 422));
    const event = input(10, {
      type: 'group',
      userId: 'uid',
      traits: { name: 'Org' },
      context: { traits: { email: 'n@example.com' } },
    });
    const [response] = await run(event);
    expect(request).toHaveBeenCalledWith('post', 'organizations/create_or_update.json', {
      organization: { name: 'Org' },
    });
    expect(request).toHaveBeenCalledTimes(1);
    expect(response).toMatchObject({ statusCode: 422, metadata: [event.metadata] });
    expect(response).not.toHaveProperty('batchedRequest');
  });

  it('suppresses a replayed group membership without sending another delivery request', async () => {
    request
      .mockResolvedValueOnce({ organization: { id: 99 } })
      .mockResolvedValueOnce({ users: [{ id: 12 }] })
      .mockResolvedValueOnce({ organization_memberships: [{ user_id: 12, organization_id: 99 }] });
    const event = input(4, {
      type: 'group',
      userId: 'uid',
      groupId: 'org',
      traits: { name: 'Org' },
      context: { traits: { email: 'n@example.com' } },
    });
    expect(await run(event)).toEqual([
      {
        metadata: [event.metadata],
        destination: event.destination,
        batched: false,
        statusCode: 299,
      },
    ]);
  });

  it('finds an existing membership on a later page without creating another one', async () => {
    const page = `${baseUrl}users/12/organization_memberships.json?page=2`;
    request
      .mockResolvedValueOnce({ organization: { id: 99 } })
      .mockResolvedValueOnce({ users: [{ id: 12 }] })
      .mockResolvedValueOnce({ organization_memberships: [], next_page: page })
      .mockResolvedValueOnce({
        organization_memberships: [{ organization_id: 99 }],
        next_page: null,
      });
    const event = input(7, {
      type: 'group',
      userId: 'uid',
      groupId: 'org',
      traits: { name: 'Org' },
      context: { traits: { email: 'n@example.com' } },
    });
    expect(await run(event)).toEqual([
      {
        metadata: [event.metadata],
        destination: event.destination,
        batched: false,
        statusCode: 299,
      },
    ]);
    expect(request).toHaveBeenNthCalledWith(4, 'get', page);
    expect(request).toHaveBeenCalledTimes(4);
  });

  it('rejects an invalid membership next page without posting a duplicate', async () => {
    request
      .mockResolvedValueOnce({ organization: { id: 99 } })
      .mockResolvedValueOnce({ users: [{ id: 12 }] })
      .mockResolvedValueOnce({
        organization_memberships: [],
        next_page: 'https://elsewhere.test/',
      });
    const [response] = await run(
      input(8, {
        type: 'group',
        userId: 'uid',
        groupId: 'org',
        traits: { name: 'Org' },
        context: { traits: { email: 'n@example.com' } },
      }),
    );
    expect(response.error).toBe('Invalid Zendesk memberships pagination');
    expect(request).toHaveBeenCalledTimes(3);
  });

  it('keeps a group with no userId on the deferred organization delivery path when configured', async () => {
    const event = input(
      5,
      { type: 'group', traits: { name: 'Org' } },
      {
        Config: { ...destination.Config, sendGroupCallsWithoutUserId: true },
      },
    );
    const [response] = await run(event);
    expect(request).not.toHaveBeenCalled();
    expect((response.batchedRequest as any)?.endpoint).toBe(
      `${baseUrl}organizations/create_or_update.json`,
    );
  });

  it('builds a framework track request for a v2 OAuth destination', async () => {
    request.mockResolvedValueOnce({ users: [{ id: 22 }] });
    const event = input(
      9,
      {
        type: 'track',
        userId: 'uid',
        event: 'Bought',
        context: { traits: { email: 'n@example.com' } },
      },
      {
        version: 2,
        Config: { domain: 'example', rudderAccountId: 'account' },
        deliveryAccount: {
          id: 'account',
          accountDefinitionName: 'DESTINATION_ZENDESK_OAUTH_AUTH_CODE',
        },
      },
    );
    event.metadata.secret = { accessToken: 'token' };
    const [response] = await run(event);
    expect(response.statusCode).toBe(200);
    expect(response.batchedRequest).toMatchObject({ headers: { Authorization: 'test' } });
  });

  it('rejects v2 without the linked OAuth account and token before doing any I/O', async () => {
    const event = input(
      6,
      { type: 'identify', userId: 'uid' },
      { version: 2, Config: { domain: 'example' } },
    );
    const [response] = await run(event);
    expect(response.statusCode).toBe(400);
    expect(response.error).toContain('Zendesk v2 requires a linked OAuth account');
    expect(request).not.toHaveBeenCalled();
  });
});

import { handleHttpRequest } from '../../../adapters/network';
import { createClient, findUser } from './utils';
import type { ZendeskInput } from './types';

jest.mock('../../../adapters/network', () => ({ handleHttpRequest: jest.fn() }));

const makeInput = (version: number): ZendeskInput =>
  ({
    destination: {
      ID: 'zendesk-test',
      version,
      Config: {
        domain: 'example',
        email: 'user@example.com',
        apiToken: 'api-token',
        rudderAccountId: 'account',
      },
      deliveryAccount: {
        id: 'account',
        accountDefinitionName: 'DESTINATION_ZENDESK_OAUTH_AUTH_CODE',
      },
    },
    metadata: { secret: { accessToken: 'oauth-token' } },
    message: { type: 'track' },
  }) as unknown as ZendeskInput;

beforeEach(() => (handleHttpRequest as jest.Mock).mockReset());

describe('Zendesk transport', () => {
  it.each([
    {
      version: 1,
      header: `Basic ${Buffer.from('user@example.com/token:api-token').toString('base64')}`,
    },
    { version: 2, header: 'Bearer oauth-token' },
  ])(
    'applies marketplace and v$version authentication on each request',
    async ({ version, header }) => {
      (handleHttpRequest as jest.Mock).mockResolvedValue({
        processedResponse: { status: 200, response: {} },
      });
      const client = createClient(makeInput(version));
      await client.request('post', 'users/create_or_update.json', { user: { name: 'Test' } });
      await findUser(client, 'user+test@example.com');
      expect(handleHttpRequest).toHaveBeenNthCalledWith(
        1,
        'post',
        'https://example.zendesk.com/api/v2/users/create_or_update.json',
        { user: { name: 'Test' } },
        {
          headers: expect.objectContaining({
            Authorization: header,
            'X-Zendesk-Marketplace-Name': 'RudderStack',
            'X-Zendesk-Marketplace-Organization-Id': '3339',
            'X-Zendesk-Marketplace-App-Id': '263241',
          }),
        },
        expect.objectContaining({ endpointPath: '/api/v2/users/create_or_update.json' }),
      );
      expect(handleHttpRequest).toHaveBeenNthCalledWith(
        2,
        'get',
        'https://example.zendesk.com/api/v2/users/search.json?query=user%2Btest%40example.com',
        { headers: expect.objectContaining({ Authorization: header }) },
        expect.objectContaining({ endpointPath: '/api/v2/users/search.json' }),
      );
    },
  );

  it.each([
    { status: 401, version: 2, auth: 'REFRESH_TOKEN', statusCode: 401 },
    { status: 401, version: 1, auth: undefined, statusCode: 401 },
    { status: 429, version: 2, auth: undefined, statusCode: 429 },
    { status: 503, version: 2, auth: undefined, statusCode: 503 },
  ])(
    'classifies v$version HTTP $status correctly',
    async ({ status, version, auth, statusCode }) => {
      (handleHttpRequest as jest.Mock).mockResolvedValue({
        processedResponse: { status, response: {} },
      });
      try {
        await createClient(makeInput(version)).request('get', 'user_fields.json');
        throw new Error('Expected an HTTP failure');
      } catch (error) {
        expect(error).toMatchObject({ status: statusCode });
        expect((error as { authErrorCategory?: string }).authErrorCategory || undefined).toBe(auth);
      }
    },
  );
});

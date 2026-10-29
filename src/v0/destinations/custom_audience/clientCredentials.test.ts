import { ConfigurationError, RetryableError } from '@rudderstack/integrations-lib';
import { ClientCredentialsTokenProvider } from './clientCredentials';
import {
  ACCOUNT_DEFINITION_NAMES,
  CUSTOM_AUDIENCE_CLIENT_CREDENTIALS_USER_AGENT,
} from './constants';
import type { ParsedCustomAudienceDeliveryAccount } from './types';

const buildAccount = (
  options: Record<string, unknown> = {},
  secret: Record<string, unknown> = { clientSecret: 'private-secret' },
): ParsedCustomAudienceDeliveryAccount => ({
  id: 'account-1',
  secretVersion: 1,
  accountDefinitionName: ACCOUNT_DEFINITION_NAMES.CLIENT_CREDENTIALS,
  options: {
    tokenUrl: 'https://token.example.com/oauth',
    clientId: 'client-id',
    ...options,
  },
  secret,
});

const tokenResponse = (token = 'access-token', expires_in?: number) => ({
  status: 200,
  data: { access_token: token, ...(expires_in !== undefined && { expires_in }) },
});

describe('ClientCredentialsTokenProvider', () => {
  afterEach(() => jest.restoreAllMocks());

  const authCases = [
    {
      name: 'Basic auth and space-separated scopes',
      options: { scopes: ['read', 'write'], extraTokenParams: 'audience=a%26b' },
      expectedAuth: `Basic ${Buffer.from('client-id:private-secret').toString('base64')}`,
      expectedBody: 'audience=a%26b&grant_type=client_credentials&scope=read+write',
    },
    {
      name: 'form-body auth and comma-separated scopes',
      options: {
        tokenAuthMethod: 'client_secret_post',
        scopeSeparator: 'comma',
        scopes: ['read', 'write'],
      },
      expectedAuth: undefined,
      expectedBody:
        'grant_type=client_credentials&scope=read%2Cwrite&client_id=client-id&client_secret=private-secret',
    },
  ];

  it.each(authCases)(
    'sends $name with the fixed User-Agent',
    async ({ options, expectedAuth, expectedBody }) => {
      const post = jest.fn().mockResolvedValue(tokenResponse());
      const provider = new ClientCredentialsTokenProvider(post);
      expect(await provider.getToken(buildAccount(options), 'ws-1')).toBe('access-token');
      const [url, body, config] = post.mock.calls[0];
      expect(url).toBe('https://token.example.com/oauth');
      expect(body).toBe(expectedBody);
      expect(config.headers).toEqual({
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': CUSTOM_AUDIENCE_CLIENT_CREDENTIALS_USER_AGENT,
        ...(expectedAuth && { Authorization: expectedAuth }),
      });
      expect(config.proxy).toBe(false);
      expect(config.maxRedirects).toBe(0);
      expect(config.httpsAgent).toBeDefined();
    },
  );

  it('percent-encodes client credentials before Basic encoding', async () => {
    const post = jest.fn().mockResolvedValue(tokenResponse());
    const provider = new ClientCredentialsTokenProvider(post);
    await provider.getToken(buildAccount({ clientId: 'a:b' }, { clientSecret: 'x&y' }), 'ws-1');
    expect(post.mock.calls[0][2].headers.Authorization).toBe(
      `Basic ${Buffer.from('a%3Ab:x%26y').toString('base64')}`,
    );
  });

  const invalidCases = [
    {
      name: 'missing tokenUrl',
      options: { tokenUrl: '' },
      secret: { clientSecret: 'private-secret' },
      error: 'options.tokenUrl',
    },
    { name: 'missing clientSecret', options: {}, secret: {}, error: 'secret.clientSecret' },
    {
      name: 'reserved extra parameter',
      options: { extraTokenParams: 'grant_type=password' },
      secret: { clientSecret: 'private-secret' },
      error: 'reserved or duplicate',
    },
    {
      name: 'duplicate extra parameter',
      options: { extraTokenParams: 'audience=a&audience=b' },
      secret: { clientSecret: 'private-secret' },
      error: 'reserved or duplicate',
    },
    {
      name: 'non-HTTPS token URL',
      options: { tokenUrl: 'http://token.example.com' },
      secret: { clientSecret: 'private-secret' },
      error: 'HTTPS target',
    },
    {
      name: 'private token URL',
      options: { tokenUrl: 'https://127.0.0.1/token' },
      secret: { clientSecret: 'private-secret' },
      error: 'public IP',
    },
    {
      name: 'URL query',
      options: { tokenUrl: 'https://token.example.com/token?secret=x' },
      secret: { clientSecret: 'private-secret' },
      error: 'query or fragment',
    },
  ];

  it.each(invalidCases)(
    'rejects $name before sending credentials',
    async ({ options, secret, error }) => {
      const post = jest.fn();
      const provider = new ClientCredentialsTokenProvider(post);
      await expect(provider.getToken(buildAccount(options, secret), 'ws-1')).rejects.toThrow(
        ConfigurationError,
      );
      await expect(provider.getToken(buildAccount(options, secret), 'ws-1')).rejects.toThrow(error);
      expect(post).not.toHaveBeenCalled();
    },
  );

  it('reuses a token until its expires_in safety margin and defaults to one hour without expiry', async () => {
    const now = jest.spyOn(Date, 'now').mockReturnValue(0);
    const post = jest
      .fn()
      .mockResolvedValueOnce(tokenResponse('first', 120))
      .mockResolvedValueOnce(tokenResponse('second'));
    const provider = new ClientCredentialsTokenProvider(post);
    const account = buildAccount();
    expect(await provider.getToken(account, 'ws-1')).toBe('first');
    now.mockReturnValue(107999);
    expect(await provider.getToken(account, 'ws-1')).toBe('first');
    now.mockReturnValue(108000);
    expect(await provider.getToken(account, 'ws-1')).toBe('second');
    now.mockReturnValue(3707999);
    expect(await provider.getToken(account, 'ws-1')).toBe('second');
    expect(post).toHaveBeenCalledTimes(2);
  });

  it('isolates accounts, workspaces, secret versions, and option-only edits', async () => {
    const post = jest
      .fn()
      .mockImplementation(async () => tokenResponse(`token-${post.mock.calls.length}`));
    const provider = new ClientCredentialsTokenProvider(post);
    const account = buildAccount();
    expect(await provider.getToken(account, 'ws-1')).toBe('token-1');
    expect(await provider.getToken(account, 'ws-1')).toBe('token-1');
    await provider.getToken({ ...account, secretVersion: 2 }, 'ws-1');
    await provider.getToken(
      { ...account, options: { ...account.options, scopes: ['new'] } },
      'ws-1',
    );
    await provider.getToken({ ...account, id: 'account-2' }, 'ws-1');
    await provider.getToken(account, 'ws-2');
    expect(post).toHaveBeenCalledTimes(5);
  });

  it('shares one in-flight grant for concurrent cold-cache events', async () => {
    let release!: (response: ReturnType<typeof tokenResponse>) => void;
    const post = jest.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          release = resolve;
        }),
    );
    const provider = new ClientCredentialsTokenProvider(post);
    const account = buildAccount();
    const first = provider.getToken(account, 'ws-1');
    const second = provider.getToken(account, 'ws-1');
    expect(post).toHaveBeenCalledTimes(1);
    release(tokenResponse());
    expect(await Promise.all([first, second])).toEqual(['access-token', 'access-token']);
    expect(post).toHaveBeenCalledTimes(1);
  });

  const failureCases = [
    {
      name: 'HTTP 400',
      response: { status: 400, data: { message: 'Bad credentials' } },
      errorType: ConfigurationError,
    },
    {
      name: 'HTTP 401',
      response: {
        status: 401,
        data: { code: 1201, message: 'Two-factor authentication required.' },
      },
      errorType: ConfigurationError,
    },
    {
      name: 'invalid_client envelope',
      response: { status: 200, data: { error: 'invalid_client' } },
      errorType: ConfigurationError,
    },
    {
      name: 'unauthorized_client envelope',
      response: { status: 200, data: { error: 'unauthorized_client' } },
      errorType: ConfigurationError,
    },
    {
      name: 'HTTP 500',
      response: { status: 500, data: { message: 'provider down' } },
      errorType: RetryableError,
    },
    {
      name: 'HTTP 500 with invalid_client body',
      response: { status: 500, data: { error: 'invalid_client' } },
      errorType: RetryableError,
    },
    { name: 'redirect', response: { status: 302, data: {} }, errorType: ConfigurationError },
  ];

  it.each(failureCases)('classifies $name without caching it', async ({ response, errorType }) => {
    const post = jest.fn().mockResolvedValueOnce(response).mockResolvedValueOnce(tokenResponse());
    const provider = new ClientCredentialsTokenProvider(post);
    await expect(provider.getToken(buildAccount(), 'ws-1')).rejects.toThrow(errorType);
    expect(await provider.getToken(buildAccount(), 'ws-1')).toBe('access-token');
    expect(post).toHaveBeenCalledTimes(2);
  });

  it('returns a shortened message without echoing the submitted secret', async () => {
    const post = jest
      .fn()
      .mockResolvedValue({ status: 401, data: { message: 'Bad private-secret for client-id' } });
    const provider = new ClientCredentialsTokenProvider(post);
    await expect(provider.getToken(buildAccount(), 'ws-1')).rejects.toThrow(
      'Bad [redacted] for [redacted]',
    );
  });

  it('redacts form-encoded credentials in provider errors', async () => {
    const post = jest
      .fn()
      .mockResolvedValue({ status: 401, data: { message: 'Bad secret with+space for client-id' } });
    const provider = new ClientCredentialsTokenProvider(post);
    const account = buildAccount({}, { clientSecret: 'with space' });
    await expect(provider.getToken(account, 'ws-1')).rejects.toThrow(
      'Bad secret [redacted] for [redacted]',
    );
  });

  it('treats network and timeout failures as retryable and retries the next event', async () => {
    const post = jest
      .fn()
      .mockRejectedValueOnce(new Error('ECONNRESET'))
      .mockResolvedValueOnce(tokenResponse());
    const provider = new ClientCredentialsTokenProvider(post);
    await expect(provider.getToken(buildAccount(), 'ws-1')).rejects.toThrow(RetryableError);
    expect(await provider.getToken(buildAccount(), 'ws-1')).toBe('access-token');
  });
});

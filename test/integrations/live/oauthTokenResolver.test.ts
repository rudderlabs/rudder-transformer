import axios from 'axios';
import { OAuthTokenResolver } from './oauthTokenResolver';
import type { LiveSecret } from './types';

jest.mock('axios');
const mockedPost = axios.post as jest.MockedFunction<typeof axios.post>;

const ACCOUNT_DEFINITION = {
  type: 'google_adwords_enhanced_conversions',
  category: 'destination',
  name: 'DESTINATION_GOOGLE_ADWORDS_ENHANCED_CONVERSIONS_OAUTH',
};

const oauthSecret = (overrides: Partial<LiveSecret['oauthRefresh']> = {}): LiveSecret => ({
  authType: 'oauth',
  config: {},
  oauthRefresh: { refreshToken: 'rt-123', ...overrides },
});

const resolver = new OAuthTokenResolver('http://rudder-auth.test');

beforeEach(() => mockedPost.mockReset());

const lastBody = () => mockedPost.mock.calls[0][1] as Record<string, any>;

describe('OAuthTokenResolver — v1', () => {
  // rudder-auth's v1 route res.json()s `implementation.refreshToken()`'s return verbatim, and that
  // return is `{ secret: {...} }`. Reading the token off the top level finds nothing.
  it('unwraps the { secret } envelope the v1 route returns', async () => {
    mockedPost.mockResolvedValue({
      status: 200,
      data: { secret: { access_token: 'at-1', refresh_token: 'rt-1', developer_token: 'dt-1' } },
    } as never);

    const secret = await resolver.resolveSecret(
      'google_adwords_enhanced_conversions',
      oauthSecret(),
      'v1',
    );

    expect(secret).toEqual({
      access_token: 'at-1',
      refresh_token: 'rt-1',
      developer_token: 'dt-1',
    });
  });

  // The v1 route hands account.secret to the implementation with no key mapping, and rudder-auth's
  // Google implementation destructures `refresh_token`, not `refreshToken`.
  it('sends the refresh token under both spellings', async () => {
    mockedPost.mockResolvedValue({
      status: 200,
      data: { secret: { access_token: 'at' } },
    } as never);

    await resolver.resolveSecret('google_adwords_enhanced_conversions', oauthSecret(), 'v1');

    expect(lastBody().account.secret).toMatchObject({
      refreshToken: 'rt-123',
      refresh_token: 'rt-123',
    });
    expect(lastBody().accountDefinition).toEqual(ACCOUNT_DEFINITION);
  });

  it('lets providerFields override either spelling and carry extras', async () => {
    mockedPost.mockResolvedValue({
      status: 200,
      data: { secret: { access_token: 'at' } },
    } as never);

    await resolver.resolveSecret(
      'google_adwords_enhanced_conversions',
      oauthSecret({ providerFields: { instance_url: 'https://x.test' } }),
      'v1',
    );

    expect(lastBody().account.secret.instance_url).toEqual('https://x.test');
  });

  // An account definition is public metadata, not a credential, so it is never read from the
  // secret. With no spec declaration either, the resolver derives the control plane's convention.
  it('derives the conventional account definition when the spec does not declare one', async () => {
    mockedPost.mockResolvedValue({
      status: 200,
      data: { secret: { access_token: 'at' } },
    } as never);

    await resolver.resolveSecret('google_adwords_enhanced_conversions', oauthSecret(), 'v1');

    expect(lastBody().accountDefinition).toEqual(ACCOUNT_DEFINITION);
  });

  it('prefers the spec-declared account definition over the derived one', async () => {
    mockedPost.mockResolvedValue({
      status: 200,
      data: { secret: { access_token: 'at' } },
    } as never);
    const specDefinition = {
      type: 'google_adwords_remarketing_lists',
      category: 'destination',
      name: 'DESTINATION_GOOGLE_ADWORDS_REMARKETING_LISTS_DM_OAUTH',
    };

    await resolver.resolveSecret(
      'google_adwords_remarketing_lists',
      oauthSecret(),
      'v1',
      specDefinition,
    );

    expect(lastBody().accountDefinition).toEqual(specDefinition);
  });
});

describe('OAuthTokenResolver — v0', () => {
  // criteo_audience's v0 method returns the secret flat; unwrapping must not disturb that.
  it('reads a flat v0 response and posts only refreshToken', async () => {
    mockedPost.mockResolvedValue({
      status: 200,
      data: { accessToken: 'at-0', refreshToken: 'rt-0' },
    } as never);

    const secret = await resolver.resolveSecret('criteo_audience', oauthSecret(), 'v0');

    expect(secret).toEqual({ accessToken: 'at-0', refreshToken: 'rt-0' });
    expect(mockedPost.mock.calls[0][0]).toContain('/tokens/destination/criteo_audience/refresh');
    expect(lastBody()).toEqual({ refreshToken: 'rt-123' });
  });

  // A v0 body is whatever the destination's own refresh method returns, so a nested `secret` in it
  // is not the v1 envelope. Unwrapping by body shape rather than by route would descend into it and
  // drop the top-level token, reporting a successful refresh as 'no access token in response'.
  it('does not unwrap a nested `secret` on the flat v0 route', async () => {
    mockedPost.mockResolvedValue({
      status: 200,
      data: { accessToken: 'at-0', secret: { clientSecret: 'not-a-token' } },
    } as never);

    const secret = await resolver.resolveSecret('criteo_audience', oauthSecret(), 'v0');

    expect(secret.accessToken).toEqual('at-0');
  });
});

describe('OAuthTokenResolver — failures', () => {
  it('reports a refresh that returned no access token', async () => {
    mockedPost.mockResolvedValue({
      status: 200,
      data: { secret: { refresh_token: 'only' } },
    } as never);

    await expect(
      resolver.resolveSecret('google_adwords_enhanced_conversions', oauthSecret(), 'v1'),
    ).rejects.toThrow('no access token in response');
  });

  it('never puts the response body — which carries tokens — into the thrown message', async () => {
    const err = Object.assign(new Error('boom'), {
      isAxiosError: true,
      response: { status: 401, data: { secret: { access_token: 'LEAKED-TOKEN' } } },
      config: { data: JSON.stringify({ refreshToken: 'LEAKED-REFRESH' }) },
    });
    mockedPost.mockRejectedValue(err);

    await expect(
      resolver.resolveSecret('google_adwords_enhanced_conversions', oauthSecret(), 'v1'),
    ).rejects.toThrow(
      expect.objectContaining({
        message: expect.not.stringContaining('LEAKED'),
      }) as never,
    );
  });
});

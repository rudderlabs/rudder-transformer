import axios from 'axios';
import { z } from 'zod';
import type { AccountDefinition, LiveSecret, OAuthVersion } from './types';

// The account-definition shape the control plane uses for a destination with a single OAuth
// account: rudder-integrations-config stores it under
// `destinations/<dest>/accounts/<dest>_oauth/db-config.json` as
// `{ name: 'DESTINATION_<DEST>_OAUTH', type: '<dest>', category: 'destination' }`, and rudder-auth
// resolves its implementation from `name.toLowerCase()`. Deriving it keeps the common case free of
// boilerplate; a spec can still declare its own for a destination with more than one variant.
const defaultAccountDefinition = (destination: string): AccountDefinition => ({
  type: destination,
  category: 'destination',
  name: `DESTINATION_${destination.toUpperCase()}_OAUTH`,
});

const SecretSchema = z.record(z.unknown());

type RefreshResult = { ok: true; secret: Record<string, string> } | { ok: false; detail: string };

// The two routes answer with different envelopes. v0 returns the secret flat
// (`{ accessToken, refreshToken }` / `{ access_token, … }`), while v1 wraps it —
// `implementation.refreshToken()` returns `{ secret: {...} }` and the route `res.json`s that
// verbatim. Without unwrapping, a v1 refresh reads no access token at the top level and is
// reported as a failed refresh even though it succeeded.
//
// Applied per ROUTE rather than by sniffing the body, because the two shapes are not reliably
// distinguishable: a v0 response is whatever the destination's own refresh method returns, and one
// that happened to carry a nested `secret` object alongside its top-level `accessToken` would be
// unwrapped into the inner object and the token silently lost. The route is known at the call
// site, so there is nothing to guess at.
const unwrapSecret = (body: Record<string, unknown>): Record<string, unknown> => {
  const inner = body.secret;
  return typeof inner === 'object' && inner !== null && !Array.isArray(inner)
    ? (inner as Record<string, unknown>)
    : body;
};

const stringEntries = (secret: Record<string, unknown>): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(secret)) {
    if (typeof value === 'string') {
      out[key] = value;
    }
  }
  return out;
};

export class OAuthTokenResolver {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  // `envelope` names the shape the route answers with: 'wrapped' for v1's `{ secret: {...} }`,
  // 'flat' for v0's bare secret. See unwrapSecret for why this is a parameter and not a sniff.
  private async post(
    url: string,
    body: object,
    envelope: 'flat' | 'wrapped',
  ): Promise<RefreshResult> {
    try {
      const res = await axios.post(url, body, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 20000,
      });
      const parsed = SecretSchema.safeParse(res.data);
      const payload = parsed.success ? parsed.data : {};
      const secret = stringEntries(envelope === 'wrapped' ? unwrapSecret(payload) : payload);
      if (secret.accessToken || secret.access_token) {
        return { ok: true, secret };
      }
      return { ok: false, detail: `HTTP ${res.status}: no access token in response` };
    } catch (err) {
      if (!axios.isAxiosError(err)) {
        return { ok: false, detail: 'unexpected error' };
      }
      // err.response → the HTTP error status; otherwise a network/timeout. Report the status or
      // machine code only — never err.message/config, which can carry the request body's token.
      return {
        ok: false,
        detail: err.response
          ? `HTTP ${err.response.status}`
          : `unreachable (${err.code ?? 'no response'})`,
      };
    }
  }

  private async refreshV1(
    destination: string,
    secret: LiveSecret,
    specAccountDefinition?: AccountDefinition,
  ): Promise<RefreshResult> {
    const { refreshToken, providerFields } = secret.oauthRefresh ?? {};
    // An account definition is public metadata, never a credential, so it is not read from the
    // secret at all: a spec declares it, or the convention below is derived. That keeps
    // LIVE_SECRET_<DEST> to credentials only.
    const accountDefinition = specAccountDefinition ?? defaultAccountDefinition(destination);
    // `account.secret` is handed to the resolved implementation verbatim — the v1 route does no key
    // mapping — and implementations disagree on the casing they destructure: rudder-auth's Google
    // implementation reads `refresh_token`, others read `refreshToken`. Sending both spellings of
    // the same token keeps this resolver agnostic; `providerFields` is spread last so a spec can
    // still override either, alongside extras like Salesforce's instance_url.
    return this.post(
      `${this.baseUrl}/auth/v1/refresh`,
      {
        accountDefinition,
        account: {
          secret: { refreshToken, refresh_token: refreshToken, ...(providerFields ?? {}) },
          options: {},
        },
      },
      'wrapped',
    );
  }

  private async refreshV0(destination: string, refreshToken: string): Promise<RefreshResult> {
    return this.post(
      `${this.baseUrl}/tokens/destination/${destination}/refresh`,
      { refreshToken },
      'flat',
    );
  }

  // Call exactly the route the spec declares — no fallback, so a leftover legacy path can't be hit.
  async resolveSecret(
    destination: string,
    secret: LiveSecret,
    version: OAuthVersion,
    specAccountDefinition?: AccountDefinition,
  ): Promise<Record<string, string>> {
    const refreshToken = secret.oauthRefresh?.refreshToken;
    if (!refreshToken) {
      throw new Error(
        `[live:${destination}] authType is 'oauth' but LIVE_SECRET_${destination.toUpperCase()} has no oauthRefresh.refreshToken.`,
      );
    }
    const result =
      version === 'v0'
        ? await this.refreshV0(destination, refreshToken)
        : await this.refreshV1(destination, secret, specAccountDefinition);
    if (result.ok) {
      return result.secret;
    }
    const route =
      version === 'v0' ? `/tokens/destination/${destination}/refresh` : '/auth/v1/refresh';
    throw new Error(
      `[live:${destination}] rudder-auth ${version} refresh failed (${route}): ${result.detail}`,
    );
  }
}

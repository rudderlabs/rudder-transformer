import axios from 'axios';
import { z } from 'zod';
import type { LiveSecret } from './types';

// rudder-auth returns each integration's own refreshed *secret* object, with no normalization:
// criteo_audience/zoho -> { accessToken, refreshToken }, google_adwords -> { access_token }, etc.
// rudder-server injects that object as-is into metadata.secret, and each transform reads its own key
// via getAccessToken(metadata, 'accessToken' | 'access_token'). So the resolver returns the whole
// secret to merge, and only asserts that *some* access token is present to tell a successful refresh
// from an error body. (Confirmed against rudder-auth: routes/tokens.ts, routes/auth/v1/index.ts,
// controllers/refreshTokenMethods/criteo_audience.ts.)
const SecretSchema = z.record(z.unknown());

// Success carries the secret to merge; failure carries a reason so a total failure can report why
// each route failed instead of an opaque "no token".
type RefreshResult = { ok: true; secret: Record<string, string> } | { ok: false; detail: string };

const stringEntries = (secret: Record<string, unknown>): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(secret)) {
    if (typeof value === 'string') {
      out[key] = value;
    }
  }
  return out;
};

// Redact token-shaped keys before a failure body is put in an error, so a token under an
// unrecognized key can't leak (rudder-auth responses are flat, so a shallow pass suffices).
const redact = (data: unknown): unknown => {
  if (data === null || typeof data !== 'object') {
    return data;
  }
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    out[key] = /token|secret|password|key/i.test(key) ? '[redacted]' : value;
  }
  return out;
};

// A refresh succeeded iff a token is present under either key convention; otherwise report the body.
const toResult = (status: number, data: unknown): RefreshResult => {
  const parsed = SecretSchema.safeParse(data);
  const secret = parsed.success ? stringEntries(parsed.data) : {};
  if (secret.accessToken || secret.access_token) {
    return { ok: true, secret };
  }
  return { ok: false, detail: `HTTP ${status}, body=${JSON.stringify(redact(data))}` };
};

export class OAuthTokenResolver {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  private async post(url: string, body: object): Promise<RefreshResult> {
    try {
      const res = await axios.post(url, body, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 20000,
        validateStatus: () => true,
      });
      return toResult(res.status, res.data);
    } catch (err) {
      // Machine code only — never the message/config, which can carry the request body (token).
      const code = axios.isAxiosError(err) ? (err.code ?? 'no response') : 'unexpected error';
      return { ok: false, detail: `unreachable (${code})` };
    }
  }

  // V1: POST /auth/v1/refresh with { accountDefinition, account: { secret, options } }.
  private async tryV1(secret: LiveSecret): Promise<RefreshResult> {
    const { refreshToken, accountDefinition, providerFields } = secret.oauthRefresh ?? {};
    if (!refreshToken || !accountDefinition) {
      return { ok: false, detail: 'skipped (no oauthRefresh.accountDefinition)' };
    }
    return this.post(`${this.baseUrl}/auth/v1/refresh`, {
      accountDefinition,
      account: { secret: { refreshToken, ...(providerFields ?? {}) }, options: {} },
    });
  }

  // Legacy: POST /tokens/destination/<dest>/refresh with { refreshToken }.
  private async tryLegacy(destination: string, refreshToken: string): Promise<RefreshResult> {
    return this.post(`${this.baseUrl}/tokens/destination/${destination}/refresh`, { refreshToken });
  }

  async resolveSecret(destination: string, secret: LiveSecret): Promise<Record<string, string>> {
    const refreshToken = secret.oauthRefresh?.refreshToken;
    if (!refreshToken) {
      throw new Error(
        `[live:${destination}] authType is 'oauth' but LIVE_SECRET_${destination.toUpperCase()} ` +
          `has no oauthRefresh.refreshToken — cannot mint a secret via rudder-auth.`,
      );
    }
    const v1 = await this.tryV1(secret);
    if (v1.ok) {
      return v1.secret;
    }
    const legacy = await this.tryLegacy(destination, refreshToken);
    if (legacy.ok) {
      return legacy.secret;
    }
    throw new Error(
      `[live:${destination}] rudder-auth refresh failed on both routes:\n` +
        `  V1 (/auth/v1/refresh): ${v1.detail}\n` +
        `  legacy (/tokens/destination/${destination}/refresh): ${legacy.detail}\n` +
        `The refresh token must match the app whose client_id/secret rudder-auth uses ` +
        `(image default, or *_CLIENT_ID/_SECRET in the env).`,
    );
  }
}

import axios from 'axios';
import { z } from 'zod';
import type { LiveSecret, OAuthVersion } from './types';

const SecretSchema = z.record(z.unknown());

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
      });
      const parsed = SecretSchema.safeParse(res.data);
      const secret = parsed.success ? stringEntries(parsed.data) : {};
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

  private async refreshV1(secret: LiveSecret): Promise<RefreshResult> {
    const { refreshToken, accountDefinition, providerFields } = secret.oauthRefresh ?? {};
    if (!accountDefinition) {
      return { ok: false, detail: 'oauthRefresh.accountDefinition is required for a v1 refresh' };
    }
    return this.post(`${this.baseUrl}/auth/v1/refresh`, {
      accountDefinition,
      account: { secret: { refreshToken, ...(providerFields ?? {}) }, options: {} },
    });
  }

  private async refreshV0(destination: string, refreshToken: string): Promise<RefreshResult> {
    return this.post(`${this.baseUrl}/tokens/destination/${destination}/refresh`, { refreshToken });
  }

  // Call exactly the route the spec declares — no fallback, so a leftover legacy path can't be hit.
  async resolveSecret(
    destination: string,
    secret: LiveSecret,
    version: OAuthVersion,
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
        : await this.refreshV1(secret);
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

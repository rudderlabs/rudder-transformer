import axios from 'axios';
import { LiveSecret } from './types';

type RefreshResponse = {
  accessToken?: string;
  refreshToken?: string;
  [key: string]: unknown;
};

// Mints a fresh OAuth access token for a destination via the rudder-auth refresh endpoint.
export class OAuthTokenResolver {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  async resolveAccessToken(destination: string, secret: LiveSecret): Promise<string> {
    const refreshToken = secret.oauthRefresh?.refreshToken;
    if (!refreshToken) {
      throw new Error(
        `[live:${destination}] authType is 'oauth' but LIVE_SECRET_${destination.toUpperCase()} ` +
          `has no oauthRefresh.refreshToken — cannot mint an access token via rudder-auth.`,
      );
    }

    const url = `${this.baseUrl}/tokens/destination/${destination}/refresh`;
    const res = await axios
      .post<RefreshResponse>(
        url,
        { refreshToken },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 20000,
          validateStatus: () => true,
        },
      )
      .catch((err) => {
        throw new Error(
          `[live:${destination}] could not reach rudder-auth at ${url}: ${String(err)}. ` +
            `Check the rudder-auth container started (see live/rudderAuthContainer.ts).`,
        );
      });

    const accessToken = res.data?.accessToken;
    if (res.status !== 200 || !accessToken) {
      throw new Error(
        `[live:${destination}] rudder-auth refresh failed (${url}): HTTP ${res.status}, ` +
          `body=${JSON.stringify(res.data)}. The refresh token must be issued by the app whose ` +
          `client_id/secret rudder-auth uses (the image default, or the *_CLIENT_ID/_SECRET set in the env).`,
      );
    }
    return accessToken;
  }
}

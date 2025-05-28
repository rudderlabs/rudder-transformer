import axios, { AxiosError } from 'axios';
import { TokenCache, SFMCErrorResponse } from '../types';
import { SFMCAuthError, SFMCRateLimitError } from '../errors';
import { SFMCDestinationConfig } from '../type';

class TokenManager {
  private static instance: TokenManager;

  private tokenCache: TokenCache | null = null;

  private readonly SAFETY_MARGIN = 300000; // 5 minutes in milliseconds

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  private isValidToken(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      const expirationTime = payload.exp * 1000;
      return Date.now() < expirationTime;
    } catch (error) {
      return false;
    }
  }

  private async refreshToken(config: SFMCDestinationConfig): Promise<string> {
    try {
      const { clientId, clientSecret, subDomain } = config;

      const response = await axios.post(
        `https://${subDomain}.auth.marketingcloudapis.com/v2/token`,
        {
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const { access_token: accessToken, expires_in: expiresIn } = response.data;

      this.tokenCache = {
        token: accessToken,
        expiresAt: Date.now() + expiresIn * 1000 - this.SAFETY_MARGIN,
      };

      return accessToken;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<SFMCErrorResponse>;
        if (axiosError.response?.status === 429) {
          throw new SFMCRateLimitError('Rate limit exceeded', {
            limit: parseInt(axiosError.response.headers['x-ratelimit-limit'] || '0', 10),
            remaining: parseInt(axiosError.response.headers['x-ratelimit-remaining'] || '0', 10),
            reset: parseInt(axiosError.response.headers['x-ratelimit-reset'] || '0', 10),
          });
        }
        throw new SFMCAuthError(
          `Authentication failed: ${axiosError.response?.data?.message || axiosError.message}`,
        );
      }
      throw new SFMCAuthError('Authentication failed: Unknown error');
    }
  }

  async getAuthToken(config: SFMCDestinationConfig): Promise<string> {
    if (
      this.tokenCache &&
      this.isValidToken(this.tokenCache.token) &&
      Date.now() < this.tokenCache.expiresAt
    ) {
      return this.tokenCache.token;
    }
    return this.refreshToken(config);
  }
}

export const tokenManager = TokenManager.getInstance();

import axios, { AxiosError } from 'axios';
import { ConfigurationError } from '@rudderstack/integrations-lib';
import { TokenCache, SFMCErrorResponse } from './types';
import { SFMCAuthError, SFMCRateLimitError } from './errors';
import { ProcessedEvent, SFMCDestinationConfig, SFMCRouterRequest } from './type';

// Token cache
let tokenCache: TokenCache | null = null;

/**
 * Validates if a token is still valid
 * @param token The token to validate
 * @returns boolean indicating if token is valid
 */
export function isValidToken(token: string): boolean {
  try {
    // Basic JWT validation
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    // Check if token is expired
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() < expirationTime;
  } catch (error) {
    return false;
  }
}

/**
 * Refreshes the authentication token
 * @param config SFMC destination configuration
 * @returns Promise resolving to a new token
 */
async function refreshToken(config: SFMCDestinationConfig): Promise<string> {
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

    // Cache the token with expiration
    tokenCache = {
      token: accessToken,
      expiresAt: Date.now() + expiresIn * 1000 - 300000, // Subtract 5 minutes for safety
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

/**
 * Gets a valid authentication token, using cache if available
 * @param config SFMC destination configuration
 * @returns Promise resolving to a valid token
 */
export async function getAuthToken(config: SFMCDestinationConfig): Promise<string> {
  // Check if we have a valid cached token
  if (tokenCache && isValidToken(tokenCache.token) && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  // If no valid cached token, get a new one
  return refreshToken(config);
}

// Create event chunk from router request
export const createEventChunk = (event: SFMCRouterRequest): ProcessedEvent => {
  const { message, metadata, connection } = event;
  const { action, identifiers, fields } = message;
  if (!connection) {
    throw new ConfigurationError('Connection configuration is required');
  }
  // Create payload based on action type
  const payload = {
    keys: identifiers,
    values: fields,
  };

  return {
    payload,
    metadata,
    eventAction: action,
  };
};

export const getMergedMetadata = (batch: ProcessedEvent[]) => batch.map((input) => input.metadata);

import { AuthProvider } from './auth/authContext';
import { TokenProvider } from './auth/tokenProvider';
import { OAuthProvider } from './auth/oauthProvider';
import {
  SalesforceDestinationConfig,
  OAuthCredentials,
  LEGACY,
  OAUTH,
} from './types/salesforceTypes';

export function createAuthProvider(
  authType: 'legacy' | 'oauth',
  metadata: SalesforceDestinationConfig | OAuthCredentials,
): AuthProvider {
  if (authType === LEGACY) {
    return new TokenProvider(metadata as SalesforceDestinationConfig);
  }
  if (authType === OAUTH) {
    return new OAuthProvider(metadata as OAuthCredentials);
  }
  throw new Error(`Unsupported auth type: ${authType}`);
}

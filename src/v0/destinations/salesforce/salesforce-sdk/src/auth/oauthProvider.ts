import { AuthProvider } from './authContext';
import { OAuthCredentials } from '../types/salesforceTypes';

/**
 * OAuthProvider is an implementation of AuthProvider that retrieves an access token using OAuth.
 */
export class OAuthProvider implements AuthProvider {
  private readonly credentials: OAuthCredentials;

  constructor(credentials: OAuthCredentials) {
    if (!credentials.token || !credentials.instanceUrl) {
      throw new Error('OAuth credentials are incomplete.');
    }
    this.credentials = credentials;
  }

  async getAccessToken(): Promise<string> {
    return this.credentials.token;
  }

  getAuthenticationHeader(token: string): any {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  areCredentialsSet(): boolean {
    return !!(this.credentials && this.credentials.token && this.credentials.instanceUrl);
  }
}

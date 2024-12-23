import axios from 'axios';
import { AuthProvider } from './authContext';
import {
  SalesforceDestinationConfig,
  SF_TOKEN_REQUEST_URL,
  SF_TOKEN_REQUEST_URL_SANDBOX,
} from '../types/salesforceTypes';

/**
 * TokenProvider is an implementation of AuthProvider that uses a pre-existing access token.
 */
export class TokenProvider implements AuthProvider {
  private credentials!: SalesforceDestinationConfig;

  // Setter method for credentials to validate before setting
  setCredentials(credentials: SalesforceDestinationConfig): void {
    if (!credentials.consumerKey || !credentials.password || !credentials.consumerSecret) {
      throw new Error('Access token is required for TokenProvider.');
    }
    this.credentials = credentials;
  }

  constructor(credentials: SalesforceDestinationConfig) {
    this.setCredentials(credentials); // Use the setter method
  }

  async getAccessToken(): Promise<string> {
    let SF_TOKEN_URL;
    if (this.credentials.sandbox) {
      SF_TOKEN_URL = SF_TOKEN_REQUEST_URL_SANDBOX;
    } else {
      SF_TOKEN_URL = SF_TOKEN_REQUEST_URL;
    }

    try {
      const authUrl = `${SF_TOKEN_URL}?username=${
        this.credentials.userName
      }&password=${encodeURIComponent(this.credentials.password)}${encodeURIComponent(
        this.credentials.initialAccessToken,
      )}&client_id=${this.credentials.consumerKey}&client_secret=${
        this.credentials.consumerSecret
      }&grant_type=password`;
      const response = await axios.post(authUrl);

      if (response.data && response.data.access_token) {
        this.credentials.instanceUrl = response.data.instance_url;
        return response.data.access_token;
      }
      throw new Error('Failed to retrieve access token.');
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error fetching access token: ${error.message}`);
      } else {
        throw new Error('Error fetching access token: Unknown error occurred.');
      }
    }
  }

  getAuthenticationHeader(token: string): any {
    return {
      Authorization: token,
    };
  }

  areCredentialsSet(): boolean {
    return !!(
      this.credentials &&
      this.credentials.consumerKey &&
      this.credentials.password &&
      this.credentials.consumerSecret &&
      this.credentials.instanceUrl
    );
  }
}

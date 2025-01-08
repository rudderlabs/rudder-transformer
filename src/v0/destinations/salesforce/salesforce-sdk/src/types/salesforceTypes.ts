export interface OAuthCredentials {
  token: string;
  instanceUrl: string;
}

export interface SalesforceDestinationConfig {
  initialAccessToken: string;
  consumerKey: string;
  consumerSecret: string;
  userName: string;
  password: string;
  sandbox: true;
  instanceUrl: string;
}

export type SalesforceAuth = SalesforceDestinationConfig | OAuthCredentials;

export interface AuthProvider {
  getAccessToken(): Promise<string>;
  getAuthenticationHeader(token: string): any;
}

export interface SalesforceResponse {
  id: string;
  success: boolean;
  errors?: string[];
}

export interface SalesforceRecord {
  Id: string;
  Name: string;
}

export interface QueryResponse<T> {
  totalSize: number;
  done: boolean;
  records: T[];
}

export const SF_TOKEN_REQUEST_URL = 'https://login.salesforce.com/services/oauth2/token';
export const SF_TOKEN_REQUEST_URL_SANDBOX = 'https://test.salesforce.com/services/oauth2/token';

export const LEGACY = 'legacy';
export const OAUTH = 'oauth';

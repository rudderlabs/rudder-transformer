/**
 * AuthProvider interface acts as a contract for authentication mechanisms.
 * Each implementation of this interface will define how to retrieve the access token.
 */
export interface AuthProvider {
  /**
   * Retrieves the access token required for authenticating API calls.
   * @returns A Promise that resolves to the access token as a string.
   */
  getAccessToken(): Promise<string>;

  getAuthenticationHeader(token: string): any;

  areCredentialsSet(): boolean;
}

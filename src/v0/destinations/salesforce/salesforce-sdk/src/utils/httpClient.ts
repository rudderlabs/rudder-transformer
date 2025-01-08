import axios, { AxiosInstance } from 'axios';
import { AuthProvider } from '../types/salesforceTypes';

export class HttpClient {
  private client: AxiosInstance;

  private authProvider: AuthProvider;

  constructor(instanceUrl: string, authProvider: AuthProvider) {
    this.authProvider = authProvider;
    this.client = axios.create({
      baseURL: instanceUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private async addAuthHeader(): Promise<void> {
    const token = await this.authProvider.getAccessToken();
    this.client.defaults.headers = this.authProvider.getAuthenticationHeader(token);
  }

  async get<T>(url: string): Promise<T> {
    // for getting the access token we are not requiring to send any headers
    const response = await this.client.get<T>(url);
    return response.data;
  }

  async post<T>(url: string, data: any): Promise<T> {
    await this.addAuthHeader();
    const response = await this.client.post<T>(url, data);
    return response.data;
  }
}

import { APIClientFactory } from '../api-versioning/APIClientFactory';
import { InputTypeStrategy } from '../type';

export abstract class BaseProcessor implements InputTypeStrategy {
  protected destination: any;

  constructor(destination: any) {
    this.destination = destination;
  }

  getEndpoint(): string {
    const apiClient = APIClientFactory.createClient(this.destination.Config.apiVersion);
    return apiClient.getEndpoint();
  }

  getHeaders(): Record<string, string> {
    const apiClient = APIClientFactory.createClient(this.destination.Config.apiVersion);
    return apiClient.getHeaders(this.destination);
  }

  abstract getMessageBody(event: any): void;

  responseBuilder(messageBody, endPoint, headers): string {
    const apiClient = APIClientFactory.createClient(this.destination.Config.apiVersion);
    return apiClient.responseBuilder(messageBody, endPoint, headers);
  }
}

export interface APIClient {
  getEndpoint(): string;
  getHeaders(destination: any): Record<string, string>;
  getMessageBody(data: any): any;
  responseBuilder(messageBody: any, endPoint: string, headers: Record<string, string>): any;
}

export interface InputTypeStrategy {
  getEndpoint(): string;
  getHeaders(destination: any): Record<string, string>;
  getMessageBody(data: any): any;
}

export interface InputClassificationStrategy {
  processInput(data: any): void;
}

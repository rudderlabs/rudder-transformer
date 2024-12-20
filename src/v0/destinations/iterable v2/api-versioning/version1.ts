import { defaultPostRequestConfig, defaultRequestConfig } from '../../../util';
import { JSON_MIME_TYPE } from '../../../util/constant';
import { APIClient } from '../type';

export class APIClientV1 implements APIClient {
  getEndpoint(): string {
    return 'https://api.example.com/v1/endpoint';
  }

  getHeaders(destination): Record<string, string> {
    return {
      'Content-Type': JSON_MIME_TYPE,
      api_key: destination.Config.apiKey,
    };
  }

  getMessageBody(data: any): any {
    return { ...data, version: 'v1' };
  }

  responseBuilder = (messageBody, endPoint, headers) => {
    const response = defaultRequestConfig();
    response.endpoint = endPoint;
    response.method = defaultPostRequestConfig.requestMethod;
    response.body.JSON = messageBody;
    response.headers = headers;
    return response;
  };
}

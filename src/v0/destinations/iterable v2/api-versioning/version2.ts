import { JSON_MIME_TYPE } from '../../../util/constant';
import { APIClient } from '../type';
import { defaultPostRequestConfig, defaultRequestConfig } from '../../../util';

export class APIClientV2 implements APIClient {
  getEndpoint(): string {
    return 'https://api.example.com/v2/endpoint';
  }

  getHeaders(destination): Record<string, string> {
    return {
      'Content-Type': JSON_MIME_TYPE,
      api_key: destination.Config.apiKey,
    };
  }

  getMessageBody(data: any): any {
    return { ...data, version: 'v2' };
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

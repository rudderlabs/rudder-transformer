import { AxiosResponse } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  ProcessorTransformationRequest,
  ProcessorTransformationResponse,
  RouterTransformationRequest,
  RouterTransformationResponse,
} from '../../src/types';

export interface requestType {
  method: string;
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export interface responseType {
  status: number;
  body?: any;
  headers?: Record<string, string>;
}

export interface inputType {
  request: requestType;
  pathSuffix?: string;
}

export interface outputType {
  response?: responseType;
}

export interface mockType {
  request: requestType;
  response: responseType;
}

export interface TestCaseData {
  name: string;
  description: string;
  scenario?: string;
  successCriteria?: string;
  comment?: string;
  feature: string;
  module: string;
  version?: string;
  input: inputType;
  output: outputType;
  mock?: mockType[];
  mockFns?: (mockAdapter: MockAdapter) => {};
}

export type MockHttpCallsData = {
  httpReq: Record<string, any>;
  httpRes: Partial<AxiosResponse>;
};

export type ProcessorTestData = {
  id: string;
  name: string;
  description: string;
  scenario: string;
  successCriteria: string;
  comment?: string;
  feature: string;
  module: string;
  version: string;
  input: {
    request: {
      body: ProcessorTransformationRequest[];
    };
  };
  output: {
    response: {
      status: number;
      body: ProcessorTransformationResponse[];
    };
  };
};
export type RouterTestData = {
  id: string;
  name: string;
  description: string;
  comment?: string;
  scenario: string;
  successCriteria: string;
  feature: string;
  module: string;
  version: string;
  input: {
    request: {
      body: RouterTransformationRequest;
    };
  };
  output: {
    response: {
      status: number;
      body: {
        output: RouterTransformationResponse[];
      };
    };
  };
};

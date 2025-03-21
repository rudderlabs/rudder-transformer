import { AxiosResponse } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BaseTestCase } from '@rudderstack/integrations-lib';

import {
  DeliveryV1Response,
  Metadata,
  ProcessorTransformationRequest,
  ProcessorTransformationResponse,
  ProxyV1Request,
  RouterTransformationRequest,
  RouterTransformationResponse,
  RudderMessage,
} from '../../src/types';

export interface requestType {
  method: string;
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export interface responseType {
  status: number;
  statusCode?: number;
  error?: any;
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

export interface TestCaseData extends BaseTestCase {
  id?: string;
  name: string;
  description: string;
  skipGo?: string;
  scenario?: string;
  successCriteria?: string;
  tags?: string[];
  comment?: string;
  feature: string;
  module: string;
  version?: string;
  input: inputType;
  output: outputType;
  mock?: mockType[];
  overrideReceivedAt?: string;
  overrideRequestIP?: string;
  mockFns?: (mockAdapter: MockAdapter) => {};
}

export interface ExtendedTestCaseData {
  // use this to add any new properties for dynamic test cases
  // this will keep the base TestCaseData structure generic and intact
  tcData: TestCaseData;
  sourceTransformV2Flag?: boolean;
  descriptionSuffix?: string;
}

export type MockFns = (mockAdapter: MockAdapter) => void;

export interface SrcTestCaseData {
  id?: string;
  name: string;
  description: string;
  scenario?: string;
  successCriteria?: string;
  comment?: string;
  feature?: string;
  module: string;
  version?: string;
  input: inputType;
  output: outputType;
  mock?: mockType[];
  mockFns?: MockFns;
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
      method: string;
      body: ProcessorTransformationRequest<Partial<RudderMessage>, Partial<Metadata>>[];
    };
  };
  output: {
    response: {
      status: number;
      body: ProcessorTransformationResponse[];
    };
  };
  mockFns?: (mockAdapter: MockAdapter) => void;
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
      body: RouterTransformationRequest<Partial<RudderMessage>, Partial<Metadata>>;
      method: string;
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

export type ProxyV1TestData = BaseTestCase & {
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
      body: ProxyV1Request;
      method: string;
    };
  };
  output: {
    response: {
      status: number;
      body: {
        output: DeliveryV1Response;
      };
    };
  };
};

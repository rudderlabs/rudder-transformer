import { AxiosResponse } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BaseTestCase } from '@rudderstack/integrations-lib';
import { EnvOverride } from './envUtils';

import {
  DeliveryV1Response,
  Metadata,
  ProcessorTransformationRequest,
  ProcessorTransformationResponse,
  ProcessorCompactedTransformationRequest,
  ProxyV1Request,
  RouterTransformationRequest,
  RouterTransformationResponse,
  RouterCompactedTransformationRequest,
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
  envOverrides?: EnvOverride;
}

export interface ExtendedTestCaseData {
  // use this to add any new properties for dynamic test cases
  // this will keep the base TestCaseData structure generic and intact
  tcData: TestCaseData;
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
  skip?: boolean;
  input: {
    request: {
      method: string;
      headers?: Record<string, string>;
      body:
        | ProcessorTransformationRequest<Partial<RudderMessage>, Partial<Metadata>>[]
        | ProcessorCompactedTransformationRequest<Partial<RudderMessage>, Partial<Metadata>>;
    };
  };
  output: {
    response: {
      status: number;
      body: ProcessorTransformationResponse[];
    };
  };
  mockFns?: (mockAdapter: MockAdapter) => void;
  envOverrides?: EnvOverride;
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
  skip?: boolean;
  input: {
    request: {
      method: string;
      headers?: Record<string, string>;
      body:
        | RouterTransformationRequest<Partial<RudderMessage>, Partial<Metadata>>
        | RouterCompactedTransformationRequest<Partial<RudderMessage>, Partial<Metadata>>;
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
  mockFns?: (mockAdapter: MockAdapter) => void;
  envOverrides?: EnvOverride;
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

export type ProcessorStreamTestData = Omit<ProcessorTestData, 'output'> & {
  output: {
    response: {
      status: number;
      body: Array<
        Omit<ProcessorTransformationResponse, 'output'> & {
          output?: Record<string, unknown>;
        }
      >;
    };
  };
};

export type RouterStreamTestData = Omit<RouterTestData, 'output'> & {
  output: {
    response: {
      status: number;
      // The union type below allows for two possible response body shapes:
      // 1. An object with an 'output' property containing an array of RouterTransformationResponse objects (with optional 'batchedRequest'),
      //    which is used for standard router transformation responses.
      // 2. An array of generic records, which is required for Kafka stream output tests where the output may not conform to the standard structure.
      body:
        | {
            output?: Array<
              Omit<RouterTransformationResponse, 'batchedRequest'> & {
                batchedRequest?: Record<string, unknown>;
              }
            >;
          }
        | Array<Record<string, unknown>>;
    };
  };
};

import { globSync } from 'glob';
import { join } from 'path';
import { MockHttpCallsData, TestCaseData } from './testTypes';
import MockAdapter from 'axios-mock-adapter';
import isMatch from 'lodash/isMatch';
import { OptionValues } from 'commander';
import { removeUndefinedAndNullValues } from '@rudderstack/integrations-lib';
import tags from '../../src/v0/util/tags';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { Destination, ProxyMetdata, ProxyV0Request, ProxyV1Request } from '../../src/types';
import {
  DeliveryV0ResponseSchema,
  DeliveryV0ResponseSchemaForOauth,
  DeliveryV1ResponseSchema,
  DeliveryV1ResponseSchemaForOauth,
  ProcessorTransformationResponseListSchema,
  ProxyV0RequestSchema,
  ProxyV1RequestSchema,
  RouterTransformationResponseListSchema,
} from '../../src/types/zodTypes';

const generateAlphanumericId = (size = 36) =>
  [...Array(size)].map(() => ((Math.random() * size) | 0).toString(size)).join('');
export const getTestDataFilePaths = (dirPath: string, opts: OptionValues): string[] => {
  const globPattern = join(dirPath, '**', 'data.ts');
  let testFilePaths = globSync(globPattern);
  if (opts.destination) {
    testFilePaths = testFilePaths.filter((testFile) => testFile.includes(opts.destination));
  }
  if (opts.feature) {
    testFilePaths = testFilePaths.filter((testFile) => testFile.includes(opts.feature));
  }
  return testFilePaths;
};

export const getTestData = (filePath): TestCaseData[] => {
  return require(filePath).data as TestCaseData[];
};

export const getMockHttpCallsData = (filePath): MockHttpCallsData[] => {
  return require(filePath).networkCallsData as MockHttpCallsData[];
};

export const getAllTestMockDataFilePaths = (dirPath: string, destination: string): string[] => {
  const globPattern = join(dirPath, '**', 'network.ts');
  let testFilePaths = globSync(globPattern);
  if (destination) {
    const commonTestFilePaths = testFilePaths.filter((testFile) =>
      testFile.includes('test/integrations/common'),
    );
    testFilePaths = testFilePaths.filter((testFile) => testFile.includes(destination));
    testFilePaths = [...commonTestFilePaths, ...testFilePaths];
  }
  return testFilePaths;
};

export const addMock = (mock: MockAdapter, axiosMock: MockHttpCallsData) => {
  const { url, method, data: reqData, params, ...opts } = axiosMock.httpReq;
  const { data, headers, status } = axiosMock.httpRes;

  const headersAsymMatch = {
    asymmetricMatch: function (actual) {
      return isMatch(actual, opts.headers);
    },
  };

  switch (method.toLowerCase()) {
    case 'get':
      // We are accepting parameters exclusively for mocking purposes and do not require a request body,
      // particularly for GET requests where it is typically unnecessary
      // @ts-ignore
      mock.onGet(url, { params }, headersAsymMatch).reply(status, data, headers);
      break;
    case 'delete':
      // @ts-ignore
      mock.onDelete(url, reqData, headersAsymMatch).reply(status, data, headers);
      break;
    case 'post':
      // @ts-ignore
      mock.onPost(url, reqData, headersAsymMatch).reply(status, data, headers);
      break;
    case 'patch':
      // @ts-ignore
      mock.onPatch(url, reqData, headersAsymMatch).reply(status, data, headers);
      break;
    case 'put':
      // @ts-ignore
      mock.onPut(url, reqData, headersAsymMatch).reply(status, data, headers);
      break;
    default:
      break;
  }
};
export const overrideDestination = (destination: Destination, overrideConfigValues) => {
  return Object.assign({}, destination, {
    Config: { ...destination.Config, ...overrideConfigValues },
  });
};

export const produceTestData = (testData: TestCaseData[], filterKeys = []) => {
  const result: any = [];
  testData.forEach((tcData) => {
    let events;
    try {
      switch (tcData.feature) {
        case tags.FEATURES.PROCESSOR:
          events = tcData.input.request.body;
          break;
        case tags.FEATURES.BATCH:
          events = tcData.input.request.body.input;
          break;
        case tags.FEATURES.ROUTER:
          events = tcData.input.request.body.input;
          break;
      }
    } catch (e) {
      throw new Error(
        `Error in producing test data for destination:${tcData.name}, id:${tcData.id}: ${e}`,
      );
    }

    events.forEach((event) => {
      const { message } = event;
      // remove unwanted keys
      filterKeys.forEach((key) => {
        delete message[key];
      });
      result.push(message);
    });
  });

  // write the data to a file

  // create directory if not exists
  const dir = join(__dirname, '../../temp');
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
  writeFileSync(join(__dirname, '../../temp/test_data.json'), JSON.stringify(result, null, 2));
  console.log('Data generated successfully at temp/test_data.json');
};

export const generateIndentifyPayload: any = (parametersOverride: any) => {
  const payload = {
    type: 'identify',
    sentAt: parametersOverride.sentAt || '2021-01-03T17:02:53.195Z',
    userId: parametersOverride.userId || 'default-userId',
    channel: 'web',
    context: removeUndefinedAndNullValues({
      externalId: parametersOverride.externalId,
      os: { name: '', version: '1.12.3' },
      app: {
        name: 'RudderLabs JavaScript SDK',
        build: '1.0.0',
        version: '1.1.11',
        namespace: 'com.rudderlabs.javascript',
      },
      traits: parametersOverride.context.traits,
      locale: 'en-US',
      device: { token: 'token', id: 'id', type: 'ios' },
      screen: { density: 2 },
      library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
      campaign: {},
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
    }),
    traits: parametersOverride.traits,
    integrations: parametersOverride.integrations,
    rudderId: parametersOverride.rudderId || generateAlphanumericId(36),
    messageId: parametersOverride.messageId || generateAlphanumericId(36),
    anonymousId: parametersOverride.anonymousId || 'default-anonymousId',
    originalTimestamp: parametersOverride.originalTimestamp || '2021-01-03T17:02:53.193Z',
  };

  return removeUndefinedAndNullValues(payload);
};

export const generateSimplifiedIdentifyPayload: any = (parametersOverride: any) => {
  return removeUndefinedAndNullValues({
    type: 'identify',
    sentAt: parametersOverride.sentAt || '2021-01-03T17:02:53.195Z',
    userId: parametersOverride.userId || 'default-userId',
    traits: parametersOverride.traits,
    integrations: parametersOverride.integrations,
    rudderId: parametersOverride.rudderId || generateAlphanumericId(36),
    messageId: parametersOverride.messageId || generateAlphanumericId(36),
    context: {
      externalId: parametersOverride.context.externalId,
      traits: parametersOverride.context.traits,
    },
    anonymousId: parametersOverride.anonymousId || 'default-anonymousId',
    originalTimestamp: parametersOverride.originalTimestamp || '2021-01-03T17:02:53.193Z',
  });
};

export const generateTrackPayload: any = (parametersOverride: any) => {
  const payload = {
    type: 'track',
    sentAt: parametersOverride.sentAt || '2021-01-03T17:02:53.195Z',
    userId: parametersOverride.userId || 'default-user-id',
    channel: 'web',
    context: removeUndefinedAndNullValues({
      externalId: parametersOverride.externalId,
      os: { name: '', version: '1.12.3' },
      app: {
        name: 'RudderLabs JavaScript SDK',
        build: '1.0.0',
        version: '1.1.11',
        namespace: 'com.rudderlabs.javascript',
      },
      traits: parametersOverride.context.traits,
      locale: 'en-US',
      device: { token: 'token', id: 'id', type: 'ios' },
      screen: { density: 2 },
      library: { name: 'RudderLabs JavaScript SDK', version: '1.1.11' },
      campaign: {},
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
      dataProcessingOptions: parametersOverride.context.dataProcessingOptions,
    }),
    rudderId: parametersOverride.rudderId || generateAlphanumericId(36),
    messageId: parametersOverride.messageId || generateAlphanumericId(36),
    anonymousId: parametersOverride.anonymousId || 'default-anonymousId',
    originalTimestamp: parametersOverride.originalTimestamp || '2021-01-03T17:02:53.193Z',
    timestamp: parametersOverride.timestamp,
    event: parametersOverride.event || 'test-event',
    integrations: parametersOverride.integrations,
    properties: parametersOverride.properties,
  };
  return removeUndefinedAndNullValues(payload);
};

export const generateSimplifiedTrackPayload: any = (parametersOverride: any) => {
  return removeUndefinedAndNullValues({
    type: 'track',
    sentAt: parametersOverride.sentAt || '2021-01-03T17:02:53.195Z',
    userId: parametersOverride.userId || 'default-user-id',
    event: parametersOverride.event || 'test-event',
    properties: parametersOverride.properties,
    integrations: parametersOverride.integrations,
    rudderId: parametersOverride.rudderId || generateAlphanumericId(36),
    messageId: parametersOverride.messageId || generateAlphanumericId(36),
    context: removeUndefinedAndNullValues({
      externalId: parametersOverride.context.externalId,
      traits: parametersOverride.context.traits,
      device: parametersOverride.context.device,
      os: parametersOverride.context.os,
      app: parametersOverride.context.app,
    }),
    anonymousId: parametersOverride.anonymousId || 'default-anonymousId',
    originalTimestamp: parametersOverride.originalTimestamp || '2021-01-03T17:02:53.193Z',
  });
};

export const generatePageOrScreenPayload: any = (parametersOverride: any, eventType: string) => {
  const payload = {
    channel: 'web',
    userId: parametersOverride.userId || 'default-userId',
    rudderId: parametersOverride.rudderId || generateAlphanumericId(36),
    originalTimestamp: parametersOverride.originalTimestamp || '2022-04-26T05:17:09Z',
    timestamp: parametersOverride.timestamp,
    context: removeUndefinedAndNullValues({
      app: {
        build: '1.0.0',
        name: 'RudderLabs JavaScript SDK',
        namespace: 'com.rudderlabs.javascript',
        version: '1.0.0',
      },
      device: {
        adTrackingEnabled: 'false',
        advertisingId: 'T0T0T072-5e28-45a1-9eda-ce22a3e36d1a',
        id: '3f034872-5e28-45a1-9eda-ce22a3e36d1a',
        manufacturer: 'Google',
        model: 'AOSP on IA Emulator',
        name: 'generic_x86_arm',
        type: 'ios',
        attTrackingStatus: 3,
      },
      ip: '0.0.0.0',
      library: {
        name: 'RudderLabs JavaScript SDK',
        version: '1.0.0',
      },
      locale: 'en-US',
      os: {
        name: 'iOS',
        version: '14.4.1',
      },
      screen: {
        density: 2,
      },
      page: parametersOverride.context.page,
      traits: parametersOverride.context.traits,
      externalId: parametersOverride.externalId,
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
    }),
    event: parametersOverride.event,
    name: parametersOverride.name,
    anonymousId: parametersOverride.anonymousId || 'default-anonymousId',
    properties: parametersOverride.properties,
    type: eventType || 'page',
    integrations: parametersOverride.integrations,
    sentAt: '2022-04-20T15:20:57Z',
  };

  return removeUndefinedAndNullValues(payload);
};

export const generateSimplifiedPageOrScreenPayload: any = (
  parametersOverride: any,
  eventType: string,
) => {
  return removeUndefinedAndNullValues({
    channel: 'web',
    userId: parametersOverride.userId || 'default-userId',
    type: eventType || 'page',
    event: parametersOverride.event,
    name: parametersOverride.name,
    properties: parametersOverride.properties,
    integrations: parametersOverride.integrations,
    rudderId: parametersOverride.rudderId || generateAlphanumericId(36),
    context: removeUndefinedAndNullValues({
      externalId: parametersOverride.externalId,
      traits: parametersOverride.context.traits,
    }),
    timestamp: parametersOverride.timestamp,
    anonymousId: parametersOverride.anonymousId || 'default-anonymousId',
    originalTimestamp: parametersOverride.originalTimestamp || '2022-04-26T05:17:09Z',
  });
};

export const generateGroupPayload: any = (parametersOverride: any) => {
  const payload = {
    channel: 'web',
    context: removeUndefinedAndNullValues({
      app: {
        build: '1.0.0',
        name: 'RudderLabs JavaScript SDK',
        namespace: 'com.rudderlabs.javascript',
        version: '1.0.0',
      },
      library: {
        name: 'RudderLabs JavaScript SDK',
        version: '1.0.0',
      },
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
      locale: 'en-US',
      ip: '0.0.0.0',
      os: {
        name: '',
        version: '',
      },
      screen: {
        density: 2,
      },
      device: parametersOverride.context.device,
      traits: parametersOverride.context.traits,
      externalId: parametersOverride.context.externalId,
    }),
    messageId: parametersOverride.messageId || generateAlphanumericId(36),
    session_id: parametersOverride.session_id || generateAlphanumericId(36),
    originalTimestamp: parametersOverride.originalTimestamp || '2019-10-14T09:03:17.562Z',
    timestamp: parametersOverride.timestamp,
    anonymousId: parametersOverride.anonymousId || generateAlphanumericId(36),
    userId: parametersOverride.userId || 'default-user-id',
    type: 'group',
    groupId: parametersOverride.groupId,
    traits: parametersOverride.traits,
    integrations: parametersOverride.integrations,
    sentAt: parametersOverride.sentAt || '2019-10-14T09:03:22.563Z',
  };
  return removeUndefinedAndNullValues(payload);
};

export const generateSimplifiedGroupPayload: any = (parametersOverride: any) => {
  return removeUndefinedAndNullValues({
    channel: 'web',
    userId: parametersOverride.userId || 'default-userId',
    type: 'group',
    groupId: parametersOverride.groupId,
    traits: parametersOverride.traits,
    integrations: parametersOverride.integrations,
    context: removeUndefinedAndNullValues({
      externalId: parametersOverride.externalId,
      traits: parametersOverride.context.traits,
    }),
    timestamp: parametersOverride.timestamp,
    anonymousId: parametersOverride.anonymousId || generateAlphanumericId(36),
    originalTimestamp: parametersOverride.originalTimestamp || '2019-10-14T09:03:17.562Z',
  });
};

export const transformResultBuilder: any = (matchData) => {
  return removeUndefinedAndNullValues({
    version: '1',
    type: 'REST',
    userId: matchData.userId,
    method: matchData.method || 'POST',
    endpoint: matchData.endpoint || '',
    headers: matchData.headers || {},
    params: matchData.params || {},
    body: {
      JSON: matchData.JSON || {},
      JSON_ARRAY: matchData.JSON_ARRAY || {},
      XML: matchData.XML || {},
      FORM: matchData.FORM || {},
    },
    files: matchData.files || {},
  });
};

export const compareObjects = (obj1, obj2, logPrefix = '', differences: string[] = []) => {
  for (const key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      const fullKey = logPrefix ? `${logPrefix}.${key}` : key;

      if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
        compareObjects(obj1[key], obj2[key], fullKey, differences);
      } else if (obj1[key] !== obj2[key]) {
        differences.push(fullKey);
      }
    }
  }

  // Check for keys in obj2 that are not present in obj1
  for (const key in obj2) {
    if (obj2.hasOwnProperty(key) && !obj1.hasOwnProperty(key)) {
      const fullKey = logPrefix ? `${logPrefix}.${key}` : key;
      differences.push(fullKey);
    }
  }

  return differences;
};

export const generateProxyV0Payload = (
  payloadParameters: any,
  metadataInput?: ProxyMetdata,
  destinationConfig?: any,
): ProxyV0Request => {
  let metadata: ProxyMetdata = {
    jobId: 1,
    attemptNum: 1,
    userId: 'default-userId',
    destinationId: 'default-destinationId',
    workspaceId: 'default-workspaceId',
    sourceId: 'default-sourceId',
    secret: {
      accessToken: 'default-accessToken',
    },
    dontBatch: false,
  };
  if (metadataInput) {
    metadata = metadataInput;
  }
  const payload = {
    version: 'v0',
    type: 'REST',
    userId: payloadParameters.userId || 'default-userId',
    method: payloadParameters.method || 'POST',
    endpoint: payloadParameters.endpoint || '',
    headers: payloadParameters.headers || {},
    params: payloadParameters.params || {},
    body: {
      JSON: payloadParameters.JSON || {},
      JSON_ARRAY: payloadParameters.JSON_ARRAY || {},
      XML: payloadParameters.XML || {},
      FORM: payloadParameters.FORM || {},
    },
    files: payloadParameters.files || {},
    metadata,
    destinationConfig: destinationConfig || {},
  };
  return removeUndefinedAndNullValues(payload) as ProxyV0Request;
};

export const generateProxyV1Payload = (
  payloadParameters: any,
  metadataInput?: ProxyMetdata[],
  destinationConfig?: any,
): ProxyV1Request => {
  let metadata: ProxyMetdata[] = [
    {
      jobId: 1,
      attemptNum: 1,
      userId: 'default-userId',
      destinationId: 'default-destinationId',
      workspaceId: 'default-workspaceId',
      sourceId: 'default-sourceId',
      secret: {
        accessToken: payloadParameters.accessToken || 'default-accessToken',
      },
      dontBatch: false,
    },
  ];
  if (metadataInput) {
    metadata = metadataInput;
  }
  const payload = {
    version: 'v1',
    type: 'REST',
    userId: payloadParameters.userId || 'default-userId',
    method: payloadParameters.method || 'POST',
    endpoint: payloadParameters.endpoint || '',
    headers: payloadParameters.headers || {},
    params: payloadParameters.params || {},
    body: {
      JSON: payloadParameters.JSON || {},
      JSON_ARRAY: payloadParameters.JSON_ARRAY || {},
      XML: payloadParameters.XML || {},
      FORM: payloadParameters.FORM || {},
    },
    files: payloadParameters.files || {},
    metadata,
    destinationConfig: destinationConfig || {},
  };
  return removeUndefinedAndNullValues(payload) as ProxyV1Request;
};

// -----------------------------
// Zod validations

export const validateTestWithZOD = (testPayload: TestCaseData, response: any) => {
  // Validate the resquest payload
  switch (testPayload.feature) {
    case 'router':
      RouterTransformationResponseListSchema.parse(response.body.output);
      break;
    case 'batch':
      RouterTransformationResponseListSchema.parse(response.body);
      break;
    // case 'user_deletion':
    //   DeletionSchema.parse(responseBody);
    //   break;
    case 'processor':
      ProcessorTransformationResponseListSchema.parse(response.body);
      break;
    case 'dataDelivery':
      if (testPayload.version === 'v0') {
        ProxyV0RequestSchema.parse(testPayload.input.request.body);
        if (testPayload.scenario === 'Oauth') {
          DeliveryV0ResponseSchemaForOauth.parse(response.body.output);
        } else {
          DeliveryV0ResponseSchema.parse(response.body.output);
        }
      } else if (testPayload.version === 'v1') {
        ProxyV1RequestSchema.parse(testPayload.input.request.body);
        if (testPayload.scenario === 'Oauth') {
          DeliveryV1ResponseSchemaForOauth.parse(response.body.output);
        } else {
          DeliveryV1ResponseSchema.parse(response.body.output);
        }
      }
      break;
    default:
      break;
  }
  return true;
};

// -----------------------------
// Helper functions

export const generateMetadata = (jobId: number): any => {
  return {
    jobId,
    attemptNum: 1,
    userId: 'default-userId',
    sourceId: 'default-sourceId',
    destinationId: 'default-destinationId',
    workspaceId: 'default-workspaceId',
    secret: {
      accessToken: 'default-accessToken',
    },
    dontBatch: false,
  };
};

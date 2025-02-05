import { Command, OptionValues } from 'commander';
import path from 'path';
import fs from 'fs';
import get from 'get-value';
import { getTestData, getTestDataFilePaths, produceTestData } from '../integrations/testUtils';
import { head, isNumber } from 'lodash';
import { responseType } from '../integrations/testTypes';
import { isDefinedAndNotNull } from '@rudderstack/integrations-lib';

interface TestCaseData {
  name: string;
  description: string;
  skip?: string;
  input: Input;
  output: Output;
}

interface Input {
  request: {
    query: string;
    body: any;
    headers?: Record<string, string>;
    method?: string;
  };
}

interface Output {
  response: {
    status: number;
    body: any;
  };
  queue: any[];
  errQueue: any[];
}

const jsonGenerator = new Command();
jsonGenerator
  .name('json-generator')
  .description('CLI to some JavaScript string utilities')
  .version('0.8.0');

jsonGenerator
  .command('sources')
  .description('generator JSON test cases for source')
  .argument('<string>', 'output path')
  .option('-s, --source <char>', 'source', '')
  .action(generateSources);

jsonGenerator.parse();

function getStatusCode(outputResponse?: responseType): number {
  const statusCodeKeys = ['body.0.statusCode', 'statusCode', 'status'];
  const stCode = statusCodeKeys
    .map((statusKey) => get(outputResponse, statusKey))
    .find((stCode) => isNumber(stCode));
  return stCode || 200;
}

function getErrorResponse(outputResponse?: responseType) {
  const bodyKeys = ['body.0.error', 'error'];
  const errorResponse = bodyKeys
    .map((statusKey) => get(outputResponse, statusKey))
    .find(isDefinedAndNotNull);
  if (errorResponse) {
    return errorResponse + '\n';
  }
  return errorResponse;
}

function getSourceRequestBody(
  testCase: any,
  version?: string,
  deleteQueryParameters: boolean = true,
) {
  function removeQueryParameters(element: any) {
    if (Array.isArray(element)) {
      return element;
    }
    if (deleteQueryParameters && element?.query_parameters) {
      delete element.query_parameters;
    }
    return { ...element };
  }

  const { body } = testCase.input.request;
  const bodyElement = body.length === 1 ? body[0] : body;

  if (!version) {
    throw new Error(`Unknown version: ${version}`);
  }

  switch (version) {
    case 'v0':
      return removeQueryParameters(bodyElement);
    case 'v1':
      return removeQueryParameters(bodyElement.event);
    case 'v2':
      return { ...bodyElement.request.body };
    default:
      throw new Error(`Unknown version: ${version}`);
  }
}

function getSourceRequestParams(testCase: any, version?: string) {
  function getQueryParameters(element: any, rawParams: any) {
    if (Array.isArray(element)) {
      return rawParams;
    }
    if (element?.query_parameters) {
      return { ...rawParams, ...element.query_parameters };
    }
    return { ...rawParams };
  }

  const rawParams = testCase.input.request?.params || {};

  const { body } = testCase.input.request;
  const bodyElement = body.length === 1 ? body[0] : body;

  const queryParams = (function () {
    switch (version) {
      case 'v0':
        return getQueryParameters(bodyElement, rawParams);
      case 'v1':
        return getQueryParameters(bodyElement.event, rawParams);
      case 'v2':
        const { query_parameters } = bodyElement.request;
        return { ...rawParams, ...(query_parameters || {}) };
      default:
        throw new Error(`Unknown version: ${version}`);
    }
  })();

  return JSON.stringify(queryParams);
}

function generateSources(outputFolder: string, options: OptionValues) {
  const rootDir = __dirname;
  const resolvedpath = path.resolve(rootDir, '../integrations/sources');

  const files = getTestDataFilePaths(resolvedpath, options);

  files.forEach((testDataPath) => {
    const testData = getTestData(testDataPath);
    testData.forEach(({ version, ...testCase }) => {
      let statusCode: number = getStatusCode(testCase.output.response);

      let responseBody: any = 'OK';
      if (statusCode == 200) {
        if (testCase.output.response?.body[0]?.outputToSource?.body) {
          let rawBody = Buffer.from(
            testCase.output.response?.body[0]?.outputToSource?.body,
            'base64',
          ).toString();
          if (
            testCase.output.response?.body[0]?.outputToSource?.contentType === 'application/json'
          ) {
            responseBody = JSON.parse(rawBody);
          } else {
            responseBody = rawBody;
          }
        }
      } else {
        responseBody = getErrorResponse(testCase.output.response);
      }

      testCase.input.request.body.forEach((body) => {
        delete body['receivedAt'];
        delete body['request_ip'];
      });

      let errorQueue: any[] = [];
      if (statusCode !== 200) {
        const body = getSourceRequestBody(testCase, version, false);
        errorQueue = Array.isArray(body) ? body : [body];
      }

      let goTest: TestCaseData = {
        name: testCase.name,
        description: testCase.description,
        input: {
          request: {
            query: getSourceRequestParams(testCase, version),
            body: getSourceRequestBody(testCase, version),
            headers: testCase.input.request.headers || {
              'Content-Type': 'application/json',
            },
          },
        },
        output: {
          response: {
            status: statusCode,
            body: responseBody,
          },
          // TODO flatten nested array
          queue:
            statusCode == 200
              ? testCase.output.response?.body
                  .filter((i) => i.output)
                  .map((i) => i.output.batch)
                  .flat()
              : [],
          errQueue: errorQueue,
        },
      };
      if (testCase.input.request.method && testCase.input.request.method.toLowerCase() !== 'post') {
        goTest.input.request.method = testCase.input.request.method;
      }
      const dirPath = path.join(outputFolder, goTest.name);
      const safeName = toSnakeCase(goTest.description)
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase();
      const filePath = path.join(dirPath, `${safeName}.json`);

      if (testCase.skipGo) {
        goTest.skip = testCase.skipGo;
      }

      goTest.output.queue.forEach((queueItem, i) => {
        queueItem['receivedAt'] =
          testCase?.overrideReceivedAt &&
          testCase.output.response?.body?.[0]?.output?.batch?.[i]?.receivedAt
            ? testCase.output.response?.body?.[0]?.output?.batch?.[i]?.receivedAt
            : '2024-03-03T04:48:29.000Z';
        queueItem['request_ip'] =
          testCase?.overrideRequestIP &&
          testCase.output.response?.body?.[0]?.output?.batch?.[i]?.request_ip
            ? testCase.output.response?.body?.[0]?.output?.batch?.[i]?.request_ip
            : '192.0.2.30';
        if (!queueItem['messageId']) {
          queueItem['messageId'] = '00000000-0000-0000-0000-000000000000';
        }
      });

      fs.mkdirSync(dirPath, { recursive: true });

      fs.writeFileSync(filePath, JSON.stringify(goTest, null, 2));
    });
  });
}

function toSnakeCase(str: string): string {
  return (
    str
      // Replace spaces with underscores
      .replace(/\s+/g, '_')
      // Insert underscores before uppercase letters, handle acronyms correctly
      .replace(/\.?([A-Z]+)/g, (x, y) => '_' + y.toLowerCase())
      // Remove leading underscores and handle consecutive underscores
      .replace(/^_+/, '')
      .replace(/_{2,}/g, '_')
  );
}

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
  source?: {
    config: string;
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
  // .command('sources')
  .description('generator JSON test cases for source')
  .option('-s, --source <char>', 'source name', '')
  .option('-l, --location <path>', 'output path', `${new Date().getTime()}`)
  .action((options) => generateSources(options.location, options));

jsonGenerator.parse();

function getStatusCode(outputResponse?: responseType, index?: number): number {
  const statusCodeKeys = [`body.${index || 0}.statusCode`, 'statusCode', 'status'];
  const stCode = statusCodeKeys
    .map((statusKey) => get(outputResponse, statusKey))
    .find((stCode) => isNumber(stCode));
  return stCode || 200;
}

function getErrorResponse(outputResponse?: responseType, index?: number) {
  const bodyKeys = [`body.${index || 0}.error`, 'error'];
  const errorResponse = bodyKeys
    .map((statusKey) => get(outputResponse, statusKey))
    .find(isDefinedAndNotNull);
  if (errorResponse) {
    return errorResponse + '\n';
  }
  return errorResponse;
}

function generateSources(outputFolder: string, options: OptionValues) {
  const rootDir = __dirname;
  const resolvedpath = path.resolve(rootDir, '../integrations/sources');

  const files = getTestDataFilePaths(resolvedpath, options);

  files.forEach((testDataPath) => {
    console.log(testDataPath);
    const testData = getTestData(testDataPath);
    testData.forEach(({ version, input, output, ...testCase }) => {
      if (version !== 'v2') {
        return;
      }

      const numberOfPayloads = input.request.body?.length || 0;

      for (let i = 0; i < numberOfPayloads; i++) {
        let statusCode: number = getStatusCode(output.response, i);
        let responseBody: any = 'OK';
        let errQueue: any = [];
        let queue: any[] = [];

        if (statusCode !== 200) {
          responseBody = getErrorResponse(output.response, i);
          try {
            errQueue = [JSON.parse(input.request.body[i]?.request?.body)];
          } catch (e) {
            errQueue = [input.request.body[i]?.request?.body];
          }
        } else {
          queue = output.response?.body[i]?.output?.batch || [];
        }

        const outputToSource = output.response?.body[i]?.outputToSource;
        if (outputToSource?.body) {
          let rawBody = Buffer.from(outputToSource.body, 'base64').toString();
          if (outputToSource.contentType === 'application/json') {
            responseBody = JSON.parse(rawBody);
          } else {
            responseBody = rawBody;
          }
        }

        if (queue?.length > 0) {
          queue.forEach((queueItem, batchIndex) => {
            queueItem['receivedAt'] =
              testCase?.overrideReceivedAt &&
              testCase.output?.response?.body?.[i]?.output?.batch?.[batchIndex]?.receivedAt
                ? testCase.output?.response?.body?.[i]?.output?.batch?.[batchIndex]?.receivedAt
                : '2024-03-03T04:48:29.000Z';
            queueItem['request_ip'] =
              testCase?.overrideRequestIP &&
              testCase.output?.response?.body?.[i]?.output?.batch?.[batchIndex]?.request_ip
                ? testCase.output?.response?.body?.[i]?.output?.batch?.[batchIndex]?.request_ip
                : '192.0.2.30';
            if (!queueItem['messageId']) {
              queueItem['messageId'] = '00000000-0000-0000-0000-000000000000';
            }
          });
        }

        let headers = input.request.body[i]?.request?.headers ||
          input.request?.headers || {
            'Content-Type': 'application/json',
          };
        // Flatten any array header values into comma-separated strings
        for (const [key, value] of Object.entries(headers)) {
          if (Array.isArray(value)) {
            headers[key] = value.join(',');
          }
        }

        let goTest: TestCaseData = {
          name: testCase.name,
          description: testCase.description,
          input: {
            request: {
              query:
                input.request.body[i]?.request?.query_parameters || input.request?.params || {},
              body: input.request.body[i]?.request?.body || {},
              headers,
              method: input.request.body[i]?.request?.method || input.request?.method || 'POST',
            },
            source: {
              config: JSON.stringify(input.request.body[i]?.source?.Config || {}),
            },
          },
          output: {
            response: {
              status: statusCode,
              body: responseBody,
            },
            queue,
            errQueue,
          },
        };

        const dirPath = path.join(`./go/webhook/testcases/testdata/${outputFolder}`, goTest.name);
        const safeName =
          toSnakeCase(goTest.description)
            .replace(/[^a-z0-9]/gi, '_')
            .toLowerCase() + `_${i}`;
        const filePath = path.join(dirPath, `${safeName}.json`);

        if (testCase.skipGo) {
          goTest.skip = testCase.skipGo;
        }

        fs.mkdirSync(dirPath, { recursive: true });
        fs.writeFileSync(filePath, JSON.stringify(goTest, null, 2));
      }
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

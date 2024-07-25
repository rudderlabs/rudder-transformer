import { Command, OptionValues } from 'commander';
import path from 'path';
import fs from 'fs';
import { getTestData, getTestDataFilePaths, produceTestData } from '../integrations/testUtils';
import { head } from 'lodash';

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
  .option('-s, --source <char>', 'source', ',')
  .action(generateSources);

jsonGenerator.parse();

function generateSources(outputFolder: string, options: OptionValues) {
  const rootDir = __dirname;
  const resolvedpath = path.resolve(rootDir, '../integrations/sources');

  const files = getTestDataFilePaths(resolvedpath, options);

  files.forEach((testDataPath) => {
    let testData = getTestData(testDataPath);
    testData.forEach((testCase) => {
      let statusCode: number =
        testCase.output.response?.statusCode || testCase.output.response?.status || 200;

      let responseBody: any = 'OK';
      if (statusCode == 200) {
        if (testCase.output.response?.body[0]?.outputToSource?.body) {
          responseBody = JSON.parse(
            Buffer.from(testCase.output.response?.body[0]?.outputToSource?.body, 'base64').toString(
              'utf-8',
            ),
          );
        }
      } else {
        responseBody = testCase.output.response?.error;
      }

      testCase.input.request.body.forEach((body) => {
        delete body['receivedAt'];
        delete body['request_ip'];
      });

      let goTest: TestCaseData = {
        name: testCase.name,
        description: testCase.description,
        input: {
          request: {
            query: JSON.stringify(testCase.input.request.params),
            body:
              testCase.input.request.body.length === 1
                ? testCase.input.request.body[0]
                : testCase.input.request.body,
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
          errQueue: statusCode != 200 ? [testCase.output.response?.body] : [],
        },
      };
      const dirPath = path.join(outputFolder, goTest.name);
      const filePath = path.join(dirPath, `${toSnakeCase(goTest.description)}.json`);

      if (testCase.skipGo) {
        goTest.skip = testCase.skipGo;
      }

      goTest.output.queue.forEach((queueItem) => {
        queueItem['receivedAt'] = '2024-03-03T04:48:29.000Z';
        queueItem['request_ip'] = '192.0.2.30';
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

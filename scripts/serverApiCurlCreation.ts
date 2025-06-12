/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
import get from 'get-value';
import {
  parseArgs,
  extractField,
  resolveDataFile,
  importDataModule,
  copyToClipboard,
  buildCurl,
} from './common';

// Build URL for the request
// eslint-disable-next-line consistent-return
function buildURL(messageType: string): string {
  const baseEndPoint = 'http://localhost:8080/v1/';
  const serverUrlMap = {
    identify: 'identify',
    track: 'track',
    page: 'page',
    screen: 'screen',
    group: 'group',
    alias: 'alias',
  };
  if (!serverUrlMap[messageType]) {
    console.error(`Message type: '${messageType}' is not supported.`);
    process.exit(1);
  }
  const url = `${baseEndPoint}${serverUrlMap[messageType]}`;
  return url;
}

async function main() {
  const { filePath, dataString } = parseArgs();

  const description = extractField(dataString, 'description') || '';
  const feature = extractField(dataString, 'feature') || '';
  if (feature !== 'processor') {
    console.error('This script is only for processor feature requests.');
    process.exit(1);
  }

  const dataFile = await resolveDataFile(filePath);
  console.log(`Using data file: ${dataFile}`);
  const data = await importDataModule(dataFile);

  const testCase = data.find((tc) => tc.description === description && tc.feature === feature);
  if (!testCase?.input?.request) {
    console.error('Matching test case not found or invalid structure.');
    process.exit(1);
  }

  const { body, headers = {} } = testCase.input.request;
  if (!body || !Array.isArray(body) || body.length === 0) {
    console.error('Request body is empty or not an array.');
    process.exit(1);
  }

  const messageType = get(body[0], 'message.type', null);
  if (!messageType) {
    console.error('Message type not found in the request body.');
    process.exit(1);
  }

  const url = buildURL(messageType);
  const curlCmd = buildCurl(url, headers, body[0].message);
  console.log('\n--- Generated curl command ---\n');
  console.log(curlCmd);
  console.log();

  copyToClipboard(curlCmd);
}

main();

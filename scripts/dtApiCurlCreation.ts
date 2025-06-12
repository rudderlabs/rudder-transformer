/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
import {
  parseArgs,
  extractField,
  getDestination,
  resolveDataFile,
  importDataModule,
  runTestCommand,
  copyToClipboard,
  buildCurl,
} from './common';

type SupportedFeature = 'processor' | 'router' | 'dataDelivery' | 'userDeletion';

// Build URL for the request
// eslint-disable-next-line consistent-return
function buildURL(feature: string, destination: string, version): string {
  const urls: Record<SupportedFeature, string> = {
    processor: `http://localhost:9090/${version}/destinations/${destination}`,
    router: 'http://localhost:9090/routerTransform',
    dataDelivery: `http://localhost:9090/${version}/destinations/${destination}/proxy`,
    userDeletion: `http://localhost:9090/deleteUsers`,
  };
  if (urls[feature]) {
    return urls[feature];
  }
  console.error(`Feature '${feature}' is not supported.`);
  process.exit(1);
}

async function main() {
  const { filePath, dataString } = parseArgs();

  const description = extractField(dataString, 'description') || '';
  const feature = extractField(dataString, 'feature') || '';
  const version = extractField(dataString, 'version') || 'v1';
  const destination = getDestination(filePath);
  const url = buildURL(feature, destination, version);

  const dataFile = await resolveDataFile(filePath);
  console.log(`Using data file: ${dataFile}`);
  const data = await importDataModule(dataFile);

  const testCase = data.find((tc) => tc.description === description && tc.feature === feature);

  if (!testCase?.input?.request) {
    console.error('Matching test case not found or invalid structure.');
    process.exit(1);
  }

  const { body, headers = {} } = testCase.input.request;
  const curlCmd = buildCurl(url, headers, body);

  console.log('\n--- Generated curl command ---\n');
  console.log(curlCmd);
  console.log();

  copyToClipboard(curlCmd);
  runTestCommand(curlCmd);
}

main();

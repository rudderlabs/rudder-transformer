import { exec } from 'child_process';
import {
  parseArgs,
  extractField,
  getDestination,
  resolveDataFile,
  importDataModule,
  runTestCommand,
} from './common';

// Build URL for the request
function buildURL(feature: string, destination: string): string {
  const urls = {
    processor: `http://localhost:9090/v0/destinations/${destination}`,
    router: 'http://localhost:9090/routerTransform',
    dataDelivery: `http://localhost:9090/v1/destinations/${destination}/proxy`,
  };
  if (urls[feature]) {
    return urls[feature];
  }
  console.error(`Feature '${feature}' is not supported.`);
  process.exit(1);
}

// Build curl command
function buildCurl(url: string, headers: Record<string, string>, body: unknown): string {
  const curl = [`curl -X POST "${url}"`, `-H "Content-Type: application/json"`];
  for (const [k, v] of Object.entries(headers || {})) {
    curl.push(`-H "${k}: ${v}"`);
  }
  if (body) {
    curl.push(`--data '${JSON.stringify(body)}'`);
  }
  return curl.join(' \\\n  ');
}

// Copy string to clipboard using pbcopy
function copyToClipboard(text: string) {
  const child = exec('pbcopy');
  if (child.stdin) {
    child.stdin.write(text);
    child.stdin.end();
  } else {
    console.error('pbcopy: stdin is null');
  }

  child.on('error', (err) => {
    console.error('pbcopy error:', err);
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Copied curl command to clipboard.');
    } else {
      console.error(`pbcopy exited with code ${code}`);
    }
  });
}

async function main() {
  const { filePath, dataString } = parseArgs();

  const description = extractField(dataString, 'description')!;
  const feature = extractField(dataString, 'feature')!;
  const destination = getDestination(filePath);
  const url = buildURL(feature, destination);

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
  console.log();

  copyToClipboard(curlCmd);
  runTestCommand(curlCmd);
}

main();

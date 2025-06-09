import path from 'path';
import { exec } from 'child_process';
import fs from 'fs/promises';

// Extract CLI arguments
function parseArgs() {
  const [filePath, dataString] = process.argv.slice(2);
  if (!filePath || !dataString) {
    console.error('Usage: node createCurlRequest.ts <path-to-data-file> <data-string>');
    process.exit(1);
  }
  return { filePath, dataString };
}

// Extract field using regex
function extractField(data: string, key: string, required = true): string | undefined {
  const match = data.match(new RegExp(`${key}:\\s*'([^']*)'`));
  if (match) return match[1];
  if (required) {
    console.error(`Field '${key}' not found in the input.`);
    process.exit(1);
  }
  return undefined;
}

// Get destination name from path
function getDestination(filePath: string): string {
  const match = filePath.match(/destinations\/([^/]+)/);
  if (match) return match[1];
  console.error('Destination not found in the file path.');
  process.exit(1);
}

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

// Replace filename with 'data.ts' or 'data.js'
async function resolveDataFile(basePath: string): Promise<string> {
  const dir = path.dirname(basePath);
  const candidates = ['data.ts', 'data.js'];
  for (const file of candidates) {
    const fullPath = path.join(dir, file);
    try {
      await fs.access(fullPath);
      return fullPath;
    } catch {}
  }
  console.error(`Neither data.ts nor data.js found in: ${dir}`);
  process.exit(1);
}

// Import the data module
async function importDataModule(filePath: string): Promise<any[]> {
  try {
    const mod = await import(filePath);
    if (!mod.data || !Array.isArray(mod.data)) {
      throw new Error(`Module does not export a valid 'data' array.`);
    }
    return mod.data;
  } catch (err: any) {
    console.error(`Failed to import test data module:`, err.message);
    process.exit(1);
  }
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

  const dataFile = await resolveDataFile(path.resolve(process.cwd(), filePath));
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
}

main();

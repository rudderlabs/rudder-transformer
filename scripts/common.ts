/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
import path from 'path';
import fs from 'fs/promises';
import { exec } from 'child_process';
import os from 'os';

// Extract CLI arguments
export function parseArgs() {
  const [filePath, dataString] = process.argv.slice(2);
  if (!filePath || !dataString) {
    console.error('Usage: node <script> <path-to-data-file> <data-string>');
    process.exit(1);
  }
  return { filePath, dataString };
}

// Extract field using regex
export function extractField(data: string, key: string, required = true): string | undefined {
  const match = data.match(new RegExp(`${key}:\\s*'([^']*)'`));
  if (match) return match[1];
  if (required) {
    console.error(`Field '${key}' not found in the input.`);
    process.exit(1);
  }
  return undefined;
}

// Get destination name from path
// eslint-disable-next-line consistent-return
export function getDestination(filePath: string): string {
  const normalizedPath = filePath.replace(/\\/g, '/'); // Normalize for cross-platform compatibility
  const match = normalizedPath.match(/destinations\/([^/]+)/);
  if (match) return match[1];
  console.error('Destination not found in the file path.');
  process.exit(1);
}

// Replace filename with 'data.ts' or 'data.js'
export async function resolveDataFile(basePath: string): Promise<string> {
  const dir = path.dirname(path.resolve(process.cwd(), basePath));
  const candidates = ['data.ts', 'data.js'];
  for (const candidate of candidates) {
    const fullPath = path.join(dir, candidate);
    try {
      // eslint-disable-next-line no-await-in-loop
      await fs.access(fullPath);
      return fullPath;
    } catch {
      // Ignore errors, continue to next candidate
    }
  }
  return '';
}

// Import the data module
// eslint-disable-next-line consistent-return
export async function importDataModule(filePath: string): Promise<any[]> {
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

export function runTestCommand(command: string): void {
  console.log(`Running command: ${command}`);
  const testCommand = exec(command);
  if (!testCommand.stdout || !testCommand.stderr) {
    console.error('Failed to execute command: stdout or stderr is null');
    return;
  }

  testCommand.stdout.on('data', (data) => {
    console.log(data);
  });

  testCommand.stderr.on('data', (data) => {
    console.error(data);
  });

  testCommand.on('close', (code) => {
    console.log(`Process exited with code ${code}`);
  });
}

// Build curl command
export function buildCurl(url: string, headers: Record<string, string>, body: unknown): string {
  const curl = [`curl -X POST "${url}"`, `-H "Content-Type: application/json"`];
  Object.entries(headers || {}).forEach(([k, v]) => {
    curl.push(`-H "${k}: ${v}"`);
  });
  if (body) {
    curl.push(`--data '${JSON.stringify(body)}'`);
  }
  return curl.join(' \\\n  ');
}

// Copy string to clipboard using pbcopy
export function copyToClipboard(text: string) {
  const platform = os.platform();
  const copyCommandMap: Record<string, string> = {
    darwin: 'pbcopy',
    win32: 'clip',
    linux: 'xclip',
  };
  const command = copyCommandMap[platform];
  if (platform === 'linux' && !command) {
    console.warn(
      '⚠️  Clipboard copy requires xclip on Linux (install with: apt-get install xclip)',
    );
    return;
  }
  const child = exec(command);
  if (child.stdin) {
    child.stdin.write(text);
    child.stdin.end();
  } else {
    console.error(`${command}: stdin is null`);
  }

  child.on('error', (err) => {
    console.error(`${command} error: ${err}`);
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Copied curl command to clipboard.');
    } else {
      console.error(`${command} exited with code ${code}`);
    }
  });
}

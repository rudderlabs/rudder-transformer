/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
import path from 'path';
import fs from 'fs/promises';
import { exec } from 'child_process';

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
  const match = filePath.match(/destinations\/([^/]+)/);
  if (match) return match[1];
  console.error('Destination not found in the file path.');
  process.exit(1);
}

// Replace filename with 'data.ts' or 'data.js'
export async function resolveDataFile(basePath: string): Promise<string> {
  const dir = path.dirname(path.resolve(process.cwd(), basePath));
  const candidates = ['data.ts', 'data.js'];
  return (
    candidates
      .map(async (file) => {
        const fullPath = path.join(dir, file);
        try {
          await fs.access(fullPath);
          return fullPath;
        } catch {
          return '';
        }
      })
      .find(Boolean) || ''
  );
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

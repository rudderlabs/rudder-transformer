/* eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
import path from 'path';
import fs from 'fs/promises';
import { execFile, spawn } from 'child_process';
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
  // eslint-disable-next-line no-restricted-syntax
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

  // Split command into executable and arguments to avoid shell interpretation
  const parts = command.trim().split(/\s+/);
  const executable = parts[0];
  const args = parts.slice(1);

  const updatedExecutable =
    process.platform === 'win32' && executable === 'npm' ? 'npm.cmd' : executable;
  const testCommand = spawn(updatedExecutable, args, {
    shell: process.platform === 'win32',
  });

  testCommand.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  testCommand.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  testCommand.on('close', (code) => {
    console.log(`Process exited with code ${code}`);
  });

  testCommand.on('error', (err) => {
    console.error(`Failed to execute command: ${err.message}`);
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

// Copy string to clipboard using platform-appropriate commands
export function copyToClipboard(text: string) {
  const platform = os.platform();

  // Platform-specific command mapping with WSL support
  const copyCommandMap: Record<string, string> = {
    darwin: 'pbcopy',
    win32: 'clip',
    linux: 'xclip',
  };

  const resolvedCommand = copyCommandMap[platform];

  if (!resolvedCommand) {
    console.warn(
      '⚠️  Clipboard copy requires xclip on Linux (install with: apt-get install xclip)',
    );
    return;
  }

  // Platform-specific arguments for proper clipboard targeting
  const argsMap: Record<string, string[]> = {
    darwin: [], // macOS (pbcopy)
    win32: [], // Windows (clip)
    linux: ['-selection', 'clipboard', '-in'], // Linux (xclip with clipboard target)
  };

  const args = argsMap[platform] ?? [];

  // Use execFile instead of exec for known commands to prevent command injection
  const child = execFile(resolvedCommand, args, { windowsHide: true });

  if (child.stdin) {
    // Use proper encoding for Windows
    if (platform === 'win32') {
      // clip.exe expects UTF-16LE
      child.stdin.write(Buffer.from(`${text}\r\n`, 'utf16le'));
    } else {
      child.stdin.write(text);
    }
    child.stdin.end();
  } else {
    console.error(`${resolvedCommand}: stdin is null`);
  }

  child.on('error', (err) => {
    console.error(`${resolvedCommand} error: ${err}`);
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Copied curl command to clipboard.');
    } else {
      console.error(`${resolvedCommand} exited with code ${code}`);
    }
  });
}

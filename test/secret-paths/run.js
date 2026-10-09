#!/usr/bin/env node

const { spawnSync } = require('child_process');
const path = require('path');
const { Command } = require('commander');

const command = new Command()
  .name('secret-paths')
  .description('Generate, compare, or validate the destination secret-path artifact')
  .option('--destination <names>', 'comma-separated destinations to generate')
  .option('--integrations-config <path>', 'path to integrations-config destination definitions')
  .option('--check', 'compare fresh derivation with the committed artifact')
  .option('--validate', 'validate committed paths against the fixture corpus')
  .parse();

const options = command.opts();
if (options.check && options.validate) {
  command.error('--check and --validate cannot be used together');
}

const result = spawnSync(
  process.execPath,
  [
    path.join(__dirname, '../../node_modules/jest/bin/jest.js'),
    '-c',
    'jest.config.js',
    '--runInBand',
    '--testMatch',
    '<rootDir>/test/secret-paths/run-entry.ts',
  ],
  {
    cwd: path.join(__dirname, '../..'),
    env: { ...process.env, SECRET_PATHS_RUN_OPTIONS: JSON.stringify(options) },
    stdio: 'inherit',
  },
);

if (result.error) throw result.error;
process.exitCode = result.status ?? 1;

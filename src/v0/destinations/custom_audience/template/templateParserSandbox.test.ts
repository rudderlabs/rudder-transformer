/**
 * Tests for sandboxedParseTemplate — runs parseTemplate inside isolated-vm.
 *
 * Prerequisites:
 *   - Node must be started with --no-node-snapshot (isolated-vm requirement).
 *     The project's jest config already sets NODE_OPTIONS='--no-node-snapshot'.
 *     On macOS or other platforms, ensure that flag is present.
 *   - The bundle must be up-to-date. Run `npm run build:custom-audience-sandbox` after
 *     any change to templateParser.ts or sandboxedParse.entry.ts.
 */
import fs from 'fs';
import path from 'path';
import { sandboxedParseTemplate } from './templateParserSandbox';

const BUNDLE_PATH = path.resolve(__dirname, '../../../../../dist/sandboxedParse.bundle.js');
const ENTRY_SOURCE = path.resolve(__dirname, 'sandboxedParse.entry.ts');
const PARSER_SOURCE = path.resolve(__dirname, 'templateParser.ts');

function assertBundleFreshness() {
  if (!fs.existsSync(BUNDLE_PATH)) {
    throw new Error(
      `Bundle not found at ${BUNDLE_PATH}. Run \`npm run build:custom-audience-sandbox\` first.`,
    );
  }
  const bundleMtime = fs.statSync(BUNDLE_PATH).mtimeMs;
  const sourceFiles = [ENTRY_SOURCE, PARSER_SOURCE];
  for (const src of sourceFiles) {
    if (fs.existsSync(src) && fs.statSync(src).mtimeMs > bundleMtime) {
      throw new Error(
        `${path.basename(src)} is newer than the bundle. Run \`npm run build:custom-audience-sandbox\` to rebuild.`,
      );
    }
  }
}

const validCases = [
  {
    name: 'object iteration with two fields',
    template: '{ "data": $.records.({ "email": .email, "phone": .phone_sha256 }) }',
    expectedFields: ['email', 'phone_sha256'],
  },
  {
    name: 'array iteration',
    template: '$.records.([.user_id, .email])',
    expectedFields: ['email', 'user_id'],
  },
  {
    name: 'static-only template (no record fields)',
    template: '{ "action": "add" }',
    expectedFields: [],
  },
];

const invalidCases = [
  {
    name: 'spread operator',
    template: '{ ...$.records }',
    errorMatch: /spread_expr/,
  },
  {
    name: 'bare identifier',
    template: 'process.exit(1)',
    errorMatch: /Function calls are not supported/,
  },
  {
    name: 'unparseable syntax',
    template: '{{{{',
    errorMatch: /Unexpected end of template/,
  },
];

describe('sandboxedParseTemplate', () => {
  beforeAll(() => {
    assertBundleFreshness();
  });

  it.each(validCases)('should return valid=true: $name', async ({ template, expectedFields }) => {
    const result = await sandboxedParseTemplate(template, 'ws-valid');

    expect(result.valid).toBe(true);
    expect('recordFields' in result && result.recordFields.sort()).toEqual(expectedFields);
  });

  it.each(invalidCases)('should return valid=false: $name', async ({ template, errorMatch }) => {
    const result = await sandboxedParseTemplate(template, 'ws-invalid');

    expect(result.valid).toBe(false);
    expect('errors' in result && result.errors[0]).toMatch(errorMatch);
  });
});

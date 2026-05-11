/**
 * Tests for the combined template sandbox — runs parseTemplate and
 * evaluateTemplate inside isolated-vm.
 *
 * Prerequisites:
 *   - Node must be started with --no-node-snapshot (isolated-vm requirement).
 *     The project's jest config already sets NODE_OPTIONS='--no-node-snapshot'.
 *   - The bundle must be up-to-date. Run `npm run build:custom-audience-sandbox` after
 *     any change to templateParser.ts or sandboxedTemplate.entry.ts.
 */
import fs from 'fs';
import path from 'path';
import { InstrumentationError, PlatformError } from '@rudderstack/integrations-lib';
import { sandboxedEvaluateTemplate, sandboxedParseTemplate } from './templateSandbox';
import { templateSandboxRunner } from './ivmScriptRunner';

const BUNDLE_PATH = path.resolve(__dirname, '../../../../../dist/sandboxedTemplate.bundle.js');
const ENTRY_SOURCE = path.resolve(__dirname, 'sandboxedTemplate.entry.ts');
const PARSER_SOURCE = path.resolve(__dirname, 'templateParser.ts');

export function assertBundleFreshness() {
  if (!fs.existsSync(BUNDLE_PATH)) {
    throw new Error(
      `Bundle not found at ${BUNDLE_PATH}. Run \`npm run build:custom-audience-sandbox\` first.`,
    );
  }
  const bundleMtime = fs.statSync(BUNDLE_PATH).mtimeMs;
  for (const src of [ENTRY_SOURCE, PARSER_SOURCE]) {
    if (fs.existsSync(src) && fs.statSync(src).mtimeMs > bundleMtime) {
      throw new Error(
        `${path.basename(src)} is newer than the bundle. Run \`npm run build:custom-audience-sandbox\` to rebuild.`,
      );
    }
  }
}

describe('templateSandbox', () => {
  beforeAll(() => {
    assertBundleFreshness();
  });

  describe('sandboxedParseTemplate', () => {
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

    it.each(validCases)('returns valid=true: $name', async ({ template, expectedFields }) => {
      const result = await sandboxedParseTemplate(template, 'ws-valid');

      expect(result.valid).toBe(true);
      expect('recordFields' in result && result.recordFields.sort()).toEqual(expectedFields);
    });

    it.each(invalidCases)('returns valid=false: $name', async ({ template, errorMatch }) => {
      const result = await sandboxedParseTemplate(template, 'ws-invalid');

      expect(result.valid).toBe(false);
      expect('errors' in result && result.errors[0]).toMatch(errorMatch);
    });
  });

  describe('sandboxedEvaluateTemplate', () => {
    it('evaluates a template against multiple chunks in a single call', async () => {
      const template = '{ "audienceId": $.connection.audienceId, "users": $.records }';
      const chunks = [[{ email: 'a@b.com' }, { email: 'c@d.com' }], [{ email: 'e@f.com' }]];

      const bodies = await sandboxedEvaluateTemplate(
        template,
        chunks,
        { audienceId: 'aud-1' },
        'ws-eval',
      );

      expect(bodies).toEqual([
        { audienceId: 'aud-1', users: [{ email: 'a@b.com' }, { email: 'c@d.com' }] },
        { audienceId: 'aud-1', users: [{ email: 'e@f.com' }] },
      ]);
    });

    it.each([
      {
        name: 'single-element iteration returns object without [] wrapper',
        template: '{ "data": $.records.({ "email": .email }) }',
        records: [{ email: 'a@b.com' }],
        expected: [{ data: { email: 'a@b.com' } }],
      },
      {
        name: 'multi-element iteration without [] wrapper',
        template: '{ "data": $.records.({ "email": .email }) }',
        records: [{ email: 'a@b.com' }, { email: 'c@d.com' }],
        expected: [{ data: [{ email: 'a@b.com' }, { email: 'c@d.com' }] }],
      },
      {
        name: 'single-element iteration returns array when wrapped in []',
        template: '{ "data": [$.records.({ "email": .email })] }',
        records: [{ email: 'a@b.com' }],
        expected: [{ data: [{ email: 'a@b.com' }] }],
      },
      // TODO: fix once we migrate to JSONata — [] should be idempotent on arrays, not double-nest
      {
        name: 'multi-element iteration double-nests when wrapped in []',
        template: '{ "data": [$.records.({ "email": .email })] }',
        records: [{ email: 'a@b.com' }, { email: 'c@d.com' }],
        expected: [{ data: [[{ email: 'a@b.com' }, { email: 'c@d.com' }]] }],
      },
    ])('$name', async ({ template, records, expected }) => {
      const bodies = await sandboxedEvaluateTemplate(template, [records], {}, 'ws-eval');

      expect(bodies).toEqual(expected);
    });

    it('throws InstrumentationError when the template fails at runtime', async () => {
      const template = '$.records[0].notARealMethod()';

      await expect(
        sandboxedEvaluateTemplate(template, [[{ email: 'a@b.com' }]], {}, 'ws-eval'),
      ).rejects.toThrow(InstrumentationError);
    });

    it('throws InstrumentationError for unparseable templates', async () => {
      await expect(sandboxedEvaluateTemplate('{{{{', [[]], {}, 'ws-eval')).rejects.toThrow(
        /Failed to evaluate requestBody template/,
      );
    });

    // Data is passed into the isolate via structured clone (evalClosure with
    // { copy: true }), which preserves types that JSON.stringify would drop.
    it.each([
      {
        name: 'undefined values in records are preserved',
        records: [{ email: 'a@b.com', phone: undefined }],
        expected: [{ data: [{ email: 'a@b.com', phone: undefined }] }],
      },
      {
        name: 'NaN is preserved',
        records: [{ score: NaN }],
        expected: [{ data: [{ score: NaN }] }],
      },
      {
        name: 'Infinity is preserved',
        records: [{ value: Infinity }],
        expected: [{ data: [{ value: Infinity }] }],
      },
    ])('structured clone: $name', async ({ records, expected }) => {
      const bodies = await sandboxedEvaluateTemplate(
        '{ "data": $.records }',
        [records],
        {},
        'ws-clone',
      );
      expect(bodies).toEqual(expected);
    });

    it('throws PlatformError when the isolate runner fails (e.g. timeout)', async () => {
      const spy = jest
        .spyOn(templateSandboxRunner, 'execute')
        .mockRejectedValueOnce(new Error('Script execution timed out.'));

      await expect(
        sandboxedEvaluateTemplate('{ "users": $.records }', [[]], {}, 'ws-internal'),
      ).rejects.toThrow(PlatformError);

      spy.mockRestore();
    });
  });
});

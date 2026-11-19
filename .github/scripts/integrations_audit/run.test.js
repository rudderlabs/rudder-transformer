// Run with: node --test .github/scripts/integrations_audit/*.test.js
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { CURSOR, extractFindings, validateFindings, writeSummary } = require('./run');

const finding = {
  category: 'auth',
  impact: 'breaking',
  title: 'API keys removed',
  summary: 'Moves to OAuth.',
  announcementUrl: 'https://partner.example/oauth',
  announcedOn: '2026-11-01',
  effectiveDate: '2027-04-30',
  targetVersion: null,
  affects: 'Configuration',
};

const resultText = (body) =>
  `Checked the changelog.\nBEGIN_FINDINGS_JSON\n${JSON.stringify(body)}\nEND_FINDINGS_JSON`;

test('cursor output: reads the result text and token counts when reported', () => {
  const parsed = CURSOR.parse(
    JSON.stringify({
      is_error: false,
      result: 'done',
      usage: { input_tokens: 1200, output_tokens: 80 },
    }),
  );
  assert.deepStrictEqual(parsed, {
    text: 'done',
    isError: false,
    usage: { inputTokens: 1200, outputTokens: 80 },
  });
});

test('cursor output: no usage means no token counts', () => {
  assert.deepStrictEqual(CURSOR.parse(JSON.stringify({ result: 'done' })).usage, {});
});

test('findings: the last marked block is used and validated', () => {
  const text = `${resultText({ integration: 'x', findings: [] })}\n${resultText({ integration: 'zendesk', findings: [finding] })}`;
  const result = extractFindings(text);
  assert.strictEqual(result.integration, 'zendesk');
  assert.deepStrictEqual(validateFindings(result, 'zendesk'), []);
});

test('findings: wrong integration, unknown category and bad dates are rejected', () => {
  const result = {
    integration: 'hs',
    findings: [{ ...finding, category: 'pricing', effectiveDate: 'soon', announcementUrl: '' }],
  };
  assert.deepStrictEqual(validateFindings(result, 'zendesk'), [
    'integration is "hs"',
    'findings[0].category "pricing"',
    'findings[0].announcementUrl missing',
    'findings[0].effectiveDate "soon"',
  ]);
});

test('findings: output without the marker block is an error', () => {
  assert.throws(() => extractFindings('no json here'), /no BEGIN_FINDINGS_JSON block/);
});

test('summary: shows tokens when reported and lists skipped READMEs', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'audit-'));
  writeSummary(
    dir,
    [
      {
        integration: 'am',
        status: 'ok',
        durationMs: 31000,
        usage: { inputTokens: 900, outputTokens: 40 },
        result: { findings: [] },
      },
      { integration: 'hs', status: 'timeout', durationMs: 300000 },
    ],
    [{ name: 'foo', problems: ['missing "### Changelog References"'] }],
    { lookbackDays: 45 },
  );
  const md = fs.readFileSync(path.join(dir, 'summary.md'), 'utf8');
  assert.match(md, /\| am \| ok \| 0 \| 31s \| 900 in \/ 40 out \|/);
  assert.match(md, /\| hs \| timeout \| – \| 300s \| – \|/);
  assert.match(md, /- foo: missing "### Changelog References"/);
  assert.doesNotMatch(md, /cost/i);
});

// Run with: node --test .github/scripts/integrations_audit/*.test.js
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  cursorArgs,
  parseCursorOutput,
  extractFindings,
  validateFindings,
  writeSummary,
} = require('./run');

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

test('cursor args: trusted headless JSON run, model only when set, prompt last', () => {
  assert.deepStrictEqual(cursorArgs('p', ''), [
    '-p',
    '--force',
    '--trust',
    '--output-format',
    'json',
    'p',
  ]);
  assert.deepStrictEqual(cursorArgs('p', 'gpt-5').slice(-3), ['--model', 'gpt-5', 'p']);
});

test('cursor output: reads the result text and API time', () => {
  const parsed = parseCursorOutput(
    JSON.stringify({
      type: 'result',
      is_error: false,
      result: 'done',
      duration_ms: 40000,
      duration_api_ms: 31000,
    }),
  );
  assert.deepStrictEqual(parsed, { text: 'done', isError: false, apiMs: 31000 });
});

test('cursor output: an error result is flagged', () => {
  assert.deepStrictEqual(parseCursorOutput(JSON.stringify({ is_error: true, result: 'boom' })), {
    text: 'boom',
    isError: true,
    apiMs: null,
  });
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

test('summary: shows time and API time, and lists skipped READMEs', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'audit-'));
  writeSummary(
    dir,
    [
      {
        integration: 'am',
        status: 'ok',
        durationMs: 40000,
        apiMs: 31000,
        result: { findings: [] },
      },
      { integration: 'hs', status: 'timeout', durationMs: 300000 },
    ],
    [{ name: 'foo', problems: ['missing "### Changelog References"'] }],
    { lookbackDays: 45 },
  );
  const md = fs.readFileSync(path.join(dir, 'summary.md'), 'utf8');
  assert.match(md, /\| am \| ok \| 0 \| 40s \| 31s \|/);
  assert.match(md, /\| hs \| timeout \| – \| 300s \| – \|/);
  assert.match(md, /- foo: missing "### Changelog References"/);
});

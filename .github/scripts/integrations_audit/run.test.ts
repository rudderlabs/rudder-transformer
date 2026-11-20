// Runs with the repo Jest suite (npm test).
import assert from 'node:assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  cursorArgs,
  parseCursorOutput,
  extractFindings,
  validateFindings,
  writeSummary,
  agentEnv,
  redact,
} from './run';
import { AgentResult, AuditRecord, Finding } from './common';

const finding: Finding = {
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

const agentResult = (integration: string, findings: Finding[]): AgentResult => ({
  integration,
  sourcesChecked: [],
  unreachable: [],
  latestVersionSeen: null,
  skipped: 0,
  findings,
});

const resultText = (body: AgentResult) =>
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
  const text = `${resultText(agentResult('x', []))}\n${resultText(agentResult('zendesk', [finding]))}`;
  const result = extractFindings(text);
  assert.strictEqual(result.integration, 'zendesk');
  assert.deepStrictEqual(validateFindings(result, 'zendesk'), []);
});

test('findings: wrong integration, unknown category and bad dates are rejected', () => {
  // Deliberately invalid agent output, so the shape is cast past the type checker.
  const result = agentResult('hs', [
    { ...finding, category: 'pricing', effectiveDate: 'soon', announcementUrl: '' },
  ] as unknown as Finding[]);
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
  const record = (integration: string): Omit<AuditRecord, 'status' | 'durationMs'> => ({
    integration,
    title: integration,
    readmePath: `src/v0/destinations/${integration}/README.md`,
    promptChars: 1000,
  });
  writeSummary(
    dir,
    [
      {
        ...record('am'),
        status: 'ok',
        durationMs: 40000,
        apiMs: 31000,
        result: agentResult('am', []),
      },
      { ...record('hs'), status: 'timeout', durationMs: 300000 },
    ],
    [{ name: 'foo', problems: ['missing "### Changelog References"'] }],
    { lookbackDays: 45 },
  );
  const md = fs.readFileSync(path.join(dir, 'summary.md'), 'utf8');
  assert.match(md, /\| am \| ok \| 0 \| 40s \| 31s \|/);
  assert.match(md, /\| hs \| timeout \| – \| 300s \| – \|/);
  assert.match(md, /- foo: missing "### Changelog References"/);
});

test('the agent gets only the environment it needs, never the runner files', () => {
  const env = agentEnv({
    PATH: '/bin',
    HOME: '/home/runner',
    CURSOR_API_KEY: 'not-a-real-key',
    GITHUB_ENV: '/tmp/env',
    GITHUB_OUTPUT: '/tmp/out',
    LINEAR_API_KEY: 'lin_api',
  });
  assert.deepStrictEqual(env, {
    PATH: '/bin',
    HOME: '/home/runner',
    CURSOR_API_KEY: 'not-a-real-key',
  });
});

test('the Cursor key is masked in text written to artifacts', () => {
  const env = { CURSOR_API_KEY: 'not-a-real-key' };
  assert.strictEqual(redact('auth not-a-real-key failed', env), 'auth *** failed');
  assert.strictEqual(redact('nothing to mask', {}), 'nothing to mask');
});

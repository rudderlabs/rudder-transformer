// Runs the integration audit: one cursor-agent call per integration, each with a time limit.
// Usage: tsx run.ts [--only hs,marketo] [--limit 5] [--concurrency 3] [--timeout-sec 300]
//                   [--lookback-days 45] [--model <name>] [--out audit-out]
// Without --model, cursor-agent uses its default (Auto routing on a fresh install).
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { discover, readIntegration, Integration } from './readme';
import {
  REPO_ROOT,
  CATEGORIES,
  IMPACTS,
  isoDate,
  pool,
  AgentResult,
  AuditRecord,
  Category,
  Impact,
} from './common';

export interface Options {
  only: string[] | null;
  limit: number;
  concurrency: number;
  timeoutSec: number;
  lookbackDays: number;
  maxFetches: number;
  maxSearches: number;
  model: string;
  out: string;
}

export function parseArgs(argv: string[]): Options {
  const opts: Record<string, string | number> = {
    only: '',
    limit: 0,
    concurrency: 3,
    timeoutSec: 300,
    lookbackDays: 45,
    maxFetches: 6,
    maxSearches: 2,
    model: '',
    out: 'audit-out',
  };
  for (let i = 2; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, '').replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    if (!(key in opts)) throw new Error(`Unknown option ${argv[i]}`);
    opts[key] = typeof opts[key] === 'number' ? Number(argv[i + 1]) : argv[i + 1];
  }
  const only = String(opts.only);
  return {
    ...(opts as unknown as Options),
    only: only ? only.split(',').map((s) => s.trim()) : null,
  };
}

export function buildPrompt(template: string, integration: Integration, opts: Options): string {
  const today = new Date();
  const since = new Date(today.getTime() - opts.lookbackDays * 86400000);
  const values: Record<string, string | number> = {
    title: integration.title,
    name: integration.name,
    dir: integration.dir,
    today: isoDate(today),
    since: isoDate(since),
    lookbackDays: opts.lookbackDays,
    sections: [
      '## Version Information',
      integration.sections.versionInformation.trim(),
      '',
      '## Documentation Links',
      integration.sections.documentationLinks.trim(),
    ].join('\n'),
    onDemandFiles: integration.onDemandFiles.map((f) => `\`${f}\``).join(', ') || 'none',
    maxFetches: opts.maxFetches,
    maxSearches: opts.maxSearches,
  };
  return template.replace(/\{\{(\w+)\}\}/g, (_, k: string) => String(values[k]));
}

/** `--force` runs tools without approval; the workflow's `.cursor/cli.json` deny rules still apply. */
export function cursorArgs(prompt: string, model: string): string[] {
  return [
    '-p',
    '--force',
    '--trust',
    '--output-format',
    'json',
    ...(model ? ['--model', model] : []),
    prompt,
  ];
}

export interface AgentOutput {
  text: string;
  isError: boolean;
  apiMs: number | null;
}

/** Reads `cursor-agent --output-format json`; it reports API time but no token counts. */
export function parseCursorOutput(stdout: string): AgentOutput {
  const r = JSON.parse(stdout);
  return { text: r.result || '', isError: Boolean(r.is_error), apiMs: r.duration_api_ms ?? null };
}

interface ProcessResult {
  code: number | null;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  durationMs: number;
}

function runCursor(prompt: string, opts: Options): Promise<ProcessResult> {
  return new Promise((resolve) => {
    const started = Date.now();
    const child = spawn('cursor-agent', cursorArgs(prompt, opts.model), {
      cwd: REPO_ROOT,
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      try {
        process.kill(-(child.pid as number), 'SIGKILL');
      } catch {
        child.kill('SIGKILL');
      }
    }, opts.timeoutSec * 1000);
    const finish = (code: number | null, err?: string) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr: err || stderr, timedOut, durationMs: Date.now() - started });
    };
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    child.on('error', (err) => finish(-1, String(err)));
    child.on('close', (code) => finish(code));
  });
}

export function extractFindings(text: string): AgentResult {
  const blocks = [...text.matchAll(/BEGIN_FINDINGS_JSON\s*([\s\S]*?)\s*END_FINDINGS_JSON/g)];
  if (!blocks.length) throw new Error('no BEGIN_FINDINGS_JSON block');
  const raw = blocks[blocks.length - 1][1].replace(/^```(json)?\s*|\s*```$/g, '');
  return JSON.parse(raw);
}

export function validateFindings(result: AgentResult, name: string): string[] {
  const errors: string[] = [];
  if (result.integration !== name) errors.push(`integration is "${result.integration}"`);
  if (!Array.isArray(result.findings)) errors.push('findings is not an array');
  (result.findings || []).forEach((f, i) => {
    if (!CATEGORIES.includes(f.category as Category))
      errors.push(`findings[${i}].category "${f.category}"`);
    if (!IMPACTS.includes(f.impact as Impact)) errors.push(`findings[${i}].impact "${f.impact}"`);
    if (!/^https?:\/\//.test(f.announcementUrl || ''))
      errors.push(`findings[${i}].announcementUrl missing`);
    if (f.effectiveDate && !/^\d{4}-\d{2}(-\d{2})?$/.test(f.effectiveDate))
      errors.push(`findings[${i}].effectiveDate "${f.effectiveDate}"`);
  });
  return errors;
}

async function auditOne(
  integration: Integration,
  template: string,
  opts: Options,
): Promise<AuditRecord> {
  const prompt = buildPrompt(template, integration, opts);
  const run = await runCursor(prompt, opts);
  const base = {
    integration: integration.name,
    title: integration.title,
    readmePath: integration.readmePath,
    durationMs: run.durationMs,
    promptChars: prompt.length,
  };
  if (run.timedOut) return { ...base, status: 'timeout' };
  let parsed: AgentOutput;
  try {
    parsed = parseCursorOutput(run.stdout);
  } catch {
    return { ...base, status: 'agent_error', error: (run.stderr || run.stdout).slice(-500) };
  }
  const withApi = { ...base, apiMs: parsed.apiMs };
  if (parsed.isError || run.code !== 0) {
    return { ...withApi, status: 'agent_error', error: parsed.text.slice(-500) };
  }
  try {
    const result = extractFindings(parsed.text);
    const errors = validateFindings(result, integration.name);
    if (errors.length) {
      return { ...withApi, status: 'invalid_output', error: errors.join('; '), result };
    }
    return { ...withApi, status: 'ok', result };
  } catch (err) {
    return {
      ...withApi,
      status: 'invalid_output',
      error: String((err as Error).message),
      tail: parsed.text.slice(-500),
    };
  }
}

const seconds = (ms: number | null | undefined) => (ms == null ? '–' : `${Math.round(ms / 1000)}s`);

export function writeSummary(
  outDir: string,
  records: AuditRecord[],
  skipped: Pick<Integration, 'name' | 'problems'>[],
  opts: Pick<Options, 'lookbackDays'>,
): void {
  const lines = [
    `# Integration audit run (${isoDate(new Date())}, lookback ${opts.lookbackDays} days)`,
    '',
    '| Integration | Status | Findings | Time | API time |',
    '|---|---|---:|---:|---:|',
    ...records.map(
      (r) =>
        `| ${r.integration} | ${r.status} | ${r.result ? r.result.findings.length : '–'} | ${seconds(r.durationMs)} | ${seconds(r.apiMs)} |`,
    ),
  ];
  if (skipped.length) {
    lines.push('', '## Skipped: README not audit-ready', '');
    skipped.forEach((s) => lines.push(`- ${s.name}: ${s.problems.join('; ')}`));
  }
  fs.writeFileSync(path.join(outDir, 'summary.md'), `${lines.join('\n')}\n`);
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv);
  const outDir = path.resolve(REPO_ROOT, opts.out);
  fs.mkdirSync(path.join(outDir, 'findings'), { recursive: true });

  let integrations = discover(REPO_ROOT).map((d) => readIntegration(REPO_ROOT, d));
  const { only } = opts;
  if (only) {
    const missing = only.filter((n) => !integrations.some((i) => i.name === n));
    if (missing.length) throw new Error(`No README for: ${missing.join(', ')}`);
    integrations = integrations.filter((i) => only.includes(i.name));
  }
  const skipped = integrations.filter((i) => i.problems.length);
  let ready = integrations.filter((i) => !i.problems.length);
  if (opts.limit) ready = ready.slice(0, opts.limit);

  const template = fs.readFileSync(path.join(__dirname, 'prompt.md'), 'utf8');
  console.log(`Auditing ${ready.length} integrations (skipped ${skipped.length})`);
  const records = await pool(ready, opts.concurrency, async (integration) => {
    const record = await auditOne(integration, template, opts);
    fs.writeFileSync(
      path.join(outDir, 'findings', `${integration.name}.json`),
      `${JSON.stringify(record, null, 2)}\n`,
    );
    console.log(`${record.status.padEnd(14)} ${integration.name} ${seconds(record.durationMs)}`);
    return record;
  });
  writeSummary(outDir, records, skipped, opts);
  console.log(`Summary: ${path.join(outDir, 'summary.md')}`);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

#!/usr/bin/env node
// Runs the integration audit: one agent call per integration, each with a time and budget limit.
// Usage: node run.js [--only hs,marketo] [--limit 5] [--concurrency 3] [--timeout-sec 300]
//                    [--budget-usd 1] [--lookback-days 45] [--agent cursor|claude] (cursor in CI, claude for local runs) [--out audit-out]
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { discover, readIntegration } = require('./readme');

const REPO_ROOT = path.resolve(__dirname, '../../..');
const ALLOWED_TOOLS = ['WebFetch', 'WebSearch', 'Read', 'Grep', 'Glob'];
const IMPACTS = ['breaking', 'version_upgrade', 'opportunity'];
const CATEGORIES = [
  'version_upgrade',
  'endpoint_lifecycle',
  'auth',
  'request_response_fields',
  'new_mapping',
  'validation_limits',
  'new_capability',
  'error_handling',
];

function parseArgs(argv) {
  const opts = {
    only: null,
    limit: null,
    concurrency: 3,
    timeoutSec: 300,
    budgetUsd: 1,
    lookbackDays: 45,
    maxFetches: 6,
    maxSearches: 2,
    agent: process.env.AUDIT_AGENT || 'cursor',
    out: 'audit-out',
  };
  for (let i = 2; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    if (!(key in opts)) throw new Error(`Unknown option ${argv[i]}`);
    const v = argv[i + 1];
    opts[key] =
      key === 'only'
        ? v.split(',').map((s) => s.trim())
        : typeof opts[key] === 'number'
          ? Number(v)
          : v;
  }
  return opts;
}

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

function buildPrompt(template, integration, opts) {
  const today = new Date();
  const since = new Date(today.getTime() - opts.lookbackDays * 86400000);
  const sections = [
    '## Version Information',
    integration.sections.versionInformation.trim(),
    '',
    '## Documentation Links',
    integration.sections.documentationLinks.trim(),
  ].join('\n');
  const values = {
    title: integration.title,
    name: integration.name,
    dir: integration.dir,
    today: isoDate(today),
    since: isoDate(since),
    lookbackDays: opts.lookbackDays,
    sections,
    onDemandFiles: integration.onDemandFiles.map((f) => `\`${f}\``).join(', ') || 'none',
    maxFetches: opts.maxFetches,
    maxSearches: opts.maxSearches,
  };
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => String(values[k]));
}

/** Agent adapters: the command to run, and how to read its text result and usage. */
const AGENTS = {
  claude: {
    command: (prompt, opts) => [
      'claude',
      [
        '-p',
        prompt,
        '--output-format',
        'json',
        '--allowedTools',
        ...ALLOWED_TOOLS,
        '--max-budget-usd',
        String(opts.budgetUsd),
        '--strict-mcp-config',
        '--no-session-persistence',
        ...(process.env.AUDIT_CLAUDE_ARGS ? process.env.AUDIT_CLAUDE_ARGS.split(' ') : []),
      ],
    ],
    parse: (stdout) => {
      const r = JSON.parse(stdout);
      const u = r.usage || {};
      return {
        text: r.result || '',
        isError: Boolean(r.is_error),
        usage: {
          costUsd: r.total_cost_usd ?? null,
          inputTokens:
            (u.input_tokens || 0) +
            (u.cache_read_input_tokens || 0) +
            (u.cache_creation_input_tokens || 0),
          outputTokens: u.output_tokens ?? null,
          turns: r.num_turns ?? null,
        },
      };
    },
  },
  cursor: {
    command: (prompt) => ['cursor-agent', ['-p', '--force', '--output-format', 'json', prompt]],
    parse: (stdout) => {
      const r = JSON.parse(stdout);
      return { text: r.result || '', isError: Boolean(r.is_error), usage: {} };
    },
  },
};

function runAgent(adapter, prompt, opts) {
  const [cmd, args] = adapter.command(prompt, opts);
  return new Promise((resolve) => {
    const started = Date.now();
    const child = spawn(cmd, args, {
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
        process.kill(-child.pid, 'SIGKILL');
      } catch {
        child.kill('SIGKILL');
      }
    }, opts.timeoutSec * 1000);
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({
        code: -1,
        stdout,
        stderr: String(err),
        timedOut,
        durationMs: Date.now() - started,
      });
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr, timedOut, durationMs: Date.now() - started });
    });
  });
}

function extractFindings(text) {
  const blocks = [...text.matchAll(/BEGIN_FINDINGS_JSON\s*([\s\S]*?)\s*END_FINDINGS_JSON/g)];
  if (!blocks.length) throw new Error('no BEGIN_FINDINGS_JSON block');
  const raw = blocks[blocks.length - 1][1].replace(/^```(json)?\s*|\s*```$/g, '');
  return JSON.parse(raw);
}

function validateFindings(result, name) {
  const errors = [];
  if (result.integration !== name) errors.push(`integration is "${result.integration}"`);
  if (!Array.isArray(result.findings)) errors.push('findings is not an array');
  (result.findings || []).forEach((f, i) => {
    if (!CATEGORIES.includes(f.category)) errors.push(`findings[${i}].category "${f.category}"`);
    if (!IMPACTS.includes(f.impact)) errors.push(`findings[${i}].impact "${f.impact}"`);
    if (!/^https?:\/\//.test(f.announcementUrl || ''))
      errors.push(`findings[${i}].announcementUrl missing`);
    if (f.effectiveDate && !/^\d{4}-\d{2}(-\d{2})?$/.test(f.effectiveDate))
      errors.push(`findings[${i}].effectiveDate "${f.effectiveDate}"`);
  });
  return errors;
}

async function auditOne(integration, template, adapter, opts) {
  const prompt = buildPrompt(template, integration, opts);
  const run = await runAgent(adapter, prompt, opts);
  const base = {
    integration: integration.name,
    title: integration.title,
    readmePath: integration.readmePath,
    durationMs: run.durationMs,
    promptChars: prompt.length,
  };
  if (run.timedOut) return { ...base, status: 'timeout' };
  let parsed;
  try {
    parsed = adapter.parse(run.stdout);
  } catch {
    return { ...base, status: 'agent_error', error: (run.stderr || run.stdout).slice(-500) };
  }
  if (parsed.isError || run.code !== 0) {
    return { ...base, status: 'agent_error', usage: parsed.usage, error: parsed.text.slice(-500) };
  }
  try {
    const result = extractFindings(parsed.text);
    const errors = validateFindings(result, integration.name);
    if (errors.length)
      return {
        ...base,
        status: 'invalid_output',
        usage: parsed.usage,
        error: errors.join('; '),
        result,
      };
    return { ...base, status: 'ok', usage: parsed.usage, result };
  } catch (err) {
    return {
      ...base,
      status: 'invalid_output',
      usage: parsed.usage,
      error: String(err.message),
      tail: parsed.text.slice(-500),
    };
  }
}

async function pool(items, size, worker) {
  const results = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        results[i] = await worker(items[i]);
      }
    }),
  );
  return results;
}

function fmtUsage(u = {}) {
  const cost = u.costUsd != null ? `$${u.costUsd.toFixed(3)}` : '–';
  const tokens = u.inputTokens != null ? `${u.inputTokens} in / ${u.outputTokens ?? '–'} out` : '–';
  return { cost, tokens };
}

function writeSummary(outDir, records, skipped, opts) {
  const lines = [
    `# Integration audit run (${isoDate(new Date())}, agent: ${opts.agent}, lookback ${opts.lookbackDays} days)`,
    '',
    '| Integration | Status | Findings | Time | Cost | Tokens |',
    '|---|---|---:|---:|---:|---|',
  ];
  for (const r of records) {
    const { cost, tokens } = fmtUsage(r.usage);
    lines.push(
      `| ${r.integration} | ${r.status} | ${r.result ? r.result.findings.length : '–'} | ${Math.round(r.durationMs / 1000)}s | ${cost} | ${tokens} |`,
    );
  }
  const totalCost = records.reduce((s, r) => s + (r.usage?.costUsd || 0), 0);
  lines.push('', `Total cost: $${totalCost.toFixed(3)}`);
  if (skipped.length) {
    lines.push('', '## Skipped: README not audit-ready', '');
    skipped.forEach((s) => lines.push(`- ${s.name}: ${s.problems.join('; ')}`));
  }
  fs.writeFileSync(path.join(outDir, 'summary.md'), `${lines.join('\n')}\n`);
}

async function main() {
  const opts = parseArgs(process.argv);
  const adapter = AGENTS[opts.agent];
  if (!adapter) throw new Error(`Unknown agent "${opts.agent}"`);
  const outDir = path.resolve(REPO_ROOT, opts.out);
  fs.mkdirSync(path.join(outDir, 'findings'), { recursive: true });

  let integrations = discover(REPO_ROOT).map((d) => readIntegration(REPO_ROOT, d));
  if (opts.only) {
    const missing = opts.only.filter((n) => !integrations.some((i) => i.name === n));
    if (missing.length) throw new Error(`No README for: ${missing.join(', ')}`);
    integrations = integrations.filter((i) => opts.only.includes(i.name));
  }
  const skipped = integrations.filter((i) => i.problems.length);
  let ready = integrations.filter((i) => !i.problems.length);
  if (opts.limit) ready = ready.slice(0, opts.limit);

  const template = fs.readFileSync(path.join(__dirname, 'prompt.md'), 'utf8');
  console.log(
    `Auditing ${ready.length} integrations with ${opts.agent} (skipped ${skipped.length})`,
  );
  const records = await pool(ready, opts.concurrency, async (integration) => {
    const record = await auditOne(integration, template, adapter, opts);
    fs.writeFileSync(
      path.join(outDir, 'findings', `${integration.name}.json`),
      `${JSON.stringify(record, null, 2)}\n`,
    );
    console.log(
      `${record.status.padEnd(14)} ${integration.name} ${Math.round(record.durationMs / 1000)}s ${fmtUsage(record.usage).cost}`,
    );
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

module.exports = { buildPrompt, extractFindings, validateFindings, parseArgs };

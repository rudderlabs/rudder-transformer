// Shared by the audit scripts: the change taxonomy, small helpers and the ticket item format.
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '../../..');

/** Change category (from the agent) → Linear subticket type. */
const TYPE_BY_CATEGORY = {
  version_upgrade: 'versionUpgrade',
  endpoint_lifecycle: 'versionUpgrade',
  auth: 'authFeature',
  request_response_fields: 'mappingFeature',
  new_mapping: 'mappingFeature',
  validation_limits: 'other',
  new_capability: 'other',
  error_handling: 'other',
};
const CATEGORIES = Object.keys(TYPE_BY_CATEGORY);
const TYPE_ORDER = ['versionUpgrade', 'authFeature', 'mappingFeature', 'other'];
const IMPACTS = ['breaking', 'version_upgrade', 'opportunity'];

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normUrl(url) {
  return (url || '').toLowerCase().replace(/\/$/, '');
}

/** `--out <dir>` from argv, resolved against the repo root. */
function outDirFromArgs(argv, fallback = 'audit-out') {
  const i = argv.indexOf('--out');
  return path.resolve(REPO_ROOT, i > -1 ? argv[i + 1] : fallback);
}

/** Runs `worker` over `items`, at most `size` at a time, keeping result order. */
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

/** Linear priority: 1 Urgent … 4 Low, 0 or missing = none. */
function mostUrgent(a, b) {
  const rank = (p) => (p >= 1 && p <= 4 ? p : 5);
  return rank(a) <= rank(b) ? a : b;
}

function earliest(a, b) {
  return [a, b].filter(Boolean).sort()[0] || null;
}

function readmeLine(readmePath) {
  return `- [ ] Update the README (\`${readmePath}\`): Version Information, Configuration or mappings`;
}

/** One checklist item as written into tickets (and the plan preview). The Key line lets later runs skip it. */
function itemMarkdown(item) {
  const when = item.effectiveDate ? ` (effective ${item.effectiveDate})` : '';
  const source = item.announcementUrl ? `Source: ${item.announcementUrl} · ` : '';
  return `- [ ] **${item.title}**${when}: ${item.summary}\n  ${source}Key: \`${item.key}\``;
}

module.exports = {
  REPO_ROOT,
  TYPE_BY_CATEGORY,
  CATEGORIES,
  TYPE_ORDER,
  IMPACTS,
  isoDate,
  escapeRegExp,
  normUrl,
  outDirFromArgs,
  pool,
  mostUrgent,
  earliest,
  readmeLine,
  itemMarkdown,
};

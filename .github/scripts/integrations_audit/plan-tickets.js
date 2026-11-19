#!/usr/bin/env node
// Turns audit findings into a Linear ticket plan: one parent per integration, one subticket per change type.
// Writes plan.json / plan.md and never calls Linear (create-tickets.js applies the plan).
// Usage: node plan-tickets.js [--out audit-out]
const fs = require('fs');
const path = require('path');
const { readIntegration } = require('./readme');
const {
  REPO_ROOT,
  TYPE_BY_CATEGORY,
  TYPE_ORDER,
  isoDate,
  normUrl,
  outDirFromArgs,
  mostUrgent,
  earliest,
  readmeLine,
  itemMarkdown,
} = require('./common');

const DAY = 86400000;
const PRIORITY_NAMES = { 1: 'Urgent', 2: 'High', 3: 'Medium', 4: 'Low' };

/** A YYYY-MM date counts from the first of the month, the earliest it could take effect. */
function parseDate(value) {
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(value || '');
  return m ? new Date(Date.UTC(+m[1], +m[2] - 1, m[3] ? +m[3] : 1)) : null;
}

/** Same thresholds as the version audit: days until the change takes effect. */
function priorityFor(item, today) {
  const date = parseDate(item.effectiveDate);
  // A release date is not a deadline: only a future date makes a plain version upgrade urgent.
  const isDeadline = item.impact !== 'version_upgrade' || (date && date > today);
  if (date && isDeadline) {
    const days = Math.floor((date - today) / DAY);
    if (days < 90) return { priority: 1, dueDate: isoDate(new Date(today.getTime() + DAY)) };
    if (days < 180) return { priority: 2, dueDate: isoDate(new Date(date.getTime() - 90 * DAY)) };
    if (days < 365) return { priority: 3, dueDate: isoDate(new Date(date.getTime() - 180 * DAY)) };
    return { priority: 4, dueDate: isoDate(new Date(today.getTime() + 365 * DAY)) };
  }
  return { priority: item.impact === 'breaking' ? 2 : 4, dueDate: null };
}

function slug(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

/** Version items the README itself already states: deprecated, sunset, or an upgrade is due. */
function readmeVersionItems(integration) {
  return integration.versions
    .map((v) => {
      const deprecated = v.status === 'Deprecated' || v.status === 'Sunset';
      if (!v.upgradeNeeded && !deprecated) return null;
      const move = v.upgradeNeeded && v.latest && v.latest !== v.current;
      const label = `${v.api ? `${v.api}: ` : ''}${move ? `${v.current} → ${v.latest}` : v.current}`;
      return {
        category: 'version_upgrade',
        impact: deprecated ? 'breaking' : 'version_upgrade',
        title: deprecated ? `${label} (${v.status})` : label,
        summary: `README: status ${v.status}, sunset ${v.sunsetDate || 'none announced'}, upgrade needed ${v.upgradeNeeded ? 'yes' : 'no'}.`,
        announcementUrl: v.sourceUrl,
        effectiveDate: v.sunsetDate,
        targetVersion: v.latest,
        current: v.current,
        api: v.api,
        source: 'readme',
      };
    })
    .filter(Boolean);
}

/**
 * Stable identity of an item across runs, written into the ticket so later runs skip it.
 * A README deprecation keys on the API and the version in use, so a status change isn't filed again.
 * A changelog index URL covers many changes, so the title is added to it.
 */
function itemKey(item, indexUrls) {
  const api = slug(item.api);
  if (item.source === 'readme' && item.impact === 'breaking') {
    return `readme:${api}:${slug(item.current)}`;
  }
  if (item.targetVersion) return `version:${api}:${item.targetVersion.toLowerCase()}`;
  const url = normUrl(item.announcementUrl);
  return indexUrls.has(url) ? `url:${url}#${slug(item.title)}` : `url:${url}`;
}

function itemsFor(record, integration) {
  const agentItems = record.result.findings.map((f) => ({ ...f, source: 'agent' }));
  // A README upgrade the agent also reported is kept once, with the agent's announcement link.
  // README deprecations and sunsets are always kept: they carry a deadline the agent may not repeat.
  const agentTargets = new Set(
    agentItems.map((f) => (f.targetVersion || '').toLowerCase()).filter(Boolean),
  );
  const readmeItems = readmeVersionItems(integration).filter(
    (r) =>
      r.impact !== 'version_upgrade' || !agentTargets.has((r.targetVersion || '').toLowerCase()),
  );
  const indexUrls = new Set(integration.changelogIndexUrls.map(normUrl));
  const seen = new Set();
  return [...agentItems, ...readmeItems]
    .map((i) => ({ ...i, key: itemKey(i, indexUrls) }))
    .filter((i) => !seen.has(i.key) && seen.add(i.key));
}

function plan(outDir, today) {
  const findingsDir = path.join(outDir, 'findings');
  const records = fs
    .readdirSync(findingsDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(findingsDir, f), 'utf8')));
  const dateTag = isoDate(today).split('-').reverse().join('/');

  const parents = [];
  const failed = [];
  for (const record of records) {
    if (record.status !== 'ok') {
      failed.push({ integration: record.integration, status: record.status, error: record.error });
      continue;
    }
    const integration = readIntegration(REPO_ROOT, path.dirname(record.readmePath));
    const items = itemsFor(record, integration);
    if (!items.length) continue;

    const subtickets = TYPE_ORDER.map((type) => {
      const typed = items
        .filter((i) => TYPE_BY_CATEGORY[i.category] === type)
        .map((i) => ({ ...i, ...priorityFor(i, today) }));
      if (!typed.length) return null;
      return {
        title: `${record.title} – ${type}`,
        type,
        priority: typed.map((i) => i.priority).reduce(mostUrgent),
        dueDate: typed.map((i) => i.dueDate).reduce(earliest, null),
        labels: type === 'versionUpgrade' ? ['KTLO', 'VersionUpgrade'] : ['KTLO'],
        items: typed,
      };
    }).filter(Boolean);

    parents.push({
      integration: record.integration,
      integrationTitle: record.title,
      readmePath: record.readmePath,
      title: `${record.title} – Integration Audit ${dateTag}`,
      subtickets,
    });
  }
  return { generatedAt: today.toISOString(), parents, failed };
}

function toMarkdown(result) {
  const lines = ['# Linear ticket plan', ''];
  if (!result.parents.length) lines.push('No tickets needed.', '');
  for (const p of result.parents) {
    lines.push(`## ${p.title}`, '');
    for (const s of p.subtickets) {
      const due = s.dueDate ? ` · due ${s.dueDate}` : '';
      lines.push(
        `### ${s.title} · ${PRIORITY_NAMES[s.priority]}${due} · labels: ${s.labels.join(', ')}`,
        '',
        ...s.items.map(itemMarkdown),
        readmeLine(p.readmePath),
        '',
      );
    }
  }
  if (result.failed.length) {
    lines.push('## Integrations not audited', '');
    result.failed.forEach((f) =>
      lines.push(`- ${f.integration}: ${f.status}${f.error ? ` (${f.error.slice(0, 120)})` : ''}`),
    );
  }
  return `${lines.join('\n')}\n`;
}

function main() {
  const outDir = outDirFromArgs(process.argv);
  const result = plan(outDir, new Date(`${isoDate(new Date())}T00:00:00Z`));
  fs.writeFileSync(path.join(outDir, 'plan.json'), `${JSON.stringify(result, null, 2)}\n`);
  const md = toMarkdown(result);
  fs.writeFileSync(path.join(outDir, 'plan.md'), md);
  process.stdout.write(md);
}

if (require.main === module) main();

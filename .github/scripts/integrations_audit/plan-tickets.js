#!/usr/bin/env node
// Turns audit findings into a Linear ticket plan: one parent per integration, one subticket per change type.
// Prints the plan and writes plan.json / plan.md; never calls Linear (create-tickets.js applies it).
// Usage: node plan-tickets.js [--out audit-out]
const fs = require('fs');
const path = require('path');
const { readIntegration } = require('./readme');

const REPO_ROOT = path.resolve(__dirname, '../../..');
const DAY = 86400000;

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
const TYPE_ORDER = ['versionUpgrade', 'authFeature', 'mappingFeature', 'other'];
const PRIORITY_NAMES = { 1: 'Urgent', 2: 'High', 3: 'Medium', 4: 'Low' };

/** A YYYY-MM date counts from the first of the month, the earliest it could take effect. */
function parseDate(value) {
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(value || '');
  return m ? new Date(Date.UTC(+m[1], +m[2] - 1, m[3] ? +m[3] : 1)) : null;
}

function isoDate(d) {
  return d.toISOString().slice(0, 10);
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

function stripLinks(value) {
  return (value || '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/`/g, '');
}

function firstLink(value) {
  const m = /\((https?:\/\/[^)\s]+)\)/.exec(value || '');
  return m ? m[1] : null;
}

/** The group for the same API in another subsection; a single unnamed group applies to every API. */
function matchGroup(groups, group, i) {
  const byName = group.api && groups.find((g) => g.api === group.api);
  return (byName || (groups.length === 1 ? groups[0] : groups[i]) || {}).fields || {};
}

function versionTitle(api, current, target, status, upgrade) {
  const move = upgrade && target && target !== current ? `${current} → ${target}` : current;
  return `${api}${move}${/^(Deprecated|Sunset)/.test(status) ? ` (${status})` : ''}`;
}

/** Version items the README itself already states (deprecated, sunset or an upgrade is due). */
function readmeVersionItems(integration) {
  const current = integration.versions['Current Version'];
  const deprecation = integration.versions['Version Deprecation'];
  const latest = integration.versions['Latest Available Version'];
  return current
    .map((group, i) => {
      const dep = matchGroup(deprecation, group, i);
      const lat = matchGroup(latest, group, i);
      const status = dep.Status || 'Unknown';
      const upgrade = /^Yes/.test(lat['Upgrade needed'] || '');
      if (!upgrade && !/^(Deprecated|Sunset)/.test(status)) return null;
      const api = group.api ? `${stripLinks(group.api)}: ` : '';
      const sunset = parseDate(dep['Sunset date']) ? dep['Sunset date'].split(' ')[0] : null;
      return {
        category: 'version_upgrade',
        impact: /^(Deprecated|Sunset)/.test(status) ? 'breaking' : 'version_upgrade',
        title: versionTitle(
          api,
          stripLinks(group.fields.Version),
          stripLinks(lat.Version || ''),
          status,
          upgrade,
        ),
        summary: `README: status ${status}, sunset ${dep['Sunset date'] || 'unknown'}, upgrade needed ${lat['Upgrade needed'] || 'unknown'}.`,
        announcementUrl: firstLink(dep.Source) || firstLink(lat.Source),
        effectiveDate: sunset,
        targetVersion: stripLinks(lat.Version || '') || null,
        api: group.api ? stripLinks(group.api) : null,
        source: 'readme',
      };
    })
    .filter(Boolean);
}

function slug(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

/**
 * Stable identity of an item across runs, written into the ticket so later runs can skip it.
 * A changelog index URL covers many changes, so the title is added to it; a specific announcement URL is enough.
 */
function itemKey(item, indexUrls) {
  const api = slug(item.api);
  if (item.source === 'readme' && item.impact === 'breaking') {
    return `readme:${api}:${slug(item.title)}`;
  }
  if (item.targetVersion) return `version:${api}:${item.targetVersion.toLowerCase()}`;
  const url = (item.announcementUrl || '').toLowerCase().replace(/\/$/, '');
  return indexUrls.has(url) ? `url:${url}#${slug(item.title)}` : `url:${url}`;
}

function dedupe(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.key)) return false;
    seen.add(item.key);
    return true;
  });
}

function plan(outDir, today) {
  const findingsDir = path.join(outDir, 'findings');
  const records = fs
    .readdirSync(findingsDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(findingsDir, f), 'utf8')));
  const dateTag = today.toISOString().slice(0, 10).split('-').reverse().join('/');

  const parents = [];
  const failed = [];
  for (const record of records) {
    if (record.status !== 'ok') {
      failed.push({ integration: record.integration, status: record.status, error: record.error });
      continue;
    }
    const integration = readIntegration(REPO_ROOT, path.dirname(record.readmePath));
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
    const indexUrls = new Set(
      Object.values(integration.changelog)
        .flatMap((c) => c.links)
        .map((l) => l.url.toLowerCase().replace(/\/$/, '')),
    );
    const items = dedupe(
      [...agentItems, ...readmeItems].map((i) => ({ ...i, key: itemKey(i, indexUrls) })),
    );
    if (!items.length) continue;

    const subtickets = TYPE_ORDER.map((type) => {
      const typed = items
        .filter((i) => TYPE_BY_CATEGORY[i.category] === type)
        .map((i) => ({ ...i, ...priorityFor(i, today) }));
      if (!typed.length) return null;
      const top = typed.reduce((a, b) => (b.priority < a.priority ? b : a));
      const dueDates = typed
        .map((i) => i.dueDate)
        .filter(Boolean)
        .sort();
      return {
        title: `${record.title} – ${type}`,
        type,
        priority: top.priority,
        dueDate: dueDates[0] || null,
        labels: type === 'versionUpgrade' ? ['KTLO', 'VersionUpgrade'] : ['KTLO'],
        items: typed,
      };
    }).filter(Boolean);

    parents.push({
      integration: record.integration,
      integrationTitle: record.title,
      readmePath: record.readmePath,
      title: `${record.title} – Integration Audit ${dateTag}`,
      labels: ['KTLO'],
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
      lines.push(
        `### ${s.title} · ${PRIORITY_NAMES[s.priority]}${s.dueDate ? ` · due ${s.dueDate}` : ''} · labels: ${s.labels.join(', ')}`,
        '',
      );
      for (const i of s.items) {
        const when = i.effectiveDate ? ` (effective ${i.effectiveDate})` : '';
        lines.push(`- [ ] **${i.title}**${when} [${i.impact}, ${i.source}]`);
        lines.push(`  ${i.summary}`);
        if (i.announcementUrl) lines.push(`  Source: ${i.announcementUrl}`);
      }
      lines.push('- [ ] Update the README (Version Information, Configuration or mappings)', '');
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
  const outArg = process.argv.indexOf('--out');
  const outDir = path.resolve(REPO_ROOT, outArg > -1 ? process.argv[outArg + 1] : 'audit-out');
  const result = plan(outDir, new Date(`${isoDate(new Date())}T00:00:00Z`));
  fs.writeFileSync(path.join(outDir, 'plan.json'), `${JSON.stringify(result, null, 2)}\n`);
  const md = toMarkdown(result);
  fs.writeFileSync(path.join(outDir, 'plan.md'), md);
  process.stdout.write(md);
}

if (require.main === module) main();

module.exports = { plan, priorityFor, readmeVersionItems, itemKey, toMarkdown, TYPE_ORDER };

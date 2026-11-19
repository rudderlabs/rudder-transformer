#!/usr/bin/env node
// Applies plan.json to Linear: one open parent per integration, at most one open subticket per type.
// Items already on any audit ticket of the integration (open, done or canceled) are skipped, by key.
// Usage: LINEAR_API_KEY=… LINEAR_TEAM_ID=… node create-tickets.js [--out audit-out]
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '../../..');
const CLOSED_STATE_TYPES = ['completed', 'canceled'];
const TYPES = ['versionUpgrade', 'authFeature', 'mappingFeature', 'other'];

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isOpen(issue) {
  return !CLOSED_STATE_TYPES.includes(issue.state?.type);
}

function issueNumber(issue) {
  return parseInt(String(issue.identifier || '').replace(/\D+/g, ''), 10) || 0;
}

/** Linear priority: 1 Urgent … 4 Low, 0 none. */
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

function itemMarkdown(item) {
  const when = item.effectiveDate ? ` (effective ${item.effectiveDate})` : '';
  const source = item.announcementUrl ? `Source: ${item.announcementUrl} · ` : '';
  return [
    `- [ ] **${item.title}**${when}: ${item.summary}`,
    `  ${source}Key: \`${item.key}\``,
  ].join('\n');
}

function subticketDescription(parent, sub) {
  return [
    `Changes found by the Integration Audit for **${parent.integrationTitle}**. Check each item against the integration and update the README when done.`,
    '',
    ...sub.items.map(itemMarkdown),
    readmeLine(parent.readmePath),
    '',
  ].join('\n');
}

function parentDescription(parent) {
  return [
    `Integration Audit round for **${parent.integrationTitle}** (\`${parent.readmePath}\`).`,
    '',
    'One subticket per change type (versionUpgrade, authFeature, mappingFeature, other). Later audit runs add new items to the open subticket of the same type. This ticket closes when all its subtickets are done.',
    '',
  ].join('\n');
}

/** Inserts new items above the README checklist line, or at the end. */
function appendItems(description, items, readmePath) {
  const marker = '- [ ] Update the README';
  const block = items.map(itemMarkdown).join('\n');
  const text = description || '';
  const at = text.indexOf(marker);
  if (at === -1) return `${text.trimEnd()}\n${block}\n${readmeLine(readmePath)}\n`;
  return `${text.slice(0, at)}${block}\n${text.slice(at)}`;
}

function knownKeys(issues) {
  const keys = new Set();
  issues.forEach((i) => {
    for (const m of (i.description || '').matchAll(/Key: `([^`]+)`/g)) keys.add(m[1]);
  });
  return keys;
}

async function applyParent(parent, client, ids) {
  const title = escapeRegExp(parent.integrationTitle);
  const parentRe = new RegExp(`^${title} – Integration Audit \\d{2}/\\d{2}/\\d{4}$`);
  const subRe = new RegExp(`^${title} – (${TYPES.join('|')})$`);

  const found = await client.search(`${parent.integrationTitle} – `);
  const parents = found.filter((i) => !i.parentId && parentRe.test(i.title));
  const parentIds = new Set(parents.map((p) => p.id));
  const subs = found.filter((i) => parentIds.has(i.parentId) && subRe.test(i.title));
  const seen = knownKeys([...parents, ...subs]);

  const pending = parent.subtickets
    .map((s) => ({ ...s, items: s.items.filter((i) => !seen.has(i.key)) }))
    .filter((s) => s.items.length);
  const report = { integration: parent.integration, created: [], updated: [], skippedItems: 0 };
  report.skippedItems =
    parent.subtickets.reduce((n, s) => n + s.items.length, 0) -
    pending.reduce((n, s) => n + s.items.length, 0);
  if (!pending.length) return report;

  let openParent = parents.filter(isOpen).sort((a, b) => issueNumber(b) - issueNumber(a))[0];
  if (!openParent) {
    openParent = await client.create({
      title: parent.title,
      description: parentDescription(parent),
      labelIds: [ids.ktlo],
      projectId: ids.project,
    });
    report.created.push({ title: parent.title, url: openParent.url });
  }

  for (const sub of pending) {
    const open = subs.find(
      (i) => i.parentId === openParent.id && isOpen(i) && i.title === sub.title,
    );
    const labelIds = sub.type === 'versionUpgrade' ? [ids.ktlo, ids.versionUpgrade] : [ids.ktlo];
    if (open) {
      await client.update(open.id, {
        description: appendItems(open.description, sub.items, parent.readmePath),
        priority: mostUrgent(open.priority, sub.priority),
        dueDate: earliest(open.dueDate, sub.dueDate),
      });
      await client.comment(
        open.id,
        [
          `Integration Audit added ${sub.items.length} item(s):`,
          ...sub.items.map(
            (i) => `- ${i.title}${i.announcementUrl ? ` (${i.announcementUrl})` : ''}`,
          ),
        ].join('\n'),
      );
      report.updated.push({ title: sub.title, url: open.url, added: sub.items.length });
    } else {
      const created = await client.create({
        title: sub.title,
        description: subticketDescription(parent, sub),
        parentId: openParent.id,
        priority: sub.priority,
        dueDate: sub.dueDate,
        labelIds,
        projectId: ids.project,
      });
      report.created.push({ title: sub.title, url: created.url, items: sub.items.length });
    }
  }
  return report;
}

/** Applies every parent; one integration failing doesn't stop the others. */
async function applyPlan(plan, client, ids) {
  const reports = [];
  const failures = [];
  for (const parent of plan.parents) {
    try {
      reports.push(await applyParent(parent, client, ids));
    } catch (error) {
      failures.push({ integration: parent.integration, error: error.message });
    }
  }
  return { reports, failures };
}

function toMarkdown({ reports, failures }) {
  const lines = ['# Linear tickets', ''];
  const changed = reports.filter((r) => r.created.length || r.updated.length);
  if (!changed.length && !failures.length) lines.push('No new tickets or items.', '');
  for (const r of changed) {
    lines.push(`## ${r.integration}`, '');
    r.created.forEach((c) => lines.push(`- Created [${c.title}](${c.url})`));
    r.updated.forEach((u) => lines.push(`- Added ${u.added} item(s) to [${u.title}](${u.url})`));
    lines.push('');
  }
  const skipped = reports.reduce((n, r) => n + r.skippedItems, 0);
  if (skipped)
    lines.push(`${skipped} item(s) were already on an audit ticket and were skipped.`, '');
  if (failures.length) {
    lines.push('## Failed', '');
    failures.forEach((f) => lines.push(`- ${f.integration}: ${f.error}`));
  }
  return `${lines.join('\n')}\n`;
}

function linearClient() {
  const api = require('../linearApi');
  return {
    client: {
      search: (titleContains) =>
        api.searchIssues({ titleContains, limit: 250, throwOnError: true }),
      create: (fields) => api.createIssue(fields),
      update: (id, fields) => api.updateIssue(id, fields),
      comment: (id, body) => api.createComment(id, body),
    },
    ids: {
      ktlo: api.KTLO_LABEL_ID,
      versionUpgrade: api.VERSION_UPGRADE_LABEL_ID,
      project: api.MAINTENANCE_PROJECT_ID,
    },
  };
}

async function main() {
  const outArg = process.argv.indexOf('--out');
  const outDir = path.resolve(REPO_ROOT, outArg > -1 ? process.argv[outArg + 1] : 'audit-out');
  const plan = JSON.parse(fs.readFileSync(path.join(outDir, 'plan.json'), 'utf8'));
  const { client, ids } = linearClient();
  const result = await applyPlan(plan, client, ids);
  const md = toMarkdown(result);
  fs.writeFileSync(path.join(outDir, 'tickets.md'), md);
  process.stdout.write(md);
  if (result.failures.length) process.exit(1);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { applyPlan, appendItems, knownKeys, toMarkdown };

#!/usr/bin/env node
// Applies plan.json to Linear: one open parent per integration, at most one open subticket per type.
// Items already on any audit ticket of the integration (open, done or canceled) are skipped, by key.
// Usage: LINEAR_API_KEY=… LINEAR_TEAM_ID=… node create-tickets.js [--out audit-out]
const fs = require('fs');
const path = require('path');
const {
  TYPE_ORDER,
  escapeRegExp,
  outDirFromArgs,
  pool,
  mostUrgent,
  earliest,
  readmeLine,
  itemMarkdown,
} = require('./common');

const CLOSED_STATE_TYPES = ['completed', 'canceled'];
const CONCURRENCY = 4;

function isOpen(issue) {
  return !CLOSED_STATE_TYPES.includes(issue.state?.type);
}

function issueNumber(issue) {
  return parseInt(String(issue.identifier || '').replace(/\D+/g, ''), 10) || 0;
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
    `One subticket per change type (${TYPE_ORDER.join(', ')}). Later audit runs add new items to the open subticket of the same type. This ticket closes when all its subtickets are done.`,
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
  return new Set(
    issues.flatMap((i) => [...(i.description || '').matchAll(/Key: `([^`]+)`/g)].map((m) => m[1])),
  );
}

async function applyParent(parent, client, ids) {
  const title = escapeRegExp(parent.integrationTitle);
  const parentRe = new RegExp(`^${title} – Integration Audit \\d{2}/\\d{2}/\\d{4}$`);
  const subRe = new RegExp(`^${title} – (${TYPE_ORDER.join('|')})$`);

  const found = await client.search(`${parent.integrationTitle} – `);
  const parents = found.filter((i) => !i.parentId && parentRe.test(i.title));
  const parentIds = new Set(parents.map((p) => p.id));
  const subs = found.filter((i) => parentIds.has(i.parentId) && subRe.test(i.title));
  const seen = knownKeys([...parents, ...subs]);

  const pending = parent.subtickets
    .map((s) => ({ ...s, items: s.items.filter((i) => !seen.has(i.key)) }))
    .filter((s) => s.items.length);
  const countItems = (subtickets) => subtickets.reduce((n, s) => n + s.items.length, 0);
  const report = {
    integration: parent.integration,
    created: [],
    updated: [],
    skippedItems: countItems(parent.subtickets) - countItems(pending),
  };
  if (!pending.length) return report;

  let openParent = parents.filter(isOpen).sort((a, b) => issueNumber(b) - issueNumber(a))[0];
  if (!openParent) {
    openParent = await client.create({
      title: parent.title,
      description: parentDescription(parent),
      labelIds: [ids.labels.KTLO],
      projectId: ids.project,
    });
    report.created.push({ title: parent.title, url: openParent.url });
  }

  for (const sub of pending) {
    const open = subs.find(
      (i) => i.parentId === openParent.id && isOpen(i) && i.title === sub.title,
    );
    if (open) {
      await Promise.all([
        client.update(open.id, {
          description: appendItems(open.description, sub.items, parent.readmePath),
          priority: mostUrgent(open.priority, sub.priority),
          dueDate: earliest(open.dueDate, sub.dueDate),
        }),
        client.comment(
          open.id,
          [
            `Integration Audit added ${sub.items.length} item(s):`,
            ...sub.items.map(
              (i) => `- ${i.title}${i.announcementUrl ? ` (${i.announcementUrl})` : ''}`,
            ),
          ].join('\n'),
        ),
      ]);
      report.updated.push({ title: sub.title, url: open.url, added: sub.items.length });
    } else {
      const created = await client.create({
        title: sub.title,
        description: subticketDescription(parent, sub),
        parentId: openParent.id,
        priority: sub.priority,
        dueDate: sub.dueDate,
        labelIds: sub.labels.map((l) => ids.labels[l]),
        projectId: ids.project,
      });
      report.created.push({ title: sub.title, url: created.url, items: sub.items.length });
    }
  }
  return report;
}

/** Applies every parent, a few integrations at a time; one integration failing doesn't stop the others. */
async function applyPlan(plan, client, ids) {
  const results = await pool(plan.parents, CONCURRENCY, async (parent) => {
    try {
      return { report: await applyParent(parent, client, ids) };
    } catch (error) {
      return { failure: { integration: parent.integration, error: error.message } };
    }
  });
  return {
    reports: results.filter((r) => r.report).map((r) => r.report),
    failures: results.filter((r) => r.failure).map((r) => r.failure),
  };
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
      search: api.findIssuesByTitle,
      create: api.createIssue,
      update: api.updateIssue,
      comment: api.createComment,
    },
    ids: {
      labels: { KTLO: api.KTLO_LABEL_ID, VersionUpgrade: api.VERSION_UPGRADE_LABEL_ID },
      project: api.MAINTENANCE_PROJECT_ID,
    },
  };
}

async function main() {
  const outDir = outDirFromArgs(process.argv);
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

module.exports = { applyPlan };

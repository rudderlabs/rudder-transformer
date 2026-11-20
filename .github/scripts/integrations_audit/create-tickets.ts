// Applies plan.json to Linear: one open parent per integration, at most one open subticket per type.
// Items already on any audit ticket of the integration (open, done or canceled) are skipped, by key.
// Usage: LINEAR_API_KEY=… LINEAR_TEAM_ID=… tsx create-tickets.ts [--out audit-out]
import fs from 'fs';
import path from 'path';
import {
  TYPE_ORDER,
  escapeRegExp,
  outDirFromArgs,
  pool,
  mostUrgent,
  earliest,
  readmeLine,
  itemMarkdown,
  LabelKey,
  Plan,
  PlanItem,
  PlannedParent,
  PlannedSubticket,
  TicketCounts,
} from './common';

const CLOSED_STATE_TYPES = ['completed', 'canceled'];
const CONCURRENCY = 4;

export interface LinearIssue {
  id: string;
  identifier: string;
  title: string;
  url: string;
  description?: string | null;
  priority?: number;
  dueDate?: string | null;
  state?: { type?: string } | null;
  parentId?: string | null;
  archivedAt?: string | null;
}

export interface IssueFields {
  title?: string;
  description?: string;
  parentId?: string;
  priority?: number;
  dueDate?: string | null;
  labelIds?: string[];
  projectId?: string;
}

/** The Linear operations the ticket step needs; production uses linearApi.js, tests a fake. */
export interface LinearClient {
  search(title: string): Promise<LinearIssue[]>;
  create(fields: IssueFields): Promise<Pick<LinearIssue, 'id' | 'url'>>;
  update(id: string, fields: IssueFields): Promise<unknown>;
  comment(id: string, body: string): Promise<unknown>;
}

export interface LinearIds {
  labels: Record<LabelKey, string>;
  project: string;
}

interface ParentReport {
  integration: string;
  integrationTitle: string;
  /** The open parent the new items went under; unset when nothing was new. */
  parentUrl?: string;
  created: { title: string; url: string; items?: number }[];
  updated: { title: string; url: string; added: number }[];
  skippedItems: number;
}

interface Failure {
  integration: string;
  error: string;
}

/** Archived issues (Linear archives closed ones automatically) still count for dedupe but get no new items. */
function isOpen(issue: LinearIssue): boolean {
  return !issue.archivedAt && !CLOSED_STATE_TYPES.includes(issue.state?.type || '');
}

function issueNumber(issue: LinearIssue): number {
  return parseInt(String(issue.identifier || '').replace(/\D+/g, ''), 10) || 0;
}

function subticketDescription(parent: PlannedParent, sub: PlannedSubticket): string {
  return [
    `Changes found by the Integration Audit for **${parent.integrationTitle}**. Check each item against the integration and update the README when done.`,
    '',
    ...sub.items.map(itemMarkdown),
    readmeLine(parent.readmePath),
    '',
  ].join('\n');
}

function parentDescription(parent: PlannedParent): string {
  return [
    `Integration Audit round for **${parent.integrationTitle}** (\`${parent.readmePath}\`).`,
    '',
    `One subticket per change type (${TYPE_ORDER.join(', ')}). Later audit runs add new items to the open subticket of the same type. This ticket closes when all its subtickets are done.`,
    '',
  ].join('\n');
}

/** Inserts new items above the README checklist line, or at the end. */
function appendItems(
  description: string | null | undefined,
  items: PlanItem[],
  readmePath: string,
): string {
  const marker = '- [ ] Update the README';
  const block = items.map(itemMarkdown).join('\n');
  const text = description || '';
  const at = text.indexOf(marker);
  if (at === -1) return `${text.trimEnd()}\n${block}\n${readmeLine(readmePath)}\n`;
  return `${text.slice(0, at)}${block}\n${text.slice(at)}`;
}

/** An integration's audit parents and their subtickets, in any state. */
export async function findAuditIssues(
  client: Pick<LinearClient, 'search'>,
  integrationTitle: string,
): Promise<{ parents: LinearIssue[]; subs: LinearIssue[] }> {
  const title = escapeRegExp(integrationTitle);
  const parentRe = new RegExp(`^${title} – Integration Audit \\d{2}/\\d{2}/\\d{4}$`);
  const subRe = new RegExp(`^${title} – (${TYPE_ORDER.join('|')})$`);
  const found = await client.search(`${integrationTitle} – `);
  const parents = found.filter((i) => !i.parentId && parentRe.test(i.title));
  const parentIds = new Set(parents.map((p) => p.id));
  const subs = found.filter((i) => i.parentId && parentIds.has(i.parentId) && subRe.test(i.title));
  return { parents, subs };
}

async function applyParent(
  parent: PlannedParent,
  client: LinearClient,
  ids: LinearIds,
): Promise<ParentReport> {
  const { parents, subs } = await findAuditIssues(client, parent.integrationTitle);
  // Any `Key:` line counts, even on an item someone has reworded by hand.
  const seen = new Set(
    [...parents, ...subs].flatMap((i) =>
      [...(i.description || '').matchAll(/Key: `([^`]+)`/g)].map((m) => m[1]),
    ),
  );

  const pending = parent.subtickets
    .map((s) => ({ ...s, items: s.items.filter((i) => !seen.has(i.key)) }))
    .filter((s) => s.items.length);
  const countItems = (subtickets: PlannedSubticket[]) =>
    subtickets.reduce((n, s) => n + s.items.length, 0);
  const report: ParentReport = {
    integration: parent.integration,
    integrationTitle: parent.integrationTitle,
    created: [],
    updated: [],
    skippedItems: countItems(parent.subtickets) - countItems(pending),
  };
  if (!pending.length) return report;

  let openParent: Pick<LinearIssue, 'id' | 'url'> | undefined = parents
    .filter(isOpen)
    .sort((a, b) => issueNumber(b) - issueNumber(a))[0];
  if (!openParent) {
    openParent = await client.create({
      title: parent.title,
      description: parentDescription(parent),
      labelIds: [ids.labels.KTLO],
      projectId: ids.project,
    });
    report.created.push({ title: parent.title, url: openParent.url });
  }
  const parentId = openParent.id;
  report.parentUrl = openParent.url;

  for (const sub of pending) {
    const open = subs.find((i) => i.parentId === parentId && isOpen(i) && i.title === sub.title);
    if (open) {
      await Promise.all([
        client.update(open.id, {
          description: appendItems(open.description, sub.items, parent.readmePath),
          priority: mostUrgent(open.priority ?? 0, sub.priority),
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
        parentId,
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
export async function applyPlan(
  plan: Pick<Plan, 'parents'>,
  client: LinearClient,
  ids: LinearIds,
): Promise<{ reports: ParentReport[]; failures: Failure[] }> {
  const results = await pool(plan.parents, CONCURRENCY, async (parent) => {
    try {
      return { report: await applyParent(parent, client, ids) };
    } catch (error) {
      return { failure: { integration: parent.integration, error: (error as Error).message } };
    }
  });
  return {
    reports: results.flatMap((r) => (r.report ? [r.report] : [])),
    failures: results.flatMap((r) => (r.failure ? [r.failure] : [])),
  };
}

function toMarkdown({
  reports,
  failures,
}: {
  reports: ParentReport[];
  failures: Failure[];
}): string {
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

/** linearApi.js reads its credentials when loaded, so it is required only when tickets are applied. */
export function linearClient(): { client: LinearClient; ids: LinearIds } {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
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

async function main(): Promise<void> {
  const outDir = outDirFromArgs(process.argv);
  const planJson: Plan = JSON.parse(fs.readFileSync(path.join(outDir, 'plan.json'), 'utf8'));
  const { client, ids } = linearClient();
  const result = await applyPlan(planJson, client, ids);
  const md = toMarkdown(result);
  fs.writeFileSync(path.join(outDir, 'tickets.md'), md);
  const counts: TicketCounts = {
    created: result.reports.reduce((n, r) => n + r.created.length, 0),
    updated: result.reports.reduce((n, r) => n + r.updated.length, 0),
    skippedItems: result.reports.reduce((n, r) => n + r.skippedItems, 0),
    failed: result.failures.map((f) => f.integration),
    changed: result.reports.flatMap((r) =>
      r.parentUrl ? [{ title: r.integrationTitle, url: r.parentUrl }] : [],
    ),
  };
  fs.writeFileSync(path.join(outDir, 'tickets.json'), `${JSON.stringify(counts, null, 2)}\n`);
  process.stdout.write(md);
  if (result.failures.length) process.exit(1);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

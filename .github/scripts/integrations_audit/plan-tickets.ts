// Turns audit findings into a Linear ticket plan: one parent per integration, one subticket per change type.
// Writes plan.json / plan.md and never calls Linear (create-tickets.ts applies the plan).
// Usage: tsx plan-tickets.ts [--out audit-out]
import fs from 'fs';
import path from 'path';
import { discover, readIntegration, Integration } from './readme';
import { cleanFindings, validateFindings } from './run';
import {
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
  readFiledItems,
  AuditRecord,
  FiledItem,
  RunStatus,
  RUN_STATUSES,
  Plan,
  PlanItem,
  PlannedParent,
  PlannedSubticket,
} from './common';

const DAY = 86400000;
const PRIORITY_NAMES: Record<number, string> = { 1: 'Urgent', 2: 'High', 3: 'Medium', 4: 'Low' };

type UnkeyedItem = Omit<PlanItem, 'key' | 'priority' | 'dueDate'> & { sameAs?: string | null };

/** A YYYY-MM date counts from the first of the month, the earliest it could take effect. */
function parseDate(value: string | null | undefined): Date | null {
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(value || '');
  return m ? new Date(Date.UTC(+m[1], +m[2] - 1, m[3] ? +m[3] : 1)) : null;
}

/** Same thresholds as the version audit: days until the change takes effect. */
export function priorityFor(
  item: Pick<PlanItem, 'impact' | 'effectiveDate'>,
  today: Date,
): { priority: number; dueDate: string | null } {
  const date = parseDate(item.effectiveDate);
  // A release date is not a deadline: only a future date makes a plain version upgrade urgent.
  const isDeadline = item.impact !== 'version_upgrade' || (date && date > today);
  if (date && isDeadline) {
    const days = Math.floor((date.getTime() - today.getTime()) / DAY);
    if (days < 90) return { priority: 1, dueDate: isoDate(new Date(today.getTime() + DAY)) };
    if (days < 180) return { priority: 2, dueDate: isoDate(new Date(date.getTime() - 90 * DAY)) };
    if (days < 365) return { priority: 3, dueDate: isoDate(new Date(date.getTime() - 180 * DAY)) };
    return { priority: 4, dueDate: isoDate(new Date(today.getTime() + 365 * DAY)) };
  }
  return { priority: item.impact === 'breaking' ? 2 : 4, dueDate: null };
}

function slug(text: string | null | undefined): string {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

/** Version items the README itself already states: deprecated, sunset, or an upgrade is due. */
function readmeVersionItems(integration: Integration): UnkeyedItem[] {
  return integration.versions.flatMap((v): UnkeyedItem[] => {
    const deprecated = v.status === 'Deprecated' || v.status === 'Sunset';
    if (!v.upgradeNeeded && !deprecated) return [];
    const move = v.upgradeNeeded && v.latest && v.latest !== v.current;
    const label = `${v.api ? `${v.api}: ` : ''}${move ? `${v.current} → ${v.latest}` : v.current}`;
    return [
      {
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
      },
    ];
  });
}

/**
 * Stable identity of an item across runs, written into the ticket so later runs skip it.
 * A README deprecation keys on the API and the version in use, so a status change isn't filed again.
 * A changelog index URL covers many changes, so the title is added to it.
 */
export function itemKey(item: UnkeyedItem, indexUrls: Set<string>): string {
  const api = slug(item.api);
  if (item.source === 'readme' && item.impact === 'breaking') {
    return `readme:${api}:${slug(item.current)}`;
  }
  if (item.targetVersion) return `version:${api}:${item.targetVersion.toLowerCase()}`;
  const url = normUrl(item.announcementUrl);
  return indexUrls.has(url) ? `url:${url}#${slug(item.title)}` : `url:${url}`;
}

/**
 * Key of a new change. One whose link is already used (by a filed item or another finding) gets
 * the category, then the title, added to its key: one announcement can carry several changes.
 */
function newChangeKey(
  item: UnkeyedItem,
  indexUrls: Set<string>,
  taken: (key: string) => boolean,
): string {
  const key = itemKey(item, indexUrls);
  if (!key.startsWith('url:')) return key;
  const options = [key, `${key}#${item.category}`, `${key}#${item.category}#${slug(item.title)}`];
  return options.find((k) => !taken(k)) || options[options.length - 1];
}

export function itemsFor(
  record: AuditRecord,
  integration: Integration,
  filed: FiledItem[] = [],
): (UnkeyedItem & { key: string })[] {
  const agentItems: UnkeyedItem[] = (record.result?.findings || []).map((f) => ({
    ...f,
    source: 'agent',
  }));
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
  const filedKeys = new Set(filed.map((f) => f.key));
  const used = new Set<string>();
  const taken = (key: string) => filedKeys.has(key) || used.has(key);
  const keyed = [
    ...agentItems.map((i) => {
      // A finding the agent matched to a filed item keeps that item's key, so it isn't filed again.
      const key =
        i.sameAs && filedKeys.has(i.sameAs) ? i.sameAs : newChangeKey(i, indexUrls, taken);
      used.add(key);
      return { ...i, key };
    }),
    ...readmeItems.map((i) => ({ ...i, key: itemKey(i, indexUrls) })),
  ];
  const seen = new Set<string>();
  return keyed.filter((i) => !seen.has(i.key) && Boolean(seen.add(i.key)));
}

export interface LoadedRecord {
  name: string;
  status: RunStatus;
  error?: string;
  record?: AuditRecord;
  integration?: Integration;
}

/**
 * Reads findings/*.json. They come from the agent's job, so they are untrusted data: only files named
 * after an integration of this checkout count, its README and title come from the checkout, and the
 * findings are validated again.
 */
export function loadRecords(outDir: string): LoadedRecord[] {
  const dirs = new Map(discover(REPO_ROOT).map((d) => [path.basename(d), d]));
  const findingsDir = path.join(outDir, 'findings');
  const files = fs.existsSync(findingsDir) ? fs.readdirSync(findingsDir) : [];
  return files.flatMap((file): LoadedRecord[] => {
    const name = file.replace(/\.json$/, '');
    const dir = dirs.get(name);
    if (!file.endsWith('.json') || !dir) return [];
    let record: AuditRecord;
    try {
      record = JSON.parse(fs.readFileSync(path.join(findingsDir, file), 'utf8'));
    } catch {
      return [{ name, status: 'invalid_output', error: 'unreadable findings file' }];
    }
    const status = RUN_STATUSES.includes(record.status) ? record.status : 'invalid_output';
    if (status !== 'ok') return [{ name, status, error: String(record.error || '').slice(0, 500) }];
    const result = record.result && cleanFindings(record.result);
    const errors =
      record.integration !== name || !result
        ? ['findings belong to another integration']
        : validateFindings(result, name);
    if (errors.length) return [{ name, status: 'invalid_output', error: errors.join('; ') }];
    return [
      { name, status, record: { ...record, result }, integration: readIntegration(REPO_ROOT, dir) },
    ];
  });
}

export function plan(outDir: string, today: Date): Plan {
  const dateTag = isoDate(today).split('-').reverse().join('/');
  const parents: PlannedParent[] = [];
  const failed: Plan['failed'] = [];
  for (const loaded of loadRecords(outDir)) {
    const { record, integration } = loaded;
    if (!record || !integration) {
      failed.push({ integration: loaded.name, status: loaded.status, error: loaded.error });
      continue;
    }
    const items = itemsFor(record, integration, readFiledItems(outDir, integration.name));
    if (!items.length) continue;

    const subtickets = TYPE_ORDER.flatMap((type): PlannedSubticket[] => {
      const typed: PlanItem[] = items
        .filter((i) => TYPE_BY_CATEGORY[i.category] === type)
        .map((i) => ({ ...i, ...priorityFor(i, today) }));
      if (!typed.length) return [];
      return [
        {
          title: `${integration.title} – ${type}`,
          type,
          priority: typed.map((i) => i.priority).reduce(mostUrgent),
          dueDate: typed.map((i) => i.dueDate).reduce<string | null>(earliest, null),
          labels: type === 'versionUpgrade' ? ['KTLO', 'VersionUpgrade'] : ['KTLO'],
          items: typed,
        },
      ];
    });

    parents.push({
      integration: integration.name,
      integrationTitle: integration.title,
      readmePath: integration.readmePath,
      title: `${integration.title} – Integration Audit ${dateTag}`,
      subtickets,
    });
  }
  return { generatedAt: today.toISOString(), parents, failed };
}

export function toMarkdown(result: Plan): string {
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

function main(): void {
  const outDir = outDirFromArgs(process.argv);
  const result = plan(outDir, new Date(`${isoDate(new Date())}T00:00:00Z`));
  fs.writeFileSync(path.join(outDir, 'plan.json'), `${JSON.stringify(result, null, 2)}\n`);
  const md = toMarkdown(result);
  fs.writeFileSync(path.join(outDir, 'plan.md'), md);
  process.stdout.write(md);
}

if (require.main === module) main();

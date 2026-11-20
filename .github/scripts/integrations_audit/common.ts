// Shared by the audit scripts: the change taxonomy, types, small helpers and the ticket item format.
import fs from 'fs';
import path from 'path';

export const REPO_ROOT = path.resolve(__dirname, '../../..');

/** Change category (from the agent) → Linear subticket type. */
export const TYPE_BY_CATEGORY = {
  version_upgrade: 'versionUpgrade',
  endpoint_lifecycle: 'versionUpgrade',
  auth: 'authFeature',
  request_response_fields: 'mappingFeature',
  new_mapping: 'mappingFeature',
  validation_limits: 'other',
  new_capability: 'other',
  error_handling: 'other',
} as const;
export type Category = keyof typeof TYPE_BY_CATEGORY;
export type SubticketType = (typeof TYPE_BY_CATEGORY)[Category];
export const CATEGORIES = Object.keys(TYPE_BY_CATEGORY) as Category[];
export const TYPE_ORDER: SubticketType[] = [
  'versionUpgrade',
  'authFeature',
  'mappingFeature',
  'other',
];
export const IMPACTS = ['breaking', 'version_upgrade', 'opportunity'] as const;
export type Impact = (typeof IMPACTS)[number];

/** One change reported by the agent (the JSON block the prompt asks for). */
export interface Finding {
  category: Category;
  impact: Impact;
  title: string;
  summary: string;
  announcementUrl: string;
  announcedOn?: string | null;
  effectiveDate?: string | null;
  targetVersion?: string | null;
  affects?: string;
  /** Key of an already filed item that describes the same change, or null for a new change. */
  sameAs?: string | null;
}

export interface AgentResult {
  integration: string;
  sourcesChecked: string[];
  unreachable: string[];
  latestVersionSeen: string | null;
  skipped: number;
  findings: Finding[];
}

export const RUN_STATUSES = ['ok', 'timeout', 'agent_error', 'invalid_output'] as const;
export type RunStatus = (typeof RUN_STATUSES)[number];

/** What run.ts writes per integration to findings/<name>.json. */
export interface AuditRecord {
  integration: string;
  title: string;
  readmePath: string;
  durationMs: number;
  promptChars: number;
  status: RunStatus;
  apiMs?: number | null;
  error?: string;
  tail?: string;
  result?: AgentResult;
}

/** A planned checklist item: an agent finding or a version fact stated by the README. */
export interface PlanItem {
  category: Category;
  impact: Impact;
  title: string;
  summary: string;
  announcementUrl: string | null;
  effectiveDate?: string | null;
  targetVersion?: string | null;
  source: 'agent' | 'readme';
  api?: string | null;
  current?: string;
  key: string;
  priority: number;
  dueDate: string | null;
}

/** An item already on an integration's audit tickets, as read back from Linear. */
export interface FiledItem {
  key: string;
  title: string;
}

export function filedItemsPath(outDir: string, integration: string): string {
  return path.join(outDir, 'filed', `${integration}.json`);
}

/** A JSON file's content, or `fallback` when it is missing or unreadable. */
export function readJson<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

/** Filed items written by filed-items.ts; none when that step didn't run (tickets off). */
export function readFiledItems(outDir: string, integration: string): FiledItem[] {
  return readJson<FiledItem[]>(filedItemsPath(outDir, integration), []);
}

/** What create-tickets.ts writes to tickets.json, for the Slack message. */
export interface TicketCounts {
  created: number;
  updated: number;
  skippedItems: number;
  failed: string[];
  /** Integrations that got new items, with their parent ticket. */
  changed: { title: string; url: string }[];
}

export type LabelKey = 'KTLO' | 'VersionUpgrade';

export interface PlannedSubticket {
  title: string;
  type: SubticketType;
  priority: number;
  dueDate: string | null;
  labels: LabelKey[];
  items: PlanItem[];
}

export interface PlannedParent {
  integration: string;
  integrationTitle: string;
  readmePath: string;
  title: string;
  subtickets: PlannedSubticket[];
}

export interface Plan {
  generatedAt: string;
  parents: PlannedParent[];
  failed: { integration: string; status: RunStatus; error?: string }[];
}

export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function normUrl(url: string | null | undefined): string {
  return (url || '').toLowerCase().replace(/\/$/, '');
}

/** `--out <dir>` from argv, resolved against the repo root. */
export function outDirFromArgs(argv: string[], fallback = 'audit-out'): string {
  const i = argv.indexOf('--out');
  return path.resolve(REPO_ROOT, i > -1 ? argv[i + 1] : fallback);
}

/** Runs `worker` over `items`, at most `size` at a time, keeping result order. */
export async function pool<T, R>(
  items: T[],
  size: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
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
export function mostUrgent(a: number, b: number): number {
  const rank = (p: number) => (p >= 1 && p <= 4 ? p : 5);
  return rank(a) <= rank(b) ? a : b;
}

export function earliest(
  a: string | null | undefined,
  b: string | null | undefined,
): string | null {
  return [a, b].filter((d): d is string => Boolean(d)).sort()[0] || null;
}

export function readmeLine(readmePath: string): string {
  return `- [ ] Update the README (\`${readmePath}\`): Version Information, Configuration or mappings`;
}

type ItemForMarkdown = Pick<PlanItem, 'title' | 'summary' | 'key' | 'effectiveDate'> & {
  announcementUrl?: string | null;
};

/** One checklist item as written into tickets (and the plan preview). The Key line lets later runs skip it. */
export function itemMarkdown(item: ItemForMarkdown): string {
  const when = item.effectiveDate ? ` (effective ${item.effectiveDate})` : '';
  const source = item.announcementUrl ? `Source: ${item.announcementUrl} · ` : '';
  return `- [ ] **${item.title}**${when}: ${item.summary}\n  ${source}Key: \`${item.key}\``;
}

/**
 * Items in a ticket description: every `Key:` line, with the title of the item line above it.
 * An item someone reworded by hand keeps its key; its title is then the key itself.
 */
export function parseItems(description: string | null | undefined): FiledItem[] {
  const lines = (description || '').split('\n');
  return lines.flatMap((line, i) => {
    const key = /Key: `([^`]+)`/.exec(line)?.[1];
    if (!key) return [];
    const title = /^- \[[ xX]\] \*\*(.+?)\*\*/.exec(lines[i - 1] || '')?.[1];
    return [{ key, title: title || key }];
  });
}

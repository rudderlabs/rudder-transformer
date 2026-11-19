// Shared by the audit scripts: the change taxonomy, types, small helpers and the ticket item format.
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
}

export interface AgentResult {
  integration: string;
  sourcesChecked: string[];
  unreachable: string[];
  latestVersionSeen: string | null;
  skipped: number;
  findings: Finding[];
}

export type RunStatus = 'ok' | 'timeout' | 'agent_error' | 'invalid_output';

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

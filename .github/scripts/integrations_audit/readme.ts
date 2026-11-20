// Reads the audit sections of integration READMEs (format: .claude/skills/generate-integration-docs/references/audit-sections.md).
import fs from 'fs';
import path from 'path';
import { escapeRegExp } from './common';

const INTEGRATION_ROOTS = [
  'src/v0/destinations',
  'src/v1/destinations',
  'src/cdk/v2/destinations',
  'src/sources',
];

const VERSION_LABELS: Record<string, string[]> = {
  'Current Version': ['Version', 'Where in code'],
  'Version Deprecation': ['Status', 'Sunset date', 'Source'],
  'Latest Available Version': ['Version', 'Released', 'Upgrade needed', 'Source'],
};
const CHANGELOG_LABELS = [
  'Changelog',
  'Deprecations',
  'Versions',
  'Feed',
  'Announcements',
  'Last checked',
];
const VALUE_PATTERNS: Record<string, RegExp> = {
  Status: /^(Supported|Deprecated|Sunset|Unknown)\b/,
  'Sunset date': /^(\d{4}-\d{2}(-\d{2})?|None announced)\b/,
  Released: /^(\d{4}-\d{2}(-\d{2})?|Unknown)\b/,
  'Upgrade needed': /^(Yes|No)\b/,
  'Last checked': /^\d{4}-\d{2}-\d{2}$/,
};

interface Bullet {
  label: string;
  value: string;
}

interface ApiGroup {
  api: string | null;
  fields: Record<string, string>;
}

/** One API's version facts, joined across the three version subsections. */
export interface VersionRecord {
  api: string | null;
  current: string;
  status: string;
  sunsetDate: string | null;
  latest: string | null;
  upgradeNeeded: boolean;
  sourceUrl: string | null;
}

export interface Integration {
  name: string;
  title: string;
  dir: string;
  readmePath: string;
  problems: string[];
  versions: VersionRecord[];
  changelogIndexUrls: string[];
  sections: { versionInformation: string; documentationLinks: string };
  onDemandFiles: string[];
}

/** Body of `heading` at `level`, up to the next heading of the same or higher level. */
function section(text: string, heading: string, level: number): string | null {
  const re = new RegExp(
    `^${'#'.repeat(level)} ${escapeRegExp(heading)}[ \\t]*\\n([\\s\\S]*?)(?=^#{1,${level}} |(?![\\s\\S]))`,
    'm',
  );
  const m = text.match(re);
  return m ? m[1] : null;
}

function bullets(body: string | null): Bullet[] {
  return [...(body || '').matchAll(/^- \*\*([^*]+?):\*\*\s*(.*)$/gm)].map((m) => ({
    label: m[1],
    value: m[2].trim(),
  }));
}

/** Splits bullets into per-API groups; a group starts at `- **API:**`, or is one unnamed group. */
function groupByApi(items: Bullet[]): ApiGroup[] {
  const groups: ApiGroup[] = [];
  for (const item of items) {
    if (item.label === 'API') {
      groups.push({ api: item.value, fields: {} });
      continue;
    }
    if (!groups.length) groups.push({ api: null, fields: {} });
    groups[groups.length - 1].fields[item.label] = item.value;
  }
  return groups;
}

function links(value: string): { title: string; url: string }[] {
  return [...value.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g)].map((m) => ({
    title: m[1],
    url: m[2],
  }));
}

function plain(value: string | undefined): string {
  return (value || '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/`/g, '');
}

function validate(text: string): string[] {
  const problems: string[] = [];
  if ((text.match(/^## Version Information\s*$/gm) || []).length !== 1) {
    problems.push('needs exactly one "## Version Information"');
  }
  const checkValues = (where: string, items: Bullet[]) =>
    items
      .filter((i) => VALUE_PATTERNS[i.label] && !VALUE_PATTERNS[i.label].test(i.value))
      .forEach((i) => problems.push(`${where}: bad ${i.label} "${i.value.slice(0, 40)}"`));

  for (const [sub, required] of Object.entries(VERSION_LABELS)) {
    const body = section(text, sub, 3);
    if (body === null) {
      problems.push(`missing "### ${sub}"`);
      continue;
    }
    const items = bullets(body);
    const names = items.map((i) => i.label);
    required
      .filter((r) => !names.includes(r))
      .forEach((r) => problems.push(`${sub}: missing ${r}`));
    checkValues(sub, items);
  }
  const cr = section(text, 'Changelog References', 3);
  if (cr === null) {
    problems.push('missing "### Changelog References"');
  } else {
    const items = bullets(cr);
    const order = items.map((i) => i.label).filter((l) => CHANGELOG_LABELS.includes(l));
    if (order.join('|') !== CHANGELOG_LABELS.join('|')) {
      problems.push(`Changelog References labels must be ${CHANGELOG_LABELS.join(', ')}`);
    }
    checkValues('Changelog References', items);
  }
  return problems;
}

/** The group for the same API in another subsection; a single unnamed group applies to every API. */
function matchGroup(groups: ApiGroup[], group: ApiGroup, i: number): Record<string, string> {
  const byName = group.api ? groups.find((g) => g.api === group.api) : undefined;
  return (byName || (groups.length === 1 ? groups[0] : groups[i]))?.fields || {};
}

/** One record per API, with the three version subsections joined and values reduced to plain facts. */
function versionRecords(text: string): VersionRecord[] {
  const [current, deprecation, latest] = Object.keys(VERSION_LABELS).map((sub) =>
    groupByApi(bullets(section(text, sub, 3))),
  );
  return current.map((group, i) => {
    const dep = matchGroup(deprecation, group, i);
    const lat = matchGroup(latest, group, i);
    const sunset = /^\d{4}-\d{2}(-\d{2})?/.exec(dep['Sunset date'] || '');
    return {
      api: group.api ? plain(group.api) : null,
      current: plain(group.fields.Version),
      status: (/^\w+/.exec(dep.Status || '') || ['Unknown'])[0],
      sunsetDate: sunset ? sunset[0] : null,
      latest: plain(lat.Version) || null,
      upgradeNeeded: /^Yes/.test(lat['Upgrade needed'] || ''),
      sourceUrl: links(dep.Source || '')[0]?.url || links(lat.Source || '')[0]?.url || null,
    };
  });
}

function listFiles(dir: string, ext: string): string[] {
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(ext))
      .map((f) => path.join(dir, f));
  } catch {
    return [];
  }
}

export function readIntegration(repoRoot: string, dir: string): Integration {
  const readmePath = path.join(dir, 'README.md');
  const text = fs.readFileSync(path.join(repoRoot, readmePath), 'utf8');
  const problems = validate(text);
  const name = path.basename(dir);
  const heading = (text.match(/^# (.+)$/m) || [])[1] || name;
  const title =
    heading
      .replace(/(\s+(RudderStack|Destination|Integration|Documentation|Guide))+$/i, '')
      .trim() || name;
  const base = { name, title, dir, readmePath, problems };
  if (problems.length) {
    return {
      ...base,
      versions: [],
      changelogIndexUrls: [],
      sections: { versionInformation: '', documentationLinks: '' },
      onDemandFiles: [],
    };
  }

  // Index pages list many changes; Announcements links are single posts, so they are not included.
  const changelogIndexUrls = bullets(section(text, 'Changelog References', 3))
    .filter((i) => i.label !== 'Announcements')
    .flatMap((i) => links(i.value).map((l) => l.url));

  return {
    ...base,
    versions: versionRecords(text),
    changelogIndexUrls,
    sections: {
      versionInformation: section(text, 'Version Information', 2) || '',
      documentationLinks: section(text, 'Documentation Links', 2) || '',
    },
    onDemandFiles: [
      ...listFiles(path.join(repoRoot, dir, 'docs'), '.md'),
      ...listFiles(path.join(repoRoot, dir, 'data'), '.json'),
    ].map((f) => path.relative(repoRoot, f)),
  };
}

export function discover(repoRoot: string): string[] {
  const dirs: string[] = [];
  for (const root of INTEGRATION_ROOTS) {
    let names: string[] = [];
    try {
      names = fs.readdirSync(path.join(repoRoot, root));
    } catch {
      continue;
    }
    for (const n of names) {
      if (fs.existsSync(path.join(repoRoot, root, n, 'README.md'))) dirs.push(path.join(root, n));
    }
  }
  return dirs.sort();
}

/** Integrations to audit: all with a README, or the `only` ones; `skipped` have a README that isn't audit-ready. */
export function selectIntegrations(
  repoRoot: string,
  only: string[] | null,
): { ready: Integration[]; skipped: Integration[] } {
  let integrations = discover(repoRoot).map((d) => readIntegration(repoRoot, d));
  if (only) {
    const missing = only.filter((n) => !integrations.some((i) => i.name === n));
    if (missing.length) throw new Error(`No README for: ${missing.join(', ')}`);
    integrations = integrations.filter((i) => only.includes(i.name));
  }
  return {
    ready: integrations.filter((i) => !i.problems.length),
    skipped: integrations.filter((i) => i.problems.length),
  };
}

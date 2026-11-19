// Reads the audit sections of integration READMEs (format: .claude/skills/generate-integration-docs/references/audit-sections.md).
const fs = require('fs');
const path = require('path');

const INTEGRATION_ROOTS = [
  'src/v0/destinations',
  'src/v1/destinations',
  'src/cdk/v2/destinations',
  'src/sources',
];

const VERSION_LABELS = {
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
const VALUE_PATTERNS = {
  Status: /^(Supported|Deprecated|Sunset|Unknown)\b/,
  'Sunset date': /^(\d{4}-\d{2}(-\d{2})?|None announced)\b/,
  Released: /^(\d{4}-\d{2}(-\d{2})?|Unknown)\b/,
  'Upgrade needed': /^(Yes|No)\b/,
  'Last checked': /^\d{4}-\d{2}-\d{2}$/,
};

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Body of `heading` at `level`, up to the next heading of the same or higher level. */
function section(text, heading, level) {
  const re = new RegExp(
    `^${'#'.repeat(level)} ${escapeRegExp(heading)}[ \\t]*\\n([\\s\\S]*?)(?=^#{1,${level}} |(?![\\s\\S]))`,
    'm',
  );
  const m = text.match(re);
  return m ? m[1] : null;
}

function bullets(body) {
  return [...body.matchAll(/^- \*\*([^*]+?):\*\*\s*(.*)$/gm)].map((m) => ({
    label: m[1],
    value: m[2].trim(),
  }));
}

/** Splits bullets into per-API groups; a group starts at `- **API:**` (or is the single unnamed group). */
function groupByApi(items) {
  const groups = [];
  let current = null;
  for (const item of items) {
    if (item.label === 'API' || !current) {
      current = { api: item.label === 'API' ? item.value : null, fields: {} };
      groups.push(current);
      if (item.label === 'API') continue;
    }
    current.fields[item.label] = item.value;
  }
  return groups;
}

function links(value) {
  return [...value.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g)].map((m) => ({
    title: m[1],
    url: m[2],
  }));
}

function validate(text) {
  const problems = [];
  if ((text.match(/^## Version Information\s*$/gm) || []).length !== 1) {
    problems.push('needs exactly one "## Version Information"');
  }
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
    items
      .filter((i) => VALUE_PATTERNS[i.label] && i.label !== 'Last checked')
      .filter((i) => !VALUE_PATTERNS[i.label].test(i.value))
      .forEach((i) => problems.push(`${sub}: bad ${i.label} "${i.value.slice(0, 40)}"`));
  }
  const cr = section(text, 'Changelog References', 3);
  if (cr === null) {
    problems.push('missing "### Changelog References"');
  } else {
    const order = bullets(cr)
      .map((i) => i.label)
      .filter((l) => CHANGELOG_LABELS.includes(l));
    if (order.join('|') !== CHANGELOG_LABELS.join('|')) {
      problems.push(`Changelog References labels must be ${CHANGELOG_LABELS.join(', ')}`);
    }
  }
  return problems;
}

function listFiles(dir, ext) {
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(ext))
      .map((f) => path.join(dir, f));
  } catch {
    return [];
  }
}

function readIntegration(repoRoot, dir) {
  const readmePath = path.join(dir, 'README.md');
  const text = fs.readFileSync(path.join(repoRoot, readmePath), 'utf8');
  const problems = validate(text);
  const name = path.basename(dir);
  if (problems.length) return { name, dir, readmePath, problems };

  const versions = Object.fromEntries(
    Object.keys(VERSION_LABELS).map((sub) => [sub, groupByApi(bullets(section(text, sub, 3)))]),
  );
  const changelogItems = bullets(section(text, 'Changelog References', 3));
  const changelog = Object.fromEntries(
    changelogItems.map((i) => [i.label, { value: i.value, links: links(i.value) }]),
  );
  const title = (text.match(/^# (.+)$/m) || [])[1] || name;

  return {
    name,
    title:
      title
        .replace(/(\s+(RudderStack|Destination|Integration|Documentation|Guide))+$/i, '')
        .trim() || name,
    dir,
    readmePath,
    problems,
    versions,
    changelog,
    sections: {
      versionInformation: section(text, 'Version Information', 2),
      documentationLinks: section(text, 'Documentation Links', 2),
    },
    onDemandFiles: [
      ...listFiles(path.join(repoRoot, dir, 'docs'), '.md'),
      ...listFiles(path.join(repoRoot, dir, 'data'), '.json'),
    ].map((f) => path.relative(repoRoot, f)),
  };
}

function discover(repoRoot) {
  const dirs = [];
  for (const root of INTEGRATION_ROOTS) {
    let names = [];
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

module.exports = { discover, readIntegration, validate, section, bullets, groupByApi, links };

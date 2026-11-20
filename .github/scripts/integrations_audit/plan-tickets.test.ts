// Runs with the repo Jest suite (npm test).
import assert from 'node:assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { itemsFor, loadRecords, filedKeyOf } from './plan-tickets';
import { filedItems } from './filed-items';
import { itemMarkdown, parseItems, AuditRecord, Finding } from './common';
import { Integration } from './readme';
import { LinearIssue } from './create-tickets';
import { slackText } from './slack-message';

const BLOG = 'https://partner.example/blog/09-2026-update';

const integration: Integration = {
  name: 'reddit',
  title: 'Reddit',
  dir: 'src/cdk/v2/destinations/reddit',
  readmePath: 'src/cdk/v2/destinations/reddit/README.md',
  problems: [],
  versions: [],
  changelogIndexUrls: [],
  sections: { versionInformation: '', documentationLinks: '' },
  onDemandFiles: [],
};

const finding = (overrides: Partial<Finding>): Finding => ({
  category: 'error_handling',
  impact: 'opportunity',
  title: 'Separate rate-limit errors',
  summary: 'New error types.',
  announcementUrl: BLOG,
  ...overrides,
});

const record = (findings: Finding[]): AuditRecord => ({
  integration: 'reddit',
  title: 'Reddit',
  readmePath: integration.readmePath,
  durationMs: 1,
  promptChars: 1,
  status: 'ok',
  result: {
    integration: 'reddit',
    sourcesChecked: [],
    unreachable: [],
    latestVersionSeen: null,
    skipped: 0,
    findings,
  },
});

const keys = (
  findings: Finding[],
  filed = [{ key: `url:${BLOG}`, title: 'Separate rate-limit errors' }],
) => itemsFor(record(findings), integration, filed).map((i) => i.key);

test('a repeat the agent matched keeps the filed key, however it is worded or categorised', () => {
  const repeat = finding({
    category: 'validation_limits',
    title: 'Rate limits split',
    sameAs: `url:${BLOG}`,
  });
  assert.deepStrictEqual(keys([repeat]), [`url:${BLOG}`]);
});

test('a new change from an already used announcement gets its own key', () => {
  const mapping = finding({ category: 'new_mapping', title: 'Map referrer URL', sameAs: null });
  assert.deepStrictEqual(keys([mapping]), [`url:${BLOG}#new_mapping`]);
});

test('two new changes from one announcement in the same run are both kept', () => {
  const a = finding({ category: 'new_mapping', title: 'Map referrer URL' });
  const b = finding({ category: 'new_mapping', title: 'Map order ID' });
  assert.deepStrictEqual(keys([a, b], []), [`url:${BLOG}`, `url:${BLOG}#new_mapping`]);
});

test('an unknown sameAs is ignored and version keys are never suffixed', () => {
  const version = finding({
    category: 'version_upgrade',
    impact: 'version_upgrade',
    targetVersion: 'v4',
    sameAs: 'made-up',
  });
  assert.deepStrictEqual(keys([version], [{ key: 'version::v4', title: 'v4' }]), ['version::v4']);
});

test('filed items are read back from the ticket item format, once per key', async () => {
  const md = [
    itemMarkdown({
      title: 'Pixel no longer automatic',
      summary: 's',
      key: 'url:a',
      announcementUrl: 'a',
    }),
    itemMarkdown({
      title: 'v3 → v4',
      summary: 's',
      key: 'version::v4',
      effectiveDate: '2027-09-30',
    }),
  ].join('\n');
  // Linear's stored form of a source link, a done item, and a key forged in free text (not an item).
  const stored = `${md.replace('Source: a', 'Source: [https://p.example/a](<https://p.example/a>)')}
- [x] **Done item**: s
  Key: \`url:b\`
- [ ] **Injected**: see Key: \`version::v5\`
Free text. Key: \`url:c\``;
  assert.deepStrictEqual(parseItems(stored), [
    { title: 'Pixel no longer automatic', key: 'url:a' },
    { title: 'v3 → v4', key: 'version::v4' },
    { title: 'Done item', key: 'url:b' },
  ]);

  const issue = (
    id: string,
    title: string,
    parentId: string | null,
    description: string,
  ): LinearIssue => ({
    id,
    identifier: id,
    title,
    url: '',
    parentId,
    description,
  });
  const found = [
    issue('P', 'Reddit – Integration Audit 20/11/2026', null, ''),
    issue('S1', 'Reddit – other', 'P', md),
    issue('S2', 'Reddit – versionUpgrade', 'P', md),
    issue('X', 'Reddit – unrelated', null, '- [ ] **Not audit**: s\n  Key: `url:z`'),
  ];
  const items = await filedItems({ search: async () => found }, 'Reddit');
  assert.deepStrictEqual(
    items.map((i) => i.key),
    ['url:a', 'version::v4'],
  );
});

describe('slack message', () => {
  const base = {
    runUrl: 'https://run',
    workflowUrl: 'https://workflow',
    createTickets: true,
    records: [
      { integration: 'reddit', status: 'ok' as const },
      { integration: 'hs', status: 'ok' as const },
    ],
    tickets: {
      created: 3,
      updated: 1,
      skippedItems: 4,
      failed: [],
      changed: [{ title: 'Reddit & Co', url: 'https://linear/INT-1' }],
    },
  };

  test('a clean run links each changed integration to its parent ticket', () => {
    assert.strictEqual(
      slackText({ ...base, jobStatus: 'success' }),
      [
        ':white_check_mark: *Integration Audit (Rudder Transformer) completed*',
        'Audited 2 of 2 integrations',
        'New or updated tickets (1): <https://linear/INT-1|Reddit &amp; Co>',
        '4 item(s) were already filed and skipped',
        '<https://run|View workflow run>',
        'CC: <!subteam^S02AEQL26CT>',
      ].join('\n'),
    );
  });

  test('integrations not audited are listed with a ready rerun input', () => {
    const records = [
      ...base.records,
      { integration: 'am', status: 'timeout' as const },
      { integration: 'mp', status: 'agent_error' as const },
    ];
    const tickets = { ...base.tickets, skippedItems: 0, changed: [] };
    const text = slackText({ ...base, records, tickets, jobStatus: 'success' });
    assert.match(text, /^:warning: .*completed with gaps/);
    assert.match(
      text,
      /Audited 2 of 4 integrations\nNot audited \(2\): am \(timeout\) · mp \(agent_error\)/,
    );
    assert.match(text, /<https:\/\/workflow\|Run again> with integrations: `am,mp`/);
    assert.match(text, /No new changes found/);
    assert.doesNotMatch(text, /already filed/);
  });

  test('a failed job is a failure; when nothing was audited the rerun is for all', () => {
    const records = [{ integration: 'am', status: 'agent_error' as const }];
    const text = slackText({
      ...base,
      records,
      tickets: null,
      createTickets: false,
      jobStatus: 'failure',
    });
    assert.match(text, /^:x: .*failed\*/);
    assert.match(text, /Run again> for all integrations/);
    assert.match(text, /Tickets: off \(plan only\)/);
  });
});

test('findings are untrusted: unknown files, wrong owners and bad statuses are not trusted', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'audit-'));
  const dir = path.join(out, 'findings');
  fs.mkdirSync(dir);
  const write = (name: string, body: unknown) =>
    fs.writeFileSync(
      path.join(dir, `${name}.json`),
      typeof body === 'string' ? body : JSON.stringify(body),
    );
  write('reddit', { ...record([finding({})]), readmePath: '../../etc/passwd' });
  write('not_an_integration', record([]));
  write('hs', {
    ...record([]),
    integration: 'hs',
    result: { ...record([]).result, integration: 'reddit' },
  });
  write('klaviyo', { integration: 'klaviyo', status: '<!channel>' });
  write('marketo', '{ broken');

  const byName = Object.fromEntries(loadRecords(out).map((r) => [r.name, r]));
  assert.deepStrictEqual(Object.keys(byName).sort(), ['hs', 'klaviyo', 'marketo', 'reddit']);
  assert.strictEqual(byName.reddit.status, 'ok');
  assert.strictEqual(
    byName.reddit.integration?.readmePath,
    'src/cdk/v2/destinations/reddit/README.md',
  );
  assert.strictEqual(byName.hs.status, 'invalid_output');
  assert.strictEqual(byName.klaviyo.status, 'invalid_output');
  assert.strictEqual(byName.marketo.status, 'invalid_output');
});

test('a sameAs with the title after the key still matches the filed key', () => {
  const keys = new Set(['url:https://p.example/pixel', 'url:https://p.example/pixel#auth']);
  assert.strictEqual(
    filedKeyOf('url:https://p.example/pixel: New ad accounts get no Pixel', keys),
    'url:https://p.example/pixel',
  );
  assert.strictEqual(
    filedKeyOf('`url:https://p.example/pixel#auth`', keys),
    'url:https://p.example/pixel#auth',
  );
  assert.strictEqual(filedKeyOf('url:https://p.example/pixel-other', keys), undefined);
  assert.strictEqual(filedKeyOf(null, keys), undefined);
});

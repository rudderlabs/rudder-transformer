// Runs with the repo Jest suite (npm test).
import assert from 'node:assert';
import { applyPlan, IssueFields, LinearClient, LinearIds, LinearIssue } from './create-tickets';
import { PlanItem, PlannedParent, PlannedSubticket, SubticketType } from './common';

const IDS: LinearIds = { labels: { KTLO: 'ktlo', VersionUpgrade: 'vu' }, project: 'proj' };

type FakeIssue = LinearIssue & Omit<IssueFields, 'parentId'>;

interface FakeLinear extends LinearClient {
  issues: FakeIssue[];
  comments: { id: string; body: string }[];
  failSearchFor: string | null;
  close(title: string): void;
}

function fakeLinear(): FakeLinear {
  const issues: FakeIssue[] = [];
  const comments: { id: string; body: string }[] = [];
  let n = 0;
  const fake: FakeLinear = {
    issues,
    comments,
    failSearchFor: null,
    async search(text) {
      if (fake.failSearchFor && text.startsWith(fake.failSearchFor)) throw new Error('Linear down');
      return issues.filter((i) => i.title.includes(text)).map((i) => ({ ...i }));
    },
    async create(fields) {
      n += 1;
      const issue: FakeIssue = {
        id: `id${n}`,
        identifier: `INT-${n}`,
        url: `https://linear.app/INT-${n}`,
        state: { type: 'backlog' },
        ...fields,
        title: fields.title || '',
        parentId: fields.parentId || null,
      };
      issues.push(issue);
      return issue;
    },
    async update(id, fields) {
      Object.assign(
        get(fake, (i) => i.id === id),
        fields,
      );
    },
    async comment(id, body) {
      comments.push({ id, body });
    },
    close(title) {
      get(fake, (i) => i.title === title).state = { type: 'completed' };
    },
  };
  return fake;
}

/** The last fake issue matching `match`; fails the test if there is none. */
function get(linear: FakeLinear, match: string | ((i: FakeIssue) => boolean)): FakeIssue {
  const test = typeof match === 'string' ? (i: FakeIssue) => i.title === match : match;
  const found = linear.issues.filter(test).pop();
  if (!found) throw new Error(`no issue matching ${String(match)}`);
  return found;
}

const item = (key: string): PlanItem => ({
  key,
  category: 'auth',
  impact: 'breaking',
  title: `Item ${key}`,
  summary: 'What changes.',
  announcementUrl: `https://partner.example/${key}`,
  effectiveDate: null,
  source: 'agent',
  priority: 4,
  dueDate: null,
});

function planFor(date: string, subtickets: PlannedSubticket[]): { parents: PlannedParent[] } {
  return {
    parents: [
      {
        integration: 'zendesk',
        integrationTitle: 'Zendesk',
        readmePath: 'src/v0/destinations/zendesk/README.md',
        title: `Zendesk – Integration Audit ${date}`,
        subtickets,
      },
    ],
  };
}

const sub = (
  type: SubticketType,
  items: PlanItem[],
  priority = 4,
  dueDate: string | null = null,
): PlannedSubticket => ({
  title: `Zendesk – ${type}`,
  type,
  priority,
  dueDate,
  labels: type === 'versionUpgrade' ? ['KTLO', 'VersionUpgrade'] : ['KTLO'],
  items,
});

test('first run creates a parent and one subticket per type', async () => {
  const linear = fakeLinear();
  const plan = planFor('19/11/2026', [
    sub('authFeature', [item('a1')], 1),
    sub('other', [item('o1')]),
  ]);
  const { reports, failures } = await applyPlan(plan, linear, IDS);

  assert.deepStrictEqual(failures, []);
  assert.deepStrictEqual(
    reports[0].created.map((c) => c.title),
    ['Zendesk – Integration Audit 19/11/2026', 'Zendesk – authFeature', 'Zendesk – other'],
  );
  const auth = get(linear, 'Zendesk – authFeature');
  assert.strictEqual(auth.parentId, 'id1');
  assert.strictEqual(auth.priority, 1);
  assert.deepStrictEqual(auth.labelIds, ['ktlo']);
  assert.match(auth.description || '', /Key: `a1`/);
  assert.match(
    auth.description || '',
    /Update the README \(`src\/v0\/destinations\/zendesk\/README.md`\)/,
  );
});

test('versionUpgrade subtickets also get the VersionUpgrade label', async () => {
  const linear = fakeLinear();
  await applyPlan(planFor('19/11/2026', [sub('versionUpgrade', [item('v1')])]), linear, IDS);
  const vu = get(linear, 'Zendesk – versionUpgrade');
  assert.deepStrictEqual(vu.labelIds, ['ktlo', 'vu']);
});

test('a second run with the same items changes nothing', async () => {
  const linear = fakeLinear();
  const plan = planFor('19/11/2026', [sub('authFeature', [item('a1')])]);
  await applyPlan(plan, linear, IDS);
  const { reports } = await applyPlan(plan, linear, IDS);

  assert.strictEqual(linear.issues.length, 2);
  assert.deepStrictEqual(reports[0].created, []);
  assert.deepStrictEqual(reports[0].updated, []);
  assert.strictEqual(reports[0].skippedItems, 1);
});

test('a new item of an open type is appended above the README line, with a comment and escalated priority', async () => {
  const linear = fakeLinear();
  await applyPlan(
    planFor('19/11/2026', [sub('authFeature', [item('a1')], 3, '2027-05-01')]),
    linear,
    IDS,
  );
  const { reports } = await applyPlan(
    planFor('19/12/2026', [sub('authFeature', [item('a1'), item('a2')], 1, '2026-12-20')]),
    linear,
    IDS,
  );

  assert.strictEqual(linear.issues.length, 2, 'no new parent or subticket');
  const auth = get(linear, 'Zendesk – authFeature');
  const description = auth.description || '';
  assert.ok(description.indexOf('Key: `a2`') < description.indexOf('Update the README'));
  assert.strictEqual(auth.priority, 1);
  assert.strictEqual(auth.dueDate, '2026-12-20');
  assert.strictEqual(reports[0].updated[0].added, 1);
  assert.match(linear.comments[0].body, /added 1 item\(s\)/);
});

test('a new type gets its own subticket under the open parent', async () => {
  const linear = fakeLinear();
  await applyPlan(planFor('19/11/2026', [sub('authFeature', [item('a1')])]), linear, IDS);
  await applyPlan(planFor('19/12/2026', [sub('mappingFeature', [item('m1')])]), linear, IDS);

  const mapping = get(linear, 'Zendesk – mappingFeature');
  assert.strictEqual(mapping.parentId, 'id1');
  assert.strictEqual(linear.issues.filter((i) => !i.parentId).length, 1, 'still one parent');
});

test('an item on a closed ticket is not reopened; a new change after the round closed starts a new parent', async () => {
  const linear = fakeLinear();
  await applyPlan(planFor('19/11/2026', [sub('authFeature', [item('a1')])]), linear, IDS);
  linear.close('Zendesk – authFeature');
  linear.close('Zendesk – Integration Audit 19/11/2026');

  const again = await applyPlan(
    planFor('19/12/2026', [sub('authFeature', [item('a1')])]),
    linear,
    IDS,
  );
  assert.deepStrictEqual(again.reports[0].created, []);

  const next = await applyPlan(
    planFor('19/12/2026', [sub('authFeature', [item('a1'), item('a2')])]),
    linear,
    IDS,
  );
  assert.deepStrictEqual(
    next.reports[0].created.map((c) => c.title),
    ['Zendesk – Integration Audit 19/12/2026', 'Zendesk – authFeature'],
  );
  const newSub = get(linear, 'Zendesk – authFeature');
  assert.doesNotMatch(newSub.description || '', /Key: `a1`/);
  assert.match(newSub.description || '', /Key: `a2`/);
});

test('tickets of an integration whose title starts the same are not mixed up', async () => {
  const linear = fakeLinear();
  await linear.create({ title: 'Zendesk Chat – Integration Audit 01/11/2026' });
  await applyPlan(planFor('19/11/2026', [sub('authFeature', [item('a1')])]), linear, IDS);
  assert.ok(linear.issues.some((i) => i.title === 'Zendesk – Integration Audit 19/11/2026'));
});

test('a Linear error fails that integration only, and nothing is created for it', async () => {
  const linear = fakeLinear();
  linear.failSearchFor = 'Zendesk';
  const plan = planFor('19/11/2026', [sub('authFeature', [item('a1')])]);
  plan.parents.push({
    ...plan.parents[0],
    integration: 'klaviyo',
    integrationTitle: 'Klaviyo',
    title: 'Klaviyo – Integration Audit 19/11/2026',
    subtickets: [{ ...sub('other', [item('k1')]), title: 'Klaviyo – other' }],
  });
  const { reports, failures } = await applyPlan(plan, linear, IDS);

  assert.deepStrictEqual(failures, [{ integration: 'zendesk', error: 'Linear down' }]);
  assert.strictEqual(reports[0].integration, 'klaviyo');
  assert.ok(linear.issues.every((i) => !i.title.startsWith('Zendesk')));
});

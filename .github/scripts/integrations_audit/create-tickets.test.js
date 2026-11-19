// Run with: node --test .github/scripts/integrations_audit/*.test.js
const test = require('node:test');
const assert = require('node:assert');
const { applyPlan } = require('./create-tickets');

const IDS = { ktlo: 'ktlo', versionUpgrade: 'vu', project: 'proj' };

function fakeLinear() {
  const issues = [];
  const comments = [];
  let n = 0;
  return {
    issues,
    comments,
    failSearchFor: null,
    async search(text) {
      if (this.failSearchFor && text.startsWith(this.failSearchFor)) throw new Error('Linear down');
      return issues.filter((i) => i.title.includes(text)).map((i) => ({ ...i }));
    },
    async create(fields) {
      n += 1;
      const issue = {
        id: `id${n}`,
        identifier: `INT-${n}`,
        url: `https://linear.app/INT-${n}`,
        state: { type: 'backlog' },
        parentId: fields.parentId || null,
        ...fields,
      };
      issues.push(issue);
      return issue;
    },
    async update(id, fields) {
      Object.assign(
        issues.find((i) => i.id === id),
        fields,
      );
    },
    async comment(id, body) {
      comments.push({ id, body });
    },
    close(title) {
      issues.find((i) => i.title === title).state = { type: 'completed' };
    },
  };
}

const item = (key, extra = {}) => ({
  key,
  title: `Item ${key}`,
  summary: 'What changes.',
  announcementUrl: `https://partner.example/${key}`,
  effectiveDate: null,
  ...extra,
});

function planFor(date, subtickets) {
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

const sub = (type, items, priority = 4, dueDate = null) => ({
  title: `Zendesk – ${type}`,
  type,
  priority,
  dueDate,
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
  const auth = linear.issues.find((i) => i.title === 'Zendesk – authFeature');
  assert.strictEqual(auth.parentId, 'id1');
  assert.strictEqual(auth.priority, 1);
  assert.deepStrictEqual(auth.labelIds, ['ktlo']);
  assert.match(auth.description, /Key: `a1`/);
  assert.match(
    auth.description,
    /Update the README \(`src\/v0\/destinations\/zendesk\/README.md`\)/,
  );
});

test('versionUpgrade subtickets also get the VersionUpgrade label', async () => {
  const linear = fakeLinear();
  await applyPlan(planFor('19/11/2026', [sub('versionUpgrade', [item('v1')])]), linear, IDS);
  const vu = linear.issues.find((i) => i.title === 'Zendesk – versionUpgrade');
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
  const auth = linear.issues.find((i) => i.title === 'Zendesk – authFeature');
  assert.ok(auth.description.indexOf('Key: `a2`') < auth.description.indexOf('Update the README'));
  assert.strictEqual(auth.priority, 1);
  assert.strictEqual(auth.dueDate, '2026-12-20');
  assert.strictEqual(reports[0].updated[0].added, 1);
  assert.match(linear.comments[0].body, /added 1 item\(s\)/);
});

test('a new type gets its own subticket under the open parent', async () => {
  const linear = fakeLinear();
  await applyPlan(planFor('19/11/2026', [sub('authFeature', [item('a1')])]), linear, IDS);
  await applyPlan(planFor('19/12/2026', [sub('mappingFeature', [item('m1')])]), linear, IDS);

  const mapping = linear.issues.find((i) => i.title === 'Zendesk – mappingFeature');
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
  const newSub = linear.issues.filter((i) => i.title === 'Zendesk – authFeature').pop();
  assert.doesNotMatch(newSub.description, /Key: `a1`/);
  assert.match(newSub.description, /Key: `a2`/);
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

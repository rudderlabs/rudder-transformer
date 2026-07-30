import { RunContext } from '../../../live/types';
import { pollUntil } from '../../../live/poll';
import { lookupFirstname } from './profiles';
import {
  ASSOC_FROM_TYPE,
  ASSOC_TO_TYPE,
  createCrmObject,
  findContactIdByEmail,
  findContactIdByProperty,
} from './api';

// The CRM Search index is eventually consistent — a fresh contact can drop out of the next
// search, so a first-hit poll leaves the transform's own search racing to create and 409-ing on
// the duplicate. Requiring several CONSECUTIVE hits plus a settle delay closes that window.
const REQUIRED_CONSECUTIVE_HITS = 5;
const SEARCH_POLL_INTERVAL_MS = 2000;
const SEARCH_MAX_POLLS = 25; // ~50s ceiling, within the scenario setup's 60s timeout
const SEARCH_SETTLE_MS = 8000;

const waitUntilSearchable = async (
  label: string,
  find: () => Promise<string | null>,
): Promise<void> => {
  let consecutive = 0;
  await pollUntil(
    async () => {
      const found = await find();
      consecutive = found ? consecutive + 1 : 0;
      return { done: consecutive >= REQUIRED_CONSECUTIVE_HITS, value: found };
    },
    {
      label: `${label} stably searchable`,
      attempts: SEARCH_MAX_POLLS,
      delayMs: () => SEARCH_POLL_INTERVAL_MS,
      settleMs: SEARCH_SETTLE_MS,
    },
  );
};

export const createContactAndWaitSearchable = async (ctx: RunContext): Promise<void> => {
  const email = ctx.email();
  // Create is strong; CRM Search is eventually consistent — poll before the transform's own search.
  await createCrmObject(ctx, 'contacts', { email, firstname: 'CI-RETL', lastname: ctx.runId });
  await waitUntilSearchable(`contact ${email}`, () => findContactIdByEmail(ctx, email));
};

// Setup for the non-unique-lookup "existing contact" case: create a contact and wait until it is
// stably searchable by firstname, so the searchContacts() flow (lookupField=firstname) finds it.
export const createContactSearchableByFirstname = async (ctx: RunContext): Promise<void> => {
  const firstname = lookupFirstname(ctx);
  await createCrmObject(ctx, 'contacts', {
    email: ctx.email(),
    firstname,
    lastname: ctx.runId,
  });
  await waitUntilSearchable(`contact with firstname ${firstname}`, () =>
    findContactIdByProperty(ctx, 'firstname', firstname),
  );
};

export const createContactAndRegisterId = async (ctx: RunContext): Promise<void> => {
  const id = await createCrmObject(ctx, 'contacts', {
    email: ctx.email(),
    firstname: 'CI-HSID',
    lastname: ctx.runId,
  });
  ctx.register({ type: 'contacts', id });
};

// An association links two existing objects, so its scenario can't mint ids on the fly — setup
// creates both and registers their real ids for the pipeline step to reference.
export const createAssociationObjects = async (ctx: RunContext): Promise<void> => {
  const fromId = await createCrmObject(ctx, ASSOC_FROM_TYPE, {
    name: `RudderStack CI ${ctx.runId}`,
    domain: `ci-${ctx.runId}.example.com`,
  });
  ctx.register({ type: ASSOC_FROM_TYPE, id: fromId });

  const toId = await createCrmObject(ctx, ASSOC_TO_TYPE, {
    email: ctx.email(),
    firstname: 'CI-ASSOC',
    lastname: ctx.runId,
  });
  ctx.register({ type: ASSOC_TO_TYPE, id: toId });
};

// Additional-email upsert scenario: create a contact whose primary email is the run email and whose
// hs_additional_emails carries a second address, register its id, and wait until it is stably
// searchable so the subsequent upserts resolve against a settled record.
export const createContactWithAdditionalEmail = async (ctx: RunContext): Promise<void> => {
  const email = ctx.email();
  const additionalEmail = ctx.email('additional');
  const id = await createCrmObject(ctx, 'contacts', {
    email,
    hs_additional_emails: additionalEmail,
    firstname: 'CI-Upsert-AddlEmail',
    lastname: ctx.runId,
  });
  ctx.register({ type: 'contacts', id });
  await waitUntilSearchable(`contact ${email}`, () => findContactIdByEmail(ctx, email));
};

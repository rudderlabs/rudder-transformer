import type { LiveSpec } from '../../../live/types';
import {
  ASSOC_FROM_TYPE,
  ASSOC_TO_TYPE,
  deleteAssociationObjects,
  deleteContactByEmail,
  deleteRegisteredObjects,
  deleteUpsertAdditionalEmailContacts,
  registeredId,
  registeredIds,
} from './api';
import {
  baseTimestamps,
  esByHsContactIdTraits,
  esContactCreateTraits,
  esContactCreateV1Traits,
  esContactUpdateTraits,
  esContactUpdateV1Traits,
  esDontBatchV1Traits,
  esDontBatchV3Traits,
  esLibrary,
  esNonUniqueCreateTraits,
  esNonUniqueUpdateTraits,
  retlContactContext,
  retlContactContextForEmail,
  retlContactCreateTraits,
  retlContactCreateV1Traits,
  retlContactUpdateTraits,
  retlContactUpdateV1Traits,
  retlRecordIdCompanyTraits,
  retlRecordIdContext,
  retlRecordIdDupCombinedTraits,
  retlRecordIdDupFirstTraits,
  retlRecordIdDupSecondTraits,
  retlRecordIdOtherContactTraits,
  retlRecordIdUpdateTraits,
  retlUpsertCombinedTraits,
  retlUpsertPrimaryTraits,
  retlUpsertSecondaryTraits,
} from './profiles';
import {
  createAndDeleteContact,
  createAssociationObjects,
  createCompanyAndRegisterId,
  createContactAndRegisterId,
  createContactAndWaitSearchable,
  createContactSearchableByFirstname,
  createContactWithAdditionalEmail,
  createTwoContactsAndRegisterIds,
} from './setup';
import {
  verifyAssociationExists,
  verifyContactProperties,
  verifyRecordIdBatch,
  verifyRegisteredObjectProperties,
  verifyUpsertResolvesToSameContact,
} from './verify';

const withoutAuthorizationType = (base: Record<string, unknown>): Record<string, unknown> => {
  const { authorizationType: _authorizationType, ...config } = base;
  return config;
};

// HubSpot's CRM search index is eventually consistent. Most reads settle quickly, but legacy
// contacts/v1 writes can surface just beyond the framework's default ~7s retry boundary.
const CONTACT_READBACK = {
  attempts: 6,
  delayMs: (attempt: number) => Math.min(1000 * 2 ** attempt, 8000),
};

export const live = {
  enabled: true,
  authType: 'apiKey',
  resolveConfig: (s) => ({
    authorizationType: 'newPrivateAppApi',
    apiVersion: 'newApi',
    lookupField: 'email',
    ...s.config,
  }),
  scenarios: [
    {
      id: 'hs-es-contacts-create-v3',
      cleanup: deleteContactByEmail,
      description: 'Event-stream identify creates a new CRM contact (newApi)',
      steps: [
        {
          name: 'identify new contact',
          stepType: 'pipeline',
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'es-contacts-create'),
            type: 'identify',
            context: esLibrary,
            traits: { email: ctx.email(), ...esContactCreateTraits(ctx) },
            integrations: { All: true },
          }),
        },
      ],
      verify: { check: verifyContactProperties(esContactCreateTraits), ...CONTACT_READBACK },
    },
    {
      id: 'hs-es-contacts-create-v3-access-token-only',
      cleanup: deleteContactByEmail,
      description:
        'Event-stream identify creates a new CRM contact with accessToken and no authorizationType (newApi)',
      configOverride: (base) => withoutAuthorizationType(base),
      steps: [
        {
          name: 'identify new contact (accessToken only, newApi)',
          stepType: 'pipeline',
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'es-contacts-create-access-token-only'),
            type: 'identify',
            context: esLibrary,
            traits: { email: ctx.email(), ...esContactCreateTraits(ctx) },
            integrations: { All: true },
          }),
        },
      ],
      verify: { check: verifyContactProperties(esContactCreateTraits), ...CONTACT_READBACK },
    },
    {
      id: 'hs-es-contacts-update-v3',
      cleanup: deleteContactByEmail,
      description: 'Event-stream identify updates an existing CRM contact (newApi)',
      steps: [
        { stepType: 'action', name: 'setup', run: createContactAndWaitSearchable },
        {
          name: 'identify existing contact',
          stepType: 'pipeline',
          retries: 3,
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'es-contacts-update'),
            type: 'identify',
            context: esLibrary,
            traits: { email: ctx.email(), ...esContactUpdateTraits(ctx) },
            integrations: { All: true },
          }),
        },
      ],
      verify: { check: verifyContactProperties(esContactUpdateTraits), ...CONTACT_READBACK },
    },
    {
      id: 'hs-es-contacts-create-v1',
      cleanup: deleteContactByEmail,
      description: 'Event-stream identify creates a new contact via the v1 endpoint (contacts/v1)',
      configOverride: (base) => ({ ...base, apiVersion: 'legacyApi' }),
      steps: [
        {
          name: 'identify new contact (v1)',
          stepType: 'pipeline',
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'es-contacts-create-v1'),
            type: 'identify',
            traits: { email: ctx.email(), ...esContactCreateV1Traits(ctx) },
          }),
        },
      ],
      verify: { check: verifyContactProperties(esContactCreateV1Traits), ...CONTACT_READBACK },
    },
    {
      id: 'hs-es-contacts-create-v1-access-token-only',
      cleanup: deleteContactByEmail,
      description:
        'Event-stream identify creates a new contact with accessToken and no authorizationType (legacyApi)',
      configOverride: (base) => withoutAuthorizationType({ ...base, apiVersion: 'legacyApi' }),
      steps: [
        {
          name: 'identify new contact (accessToken only, legacyApi)',
          stepType: 'pipeline',
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'es-contacts-create-v1-access-token-only'),
            type: 'identify',
            traits: { email: ctx.email(), ...esContactCreateV1Traits(ctx) },
          }),
        },
      ],
      verify: { check: verifyContactProperties(esContactCreateV1Traits), ...CONTACT_READBACK },
    },
    {
      id: 'hs-es-contacts-update-v1',
      cleanup: deleteContactByEmail,
      description:
        'Event-stream identify updates an existing contact via the v1 endpoint (contacts/v1)',
      configOverride: (base) => ({ ...base, apiVersion: 'legacyApi' }),
      steps: [
        { stepType: 'action', name: 'setup', run: createContactAndWaitSearchable },
        {
          name: 'identify existing contact (v1)',
          stepType: 'pipeline',
          retries: 3,
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'es-contacts-update-v1'),
            type: 'identify',
            traits: { email: ctx.email(), ...esContactUpdateV1Traits(ctx) },
          }),
        },
      ],
      verify: { check: verifyContactProperties(esContactUpdateV1Traits), ...CONTACT_READBACK },
    },
    {
      id: 'hs-es-contacts-dontbatch-v3',
      cleanup: deleteContactByEmail,
      description: 'Event-stream identify with dontBatch=true delivers un-batched (newApi)',
      steps: [
        {
          name: 'identify contact (dontBatch, newApi)',
          metadataOverride: { dontBatch: true },
          stepType: 'pipeline',
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'es-dontbatch-v3'),
            type: 'identify',
            context: esLibrary,
            traits: { email: ctx.email(), ...esDontBatchV3Traits(ctx) },
            integrations: { All: true },
          }),
        },
      ],
      verify: { check: verifyContactProperties(esDontBatchV3Traits), ...CONTACT_READBACK },
    },
    {
      id: 'hs-es-contacts-dontbatch-v1',
      cleanup: deleteContactByEmail,
      description: 'Event-stream identify with dontBatch=true delivers un-batched (legacyApi)',
      configOverride: (base) => ({ ...base, apiVersion: 'legacyApi' }),
      steps: [
        {
          name: 'identify contact (dontBatch, legacyApi)',
          metadataOverride: { dontBatch: true },
          stepType: 'pipeline',
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'es-dontbatch-v1'),
            type: 'identify',
            traits: { email: ctx.email(), ...esDontBatchV1Traits(ctx) },
          }),
        },
      ],
      verify: { check: verifyContactProperties(esDontBatchV1Traits), ...CONTACT_READBACK },
    },
    {
      id: 'hs-es-contacts-by-hscontactid-v3',
      cleanup: deleteContactByEmail,
      description: 'ES identify with hsContactId present updates the contact by id (newApi)',
      steps: [
        { stepType: 'action', name: 'setup', run: createContactAndRegisterId },
        {
          name: 'identify by hsContactId',
          stepType: 'pipeline',
          retries: 3,
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'es-hscontactid'),
            type: 'identify',
            context: {
              ...esLibrary,
              externalId: [{ type: 'hsContactId', id: registeredId(ctx, 'contacts') }],
            },
            traits: { email: ctx.email(), ...esByHsContactIdTraits(ctx) },
            integrations: { All: true },
          }),
        },
      ],
      verify: { check: verifyContactProperties(esByHsContactIdTraits), ...CONTACT_READBACK },
    },
    {
      id: 'hs-es-contacts-nonunique-lookup-v3',
      cleanup: deleteContactByEmail,
      description:
        'ES identify without hsContactId and a non-unique lookupField uses the search flow (newApi)',
      configOverride: (base) => ({ ...base, lookupField: 'firstname' }),
      steps: [
        {
          name: 'identify via non-unique lookup (search flow)',
          stepType: 'pipeline',
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'es-nonunique'),
            type: 'identify',
            context: esLibrary,
            traits: { email: ctx.email(), ...esNonUniqueCreateTraits(ctx) },
            integrations: { All: true },
          }),
        },
      ],
      verify: { check: verifyContactProperties(esNonUniqueCreateTraits), ...CONTACT_READBACK },
    },
    {
      id: 'hs-es-contacts-nonunique-lookup-existing-v3',
      cleanup: deleteContactByEmail,
      description:
        'ES identify: no hsContactId, non-unique lookupField, existing contact -> search finds it and updates (newApi)',
      configOverride: (base) => ({ ...base, lookupField: 'firstname' }),
      steps: [
        { stepType: 'action', name: 'setup', run: createContactSearchableByFirstname },
        {
          name: 'identify existing via non-unique lookup (search -> update)',
          stepType: 'pipeline',
          retries: 3,
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'es-nonunique-existing'),
            type: 'identify',
            context: esLibrary,
            traits: { email: ctx.email(), ...esNonUniqueUpdateTraits(ctx) },
            integrations: { All: true },
          }),
        },
      ],
      verify: { check: verifyContactProperties(esNonUniqueUpdateTraits), ...CONTACT_READBACK },
    },
    {
      id: 'hs-retl-contacts-create-v3',
      cleanup: deleteContactByEmail,
      description: 'RETL mappedToDestination identify creates a contact (crm/v3 batch/create)',
      steps: [
        {
          name: 'retl create contact',
          stepType: 'pipeline',
          retries: 3,
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'retl-contacts'),
            type: 'identify',
            recordId: ctx.runId,
            context: retlContactContext(ctx),
            traits: { email: ctx.email(), ...retlContactCreateTraits(ctx) },
          }),
        },
      ],
      verify: { check: verifyContactProperties(retlContactCreateTraits), ...CONTACT_READBACK },
    },
    {
      id: 'hs-retl-contacts-update-v3',
      cleanup: deleteContactByEmail,
      description:
        'RETL mappedToDestination identify updates an existing contact (crm/v3 batch/update)',
      steps: [
        { stepType: 'action', name: 'setup', run: createContactAndWaitSearchable },
        {
          name: 'retl update contact',
          stepType: 'pipeline',
          // RETL splits create-vs-update via HubSpot's eventually-consistent search; retry so a
          // just-created contact that the first search misses (409) is found and updated.
          retries: 10,
          // Settle before the pipeline runs so HubSpot's Search index reflects the contact the
          // setup step just created; without it the create-vs-update split can miss it and 409.
          delayBeforeMs: 5000,
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'retl-update'),
            type: 'identify',
            recordId: ctx.runId,
            context: retlContactContext(ctx),
            traits: { email: ctx.email(), ...retlContactUpdateTraits(ctx) },
          }),
        },
      ],
      verify: { check: verifyContactProperties(retlContactUpdateTraits), ...CONTACT_READBACK },
    },
    {
      // Exercises the rETL upsert path (crm/v3/objects/:objectType/batch/upsert):
      // the contact is created upfront (like the other update scenarios), then an
      // rETL identify updates it by its unique identifier (email) with no prior search.
      // When the identifier is a unique property in the account the write lands via the
      // batch/upsert endpoint; otherwise it falls back to create/update — the read-back
      // assertion holds either way.
      id: 'hs-retl-contacts-upsert-v3',
      cleanup: deleteContactByEmail,
      description:
        'RETL mappedToDestination identify upserts (updates) an existing contact via crm/v3 batch/upsert by unique identifier',
      steps: [
        { stepType: 'action', name: 'setup', run: createContactAndWaitSearchable },
        {
          name: 'retl upsert contact (update by unique identifier)',
          stepType: 'pipeline',
          retries: 3,
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'retl-upsert-update'),
            type: 'identify',
            recordId: ctx.runId,
            context: retlContactContext(ctx),
            traits: { email: ctx.email(), ...retlContactUpdateTraits(ctx) },
          }),
        },
      ],
      verify: { check: verifyContactProperties(retlContactUpdateTraits), ...CONTACT_READBACK },
    },
    {
      // Additional-email resolution: HubSpot treats hs_additional_emails as aliases of a contact, so
      // an upsert keyed by the primary email and a later upsert keyed by the additional email must
      // land on the SAME contact id. We seed one contact carrying both addresses, upsert disjoint
      // traits by each email, then assert that single contact ends up with both sets.
      id: 'hs-retl-contacts-upsert-additional-email-v3',
      cleanup: deleteUpsertAdditionalEmailContacts,
      description:
        'RETL upsert by primary then by additional email resolves to the same contact via crm/v3 batch/upsert',
      steps: [
        { stepType: 'action', name: 'setup', run: createContactWithAdditionalEmail },
        {
          name: 'upsert by primary email',
          stepType: 'pipeline',
          retries: 3,
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'retl-upsert-primary'),
            type: 'identify',
            recordId: ctx.runId,
            context: retlContactContextForEmail(ctx.email()),
            traits: retlUpsertPrimaryTraits(ctx),
          }),
        },
        {
          name: 'upsert by additional email',
          stepType: 'pipeline',
          retries: 3,
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'retl-upsert-additional'),
            type: 'identify',
            recordId: ctx.runId,
            context: retlContactContextForEmail(ctx.email('additional')),
            traits: retlUpsertSecondaryTraits(ctx),
          }),
        },
      ],
      verify: { check: verifyUpsertResolvesToSameContact(retlUpsertCombinedTraits) },
    },
    {
      id: 'hs-retl-contacts-create-v1',
      cleanup: deleteContactByEmail,
      description: 'RETL mappedToDestination identify creates a contact via the v1 transform',
      configOverride: (base) => ({ ...base, apiVersion: 'legacyApi' }),
      steps: [
        {
          name: 'retl create contact (v1 transform)',
          stepType: 'pipeline',
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'retl-contacts-v1'),
            type: 'identify',
            recordId: ctx.runId,
            context: retlContactContext(ctx),
            traits: { email: ctx.email(), ...retlContactCreateV1Traits(ctx) },
          }),
        },
      ],
      verify: { check: verifyContactProperties(retlContactCreateV1Traits), ...CONTACT_READBACK },
    },
    {
      id: 'hs-retl-contacts-update-v1',
      cleanup: deleteContactByEmail,
      description:
        'RETL mappedToDestination identify updates an existing contact via the v1 transform',
      configOverride: (base) => ({ ...base, apiVersion: 'legacyApi' }),
      steps: [
        { stepType: 'action', name: 'setup', run: createContactAndWaitSearchable },
        {
          name: 'retl update contact (v1 transform)',
          stepType: 'pipeline',
          // RETL splits create-vs-update via HubSpot's eventually-consistent search; retry so a
          // just-created contact that the first search misses (409) is found and updated.
          retries: 10,
          // Settle before the pipeline runs so HubSpot's Search index reflects the contact the
          // setup step just created; without it the create-vs-update split can miss it and 409.
          delayBeforeMs: 5000,
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'retl-update-v1'),
            type: 'identify',
            recordId: ctx.runId,
            context: retlContactContext(ctx),
            traits: { email: ctx.email(), ...retlContactUpdateV1Traits(ctx) },
          }),
        },
      ],
      verify: { check: verifyContactProperties(retlContactUpdateV1Traits), ...CONTACT_READBACK },
    },
    {
      id: 'hs-retl-associations-v3',
      description: 'RETL association between two objects (crm/v3/associations)',
      cleanup: deleteAssociationObjects,
      steps: [
        { stepType: 'action', name: 'setup', run: createAssociationObjects },
        {
          name: 'retl associate',
          stepType: 'pipeline',
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'retl-assoc'),
            type: 'identify',
            recordId: ctx.runId,
            traits: {
              to: { id: registeredId(ctx, ASSOC_TO_TYPE) },
              from: { id: registeredId(ctx, ASSOC_FROM_TYPE) },
            },
            context: {
              mappedToDestination: true,
              externalId: [
                {
                  id: registeredId(ctx, ASSOC_FROM_TYPE),
                  type: 'HS-association',
                  toObjectType: ASSOC_TO_TYPE,
                  fromObjectType: ASSOC_FROM_TYPE,
                  identifierType: 'id',
                  associationTypeId: 'company_to_contact',
                },
              ],
            },
          }),
        },
      ],
      verify: { check: verifyAssociationExists },
    },
    {
      // Record id (hs_object_id) identifier: the transform addresses the record directly with a
      // batch/update — no Search, so no settle delay or retries are needed after setup.
      id: 'hs-retl-contacts-update-by-record-id-v3',
      cleanup: deleteRegisteredObjects,
      description:
        'RETL identify keyed by hs_object_id updates the contact directly (crm/v3 batch/update, no search)',
      steps: [
        { stepType: 'action', name: 'setup', run: createContactAndRegisterId },
        {
          name: 'retl update contact by record id',
          stepType: 'pipeline',
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'retl-record-id'),
            type: 'identify',
            recordId: ctx.runId,
            context: retlRecordIdContext(registeredId(ctx, 'contacts')),
            traits: retlRecordIdUpdateTraits(ctx),
          }),
        },
      ],
      verify: {
        check: verifyRegisteredObjectProperties('contacts', retlRecordIdUpdateTraits),
        ...CONTACT_READBACK,
      },
    },
    {
      // HubSpot rejects a batch/update carrying the same id twice, so the two events for the first
      // contact must be merged into one input for this single request to land.
      id: 'hs-retl-contacts-update-by-record-id-batch-v3',
      cleanup: deleteRegisteredObjects,
      description:
        'RETL record id batch with a duplicate id is merged and delivered as one crm/v3 batch/update',
      steps: [
        { stepType: 'action', name: 'setup', run: createTwoContactsAndRegisterIds },
        {
          name: 'retl update two contacts by record id in one batch',
          stepType: 'pipeline',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => {
            const [firstId, secondId] = registeredIds(ctx, 'contacts');
            return [
              {
                ...baseTimestamps(ctx, 'retl-record-id-dup-1'),
                type: 'identify',
                recordId: ctx.runId,
                context: retlRecordIdContext(firstId),
                traits: retlRecordIdDupFirstTraits(ctx),
              },
              {
                ...baseTimestamps(ctx, 'retl-record-id-dup-2'),
                type: 'identify',
                recordId: ctx.runId,
                context: retlRecordIdContext(firstId),
                traits: retlRecordIdDupSecondTraits(ctx),
              },
              {
                ...baseTimestamps(ctx, 'retl-record-id-other'),
                type: 'identify',
                recordId: ctx.runId,
                context: retlRecordIdContext(secondId),
                traits: retlRecordIdOtherContactTraits(ctx),
              },
            ];
          },
        },
      ],
      verify: {
        check: verifyRecordIdBatch(retlRecordIdDupCombinedTraits, retlRecordIdOtherContactTraits),
        ...CONTACT_READBACK,
      },
    },
    {
      id: 'hs-retl-contacts-update-by-record-id-v1',
      cleanup: deleteRegisteredObjects,
      description:
        'RETL identify keyed by hs_object_id updates the contact directly via the v1 transform (no search)',
      configOverride: (base) => ({ ...base, apiVersion: 'legacyApi' }),
      steps: [
        { stepType: 'action', name: 'setup', run: createContactAndRegisterId },
        {
          name: 'retl update contact by record id (v1 transform)',
          stepType: 'pipeline',
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'retl-record-id-v1'),
            type: 'identify',
            recordId: ctx.runId,
            context: retlRecordIdContext(registeredId(ctx, 'contacts')),
            traits: retlRecordIdUpdateTraits(ctx),
          }),
        },
      ],
      verify: {
        check: verifyRegisteredObjectProperties('contacts', retlRecordIdUpdateTraits),
        ...CONTACT_READBACK,
      },
    },
    {
      // Exercises the v1 update batching's duplicate-id merge against HubSpot.
      id: 'hs-retl-contacts-update-by-record-id-batch-v1',
      cleanup: deleteRegisteredObjects,
      description:
        'RETL record id batch with a duplicate id is merged and delivered as one batch/update via the v1 transform',
      configOverride: (base) => ({ ...base, apiVersion: 'legacyApi' }),
      steps: [
        { stepType: 'action', name: 'setup', run: createTwoContactsAndRegisterIds },
        {
          name: 'retl update two contacts by record id in one batch (v1 transform)',
          stepType: 'pipeline',
          expectedOutputs: 1,
          expectedProxyRequests: 1,
          seed: (ctx) => {
            const [firstId, secondId] = registeredIds(ctx, 'contacts');
            return [
              {
                ...baseTimestamps(ctx, 'retl-record-id-v1-dup-1'),
                type: 'identify',
                recordId: ctx.runId,
                context: retlRecordIdContext(firstId),
                traits: retlRecordIdDupFirstTraits(ctx),
              },
              {
                ...baseTimestamps(ctx, 'retl-record-id-v1-dup-2'),
                type: 'identify',
                recordId: ctx.runId,
                context: retlRecordIdContext(firstId),
                traits: retlRecordIdDupSecondTraits(ctx),
              },
              {
                ...baseTimestamps(ctx, 'retl-record-id-v1-other'),
                type: 'identify',
                recordId: ctx.runId,
                context: retlRecordIdContext(secondId),
                traits: retlRecordIdOtherContactTraits(ctx),
              },
            ];
          },
        },
      ],
      verify: {
        check: verifyRecordIdBatch(retlRecordIdDupCombinedTraits, retlRecordIdOtherContactTraits),
        ...CONTACT_READBACK,
      },
    },
    {
      id: 'hs-retl-companies-update-by-record-id-v3',
      cleanup: deleteRegisteredObjects,
      description:
        'RETL identify keyed by hs_object_id updates a company directly (crm/v3 batch/update, no search)',
      steps: [
        { stepType: 'action', name: 'setup', run: createCompanyAndRegisterId },
        {
          name: 'retl update company by record id',
          stepType: 'pipeline',
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'retl-record-id-company'),
            type: 'identify',
            recordId: ctx.runId,
            context: retlRecordIdContext(registeredId(ctx, 'companies'), 'companies'),
            traits: retlRecordIdCompanyTraits(ctx),
          }),
        },
      ],
      verify: {
        check: verifyRegisteredObjectProperties('companies', retlRecordIdCompanyTraits),
        ...CONTACT_READBACK,
      },
    },
    {
      // A record id that no longer exists in HubSpot must fail delivery — never create a record.
      // Also pins HubSpot's batch/update response for a missing id: a 207 here would read as
      // delivered and fail this step.
      id: 'hs-retl-contacts-update-by-stale-record-id-v3',
      cleanup: deleteRegisteredObjects,
      description: 'RETL update keyed by a deleted hs_object_id fails delivery',
      steps: [
        { stepType: 'action', name: 'setup', run: createAndDeleteContact },
        {
          name: 'retl update deleted contact by record id',
          stepType: 'pipeline',
          expectedFailure: { items: [0] },
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'retl-record-id-stale'),
            type: 'identify',
            recordId: ctx.runId,
            context: retlRecordIdContext(registeredId(ctx, 'contacts')),
            traits: retlRecordIdUpdateTraits(ctx),
          }),
        },
      ],
    },
  ],
} satisfies LiveSpec;

export default live;

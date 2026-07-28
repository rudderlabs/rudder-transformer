import { LiveSpec } from '../../../live/types';
import { HS_RETL_SPLIT_TEST_WORKSPACE_ID } from '../router/retlSplitData';
import {
  ASSOC_FROM_TYPE,
  ASSOC_TO_TYPE,
  deleteAssociationObjects,
  deleteContactByEmail,
  registeredId,
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
  retlContactCreateTraits,
  retlContactCreateV1Traits,
  retlContactUpdateTraits,
  retlContactUpdateV1Traits,
} from './profiles';
import {
  createAssociationObjects,
  createContactAndRegisterId,
  createContactAndWaitSearchable,
  createContactSearchableByFirstname,
} from './setup';
import { verifyAssociationExists, verifyContactProperties } from './verify';

export const live: LiveSpec = {
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
      verify: { check: verifyContactProperties(esContactCreateTraits) },
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
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'es-contacts-update'),
            type: 'identify',
            context: esLibrary,
            traits: { email: ctx.email(), ...esContactUpdateTraits(ctx) },
            integrations: { All: true },
          }),
        },
      ],
      verify: { check: verifyContactProperties(esContactUpdateTraits) },
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
      verify: { check: verifyContactProperties(esContactCreateV1Traits) },
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
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'es-contacts-update-v1'),
            type: 'identify',
            traits: { email: ctx.email(), ...esContactUpdateV1Traits(ctx) },
          }),
        },
      ],
      verify: { check: verifyContactProperties(esContactUpdateV1Traits) },
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
      verify: { check: verifyContactProperties(esDontBatchV3Traits) },
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
      verify: { check: verifyContactProperties(esDontBatchV1Traits) },
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
      verify: { check: verifyContactProperties(esByHsContactIdTraits) },
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
      verify: { check: verifyContactProperties(esNonUniqueCreateTraits) },
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
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'es-nonunique-existing'),
            type: 'identify',
            context: esLibrary,
            traits: { email: ctx.email(), ...esNonUniqueUpdateTraits(ctx) },
            integrations: { All: true },
          }),
        },
      ],
      verify: { check: verifyContactProperties(esNonUniqueUpdateTraits) },
    },
    {
      id: 'hs-retl-contacts-create-v3',
      cleanup: deleteContactByEmail,
      description: 'RETL mappedToDestination identify creates a contact (crm/v3 batch/create)',
      steps: [
        {
          name: 'retl create contact',
          stepType: 'pipeline',
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'retl-contacts'),
            type: 'identify',
            recordId: ctx.runId,
            context: retlContactContext(ctx),
            traits: { email: ctx.email(), ...retlContactCreateTraits(ctx) },
          }),
        },
      ],
      verify: { check: verifyContactProperties(retlContactCreateTraits) },
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
          retries: 3,
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'retl-update'),
            type: 'identify',
            recordId: ctx.runId,
            context: retlContactContext(ctx),
            traits: { email: ctx.email(), ...retlContactUpdateTraits(ctx) },
          }),
        },
      ],
      verify: { check: verifyContactProperties(retlContactUpdateTraits) },
    },
    {
      // Exercises the gated rETL upsert path (crm/v3/objects/:objectType/batch/upsert):
      // the contact is created upfront (like the other update scenarios), then a gated
      // rETL identify updates it by its unique identifier (email) with no prior search.
      // When the identifier is a unique property in the account the write lands via the
      // batch/upsert endpoint; otherwise it falls back to create/update — the read-back
      // assertion holds either way.
      id: 'hs-retl-contacts-upsert-v3-split',
      cleanup: deleteContactByEmail,
      description:
        'RETL mappedToDestination identify upserts (updates) an existing contact via crm/v3 batch/upsert by unique identifier (gated rETL split path)',
      steps: [
        { stepType: 'action', name: 'setup', run: createContactAndWaitSearchable },
        {
          name: 'retl upsert contact (update by unique identifier)',
          stepType: 'pipeline',
          metadataOverride: { workspaceId: HS_RETL_SPLIT_TEST_WORKSPACE_ID },
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'retl-upsert-update'),
            type: 'identify',
            recordId: ctx.runId,
            context: retlContactContext(ctx),
            traits: { email: ctx.email(), ...retlContactUpdateTraits(ctx) },
          }),
        },
      ],
      verify: { check: verifyContactProperties(retlContactUpdateTraits) },
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
      verify: { check: verifyContactProperties(retlContactCreateV1Traits) },
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
          retries: 3,
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'retl-update-v1'),
            type: 'identify',
            recordId: ctx.runId,
            context: retlContactContext(ctx),
            traits: { email: ctx.email(), ...retlContactUpdateV1Traits(ctx) },
          }),
        },
      ],
      verify: { check: verifyContactProperties(retlContactUpdateV1Traits) },
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

    // ─── Gated rETL split-path duplicates ───
    // Same rETL scenarios, re-run with the allow-listed workspaceId
    // (DEST_HS_RETL_SPLIT_WORKSPACE_IDS, set in test/setup.ts) so
    // shouldUseHsRetlSplitPath routes them through retl-transform. Delivery must
    // be identical to the ungated scenarios above.
    {
      id: 'hs-retl-contacts-create-v3-retl-split',
      cleanup: deleteContactByEmail,
      description:
        'RETL mappedToDestination identify creates a contact (crm/v3 batch/create) (gated rETL split path)',
      steps: [
        {
          name: 'retl create contact',
          stepType: 'pipeline',
          metadataOverride: { workspaceId: HS_RETL_SPLIT_TEST_WORKSPACE_ID },
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'retl-contacts-split'),
            type: 'identify',
            recordId: ctx.runId,
            context: retlContactContext(ctx),
            traits: { email: ctx.email(), ...retlContactCreateTraits(ctx) },
          }),
        },
      ],
      verify: { check: verifyContactProperties(retlContactCreateTraits) },
    },
    {
      id: 'hs-retl-contacts-update-v3-retl-split',
      cleanup: deleteContactByEmail,
      description:
        'RETL mappedToDestination identify updates an existing contact (crm/v3 batch/update) (gated rETL split path)',
      steps: [
        { stepType: 'action', name: 'setup', run: createContactAndWaitSearchable },
        {
          name: 'retl update contact',
          stepType: 'pipeline',
          metadataOverride: { workspaceId: HS_RETL_SPLIT_TEST_WORKSPACE_ID },
          // RETL splits create-vs-update via HubSpot's eventually-consistent search; retry so a
          // just-created contact that the first search misses (409) is found and updated.
          retries: 3,
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'retl-update-split'),
            type: 'identify',
            recordId: ctx.runId,
            context: retlContactContext(ctx),
            traits: { email: ctx.email(), ...retlContactUpdateTraits(ctx) },
          }),
        },
      ],
      verify: { check: verifyContactProperties(retlContactUpdateTraits) },
    },
    {
      id: 'hs-retl-contacts-create-v1-retl-split',
      cleanup: deleteContactByEmail,
      description:
        'RETL mappedToDestination identify creates a contact via the v1 transform (gated rETL split path)',
      configOverride: (base) => ({ ...base, apiVersion: 'legacyApi' }),
      steps: [
        {
          name: 'retl create contact (v1 transform)',
          stepType: 'pipeline',
          metadataOverride: { workspaceId: HS_RETL_SPLIT_TEST_WORKSPACE_ID },
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'retl-contacts-v1-split'),
            type: 'identify',
            recordId: ctx.runId,
            context: retlContactContext(ctx),
            traits: { email: ctx.email(), ...retlContactCreateV1Traits(ctx) },
          }),
        },
      ],
      verify: { check: verifyContactProperties(retlContactCreateV1Traits) },
    },
    {
      id: 'hs-retl-contacts-update-v1-retl-split',
      cleanup: deleteContactByEmail,
      description:
        'RETL mappedToDestination identify updates an existing contact via the v1 transform (gated rETL split path)',
      configOverride: (base) => ({ ...base, apiVersion: 'legacyApi' }),
      steps: [
        { stepType: 'action', name: 'setup', run: createContactAndWaitSearchable },
        {
          name: 'retl update contact (v1 transform)',
          stepType: 'pipeline',
          metadataOverride: { workspaceId: HS_RETL_SPLIT_TEST_WORKSPACE_ID },
          // RETL splits create-vs-update via HubSpot's eventually-consistent search; retry so a
          // just-created contact that the first search misses (409) is found and updated.
          retries: 3,
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'retl-update-v1-split'),
            type: 'identify',
            recordId: ctx.runId,
            context: retlContactContext(ctx),
            traits: { email: ctx.email(), ...retlContactUpdateV1Traits(ctx) },
          }),
        },
      ],
      verify: { check: verifyContactProperties(retlContactUpdateV1Traits) },
    },
    {
      id: 'hs-retl-associations-v3-retl-split',
      description:
        'RETL association between two objects (crm/v3/associations) (gated rETL split path)',
      cleanup: deleteAssociationObjects,
      steps: [
        { stepType: 'action', name: 'setup', run: createAssociationObjects },
        {
          name: 'retl associate',
          stepType: 'pipeline',
          metadataOverride: { workspaceId: HS_RETL_SPLIT_TEST_WORKSPACE_ID },
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'retl-assoc-split'),
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
  ],
};

export default live;

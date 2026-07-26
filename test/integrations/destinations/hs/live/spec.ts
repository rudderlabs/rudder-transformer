import { LiveSpec } from '../../../live/types';
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

// Matches DEST_HS_RETL_SPLIT_WORKSPACE_IDS set in test/setup.ts. An rETL event
// whose metadata.workspaceId is in that allow-list is routed through the
// dedicated rETL split code path (retl-transform.ts) instead of the legacy
// interleaved one. Each rETL scenario below is duplicated with this workspaceId
// set on the pipeline step so the split path is exercised against real HubSpot;
// the split is behaviour-preserving, so the duplicate must land the same write.
const HS_RETL_SPLIT_WORKSPACE_ID = 'retl-split-ws';

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
        verifyContactProperties(esContactCreateTraits),
      ],
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
        verifyContactProperties(esContactUpdateTraits),
      ],
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
        verifyContactProperties(esContactCreateV1Traits),
      ],
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
        verifyContactProperties(esContactUpdateV1Traits),
      ],
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
        verifyContactProperties(esDontBatchV3Traits),
      ],
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
        verifyContactProperties(esDontBatchV1Traits),
      ],
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
        verifyContactProperties(esByHsContactIdTraits),
      ],
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
        verifyContactProperties(esNonUniqueCreateTraits),
      ],
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
        verifyContactProperties(esNonUniqueUpdateTraits),
      ],
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
        verifyContactProperties(retlContactCreateTraits),
      ],
    },
    {
      id: 'hs-retl-contacts-create-v3-split',
      cleanup: deleteContactByEmail,
      description:
        'RETL mappedToDestination identify creates a contact (crm/v3 batch/create) (gated rETL split path)',
      steps: [
        {
          name: 'retl create contact (split path)',
          stepType: 'pipeline',
          metadataOverride: { workspaceId: HS_RETL_SPLIT_WORKSPACE_ID },
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'retl-contacts-split'),
            type: 'identify',
            recordId: ctx.runId,
            context: retlContactContext(ctx),
            traits: { email: ctx.email(), ...retlContactCreateTraits(ctx) },
          }),
        },
        verifyContactProperties(retlContactCreateTraits),
      ],
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
        verifyContactProperties(retlContactUpdateTraits),
      ],
    },
    {
      id: 'hs-retl-contacts-update-v3-split',
      cleanup: deleteContactByEmail,
      description:
        'RETL mappedToDestination identify updates an existing contact (crm/v3 batch/update) (gated rETL split path)',
      steps: [
        { stepType: 'action', name: 'setup', run: createContactAndWaitSearchable },
        {
          name: 'retl update contact (split path)',
          stepType: 'pipeline',
          metadataOverride: { workspaceId: HS_RETL_SPLIT_WORKSPACE_ID },
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
        verifyContactProperties(retlContactUpdateTraits),
      ],
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
        verifyContactProperties(retlContactCreateV1Traits),
      ],
    },
    {
      id: 'hs-retl-contacts-create-v1-split',
      cleanup: deleteContactByEmail,
      description:
        'RETL mappedToDestination identify creates a contact via the v1 transform (gated rETL split path)',
      configOverride: (base) => ({ ...base, apiVersion: 'legacyApi' }),
      steps: [
        {
          name: 'retl create contact (v1 transform, split path)',
          stepType: 'pipeline',
          metadataOverride: { workspaceId: HS_RETL_SPLIT_WORKSPACE_ID },
          seed: (ctx) => ({
            ...baseTimestamps(ctx, 'retl-contacts-v1-split'),
            type: 'identify',
            recordId: ctx.runId,
            context: retlContactContext(ctx),
            traits: { email: ctx.email(), ...retlContactCreateV1Traits(ctx) },
          }),
        },
        verifyContactProperties(retlContactCreateV1Traits),
      ],
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
        verifyContactProperties(retlContactUpdateV1Traits),
      ],
    },
    {
      id: 'hs-retl-contacts-update-v1-split',
      cleanup: deleteContactByEmail,
      description:
        'RETL mappedToDestination identify updates an existing contact via the v1 transform (gated rETL split path)',
      configOverride: (base) => ({ ...base, apiVersion: 'legacyApi' }),
      steps: [
        { stepType: 'action', name: 'setup', run: createContactAndWaitSearchable },
        {
          name: 'retl update contact (v1 transform, split path)',
          stepType: 'pipeline',
          metadataOverride: { workspaceId: HS_RETL_SPLIT_WORKSPACE_ID },
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
        verifyContactProperties(retlContactUpdateV1Traits),
      ],
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
        verifyAssociationExists,
      ],
    },
    {
      id: 'hs-retl-associations-v3-split',
      description:
        'RETL association between two objects (crm/v3/associations) (gated rETL split path)',
      cleanup: deleteAssociationObjects,
      steps: [
        { stepType: 'action', name: 'setup', run: createAssociationObjects },
        {
          name: 'retl associate (split path)',
          stepType: 'pipeline',
          metadataOverride: { workspaceId: HS_RETL_SPLIT_WORKSPACE_ID },
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
        verifyAssociationExists,
      ],
    },
  ],
};

export default live;

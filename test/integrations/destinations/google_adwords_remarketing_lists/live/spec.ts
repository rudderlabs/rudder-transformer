import { requiredResourceId } from '../../../live/secretResolver';
import type { LiveSpec } from '../../../live/types';
import { contactIdentifiers, ipIdentifiers, memberWithIp, nulled, recordSeed } from './profiles';

const DEST = 'google_adwords_remarketing_lists';

// What a run exercises, end to end, against a real Google Ads Customer Match list:
//
//   1. rudder-auth mints an access token from the stored refresh token,
//   2. the VDM-v2 record transform builds AudienceMembers on the Data Manager path, and
//   3. delivery POSTs them to `datamanager.googleapis.com/v1/audienceMembers:ingest` / `:remove`.
//
// The focus is members carrying BOTH user identifiers and IP data: once a connection maps `userIp`,
// every member is sent as `compositeData` (nested `userData` and/or `ipData`). Google rejects a
// request that mixes `compositeData` members with top-level `userData` ones
// (MULTIPLE_DATA_TYPES_NOT_ALLOWED), and that only shows up against the real API.
//
// There is no read-back `verify`: the Data Manager API exposes no way to read list members back,
// and list sizes update asynchronously (hours). The assertion is the delivery verdict — a payload
// Google rejects comes back as a 4xx and fails the step.
//
// Not ported from the component suite: shape-only cases (IP-only member construction, invalid IP
// handling, timestamp normalization) that never depend on Google's response.

const scenarios = [
  {
    id: 'garl-dm-ingest-remove-identifiers-and-ip',
    description:
      'A member with hashed email + address identifiers AND an IPv4 with an observation window is ingested as compositeData { userData, ipData }, then removed with the same shape',
    steps: [
      {
        stepType: 'pipeline',
        name: 'ingest member with user identifiers and IP data',
        expectedOutputs: 1,
        expectedProxyRequests: 1,
        seed: (ctx) => recordSeed(ctx, 'ingest', 'insert', memberWithIp(ctx, 'member')),
      },
      {
        stepType: 'pipeline',
        name: 'remove the same member',
        expectedOutputs: 1,
        expectedProxyRequests: 1,
        seed: (ctx) => recordSeed(ctx, 'remove', 'delete', memberWithIp(ctx, 'member')),
      },
    ],
  },
  {
    id: 'garl-dm-ingest-mixed-batch',
    description:
      'Rows with and without IP data in ONE ingest request — every member is compositeData, so Google accepts the batch instead of rejecting it with MULTIPLE_DATA_TYPES_NOT_ALLOWED',
    steps: [
      {
        stepType: 'pipeline',
        name: 'ingest identifiers+IPv6, identifiers-only and IP-only rows together',
        // The point of the scenario: all three rows land in one request. A regression that split
        // them (or that mixed member shapes inside it) would otherwise go unnoticed or fail as a
        // whole-batch 400.
        expectedOutputs: 1,
        expectedProxyRequests: 1,
        seed: (ctx) => [
          recordSeed(ctx, 'mixed-ipv6', 'insert', memberWithIp(ctx, 'mixed-ipv6', 'v6')),
          recordSeed(ctx, 'mixed-no-ip', 'insert', {
            ...contactIdentifiers(ctx, 'mixed-no-ip'),
            ...nulled(ipIdentifiers(ctx)),
          }),
          recordSeed(ctx, 'mixed-ip-only', 'insert', {
            ...nulled(contactIdentifiers(ctx, 'mixed-ip-only')),
            ...ipIdentifiers(ctx),
          }),
        ],
      },
    ],
  },
] satisfies LiveSpec['scenarios'];

export const live = {
  // Credentials come from the LIVE_SECRET_GOOGLE_ADWORDS_REMARKETING_LISTS field on
  // engineering_shared/data/integrations_team/e2e_test/rudder-transformer (single-line LiveSecret
  // JSON):
  //
  //   {"authType":"oauth",
  //    "config":{"customerId":"<10-digit Google Ads customer id>"},
  //    "resourceIds":{"audienceId":"<CRM_BASED Customer Match list id in that account>"},
  //    "oauthRefresh":{"refreshToken":"<refresh token granted with the datamanager scope>"}}
  //
  // The refresh token must come from a Google user with access to that customer. Every run uploads
  // hashed test emails (sink domain) and documentation-range IPs to that list; the ingest/remove
  // scenario takes its member back out, the mixed batch is left in the sandbox list.
  enabled: true,
  authType: 'oauth',
  // rudder-auth's v1 route answers with '{ access_token }', the key the Data Manager transform reads.
  oauthVersion: 'v1',
  // Not the `_OAUTH` definition the destination name suggests: GARL has a separate Data Manager
  // definition, which requests the `datamanager` scope and is what routes the transform to the
  // Data Manager API (the runner attaches it as destination.deliveryAccount).
  accountDefinition: {
    type: DEST,
    name: 'DESTINATION_GOOGLE_ADWORDS_REMARKETING_LISTS_DM_OAUTH',
  },
  resolveConfig: (s) => ({
    rudderAccountId: 'live-dm-account',
    subAccount: false,
    ...s.config,
  }),
  // VDM-v2 rETL connection: schemaVersion 1.1 routes records through processVDMV2RecordEvents, and
  // the list, list type and hashing come from here rather than from destination.Config.
  resolveConnection: (s) => ({
    destination: {
      schemaVersion: '1.1',
      typeOfList: 'General',
      audienceId: requiredResourceId(s, DEST, 'audienceId', 'a CRM_BASED Customer Match list id'),
      isHashRequired: true,
      userDataConsent: 'UNSPECIFIED',
      personalizationConsent: 'UNSPECIFIED',
    },
  }),
  scenarios,
} satisfies LiveSpec;

export default live;

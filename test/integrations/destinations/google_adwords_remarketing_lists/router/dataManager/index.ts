/**
 * GARL (Google Ads Remarketing Lists) - Router Tests (Data Manager API)
 *
 * Mirrors the existing router/data.ts tests but routes through the DM API path:
 *   - workspaceId = 'dm-enabled-workspaceId' (registered in test/setup.ts)
 *   - access_token = secret4 (tokenInfo mock returns datamanager scope in network.ts)
 *
 * Redis mocking is applied via mockFns to avoid ETIMEDOUT during feature-flag checks.
 */

import { RedisDB } from '../../../../../../src/util/redis/redisConnector';
import { secret4, authHeader4 } from '../../maskedSecrets';
import { dmAudienceRequest } from './audience';
import {
  dmDestination,
  dmEventStreamRecordRouterRequest,
  dmRETLRecordRouterRequestVDMv1,
  dmRETLRecordRouterRequest,
  dmRETLRecordRouterRequestVDMv2General,
  dmRETLRecordRouterRequestVDMv2UserId,
  dmEventStreamRecordPreHashedRequest,
  dmEventStreamRecordHashOffRequest,
  dmFieldStrippingRequest,
  dmAllFieldsInvalidRequest,
  dmRETLRecordRouterRequestForVDMV2Flow,
} from './record';

const DM_WORKSPACE_ID = 'dm-enabled-workspaceId';

// ── Redis mock ────────────────────────────────────────────────────────────────
const mockFns = (_: unknown) => {
  jest.spyOn(RedisDB, 'getVal').mockResolvedValue(null);
  jest.spyOn(RedisDB, 'setVal').mockResolvedValue(undefined);
};

// ── Test cases ────────────────────────────────────────────────────────────────
export const dmRouterData = [
  // ── Test 01: EventStream record — single insert → DM ingest ───────────────
  {
    id: 'garl-dm-router-01',
    name: 'google_adwords_remarketing_lists',
    description: '[DM API] EventStream record insert → audienceMembers:ingest',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: { request: { body: dmEventStreamRecordRouterRequest, method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://datamanager.googleapis.com/v1/audienceMembers:ingest',
                  endpointPath: '/v1/audienceMembers:ingest',
                  headers: { Authorization: authHeader4, 'Content-Type': 'application/json' },
                  params: {},
                  body: {
                    JSON: {
                      destinations: [
                        {
                          operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
                          productDestinationId: '7090784486',
                        },
                      ],
                      audienceMembers: [
                        {
                          consent: {
                            adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
                            adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                          },
                          userData: {
                            userIdentifiers: [
                              {
                                emailAddress:
                                  'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
                              },
                              {
                                phoneNumber:
                                  '5a335f50a6bbaffd39b35513350adb4be1e598ab75b9740c2ba82a160862e82f',
                              },
                              {
                                addressInfo: {
                                  givenName:
                                    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                                  familyName:
                                    'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
                                  regionCode: 'US',
                                  postalCode: '1245',
                                },
                              },
                            ],
                          },
                        },
                      ],
                      encoding: 'HEX',
                      consent: {
                        adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
                        adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                      },
                      termsOfService: { customerMatchTermsOfServiceStatus: 'ACCEPTED' },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 2,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: DM_WORKSPACE_ID,
                  secret: { access_token: secret4 },
                  dontBatch: false,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: dmDestination,
            },
          ],
        },
      },
    },
    mockFns,
  },

  // ── Test 02: VDMv1 record insert → DM ingest ──────────────────────────────
  {
    id: 'garl-dm-router-02',
    name: 'google_adwords_remarketing_lists',
    description: '[DM API] VDMv1 record insert → audienceMembers:ingest',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: { request: { body: dmRETLRecordRouterRequestVDMv1, method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://datamanager.googleapis.com/v1/audienceMembers:ingest',
                  endpointPath: '/v1/audienceMembers:ingest',
                  headers: { Authorization: authHeader4, 'Content-Type': 'application/json' },
                  params: {},
                  body: {
                    JSON: {
                      destinations: [
                        {
                          operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
                          productDestinationId: '7090784486',
                        },
                      ],
                      audienceMembers: [
                        {
                          consent: {
                            adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
                            adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                          },
                          userData: {
                            userIdentifiers: [
                              {
                                emailAddress:
                                  'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
                              },
                              {
                                phoneNumber:
                                  '5a335f50a6bbaffd39b35513350adb4be1e598ab75b9740c2ba82a160862e82f',
                              },
                              {
                                addressInfo: {
                                  givenName:
                                    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                                  familyName:
                                    'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
                                  regionCode: 'US',
                                  postalCode: '1245',
                                },
                              },
                            ],
                          },
                        },
                      ],
                      encoding: 'HEX',
                      consent: {
                        adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
                        adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                      },
                      termsOfService: { customerMatchTermsOfServiceStatus: 'ACCEPTED' },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 3,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: DM_WORKSPACE_ID,
                  secret: { access_token: secret4 },
                  dontBatch: false,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: dmDestination,
            },
          ],
        },
      },
    },
    mockFns,
  },

  // ── Test 03: Audiencelist — add-only, remove-only, add+remove ─────────────
  {
    id: 'garl-dm-router-03',
    name: 'google_adwords_remarketing_lists',
    description: '[DM API] Audiencelist: add→ingest, remove→remove, add+remove→both',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: { request: { body: dmAudienceRequest, method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            // event 1 (jobId=1): add only → ingest
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://datamanager.googleapis.com/v1/audienceMembers:ingest',
                  endpointPath: '/v1/audienceMembers:ingest',
                  headers: { Authorization: authHeader4, 'Content-Type': 'application/json' },
                  params: {},
                  body: {
                    JSON: {
                      destinations: [
                        {
                          operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
                          productDestinationId: '7090784486',
                        },
                      ],
                      audienceMembers: [
                        {
                          consent: {
                            adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
                            adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                          },
                          userData: {
                            userIdentifiers: [
                              {
                                emailAddress:
                                  'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
                              },
                              {
                                phoneNumber:
                                  '5a335f50a6bbaffd39b35513350adb4be1e598ab75b9740c2ba82a160862e82f',
                              },
                              {
                                addressInfo: {
                                  givenName:
                                    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                                  familyName:
                                    'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
                                  regionCode: 'US',
                                  postalCode: '1245',
                                },
                              },
                            ],
                          },
                        },
                      ],
                      encoding: 'HEX',
                      consent: {
                        adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
                        adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                      },
                      termsOfService: { customerMatchTermsOfServiceStatus: 'ACCEPTED' },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: DM_WORKSPACE_ID,
                  secret: { access_token: secret4 },
                  dontBatch: false,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: dmDestination,
            },
            // event 2 (jobId=3): remove only → remove
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://datamanager.googleapis.com/v1/audienceMembers:remove',
                  endpointPath: '/v1/audienceMembers:remove',
                  headers: { Authorization: authHeader4, 'Content-Type': 'application/json' },
                  params: {},
                  body: {
                    JSON: {
                      destinations: [
                        {
                          operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
                          productDestinationId: '7090784486',
                        },
                      ],
                      audienceMembers: [
                        {
                          consent: {
                            adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
                            adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                          },
                          userData: {
                            userIdentifiers: [
                              {
                                emailAddress:
                                  'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
                              },
                              {
                                phoneNumber:
                                  '5a335f50a6bbaffd39b35513350adb4be1e598ab75b9740c2ba82a160862e82f',
                              },
                              {
                                addressInfo: {
                                  givenName:
                                    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                                  familyName:
                                    'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
                                  regionCode: 'US',
                                  postalCode: '1245',
                                },
                              },
                            ],
                          },
                        },
                      ],
                      encoding: 'HEX',
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 3,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: DM_WORKSPACE_ID,
                  secret: { access_token: secret4 },
                  dontBatch: false,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: dmDestination,
            },
            // event 3 (jobId=4): add+remove → [ingest, remove]
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://datamanager.googleapis.com/v1/audienceMembers:ingest',
                  endpointPath: '/v1/audienceMembers:ingest',
                  headers: { Authorization: authHeader4, 'Content-Type': 'application/json' },
                  params: {},
                  body: {
                    JSON: {
                      destinations: [
                        {
                          operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
                          productDestinationId: '7090784486',
                        },
                      ],
                      audienceMembers: [
                        {
                          consent: {
                            adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
                            adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                          },
                          userData: {
                            userIdentifiers: [
                              {
                                emailAddress:
                                  'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
                              },
                              {
                                phoneNumber:
                                  '5a335f50a6bbaffd39b35513350adb4be1e598ab75b9740c2ba82a160862e82f',
                              },
                              {
                                addressInfo: {
                                  givenName:
                                    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                                  familyName:
                                    'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
                                  regionCode: 'US',
                                  postalCode: '1245',
                                },
                              },
                            ],
                          },
                        },
                      ],
                      encoding: 'HEX',
                      consent: {
                        adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
                        adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                      },
                      termsOfService: { customerMatchTermsOfServiceStatus: 'ACCEPTED' },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://datamanager.googleapis.com/v1/audienceMembers:remove',
                  endpointPath: '/v1/audienceMembers:remove',
                  headers: { Authorization: authHeader4, 'Content-Type': 'application/json' },
                  params: {},
                  body: {
                    JSON: {
                      destinations: [
                        {
                          operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
                          productDestinationId: '7090784486',
                        },
                      ],
                      audienceMembers: [
                        {
                          consent: {
                            adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
                            adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                          },
                          userData: {
                            userIdentifiers: [
                              {
                                emailAddress:
                                  'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
                              },
                              {
                                phoneNumber:
                                  '5a335f50a6bbaffd39b35513350adb4be1e598ab75b9740c2ba82a160862e82f',
                              },
                              {
                                addressInfo: {
                                  givenName:
                                    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                                  familyName:
                                    'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
                                  regionCode: 'US',
                                  postalCode: '1245',
                                },
                              },
                            ],
                          },
                        },
                      ],
                      encoding: 'HEX',
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 4,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: DM_WORKSPACE_ID,
                  secret: { access_token: secret4 },
                  dontBatch: false,
                },
              ],
              batched: false,
              statusCode: 200,
              destination: dmDestination,
            },
          ],
        },
      },
    },
    mockFns,
  },

  // ── Test 04: Record events — delete/insert/update/invalid action ──────────
  //   Output order: delete → insert → update → error(lol)
  {
    id: 'garl-dm-router-04',
    name: 'google_adwords_remarketing_lists',
    description: '[DM API] Record events: delete→remove, insert→ingest, update→ingest, lol→error',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: { request: { body: dmRETLRecordRouterRequest, method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            // delete (jobId=1) → remove
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://datamanager.googleapis.com/v1/audienceMembers:remove',
                  endpointPath: '/v1/audienceMembers:remove',
                  headers: { Authorization: authHeader4, 'Content-Type': 'application/json' },
                  params: {},
                  body: {
                    JSON: {
                      destinations: [
                        {
                          operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
                          productDestinationId: '7090784486',
                        },
                      ],
                      audienceMembers: [
                        {
                          consent: {
                            adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
                            adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                          },
                          userData: {
                            userIdentifiers: [
                              {
                                emailAddress:
                                  'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
                              },
                              {
                                phoneNumber:
                                  '5a335f50a6bbaffd39b35513350adb4be1e598ab75b9740c2ba82a160862e82f',
                              },
                              {
                                addressInfo: {
                                  givenName:
                                    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                                  familyName:
                                    'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
                                  regionCode: 'US',
                                  postalCode: '1245',
                                },
                              },
                            ],
                          },
                        },
                      ],
                      encoding: 'HEX',
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: DM_WORKSPACE_ID,
                  secret: { access_token: secret4 },
                  dontBatch: false,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: dmDestination,
            },
            // insert (jobIds 2,3) → ingest with 2 audienceMembers
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://datamanager.googleapis.com/v1/audienceMembers:ingest',
                  endpointPath: '/v1/audienceMembers:ingest',
                  headers: { Authorization: authHeader4, 'Content-Type': 'application/json' },
                  params: {},
                  body: {
                    JSON: {
                      destinations: [
                        {
                          operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
                          productDestinationId: '7090784486',
                        },
                      ],
                      audienceMembers: [
                        {
                          consent: {
                            adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
                            adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                          },
                          userData: {
                            userIdentifiers: [
                              {
                                emailAddress:
                                  'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
                              },
                              {
                                phoneNumber:
                                  '5a335f50a6bbaffd39b35513350adb4be1e598ab75b9740c2ba82a160862e82f',
                              },
                              {
                                addressInfo: {
                                  givenName:
                                    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                                  familyName:
                                    'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
                                  regionCode: 'US',
                                  postalCode: '1245',
                                },
                              },
                            ],
                          },
                        },
                        {
                          consent: {
                            adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
                            adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                          },
                          userData: {
                            userIdentifiers: [
                              {
                                emailAddress:
                                  'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
                              },
                              {
                                phoneNumber:
                                  '5a335f50a6bbaffd39b35513350adb4be1e598ab75b9740c2ba82a160862e82f',
                              },
                              {
                                addressInfo: {
                                  givenName:
                                    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                                  familyName:
                                    'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
                                  regionCode: 'US',
                                  postalCode: '1245',
                                },
                              },
                            ],
                          },
                        },
                      ],
                      encoding: 'HEX',
                      consent: {
                        adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
                        adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                      },
                      termsOfService: { customerMatchTermsOfServiceStatus: 'ACCEPTED' },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 2,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: DM_WORKSPACE_ID,
                  secret: { access_token: secret4 },
                  dontBatch: false,
                },
                {
                  jobId: 3,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: DM_WORKSPACE_ID,
                  secret: { access_token: secret4 },
                  dontBatch: false,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: dmDestination,
            },
            // update (jobId=4) → ingest
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://datamanager.googleapis.com/v1/audienceMembers:ingest',
                  endpointPath: '/v1/audienceMembers:ingest',
                  headers: { Authorization: authHeader4, 'Content-Type': 'application/json' },
                  params: {},
                  body: {
                    JSON: {
                      destinations: [
                        {
                          operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
                          productDestinationId: '7090784486',
                        },
                      ],
                      audienceMembers: [
                        {
                          consent: {
                            adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
                            adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                          },
                          userData: {
                            userIdentifiers: [
                              {
                                emailAddress:
                                  'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
                              },
                              {
                                phoneNumber:
                                  '5a335f50a6bbaffd39b35513350adb4be1e598ab75b9740c2ba82a160862e82f',
                              },
                              {
                                addressInfo: {
                                  givenName:
                                    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                                  familyName:
                                    'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
                                  regionCode: 'US',
                                  postalCode: '1245',
                                },
                              },
                            ],
                          },
                        },
                      ],
                      encoding: 'HEX',
                      consent: {
                        adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
                        adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                      },
                      termsOfService: { customerMatchTermsOfServiceStatus: 'ACCEPTED' },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 4,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: DM_WORKSPACE_ID,
                  secret: { access_token: secret4 },
                  dontBatch: false,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: dmDestination,
            },
            // lol (jobId=5) → 400 error
            {
              metadata: [
                {
                  jobId: 5,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: DM_WORKSPACE_ID,
                  secret: { access_token: secret4 },
                  dontBatch: false,
                },
              ],
              batched: false,
              statusCode: 400,
              error: 'Invalid action type in record event',
              statTags: {
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                destType: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                module: 'destination',
                implementation: 'native',
                feature: 'router',
                destinationId: 'default-destinationId',
                workspaceId: DM_WORKSPACE_ID,
              },
            },
          ],
        },
      },
    },
    mockFns,
  },

  // ── Test 05: VDMv2 General typeOfList insert → DM ingest ──────────────────
  {
    id: 'garl-dm-router-05',
    name: 'google_adwords_remarketing_lists',
    description: '[DM API] VDMv2 General typeOfList insert → audienceMembers:ingest',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: { request: { body: dmRETLRecordRouterRequestVDMv2General, method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://datamanager.googleapis.com/v1/audienceMembers:ingest',
                  endpointPath: '/v1/audienceMembers:ingest',
                  headers: { Authorization: authHeader4, 'Content-Type': 'application/json' },
                  params: {},
                  body: {
                    JSON: {
                      destinations: [
                        {
                          operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
                          productDestinationId: '7090784486',
                        },
                      ],
                      audienceMembers: [
                        {
                          consent: {
                            adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
                            adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                          },
                          userData: {
                            userIdentifiers: [
                              {
                                emailAddress:
                                  'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
                              },
                              {
                                phoneNumber:
                                  '5a335f50a6bbaffd39b35513350adb4be1e598ab75b9740c2ba82a160862e82f',
                              },
                              {
                                addressInfo: {
                                  givenName:
                                    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                                  familyName:
                                    'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
                                  regionCode: 'US',
                                  postalCode: '1245',
                                },
                              },
                            ],
                          },
                        },
                      ],
                      encoding: 'HEX',
                      consent: {
                        adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
                        adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                      },
                      termsOfService: { customerMatchTermsOfServiceStatus: 'ACCEPTED' },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: DM_WORKSPACE_ID,
                  secret: { access_token: secret4 },
                  dontBatch: false,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  rudderAccountId: '258Yea7usSKNpbkIaesL9oJ9iYw',
                  audienceId: '7090784486',
                  customerId: '7693729833',
                  loginCustomerId: '',
                  subAccount: false,
                },
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                Name: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                Enabled: true,
                WorkspaceID: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                DestinationDefinition: {
                  ID: '1aIXqM806xAVm92nx07YwKbRrO9',
                  Name: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                  DisplayName: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                  Config: {},
                },
                Transformations: [],
                IsConnectionEnabled: true,
                IsProcessorEnabled: true,
              },
            },
          ],
        },
      },
    },
    mockFns,
  },

  // ── Test 06: VDMv2 UserId typeOfList insert → DM ingest with userIdData ───
  {
    id: 'garl-dm-router-06',
    name: 'google_adwords_remarketing_lists',
    description: '[DM API] VDMv2 UserId typeOfList insert → audienceMembers:ingest with userIdData',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: { request: { body: dmRETLRecordRouterRequestVDMv2UserId, method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://datamanager.googleapis.com/v1/audienceMembers:ingest',
                  endpointPath: '/v1/audienceMembers:ingest',
                  headers: { Authorization: authHeader4, 'Content-Type': 'application/json' },
                  params: {},
                  body: {
                    JSON: {
                      destinations: [
                        {
                          operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
                          productDestinationId: '7090784486',
                        },
                      ],
                      audienceMembers: [
                        {
                          consent: {
                            adPersonalization: 'CONSENT_GRANTED',
                            adUserData: 'CONSENT_GRANTED',
                          },
                          userIdData: { userId: 'useri1234' },
                        },
                      ],
                      encoding: 'HEX',
                      consent: {
                        adPersonalization: 'CONSENT_GRANTED',
                        adUserData: 'CONSENT_GRANTED',
                      },
                      termsOfService: { customerMatchTermsOfServiceStatus: 'ACCEPTED' },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 2,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: DM_WORKSPACE_ID,
                  secret: { access_token: secret4 },
                  dontBatch: false,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: {
                Config: {
                  rudderAccountId: '258Yea7usSKNpbkIaesL9oJ9iYw',
                  audienceId: '7090784486',
                  customerId: '7693729833',
                  loginCustomerId: '',
                  subAccount: false,
                },
                ID: '1mMy5cqbtfuaKZv1IhVQKnBdVwe',
                Name: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                Enabled: true,
                WorkspaceID: '1TSN08muJTZwH8iCDmnnRt1pmLd',
                DestinationDefinition: {
                  ID: '1aIXqM806xAVm92nx07YwKbRrO9',
                  Name: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                  DisplayName: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                  Config: {},
                },
                Transformations: [],
                IsConnectionEnabled: true,
                IsProcessorEnabled: true,
              },
            },
          ],
        },
      },
    },
    mockFns,
  },

  // ── Test 07: Pre-hashed input with hash required → error
  {
    id: 'garl-dm-router-07',
    name: 'google_adwords_remarketing_lists',
    description:
      '[DM API] pre-hashed data with isHashRequired true → hashing consistency validation error',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: { request: { body: dmEventStreamRecordPreHashedRequest, method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              metadata: [
                {
                  jobId: 2,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: DM_WORKSPACE_ID,
                  secret: { access_token: secret4 },
                  dontBatch: false,
                },
              ],
              batched: false,
              statusCode: 400,
              error:
                'Hashing is enabled but the value for field email appears to already be hashed. Either disable hashing or send unhashed data.',
              statTags: {
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                destType: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                module: 'destination',
                implementation: 'native',
                feature: 'router',
                destinationId: 'default-destinationId',
                workspaceId: DM_WORKSPACE_ID,
              },
            },
          ],
        },
      },
    },
    mockFns,
  },

  // ── Test 08: Hash-off plaintext input → error
  {
    id: 'garl-dm-router-08',
    name: 'google_adwords_remarketing_lists',
    description:
      '[DM API] plaintext data with isHashRequired false → hashing consistency validation error',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: { request: { body: dmEventStreamRecordHashOffRequest, method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              metadata: [
                {
                  jobId: 2,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: DM_WORKSPACE_ID,
                  secret: { access_token: secret4 },
                  dontBatch: false,
                },
              ],
              batched: false,
              statusCode: 400,
              error:
                'Hashing is disabled but the value for field email appears to be unhashed. Either enable hashing or send pre-hashed data.',
              statTags: {
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                destType: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                module: 'destination',
                implementation: 'native',
                feature: 'router',
                destinationId: 'default-destinationId',
                workspaceId: DM_WORKSPACE_ID,
              },
            },
          ],
        },
      },
    },
    mockFns,
  },

  // ── Test 09: Field stripping — invalid email stripped, valid fields sent ───
  {
    id: 'garl-dm-router-09',
    name: 'google_adwords_remarketing_lists',
    description: '[DM API] invalid email stripped, valid phone+addressInfo forwarded',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: { request: { body: dmFieldStrippingRequest, method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://datamanager.googleapis.com/v1/audienceMembers:ingest',
                  endpointPath: '/v1/audienceMembers:ingest',
                  headers: { Authorization: authHeader4, 'Content-Type': 'application/json' },
                  params: {},
                  body: {
                    JSON: {
                      destinations: [
                        {
                          operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
                          productDestinationId: '7090784486',
                        },
                      ],
                      audienceMembers: [
                        {
                          consent: {
                            adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
                            adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                          },
                          userData: {
                            userIdentifiers: [
                              // sha256('+09876543210') — email stripped, phone valid
                              {
                                phoneNumber:
                                  '249c99278be4d0470583fd6d232247e8befeccc5f086a488f245d712d9d0078b',
                              },
                              {
                                addressInfo: {
                                  givenName:
                                    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                                  familyName:
                                    'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
                                  regionCode: 'US',
                                  postalCode: '1245',
                                },
                              },
                            ],
                          },
                        },
                      ],
                      encoding: 'HEX',
                      consent: {
                        adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
                        adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                      },
                      termsOfService: { customerMatchTermsOfServiceStatus: 'ACCEPTED' },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 10,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: DM_WORKSPACE_ID,
                  secret: { access_token: secret4 },
                  dontBatch: false,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: dmDestination,
            },
          ],
        },
      },
    },
    envOverrides: { GOOGLE_ADWORDS_REMARKETING_LISTS_REJECT_INVALID_FIELDS: 'true' },
    mockFns,
  },

  // ── Test 10: All fields invalid → InstrumentationError ────────────────────
  {
    id: 'garl-dm-router-10',
    name: 'google_adwords_remarketing_lists',
    description: '[DM API] all fields invalid → InstrumentationError',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: { request: { body: dmAllFieldsInvalidRequest, method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batched: false,
              error: 'Event has no valid identifiers',
              metadata: [
                {
                  jobId: 11,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: DM_WORKSPACE_ID,
                  secret: { access_token: secret4 },
                  dontBatch: false,
                },
              ],
              statTags: {
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                destType: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                module: 'destination',
                implementation: 'native',
                feature: 'router',
                destinationId: 'default-destinationId',
                workspaceId: DM_WORKSPACE_ID,
              },
              statusCode: 400,
            },
          ],
        },
      },
    },
    envOverrides: { GOOGLE_ADWORDS_REMARKETING_LISTS_REJECT_INVALID_FIELDS: 'true' },
    mockFns,
  },

  // ── Test 11: VDMv2 flow — delete/insert×2/update/lol/empty-identifiers ────
  //   Output order: delete(1) → insert(2,3) → update(4) → empty-error(6) → lol-error(5)
  {
    id: 'garl-dm-router-11',
    name: 'google_adwords_remarketing_lists',
    description:
      '[DM API] VDMv2 flow: delete→remove, inserts→ingest, update→ingest, empty→error, lol→error',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: { request: { body: dmRETLRecordRouterRequestForVDMV2Flow, method: 'POST' } },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            // delete (jobId=1) → remove
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://datamanager.googleapis.com/v1/audienceMembers:remove',
                  endpointPath: '/v1/audienceMembers:remove',
                  headers: { Authorization: authHeader4, 'Content-Type': 'application/json' },
                  params: {},
                  body: {
                    JSON: {
                      destinations: [
                        {
                          operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
                          productDestinationId: '7090784486',
                        },
                      ],
                      audienceMembers: [
                        {
                          consent: {
                            adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
                            adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                          },
                          userData: {
                            userIdentifiers: [
                              {
                                emailAddress:
                                  'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
                              },
                              {
                                phoneNumber:
                                  '5a335f50a6bbaffd39b35513350adb4be1e598ab75b9740c2ba82a160862e82f',
                              },
                              {
                                addressInfo: {
                                  givenName:
                                    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                                  familyName:
                                    'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
                                  regionCode: 'US',
                                  postalCode: '1245',
                                },
                              },
                            ],
                          },
                        },
                      ],
                      encoding: 'HEX',
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 1,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: DM_WORKSPACE_ID,
                  secret: { access_token: secret4 },
                  dontBatch: false,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: dmDestination,
            },
            // insert (jobIds 2,3) → ingest with 2 audienceMembers
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://datamanager.googleapis.com/v1/audienceMembers:ingest',
                  endpointPath: '/v1/audienceMembers:ingest',
                  headers: { Authorization: authHeader4, 'Content-Type': 'application/json' },
                  params: {},
                  body: {
                    JSON: {
                      destinations: [
                        {
                          operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
                          productDestinationId: '7090784486',
                        },
                      ],
                      audienceMembers: [
                        {
                          consent: {
                            adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
                            adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                          },
                          userData: {
                            userIdentifiers: [
                              {
                                emailAddress:
                                  'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
                              },
                              {
                                phoneNumber:
                                  '5a335f50a6bbaffd39b35513350adb4be1e598ab75b9740c2ba82a160862e82f',
                              },
                              {
                                addressInfo: {
                                  givenName:
                                    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                                  familyName:
                                    'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
                                  regionCode: 'US',
                                  postalCode: '1245',
                                },
                              },
                            ],
                          },
                        },
                        {
                          consent: {
                            adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
                            adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                          },
                          userData: {
                            userIdentifiers: [
                              {
                                emailAddress:
                                  'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
                              },
                              {
                                phoneNumber:
                                  '5a335f50a6bbaffd39b35513350adb4be1e598ab75b9740c2ba82a160862e82f',
                              },
                              {
                                addressInfo: {
                                  givenName:
                                    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                                  familyName:
                                    'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
                                  regionCode: 'US',
                                  postalCode: '1245',
                                },
                              },
                            ],
                          },
                        },
                      ],
                      encoding: 'HEX',
                      consent: {
                        adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
                        adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                      },
                      termsOfService: { customerMatchTermsOfServiceStatus: 'ACCEPTED' },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 2,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: DM_WORKSPACE_ID,
                  secret: { access_token: secret4 },
                  dontBatch: false,
                },
                {
                  jobId: 3,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: DM_WORKSPACE_ID,
                  secret: { access_token: secret4 },
                  dontBatch: false,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: dmDestination,
            },
            // update (jobId=4) → ingest
            {
              batchedRequest: [
                {
                  version: '1',
                  type: 'REST',
                  method: 'POST',
                  endpoint: 'https://datamanager.googleapis.com/v1/audienceMembers:ingest',
                  endpointPath: '/v1/audienceMembers:ingest',
                  headers: { Authorization: authHeader4, 'Content-Type': 'application/json' },
                  params: {},
                  body: {
                    JSON: {
                      destinations: [
                        {
                          operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
                          productDestinationId: '7090784486',
                        },
                      ],
                      audienceMembers: [
                        {
                          consent: {
                            adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
                            adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                          },
                          userData: {
                            userIdentifiers: [
                              {
                                emailAddress:
                                  'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419',
                              },
                              {
                                phoneNumber:
                                  '5a335f50a6bbaffd39b35513350adb4be1e598ab75b9740c2ba82a160862e82f',
                              },
                              {
                                addressInfo: {
                                  givenName:
                                    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                                  familyName:
                                    'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251',
                                  regionCode: 'US',
                                  postalCode: '1245',
                                },
                              },
                            ],
                          },
                        },
                      ],
                      encoding: 'HEX',
                      consent: {
                        adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
                        adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                      },
                      termsOfService: { customerMatchTermsOfServiceStatus: 'ACCEPTED' },
                    },
                    JSON_ARRAY: {},
                    XML: {},
                    FORM: {},
                  },
                  files: {},
                },
              ],
              metadata: [
                {
                  jobId: 4,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: DM_WORKSPACE_ID,
                  secret: { access_token: secret4 },
                  dontBatch: false,
                },
              ],
              batched: true,
              statusCode: 200,
              destination: dmDestination,
            },
            // empty identifiers (jobId=6) → 400 error
            {
              batched: false,
              error: 'Event has no valid identifiers',
              metadata: [
                {
                  jobId: 6,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: DM_WORKSPACE_ID,
                  secret: { access_token: secret4 },
                  dontBatch: false,
                },
              ],
              statTags: {
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                destType: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                module: 'destination',
                implementation: 'native',
                feature: 'router',
                destinationId: 'default-destinationId',
                workspaceId: DM_WORKSPACE_ID,
              },
              statusCode: 400,
            },
            // lol (jobId=5) → 400 error
            {
              metadata: [
                {
                  jobId: 5,
                  attemptNum: 1,
                  userId: 'default-userId',
                  sourceId: 'default-sourceId',
                  destinationId: 'default-destinationId',
                  workspaceId: DM_WORKSPACE_ID,
                  secret: { access_token: secret4 },
                  dontBatch: false,
                },
              ],
              batched: false,
              statusCode: 400,
              error: 'Invalid action type in record event',
              statTags: {
                errorCategory: 'dataValidation',
                errorType: 'instrumentation',
                destType: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
                module: 'destination',
                implementation: 'native',
                feature: 'router',
                destinationId: 'default-destinationId',
                workspaceId: DM_WORKSPACE_ID,
              },
            },
          ],
        },
      },
    },
    mockFns,
  },
];

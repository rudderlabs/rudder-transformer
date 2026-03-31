/**
 * GARL (Google Ads Remarketing Lists) - Processor Tests (Data Manager API)
 *
 * Each test case mirrors a corresponding test in processor/data.ts, ported to the
 * Data Manager API path. The DM API path is enabled when:
 *   1. DEST_GARL_DATA_MANAGER_API_ALLOWED_WORKSPACE_IDS includes the workspaceId (set in test/setup.ts)
 *   2. The OAuth token includes the https://www.googleapis.com/auth/datamanager scope
 *      (mocked via network.ts tokenInfo response)
 *
 * Workspace: 'dm-enabled-workspaceId'  (registered in test/setup.ts)
 * Old API tests continue to use 'default-workspaceId' and are unaffected.
 */

import { RedisDB } from '../../../../../../src/util/redis/redisConnector';
import { secret4, authHeader4 } from '../../maskedSecrets';

// ── Hashes ────────────────────────────────────────────────────────────────────
const EMAIL_HASH_TEST = 'd3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419';
const EMAIL_HASH_GHI = 'a3d3807256168f51fc644aef9bda6c7f15c850702be01cf4c77af26a37aec026';
const EMAIL_HASH_SUDIP = '938758751f5af66652a118e26503af824404bc13acd1cb7642ddff99916f0e1c';
const EMAIL_HASH_TEST1_MAIL = '78310d2dd727b704ff9d9c4742d01941b1217b89f45ab71d1e9bf5a010144048';
const EMAIL_HASH_TEST5_XMAIL = '34a6406a076b943abfb9e97a6761e0c6b8cf049ab15b013412c57cf8370b5436';
const EMAIL_HASH_TEST3_MAIL = '8075d00e5f006b95eb090bf50f5246bc3c18c3d771fa1edf967b033b274b8d84';
const PHONE_HASH = '5a335f50a6bbaffd39b35513350adb4be1e598ab75b9740c2ba82a160862e82f';
const GIVEN_TEST = '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';
const FAMILY_RUDDERLABS = 'dcf000c2386fb76d22cefc0d118a8511bb75999019cd373df52044bccd1bd251';
const GIVEN_GHI = '50ae61e841fac4e8f9e40baf2ad36ec868922ea48368c18f9535e47db56dd7fb';
const FAMILY_JKL = '268f277c6d766d31334fda0f7a5533a185598d269e61c76a805870244828a5f1';

// ── Endpoints ─────────────────────────────────────────────────────────────────
const DM_INGEST_ENDPOINT = 'https://datamanager.googleapis.com/v1/audienceMembers:ingest';
const DM_INGEST_PATH = '/v1/audienceMembers:ingest';
const DM_REMOVE_ENDPOINT = 'https://datamanager.googleapis.com/v1/audienceMembers:remove';
const DM_REMOVE_PATH = '/v1/audienceMembers:remove';

// ── Common constants ──────────────────────────────────────────────────────────
const DM_WORKSPACE_ID = 'dm-enabled-workspaceId';

const CONSENT_UNSPECIFIED = {
  adPersonalization: 'CONSENT_STATUS_UNSPECIFIED',
  adUserData: 'CONSENT_STATUS_UNSPECIFIED',
};

const baseDest = {
  operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
  productDestinationId: 'list111',
};

const baseMeta = {
  workspaceId: DM_WORKSPACE_ID,
  secret: { access_token: secret4, refresh_token: 'dummy-refresh' },
};

const baseConfig = {
  rudderAccountId: 'rudder-acc-id',
  audienceId: 'list111',
  customerId: '7693729833',
  loginCustomerId: '',
  subAccount: false,
  userSchema: ['email', 'phone', 'addressInfo'],
  isHashRequired: true,
  typeOfList: 'General',
};

// ── Reusable audience members ─────────────────────────────────────────────────
const testMemberFullAddress = {
  consent: CONSENT_UNSPECIFIED,
  userData: {
    userIdentifiers: [
      { emailAddress: EMAIL_HASH_TEST },
      { phoneNumber: PHONE_HASH },
      {
        addressInfo: {
          givenName: GIVEN_TEST,
          familyName: FAMILY_RUDDERLABS,
          regionCode: 'US',
          postalCode: '1245',
        },
      },
    ],
  },
};

const ghiMemberNoPostal = {
  consent: CONSENT_UNSPECIFIED,
  userData: {
    userIdentifiers: [{ emailAddress: EMAIL_HASH_GHI }, { phoneNumber: PHONE_HASH }],
  },
};

const ghiMemberWithAddress = {
  consent: CONSENT_UNSPECIFIED,
  userData: {
    userIdentifiers: [
      { emailAddress: EMAIL_HASH_GHI },
      { phoneNumber: PHONE_HASH },
      {
        addressInfo: {
          givenName: GIVEN_GHI,
          familyName: FAMILY_JKL,
          regionCode: 'US',
          postalCode: '1245',
        },
      },
    ],
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const dmOutputBody = (
  endpoint: string,
  endpointPath: string,
  headers: Record<string, string>,
  json: unknown,
  meta: unknown,
) => ({
  output: {
    version: '1',
    type: 'REST',
    method: 'POST',
    endpoint,
    endpointPath,
    headers,
    params: {},
    body: { JSON: json, JSON_ARRAY: {}, XML: {}, FORM: {} },
    files: {},
    userId: '',
  },
  metadata: meta,
  statusCode: 200,
});

const baseHeaders = { Authorization: authHeader4, 'Content-Type': 'application/json' };

const ingestJSON = (
  destinations: unknown[],
  audienceMembers: unknown[],
  consent = CONSENT_UNSPECIFIED,
) => ({
  destinations,
  audienceMembers,
  consent,
  encoding: 'HEX',
  termsOfService: { customerMatchTermsOfServiceStatus: 'ACCEPTED' },
});

const removeJSON = (destinations: unknown[], audienceMembers: unknown[]) => ({
  destinations,
  audienceMembers,
  encoding: 'HEX',
});

const instrStatTags = {
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  destType: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
  module: 'destination',
  implementation: 'native',
  feature: 'processor',
  workspaceId: DM_WORKSPACE_ID,
};

const configStatTags = { ...instrStatTags, errorType: 'configuration' };

const platformStatTags = {
  errorCategory: 'platform',
  errorType: 'oAuthSecret',
  destType: 'GOOGLE_ADWORDS_REMARKETING_LISTS',
  module: 'destination',
  implementation: 'native',
  feature: 'processor',
  workspaceId: DM_WORKSPACE_ID,
};

const errorOutput = (meta: unknown, statusCode: number, error: string, statTags: unknown) => ({
  metadata: meta,
  statusCode,
  error,
  statTags,
});

/**
 * Mocks Redis to prevent connection attempts during tests.
 * getVal returns null (cache miss) so the tokenInfo network mock is exercised.
 */
const mockFns = (_: unknown) => {
  jest.spyOn(RedisDB, 'getVal').mockResolvedValue(null);
  jest.spyOn(RedisDB, 'setVal').mockResolvedValue(undefined);
};

// ─────────────────────────────────────────────────────────────────────────────
// Test cases
// ─────────────────────────────────────────────────────────────────────────────
export const dataManagerData = [
  // ── Test 01: (Test 0 equivalent) audiencelist add — General list ───────────
  {
    id: 'garl-dm-processor-01',
    name: 'google_adwords_remarketing_lists',
    description:
      '[DM API] audiencelist add — General list → ingest with hashed email, phone, addressInfo',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    mockFns,
    input: {
      request: {
        body: [
          {
            metadata: baseMeta,
            destination: { ID: 'dest-id-1', Config: baseConfig },
            message: {
              type: 'audiencelist',
              properties: {
                listData: {
                  add: [
                    {
                      email: 'test@abc.com',
                      phone: '@09876543210',
                      firstName: 'test',
                      lastName: 'rudderlabs',
                      country: 'US',
                      postalCode: '1245',
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          dmOutputBody(
            DM_INGEST_ENDPOINT,
            DM_INGEST_PATH,
            baseHeaders,
            ingestJSON([baseDest], [testMemberFullAddress]),
            baseMeta,
          ),
        ],
      },
    },
  },

  // ── Test 02: (Test 0 equivalent) audiencelist remove ──────────────────────
  {
    id: 'garl-dm-processor-02',
    name: 'google_adwords_remarketing_lists',
    description: '[DM API] audiencelist remove — General list → remove endpoint',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    mockFns,
    input: {
      request: {
        body: [
          {
            metadata: baseMeta,
            destination: { ID: 'dest-id-1', Config: baseConfig },
            message: {
              type: 'audiencelist',
              properties: {
                listData: {
                  remove: [
                    {
                      email: 'test@abc.com',
                      phone: '@09876543210',
                      firstName: 'test',
                      lastName: 'rudderlabs',
                      country: 'US',
                      postalCode: '1245',
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          dmOutputBody(
            DM_REMOVE_ENDPOINT,
            DM_REMOVE_PATH,
            baseHeaders,
            removeJSON([baseDest], [testMemberFullAddress]),
            baseMeta,
          ),
        ],
      },
    },
  },

  // ── Test 03: (Test 1) userID list, subAccount=true → loginAccount header ───
  {
    id: 'garl-dm-processor-03',
    name: 'google_adwords_remarketing_lists',
    description:
      '[DM API] userID list, subAccount=true — loginAccount in destinations, login-customer-id header',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    mockFns,
    input: {
      request: {
        body: [
          {
            metadata: baseMeta,
            destination: {
              ID: 'dest-id-1',
              Config: {
                ...baseConfig,
                customerId: '769-372-9833',
                loginCustomerId: '870-483-0944',
                subAccount: true,
                typeOfList: 'userID',
              },
            },
            message: {
              type: 'audiencelist',
              properties: {
                listData: {
                  add: [
                    {
                      email: 'test@abc.com',
                      phone: '@09876543210',
                      firstName: 'test',
                      lastName: 'rudderlabs',
                      country: 'US',
                      postalCode: '1245',
                      thirdPartyUserId: 'useri1234',
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          dmOutputBody(
            DM_INGEST_ENDPOINT,
            DM_INGEST_PATH,
            { ...baseHeaders, 'login-customer-id': '8704830944' },
            ingestJSON(
              [
                {
                  operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
                  loginAccount: { accountId: '8704830944', accountType: 'GOOGLE_ADS' },
                  productDestinationId: 'list111',
                },
              ],
              [
                {
                  consent: CONSENT_UNSPECIFIED,
                  userIdData: { userId: 'useri1234' },
                },
              ],
            ),
            baseMeta,
          ),
        ],
      },
    },
  },

  // ── Test 04: (Test 2) mobileDeviceID list → mobileData.mobileIds[] ─────────
  {
    id: 'garl-dm-processor-04',
    name: 'google_adwords_remarketing_lists',
    description: '[DM API] mobileDeviceID list — member with mobileData.mobileIds[]',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    mockFns,
    input: {
      request: {
        body: [
          {
            metadata: baseMeta,
            destination: {
              ID: 'dest-id-1',
              Config: { ...baseConfig, typeOfList: 'mobileDeviceID' },
            },
            message: {
              type: 'audiencelist',
              properties: {
                listData: {
                  add: [
                    {
                      email: 'test@abc.com',
                      phone: '@09876543210',
                      firstName: 'test',
                      lastName: 'rudderlabs',
                      country: 'US',
                      postalCode: '1245',
                      thirdPartyUserId: 'useri1234',
                      mobileId: 'abcd-1234-567h',
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          dmOutputBody(
            DM_INGEST_ENDPOINT,
            DM_INGEST_PATH,
            baseHeaders,
            ingestJSON(
              [baseDest],
              [
                {
                  consent: CONSENT_UNSPECIFIED,
                  mobileData: { mobileIds: ['abcd-1234-567h'] },
                },
              ],
            ),
            baseMeta,
          ),
        ],
      },
    },
  },

  // ── Test 05: (Test 3) mobileDeviceID, no mobileId → no valid members ───────
  {
    id: 'garl-dm-processor-05',
    name: 'google_adwords_remarketing_lists',
    description:
      '[DM API] mobileDeviceID list, records lack mobileId — no valid members → instrumentation error',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    mockFns,
    input: {
      request: {
        body: [
          {
            metadata: baseMeta,
            destination: {
              ID: 'dest-id-1',
              Config: { ...baseConfig, typeOfList: 'mobileDeviceID' },
            },
            message: {
              type: 'audiencelist',
              properties: {
                listData: {
                  add: [
                    {
                      email: 'abc@abc.com',
                      phone: '@09876543210',
                      firstName: 'abc',
                      lastName: 'efg',
                      country: 'US',
                      postalCode: '1245',
                      thirdPartyUserId: 'useri1234',
                    },
                    {
                      email: 'def@abc.com',
                      phone: '@09876543210',
                      firstName: 'def',
                      lastName: 'ghi',
                      country: 'US',
                      postalCode: '1245',
                      thirdPartyUserId: 'useri1234',
                    },
                    {
                      email: 'ghi@abc.com',
                      phone: '@09876543210',
                      firstName: 'ghi',
                      lastName: 'jkl',
                      country: 'US',
                      postalCode: '1245',
                      thirdPartyUserId: 'useri1234',
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          errorOutput(
            baseMeta,
            400,
            "Neither 'add' nor 'remove' property is present inside 'listData' or there are no valid audience members. Aborting message.",
            instrStatTags,
          ),
        ],
      },
    },
  },

  // ── Test 06: (Test 4) mobileDeviceID remove, no mobileId ─────────────────
  {
    id: 'garl-dm-processor-06',
    name: 'google_adwords_remarketing_lists',
    description:
      '[DM API] mobileDeviceID list, remove records lack mobileId — no valid members → instrumentation error',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    mockFns,
    input: {
      request: {
        body: [
          {
            metadata: baseMeta,
            destination: {
              ID: 'dest-id-1',
              Config: { ...baseConfig, typeOfList: 'mobileDeviceID' },
            },
            message: {
              type: 'audiencelist',
              properties: {
                listData: {
                  remove: [
                    {
                      email: 'ghi@abc.com',
                      phone: '@09876543210',
                      firstName: 'ghi',
                      lastName: 'jkl',
                      country: 'US',
                      postalCode: '1245',
                      thirdPartyUserId: 'useri1234',
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          errorOutput(
            baseMeta,
            400,
            "Neither 'add' nor 'remove' property is present inside 'listData' or there are no valid audience members. Aborting message.",
            instrStatTags,
          ),
        ],
      },
    },
  },

  // ── Test 07: (Test 5) missing message.type ─────────────────────────────────
  {
    id: 'garl-dm-processor-07',
    name: 'google_adwords_remarketing_lists',
    description: '[DM API] missing message.type → instrumentation error',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    mockFns,
    input: {
      request: {
        body: [
          {
            metadata: baseMeta,
            destination: {
              ID: 'dest-id-1',
              Config: { ...baseConfig, typeOfList: 'mobileDeviceID' },
            },
            message: {
              // no type field
              properties: {
                listData: {
                  remove: [
                    {
                      email: 'ghi@abc.com',
                      phone: '@09876543210',
                      firstName: 'ghi',
                      lastName: 'jkl',
                      country: 'US',
                      postalCode: '1245',
                      thirdPartyUserId: 'useri1234',
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          errorOutput(
            baseMeta,
            400,
            'Message Type is not present. Aborting message.',
            instrStatTags,
          ),
        ],
      },
    },
  },

  // ── Test 08: (Test 6) missing listData ────────────────────────────────────
  {
    id: 'garl-dm-processor-08',
    name: 'google_adwords_remarketing_lists',
    description: '[DM API] missing listData in properties → instrumentation error',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    mockFns,
    input: {
      request: {
        body: [
          {
            metadata: baseMeta,
            destination: {
              ID: 'dest-id-1',
              Config: { ...baseConfig, typeOfList: 'mobileDeviceID' },
            },
            message: {
              type: 'audiencelist',
              properties: { enablePartialFailure: true },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          errorOutput(
            baseMeta,
            400,
            'listData is not present inside properties. Aborting message.',
            instrStatTags,
          ),
        ],
      },
    },
  },

  // ── Test 09: (Test 7) subAccount=true but loginCustomerId missing ──────────
  {
    id: 'garl-dm-processor-09',
    name: 'google_adwords_remarketing_lists',
    description: '[DM API] subAccount=true with empty loginCustomerId → configuration error',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    mockFns,
    input: {
      request: {
        body: [
          {
            metadata: baseMeta,
            destination: {
              ID: 'dest-id-1',
              Config: {
                ...baseConfig,
                subAccount: true,
                loginCustomerId: '',
                typeOfList: 'mobileDeviceID',
              },
            },
            message: {
              type: 'audiencelisT',
              properties: {
                listData: {
                  add: [
                    {
                      email: 'ghi@abc.com',
                      phone: '@09876543210',
                      firstName: 'ghi',
                      lastName: 'jkl',
                      country: 'US',
                      mobileId: '1245',
                    },
                    {
                      email: 'ghi@abc.com',
                      phone: '@09876543210',
                      firstName: 'ghi',
                      lastName: 'jkl',
                      country: 'US',
                      postalCode: '1245',
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          errorOutput(
            baseMeta,
            400,
            'loginCustomerId is required as subAccount is true.',
            configStatTags,
          ),
        ],
      },
    },
  },

  // ── Test 10: (Test 8) 50 users → all in one DM batch (batch size = 10,000) ─
  {
    id: 'garl-dm-processor-10',
    name: 'google_adwords_remarketing_lists',
    description:
      '[DM API] 50 users add — all 50 audienceMembers in one ingest request (no batching at 10k limit)',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    mockFns,
    input: {
      request: {
        body: [
          {
            metadata: baseMeta,
            destination: { ID: 'dest-id-1', Config: baseConfig },
            message: {
              type: 'audiencelisT',
              properties: {
                listData: {
                  add: [
                    // user 0: no postalCode → email+phone only
                    {
                      email: 'ghi@abc.com',
                      phone: '@09876543210',
                      firstName: 'ghi',
                      lastName: 'jkl',
                      country: 'US',
                      mobileId: '1245',
                    },
                    // users 1–49: all have email+phone+address
                    ...Array(49).fill({
                      email: 'ghi@abc.com',
                      phone: '@09876543210',
                      firstName: 'ghi',
                      lastName: 'jkl',
                      country: 'US',
                      postalCode: '1245',
                    }),
                  ],
                },
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          dmOutputBody(
            DM_INGEST_ENDPOINT,
            DM_INGEST_PATH,
            baseHeaders,
            ingestJSON([baseDest], [ghiMemberNoPostal, ...Array(49).fill(ghiMemberWithAddress)]),
            baseMeta,
          ),
        ],
      },
    },
  },

  // ── Test 11: (Test 9) both add and remove → ingest + remove ───────────────
  {
    id: 'garl-dm-processor-11',
    name: 'google_adwords_remarketing_lists',
    description: '[DM API] both add and remove — two separate DM requests (ingest then remove)',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    mockFns,
    input: {
      request: {
        body: [
          {
            metadata: baseMeta,
            destination: { ID: 'dest-id-1', Config: baseConfig },
            message: {
              type: 'audiencelisT',
              properties: {
                listData: {
                  add: [
                    {
                      email: 'ghi@abc.com',
                      phone: '@09876543210',
                      firstName: 'ghi',
                      lastName: 'jkl',
                      country: 'US',
                      mobileId: '1245',
                    },
                    {
                      email: 'ghi@abc.com',
                      phone: '@09876543210',
                      firstName: 'ghi',
                      lastName: 'jkl',
                      country: 'US',
                      postalCode: '1245',
                    },
                  ],
                  remove: [
                    {
                      email: 'ghi@abc.com',
                      phone: '@09876543210',
                      firstName: 'ghi',
                      lastName: 'jkl',
                      country: 'US',
                      mobileId: '1245',
                    },
                    {
                      email: 'ghi@abc.com',
                      phone: '@09876543210',
                      firstName: 'ghi',
                      lastName: 'jkl',
                      country: 'US',
                      postalCode: '1245',
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          // add → ingest first
          dmOutputBody(
            DM_INGEST_ENDPOINT,
            DM_INGEST_PATH,
            baseHeaders,
            ingestJSON([baseDest], [ghiMemberNoPostal, ghiMemberWithAddress]),
            baseMeta,
          ),
          // remove → remove second
          dmOutputBody(
            DM_REMOVE_ENDPOINT,
            DM_REMOVE_PATH,
            baseHeaders,
            removeJSON([baseDest], [ghiMemberNoPostal, ghiMemberWithAddress]),
            baseMeta,
          ),
        ],
      },
    },
  },

  // ── Test 12: (Test 12) listData.delete — unsupported key → error ──────────
  {
    id: 'garl-dm-processor-12',
    name: 'google_adwords_remarketing_lists',
    description:
      '[DM API] listData.delete key (not add/remove) — no valid members → instrumentation error',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    mockFns,
    input: {
      request: {
        body: [
          {
            metadata: baseMeta,
            destination: { ID: 'dest-id-1', Config: baseConfig },
            message: {
              type: 'audiencelisT',
              properties: {
                listData: {
                  delete: [
                    {
                      email: 'ghi@abc.com',
                      phone: '@09876543210',
                      firstName: 'ghi',
                      lastName: 'jkl',
                      country: 'US',
                      mobileId: '1245',
                    },
                    {
                      email: 'ghi@abc.com',
                      phone: '@09876543210',
                      firstName: 'ghi',
                      lastName: 'jkl',
                      country: 'US',
                      postalCode: '1245',
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          errorOutput(
            baseMeta,
            400,
            "Neither 'add' nor 'remove' property is present inside 'listData' or there are no valid audience members. Aborting message.",
            instrStatTags,
          ),
        ],
      },
    },
  },

  // ── Test 13: (Test 15) add+remove with null/false field values ────────────
  {
    id: 'garl-dm-processor-13',
    name: 'google_adwords_remarketing_lists',
    description:
      '[DM API] add+remove with null firstName / null phone / null country — partial identifiers per member',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    mockFns,
    input: {
      request: {
        body: [
          {
            metadata: baseMeta,
            destination: { ID: 'dest-id-1', Config: baseConfig },
            message: {
              type: 'audiencelisT',
              properties: {
                listData: {
                  remove: [
                    // firstName null → no addressInfo (givenName missing)
                    {
                      email: 'ghi@abc.com',
                      phone: '@09876543210',
                      firstName: null,
                      lastName: 'jkl',
                      country: 'US',
                      mobileId: '1245',
                    },
                    {
                      email: 'ghi@abc.com',
                      phone: '@09876543210',
                      firstName: 'ghi',
                      lastName: 'jkl',
                      country: 'US',
                      postalCode: '1245',
                    },
                  ],
                  add: [
                    // phone null, country null → email only
                    {
                      email: 'ghi@abc.com',
                      phone: null,
                      firstName: 'ghi',
                      lastName: 'jkl',
                      country: null,
                      mobileId: '1245',
                    },
                    {
                      email: 'ghi@abc.com',
                      phone: '@09876543210',
                      firstName: 'ghi',
                      lastName: 'jkl',
                      country: 'US',
                      postalCode: '1245',
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          // add comes first (listData.add processed before listData.remove in buildAudienceListRequests)
          dmOutputBody(
            DM_INGEST_ENDPOINT,
            DM_INGEST_PATH,
            baseHeaders,
            ingestJSON(
              [baseDest],
              [
                // add user 0: phone=null, country=null → email only
                {
                  consent: CONSENT_UNSPECIFIED,
                  userData: { userIdentifiers: [{ emailAddress: EMAIL_HASH_GHI }] },
                },
                // add user 1: complete
                ghiMemberWithAddress,
              ],
            ),
            baseMeta,
          ),
          dmOutputBody(
            DM_REMOVE_ENDPOINT,
            DM_REMOVE_PATH,
            baseHeaders,
            removeJSON(
              [baseDest],
              [
                // remove user 0: firstName=null → no addressInfo → email+phone
                ghiMemberNoPostal,
                // remove user 1: complete
                ghiMemberWithAddress,
              ],
            ),
            baseMeta,
          ),
        ],
      },
    },
  },

  // ── Test 14: (Test 16) falsy values (phone=false, lastName=null, postalCode=0) ─
  {
    id: 'garl-dm-processor-14',
    name: 'google_adwords_remarketing_lists',
    description: '[DM API] phone=false and lastName=null excluded — member has emailAddress only',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    mockFns,
    input: {
      request: {
        body: [
          {
            metadata: baseMeta,
            destination: { ID: 'dest-id-1', Config: baseConfig },
            message: {
              type: 'audiencelist',
              properties: {
                listData: {
                  add: [
                    {
                      email: 'test@abc.com',
                      phone: false,
                      firstName: 'test',
                      lastName: null,
                      country: 'US',
                      postalCode: 0,
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          dmOutputBody(
            DM_INGEST_ENDPOINT,
            DM_INGEST_PATH,
            baseHeaders,
            ingestJSON(
              [baseDest],
              [
                {
                  consent: CONSENT_UNSPECIFIED,
                  userData: { userIdentifiers: [{ emailAddress: EMAIL_HASH_TEST }] },
                },
              ],
            ),
            baseMeta,
          ),
        ],
      },
    },
  },

  // ── Test 15: (Test 17) missing access token → 500 platform error ──────────
  {
    id: 'garl-dm-processor-15',
    name: 'google_adwords_remarketing_lists',
    description: '[DM API] null metadata.secret → 500 platform/oAuthSecret error',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    mockFns,
    input: {
      request: {
        body: [
          {
            metadata: { workspaceId: DM_WORKSPACE_ID, secret: null },
            destination: { ID: 'dest-id-1', Config: baseConfig },
            message: {
              type: 'audiencelist',
              properties: {
                listData: {
                  add: [
                    {
                      email: 'test@abc.com',
                      phone: '@09876543210',
                      firstName: 'test',
                      lastName: 'rudderlabs',
                      country: 'US',
                      postalCode: '1245',
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          errorOutput(
            { workspaceId: DM_WORKSPACE_ID, secret: null },
            500,
            'Failed to get access token for authentication. This might be a platform issue. Please contact RudderStack support for assistance.',
            platformStatTags,
          ),
        ],
      },
    },
  },

  // ── Test 16: (Test 18) audienceId from Config.audienceId ─────────────────
  {
    id: 'garl-dm-processor-16',
    name: 'google_adwords_remarketing_lists',
    description: '[DM API] audienceId from Config — productDestinationId uses Config.audienceId',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    mockFns,
    input: {
      request: {
        body: [
          {
            metadata: baseMeta,
            destination: {
              ID: 'dest-id-1',
              Config: { ...baseConfig, audienceId: 'aud1234' },
            },
            message: {
              type: 'audiencelist',
              properties: {
                listData: {
                  add: [
                    {
                      email: 'sudip@abc.com',
                      phone: false,
                      firstName: 'sudip',
                      lastName: null,
                      country: 'US',
                      postalCode: 0,
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          dmOutputBody(
            DM_INGEST_ENDPOINT,
            DM_INGEST_PATH,
            baseHeaders,
            ingestJSON(
              [
                {
                  operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
                  productDestinationId: 'aud1234',
                },
              ],
              [
                {
                  consent: CONSENT_UNSPECIFIED,
                  userData: { userIdentifiers: [{ emailAddress: EMAIL_HASH_SUDIP }] },
                },
              ],
            ),
            baseMeta,
          ),
        ],
      },
    },
  },

  // ── Test 17: (Test 19) RETL remove — audienceId extracted from externalId ──
  {
    id: 'garl-dm-processor-17',
    name: 'google_adwords_remarketing_lists',
    description:
      '[DM API] RETL sources remove — audienceId from externalId (GOOGLE_ADWORDS_REMARKETING_LISTS-830441345)',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    mockFns,
    input: {
      request: {
        body: [
          {
            metadata: baseMeta,
            destination: {
              ID: 'dest-id-1',
              Config: { ...baseConfig, audienceId: '' },
            },
            message: {
              anonymousId: '24ed22ae-0681-4882-8c33-012e298e1c17',
              channel: 'sources',
              context: {
                destinationFields: 'email',
                externalId: [
                  { identifierType: 'email', type: 'GOOGLE_ADWORDS_REMARKETING_LISTS-830441345' },
                ],
                mappedToDestination: 'true',
              },
              type: 'audienceList',
              properties: {
                listData: {
                  remove: [
                    { email: 'test1@mail.com' },
                    { email: 'test5@xmail.com' },
                    { email: 'test3@mail.com' },
                  ],
                },
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          dmOutputBody(
            DM_REMOVE_ENDPOINT,
            DM_REMOVE_PATH,
            baseHeaders,
            removeJSON(
              [
                {
                  operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
                  productDestinationId: '830441345',
                },
              ],
              [
                {
                  consent: CONSENT_UNSPECIFIED,
                  userData: { userIdentifiers: [{ emailAddress: EMAIL_HASH_TEST1_MAIL }] },
                },
                {
                  consent: CONSENT_UNSPECIFIED,
                  userData: { userIdentifiers: [{ emailAddress: EMAIL_HASH_TEST5_XMAIL }] },
                },
                {
                  consent: CONSENT_UNSPECIFIED,
                  userData: { userIdentifiers: [{ emailAddress: EMAIL_HASH_TEST3_MAIL }] },
                },
              ],
            ),
            baseMeta,
          ),
        ],
      },
    },
  },

  // ── Test 18: (Test 20) RETL add — audienceId extracted from externalId ─────
  {
    id: 'garl-dm-processor-18',
    name: 'google_adwords_remarketing_lists',
    description:
      '[DM API] RETL sources add — audienceId from externalId (GOOGLE_ADWORDS_REMARKETING_LISTS-830441345)',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    mockFns,
    input: {
      request: {
        body: [
          {
            metadata: baseMeta,
            destination: {
              ID: 'dest-id-1',
              Config: { ...baseConfig, audienceId: '' },
            },
            message: {
              anonymousId: '24ed22ae-0681-4882-8c33-012e298e1c17',
              channel: 'sources',
              context: {
                destinationFields: 'email',
                externalId: [
                  { identifierType: 'email', type: 'GOOGLE_ADWORDS_REMARKETING_LISTS-830441345' },
                ],
                mappedToDestination: 'true',
              },
              type: 'audienceList',
              properties: {
                listData: {
                  add: [
                    { email: 'test1@mail.com' },
                    { email: 'test5@xmail.com' },
                    { email: 'test3@mail.com' },
                  ],
                },
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          dmOutputBody(
            DM_INGEST_ENDPOINT,
            DM_INGEST_PATH,
            baseHeaders,
            ingestJSON(
              [
                {
                  operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
                  productDestinationId: '830441345',
                },
              ],
              [
                {
                  consent: CONSENT_UNSPECIFIED,
                  userData: { userIdentifiers: [{ emailAddress: EMAIL_HASH_TEST1_MAIL }] },
                },
                {
                  consent: CONSENT_UNSPECIFIED,
                  userData: { userIdentifiers: [{ emailAddress: EMAIL_HASH_TEST5_XMAIL }] },
                },
                {
                  consent: CONSENT_UNSPECIFIED,
                  userData: { userIdentifiers: [{ emailAddress: EMAIL_HASH_TEST3_MAIL }] },
                },
              ],
            ),
            baseMeta,
          ),
        ],
      },
    },
  },

  // ── Test 19: (Test 21) consent GRANTED/UNSPECIFIED → CONSENT_GRANTED/CONSENT_STATUS_UNSPECIFIED
  {
    id: 'garl-dm-processor-19',
    name: 'google_adwords_remarketing_lists',
    description:
      '[DM API] consent: personalizationConsent=GRANTED → CONSENT_GRANTED, userDataConsent=UNSPECIFIED → CONSENT_STATUS_UNSPECIFIED',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    mockFns,
    input: {
      request: {
        body: [
          {
            metadata: baseMeta,
            destination: {
              ID: 'dest-id-1',
              Config: {
                ...baseConfig,
                audienceId: '',
                userDataConsent: 'UNSPECIFIED',
                personalizationConsent: 'GRANTED',
              },
            },
            message: {
              anonymousId: '24ed22ae-0681-4882-8c33-012e298e1c17',
              channel: 'sources',
              context: {
                destinationFields: 'email',
                externalId: [
                  { identifierType: 'email', type: 'GOOGLE_ADWORDS_REMARKETING_LISTS-830441345' },
                ],
                mappedToDestination: 'true',
              },
              type: 'audienceList',
              properties: {
                listData: {
                  add: [
                    { email: 'test1@mail.com' },
                    { email: 'test5@xmail.com' },
                    { email: 'test3@mail.com' },
                  ],
                },
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          dmOutputBody(
            DM_INGEST_ENDPOINT,
            DM_INGEST_PATH,
            baseHeaders,
            ingestJSON(
              [
                {
                  operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
                  productDestinationId: '830441345',
                },
              ],
              [
                {
                  consent: {
                    adPersonalization: 'CONSENT_GRANTED',
                    adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                  },
                  userData: { userIdentifiers: [{ emailAddress: EMAIL_HASH_TEST1_MAIL }] },
                },
                {
                  consent: {
                    adPersonalization: 'CONSENT_GRANTED',
                    adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                  },
                  userData: { userIdentifiers: [{ emailAddress: EMAIL_HASH_TEST5_XMAIL }] },
                },
                {
                  consent: {
                    adPersonalization: 'CONSENT_GRANTED',
                    adUserData: 'CONSENT_STATUS_UNSPECIFIED',
                  },
                  userData: { userIdentifiers: [{ emailAddress: EMAIL_HASH_TEST3_MAIL }] },
                },
              ],
              { adPersonalization: 'CONSENT_GRANTED', adUserData: 'CONSENT_STATUS_UNSPECIFIED' },
            ),
            baseMeta,
          ),
        ],
      },
    },
  },

  // ── Test 20: (Test 22) invalid consent values → CONSENT_STATUS_UNSPECIFIED ─
  {
    id: 'garl-dm-processor-20',
    name: 'google_adwords_remarketing_lists',
    description:
      '[DM API] invalid consent values (RANDOM) → CONSENT_STATUS_UNSPECIFIED for both fields',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    mockFns,
    input: {
      request: {
        body: [
          {
            metadata: baseMeta,
            destination: {
              ID: 'dest-id-1',
              Config: {
                ...baseConfig,
                audienceId: '',
                userDataConsent: 'RANDOM',
                personalizationConsent: 'RANDOM',
              },
            },
            message: {
              anonymousId: '24ed22ae-0681-4882-8c33-012e298e1c17',
              channel: 'sources',
              context: {
                destinationFields: 'email',
                externalId: [
                  { identifierType: 'email', type: 'GOOGLE_ADWORDS_REMARKETING_LISTS-830441345' },
                ],
                mappedToDestination: 'true',
              },
              type: 'audienceList',
              properties: {
                listData: {
                  add: [
                    { email: 'test1@mail.com' },
                    { email: 'test5@xmail.com' },
                    { email: 'test3@mail.com' },
                  ],
                },
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          dmOutputBody(
            DM_INGEST_ENDPOINT,
            DM_INGEST_PATH,
            baseHeaders,
            ingestJSON(
              [
                {
                  operatingAccount: { accountId: '7693729833', accountType: 'GOOGLE_ADS' },
                  productDestinationId: '830441345',
                },
              ],
              [
                {
                  consent: CONSENT_UNSPECIFIED,
                  userData: { userIdentifiers: [{ emailAddress: EMAIL_HASH_TEST1_MAIL }] },
                },
                {
                  consent: CONSENT_UNSPECIFIED,
                  userData: { userIdentifiers: [{ emailAddress: EMAIL_HASH_TEST5_XMAIL }] },
                },
                {
                  consent: CONSENT_UNSPECIFIED,
                  userData: { userIdentifiers: [{ emailAddress: EMAIL_HASH_TEST3_MAIL }] },
                },
              ],
            ),
            baseMeta,
          ),
        ],
      },
    },
  },
];

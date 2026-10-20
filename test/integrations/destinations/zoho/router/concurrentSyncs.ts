import { defaultMockFns } from '../mocks';
import {
  commonConnectionConfigV2_3,
  commonUpsertDestConfig3,
  contactsConnectionConfigV2,
  destType,
  firstSourceJobContext,
  secondSourceJobContext,
  upsertPayload1V2,
} from '../common';

const upsertRequest = (module: string, json: Record<string, unknown>) => ({
  version: '1',
  type: 'REST',
  method: 'POST',
  endpoint: `https://www.zohoapis.com/crm/v6/${module}/upsert`,
  headers: {
    Authorization: 'Zoho-oauthtoken correct-access-token',
  },
  params: {},
  body: {
    JSON: json,
    JSON_ARRAY: {},
    XML: {},
    FORM: {},
  },
  files: {},
});

const secret = { accessToken: 'correct-access-token' };

const leadsMetadata = {
  jobId: 1,
  userId: 'u1',
  sourceId: commonConnectionConfigV2_3.sourceId,
  secret,
};

const contactsMetadata = {
  jobId: 2,
  userId: 'u2',
  sourceId: contactsConnectionConfigV2.sourceId,
  secret,
};

export const concurrentSyncsData = [
  {
    id: 'zoho-router-test-concurrent-syncs',
    name: destType,
    description:
      'Two rETL syncs on one destination, each on its own connection and module, are sent as separate requests: guards concurrent syncs reaching the wrong list (ACT2-1257)',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: { ...upsertPayload1V2, context: firstSourceJobContext },
              metadata: leadsMetadata,
              destination: commonUpsertDestConfig3,
              connection: commonConnectionConfigV2_3,
            },
            {
              message: {
                ...upsertPayload1V2,
                context: secondSourceJobContext,
                recordId: '3',
                rudderId: '3',
                fields: { First_Name: 'contact', Last_Name: 'User' },
                identifiers: { Phone: '+15550100' },
              },
              metadata: contactsMetadata,
              destination: commonUpsertDestConfig3,
              connection: contactsConnectionConfigV2,
            },
          ],
          destType,
        },
        method: 'POST',
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              batchedRequest: upsertRequest('Leads', {
                duplicate_check_fields: ['Email'],
                data: [
                  {
                    Email: 'subscribed@eewrfrd.com',
                    First_Name: 'subcribed',
                    Last_Name: ' User',
                  },
                ],
                $append_values: {},
                trigger: ['workflow'],
              }),
              metadata: [leadsMetadata],
              batched: true,
              statusCode: 200,
              destination: commonUpsertDestConfig3,
            },
            {
              batchedRequest: upsertRequest('Contacts', {
                duplicate_check_fields: ['Phone', 'Email'],
                data: [
                  {
                    First_Name: 'contact',
                    Last_Name: 'User',
                    Phone: '+15550100',
                  },
                ],
                $append_values: {},
                trigger: [],
              }),
              metadata: [contactsMetadata],
              batched: true,
              statusCode: 200,
              destination: commonUpsertDestConfig3,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
];

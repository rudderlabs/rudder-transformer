import { defaultMockFns } from '../mocks';
import { commonDeletionDestConfig, commonDeletionConnectionConfigV2, destType } from '../common';

// Regression guard for the COQL injection issue (INT-6478 / SEC-292).
//
// A user-controlled identifier value containing a single quote must be escaped before it is
// interpolated into the COQL WHERE clause, so it cannot break out of the string literal and
// match unintended records. The network mock only matches the *escaped* query string, so if the
// escaping regresses the transformer would emit the raw (unsafe) query, the mock would miss, and
// this test would fail.
export const identifierEscapingData = [
  {
    name: destType,
    id: 'zoho_identifier_escaping_injection',
    description:
      'escapes single quotes in identifier values so a deletion lookup cannot break out of the COQL string literal',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              message: {
                action: 'delete',
                context: {
                  sources: {
                    job_run_id: 'cgiiurt8um7k7n5dq480',
                    task_run_id: 'cgiiurt8um7k7n5dq48g',
                    job_id: '2MUWghI7u85n91dd1qzGyswpZan',
                    version: '895/merge',
                  },
                },
                recordId: '2',
                rudderId: '2',
                identifiers: {
                  // Injection payload: without escaping this becomes
                  //   WHERE Email = 'x' OR id IS NOT NULL OR id != ''
                  // which matches every record in the module.
                  Email: "x' OR id IS NOT NULL OR id != '",
                },
                fields: {
                  First_Name: 'subcribed',
                  Last_Name: ' User',
                },
                type: 'record',
              },
              metadata: {
                jobId: 1,
                userId: 'u1',
                secret: {
                  accessToken: 'correct-access-token',
                },
              },
              destination: commonDeletionDestConfig,
              connection: commonDeletionConnectionConfigV2,
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
              batchedRequest: {
                version: '1',
                type: 'REST',
                method: 'DELETE',
                endpoint:
                  'https://www.zohoapis.in/crm/v6/Leads?ids=<ESCAPED_LOOKUP_RECORD_ID>&wf_trigger=false',
                headers: {
                  Authorization: 'Zoho-oauthtoken correct-access-token',
                },
                params: {},
                body: {
                  JSON: {},
                  JSON_ARRAY: {},
                  XML: {},
                  FORM: {},
                },
                files: {},
              },
              metadata: [
                {
                  jobId: 1,
                  userId: 'u1',
                  secret: {
                    accessToken: 'correct-access-token',
                  },
                },
              ],
              batched: true,
              statusCode: 200,
              destination: commonDeletionDestConfig,
            },
          ],
        },
      },
    },
    mockFns: defaultMockFns,
  },
];

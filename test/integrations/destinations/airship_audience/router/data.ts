import { generateMetadata, generateRecordPayload } from '../../../testUtils';
import { RouterTestData } from '../../../testTypes';
import {
  blankKeyDestination,
  connection,
  connectionFor,
  destination,
  destType,
  endpoint,
  endpointPath,
  euDestination,
  euEndpoint,
  headers,
  RouterConfigurationErrorStatTags,
  RouterInstrumentationErrorStatTags,
  tagGroup,
} from '../common';

const tagBody = (
  action: 'add' | 'remove',
  namedUserIds: string[],
  tagName = 'rs_air_e2e',
): Record<string, unknown> => ({
  audience: { named_user_id: namedUserIds },
  [action]: { [tagGroup]: [tagName] },
});

const post = (url: string, JSON: Record<string, unknown>) => ({
  version: '1',
  type: 'REST',
  method: 'POST',
  endpoint: url,
  endpointPath,
  headers,
  params: {},
  body: { JSON, JSON_ARRAY: {}, XML: {}, FORM: {} },
  files: {},
});

const ok = (
  jobIds: number[],
  JSON: Record<string, unknown>,
  dest = destination,
  url = endpoint,
) => ({
  batchedRequest: post(url, JSON),
  metadata: jobIds.map((jobId) => generateMetadata(jobId)),
  batched: true,
  statusCode: 200,
  destination: dest,
});

const failed = (jobId: number, error: string, statTags = RouterInstrumentationErrorStatTags) => ({
  metadata: [generateMetadata(jobId)],
  batched: false,
  statusCode: 400,
  error,
  statTags,
  destination,
});

const row = (
  jobId: number,
  action: string,
  namedUserId: unknown,
  conn = connection,
  dest = destination,
) => ({
  message: generateRecordPayload({ identifiers: { named_user_id: namedUserId }, action }),
  metadata: generateMetadata(jobId),
  destination: dest,
  connection: conn,
});

const routerCase = (
  id: string,
  description: string,
  input: any[],
  output: any[],
): RouterTestData => ({
  id,
  name: destType,
  description,
  scenario: 'Business',
  successCriteria: description,
  feature: 'router',
  module: 'destination',
  version: 'v0',
  input: { request: { method: 'POST', body: { input, destType } } },
  output: { response: { status: 200, body: { output } } },
});

export const data: RouterTestData[] = [
  routerCase(
    'airship-audience-router-inserts',
    'three inserts → one POST /api/named_users/tags adding the tag to all three, with exactly the three headers',
    [row(1, 'insert', 'u-1'), row(2, 'insert', 'u-2'), row(3, 'update', 'u-3')],
    [ok([1, 2, 3], tagBody('add', ['u-1', 'u-2', 'u-3']))],
  ),
  routerCase(
    'airship-audience-router-insert-and-delete',
    'an insert and a delete → two requests, one add block and one remove block, never both in one body',
    [row(1, 'insert', 'u-1'), row(2, 'delete', 'u-2')],
    [ok([1], tagBody('add', ['u-1'])), ok([2], tagBody('remove', ['u-2']))],
  ),
  routerCase(
    'airship-audience-router-two-connections',
    'rows of two connections with tags a and b in one call → one request per tag',
    [
      row(1, 'insert', 'u-1', connectionFor('a', 'src-a')),
      row(2, 'insert', 'u-2', connectionFor('b', 'src-b')),
    ],
    [ok([1], tagBody('add', ['u-1'], 'a')), ok([2], tagBody('add', ['u-2'], 'b'))],
  ),
  routerCase(
    'airship-audience-router-named-user-id-normalisation',
    'numbers become strings (0 → "0"), strings are trimmed, case is kept',
    [
      row(1, 'insert', 0),
      row(2, 'insert', 12345),
      row(3, 'insert', ' rs-air-e2e-1 '),
      row(4, 'insert', 'Rs-Air-1'),
    ],
    [ok([1, 2, 3, 4], tagBody('add', ['0', '12345', 'rs-air-e2e-1', 'Rs-Air-1']))],
  ),
  routerCase(
    'airship-audience-router-invalid-named-user-ids',
    'an empty and an object named user ID each fail alone; the good row is still sent',
    [row(1, 'insert', ''), row(2, 'insert', {}), row(3, 'insert', 'good')],
    [
      ok([3], tagBody('add', ['good'])),
      failed(1, 'No named user ID mapped'),
      failed(2, 'Invalid named user ID'),
    ],
  ),
  routerCase(
    'airship-audience-router-blank-api-key',
    'a blank apiKey fails the input schema before any request is built',
    [row(1, 'insert', 'u-1', connection, blankKeyDestination)],
    [
      {
        ...failed(
          1,
          'destination.Config.apiKey: Airship API key is missing',
          RouterConfigurationErrorStatTags,
        ),
        destination: blankKeyDestination,
      },
    ],
  ),
  routerCase(
    'airship-audience-router-eu',
    'dataCenter EU → https://go.airship.eu/api/named_users/tags',
    [row(1, 'insert', 'u-1', connection, euDestination)],
    [ok([1], tagBody('add', ['u-1']), euDestination, euEndpoint)],
  ),
];

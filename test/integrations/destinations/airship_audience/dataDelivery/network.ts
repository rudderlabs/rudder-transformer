// Auto-discovered by the component runner (glob **/network.ts). Each mock matches on the body AND
// the three headers the transform set, so a request sent without the token finds no mock.
//
// 200, 40090, 40006 (with `details`) and 40101 are Airship's responses captured live on
// 2026-10-22/28/29 (spec §6.0, probes P1, P2, P4 and the wrong-token probe). Airship was never
// seen answering 429 or 5xx, so those bodies are not captured: 429 and 503 are empty, and the 502
// is a load balancer's HTML page, the shape that reaches the delivery code when Airship's edge
// fails. The empty 400 is the framework's no-body path.
import { endpoint, headers, tagGroup } from '../common';

const LONG_TAG = 't'.repeat(129);
export const MISSING_GROUP = 'rs_air_missing_group';

const addBody = (namedUserIds: string[], group = tagGroup, tagName = 'rs_air_e2e') => ({
  audience: { named_user_id: namedUserIds },
  add: { [group]: [tagName] },
});

export const bodies = {
  success: addBody(['rs-air-ok-1', 'rs-air-ok-2']),
  missingGroup: addBody(['rs-air-40090-1', 'rs-air-40090-2', 'rs-air-40090-3'], MISSING_GROUP),
  invalidTagBatch: addBody(
    ['rs-air-40006-1', 'rs-air-40006-2', 'rs-air-40006-3'],
    tagGroup,
    LONG_TAG,
  ),
  invalidTagSingle: addBody(['rs-air-40006-single'], tagGroup, LONG_TAG),
  unauthorized: addBody(['rs-air-401']),
  rateLimited: addBody(['rs-air-429']),
  unavailable: addBody(['rs-air-503']),
  badGateway: addBody(['rs-air-502']),
  emptyBadRequest: addBody(['rs-air-400-empty-1', 'rs-air-400-empty-2']),
};

export const responses = {
  success: { ok: true },
  missingGroup: {
    ok: false,
    error: `No valid tag groups were contained in the request: The following tag groups do not exist: ${MISSING_GROUP}`,
    error_code: 40090,
  },
  invalidTag: {
    ok: false,
    error: 'Could not parse request body.',
    error_code: 40006,
    details: { error: `Invalid Tag '${LONG_TAG}' is greater than 128 characters.` },
  },
  unauthorized: { ok: false, error: 'Unauthorized', error_code: 40101 },
  badGatewayHtml: '<html><body><h1>502 Bad Gateway</h1></body></html>',
};

const post = (data: Record<string, unknown>) => ({ method: 'POST', url: endpoint, data, headers });

export const networkCallsData = [
  { httpReq: post(bodies.success), httpRes: { data: responses.success, status: 200 } },
  { httpReq: post(bodies.missingGroup), httpRes: { data: responses.missingGroup, status: 400 } },
  { httpReq: post(bodies.invalidTagBatch), httpRes: { data: responses.invalidTag, status: 400 } },
  { httpReq: post(bodies.invalidTagSingle), httpRes: { data: responses.invalidTag, status: 400 } },
  { httpReq: post(bodies.unauthorized), httpRes: { data: responses.unauthorized, status: 401 } },
  { httpReq: post(bodies.rateLimited), httpRes: { data: '', status: 429 } },
  { httpReq: post(bodies.unavailable), httpRes: { data: '', status: 503 } },
  { httpReq: post(bodies.badGateway), httpRes: { data: responses.badGatewayHtml, status: 502 } },
  { httpReq: post(bodies.emptyBadRequest), httpRes: { data: '', status: 400 } },
];

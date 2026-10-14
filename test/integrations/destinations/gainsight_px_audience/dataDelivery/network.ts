// Auto-discovered by the component runner (glob **/network.ts). Each mock matches on body AND on the
// injected X-APTRINSIC-API-KEY header, so a request sent without prepareRequest finds no mock.
import { sentHeaders, usersUpdateEndpoint } from '../common';

export const bodies = {
  success: { identifyId: 'gpx-ok', customAttributes: { rs_gpx_e2e: true } },
  notFoundTrue: { identifyId: 'gpx-missing-true', customAttributes: { rs_gpx_e2e: true } },
  notFoundFalse: { identifyId: 'gpx-missing-false', customAttributes: { rs_gpx_e2e: false } },
  attributeMissing: { identifyId: 'gpx-attr-missing', customAttributes: { rs_gpx_e2e: true } },
  typeMismatch: { identifyId: 'gpx-type-mismatch', customAttributes: { rs_gpx_e2e: true } },
  unauthorized: { identifyId: 'gpx-401', customAttributes: { rs_gpx_e2e: true } },
  forbidden: { identifyId: 'gpx-403', customAttributes: { rs_gpx_e2e: false } },
  rateLimited: { identifyId: 'gpx-429', customAttributes: { rs_gpx_e2e: true } },
  serverError: { identifyId: 'gpx-500', customAttributes: { rs_gpx_e2e: true } },
};

export const responses = {
  notFound: { message: 'User not found' },
  attributeMissing: {
    externalapierror: {
      status: 'BAD_REQUEST',
      subErrors: [
        { message: "User custom attribute api name 'rs_gpx_e2e' does not exist or not enabled" },
      ],
    },
  },
  typeMismatch: {
    externalapierror: {
      status: 'BAD_REQUEST',
      subErrors: [{ message: 'value null does not match the type BOOLEAN', rejectedValue: null }],
    },
  },
  unauthorized: { message: 'Unauthorized' },
  forbidden: { message: 'Forbidden' },
  rateLimited: { message: 'Too many requests' },
  serverError: { message: 'Internal error' },
};

const put = (data: Record<string, unknown>) => ({
  method: 'PUT',
  url: usersUpdateEndpoint,
  data,
  headers: sentHeaders,
});

export const networkCallsData = [
  { httpReq: put(bodies.success), httpRes: { data: '', status: 204 } },
  { httpReq: put(bodies.notFoundTrue), httpRes: { data: responses.notFound, status: 404 } },
  { httpReq: put(bodies.notFoundFalse), httpRes: { data: responses.notFound, status: 404 } },
  {
    httpReq: put(bodies.attributeMissing),
    httpRes: { data: responses.attributeMissing, status: 400 },
  },
  { httpReq: put(bodies.typeMismatch), httpRes: { data: responses.typeMismatch, status: 400 } },
  { httpReq: put(bodies.unauthorized), httpRes: { data: responses.unauthorized, status: 401 } },
  { httpReq: put(bodies.forbidden), httpRes: { data: responses.forbidden, status: 403 } },
  { httpReq: put(bodies.rateLimited), httpRes: { data: responses.rateLimited, status: 429 } },
  { httpReq: put(bodies.serverError), httpRes: { data: responses.serverError, status: 500 } },
];

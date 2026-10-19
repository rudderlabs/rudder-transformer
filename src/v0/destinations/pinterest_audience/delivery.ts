/**
 * Delivery for PINTEREST_AUDIENCE: `PATCH /v5/ad_accounts/{ad}/customer_lists/{list}`.
 *
 * Pinterest answers 200 with the updated CustomerList and has no per-record envelope, so every
 * verdict covers the whole request. Errors are `{ code, message }` (OpenAPI
 * `Pinterest.Lib.Error`). The framework default stands for 2xx (success), 429 (throttled), 5xx
 * (retry) and other 4xx (abort). The overrides below only refine what differs (spec §7.3).
 */
import {
  abort,
  authExpired,
  type DeliveryContext,
  type DeliverySpec,
  type StatusOverrideMap,
} from '../../../services/destination/destinationIntegration/destinationIntegration';

type PinterestErrorBody = { code?: unknown; message?: unknown };

const errorBodyOf = (response: unknown): PinterestErrorBody =>
  response && typeof response === 'object' ? (response as PinterestErrorBody) : {};

const messageOf = (response: unknown): string | undefined => {
  const { message } = errorBodyOf(response);
  return typeof message === 'string' && message ? message : undefined;
};

/** `"<code>: <message>"`, bare message, or a status-only fallback for an empty body. */
export const extractPinterestErrorMessage = (response: unknown, status: number): string => {
  const message = messageOf(response);
  if (!message) return `Pinterest request failed with status ${status}`;
  const { code } = errorBodyOf(response);
  return typeof code === 'number' ? `${code}: ${message}` : message;
};

/** Pinterest codes for "customer list not found" (spec §3.2). */
const LIST_NOT_FOUND_CODES: ReadonlySet<number> = new Set([1001, 1018]);

// The transform built this URL from schema-validated ids, so the match always succeeds.
const LIST_URL = /\/ad_accounts\/(\d+)\/customer_lists\/(\d+)/;
const idsOf = (ctx: DeliveryContext) => {
  const match = LIST_URL.exec(ctx.request.endpoint);
  return { adAccountId: match?.[1], customerListId: match?.[2] };
};

const listNotFound = (ctx: DeliveryContext) =>
  abort(
    `Customer list ${idsOf(ctx).customerListId} was not found — it may have been deleted. Pick or create the audience again.`,
  );

const pinterestAudienceStatusOverrides: StatusOverrideMap = {
  // Every 401 refreshes the token and retries. Retrying with the same token cannot succeed,
  // and aborting would drop up to MAX_RECORDS_PER_REQUEST members. A refresh that was not
  // needed is harmless; a revoked grant fails the refresh and marks the account for
  // re-authorisation in rudder-auth.
  401: (ctx) => authExpired(extractPinterestErrorMessage(ctx.response, ctx.status)),
  403: (ctx) => {
    const detail = messageOf(ctx.response)?.replace(/\.$/, '');
    return abort(
      `Pinterest refused the request${detail ? `: ${detail}` : ''}. Check the connected account still has access to ad account ${idsOf(ctx).adAccountId}.`,
    );
  },
  404: listNotFound,
  '4xx': (ctx, fallback) => {
    const { code } = errorBodyOf(ctx.response);
    return typeof code === 'number' && LIST_NOT_FOUND_CODES.has(code)
      ? listNotFound(ctx)
      : fallback();
  },
};

export const pinterestAudienceDelivery: DeliverySpec = {
  statusOverrides: pinterestAudienceStatusOverrides,
  failureReason: (ctx) => extractPinterestErrorMessage(ctx.response, ctx.status),
};

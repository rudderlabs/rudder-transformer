import {
  BaseError,
  ConfigurationError,
  InstrumentationError,
  PlatformError,
  RetryableError,
} from '@rudderstack/integrations-lib';
import {
  ChunkBatchStrategy,
  DestinationIntegration,
  type TransformResult,
  type TransformedEvent,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import type { BatchStrategy } from '../../../services/destination/destinationIntegration/types';
import { RecordAction } from '../../../types/rudderEvents';
import { getAuthToken } from '../marketo/util';
import {
  CONFLICTING_MEMBERSHIP,
  DUPLICATE_LEADS,
  LEAD_NOT_FOUND,
  LOOKUP_UNMATCHED,
  MAX_LEAD_IDS,
  MEMBERSHIP_ENDPOINT_PATH,
  REMOVAL_UNCONFIRMED,
  ROW_NOT_PREPARED,
  TOKEN_UNAVAILABLE,
} from './config';
import { marketoAudienceDelivery } from './delivery';
import { lookupLeadsByEmail, type LookupOutcome } from './lookup';
import {
  MarketoAudienceRouterRequestSchema,
  type MarketoAudiencePayload,
  type MarketoAudienceRouterRequest,
} from './types';
import { authCache, baseUrl, readListId, resolveIdentifier } from './utils';

type Operation = 'add' | 'remove';

// A row through the pre-stage. An `email` row becomes a `lead` row, or a failed one, once the
// lookup answers; transformEvent only ever sees `lead` and `failed`.
type PreparedRow =
  | { kind: 'failed'; error: Error }
  | { kind: 'lead'; listId: string; operation: Operation; leadId: number }
  | { kind: 'email'; listId: string; operation: Operation; email: string };

type PendingRow = Exclude<PreparedRow, { kind: 'failed' }>;

const failed = (error: Error): PreparedRow => ({ kind: 'failed', error });

function prepareRow(input: MarketoAudienceRouterRequest): PreparedRow {
  const list = readListId(input.connection);
  if (!list.ok) {
    return failed(new ConfigurationError(list.message));
  }
  const operation = input.message.action === RecordAction.DELETE ? 'remove' : 'add';
  const identifier = resolveIdentifier(input.message.identifiers);
  if (identifier.kind === 'error') {
    return failed(new InstrumentationError(identifier.message));
  }
  if (identifier.kind === 'id') {
    return { kind: 'lead', listId: list.listId, operation, leadId: identifier.leadId };
  }
  return { kind: 'email', listId: list.listId, operation, email: identifier.email };
}

function applyLookup(
  row: Extract<PreparedRow, { kind: 'email' }>,
  outcome: LookupOutcome | undefined,
): PreparedRow {
  if (!outcome) {
    return failed(new RetryableError(LOOKUP_UNMATCHED));
  }
  switch (outcome.kind) {
    case 'found':
      return { kind: 'lead', listId: row.listId, operation: row.operation, leadId: outcome.leadId };
    case 'missing':
      // Leads are never created. A missing removal cannot be confirmed as already absent.
      return failed(
        new InstrumentationError(row.operation === 'add' ? LEAD_NOT_FOUND : REMOVAL_UNCONFIRMED),
      );
    case 'duplicate':
      return failed(new InstrumentationError(DUPLICATE_LEADS));
    default:
      return failed(outcome.error);
  }
}

class MarketoAudienceIntegration extends DestinationIntegration<
  MarketoAudiencePayload,
  typeof MarketoAudienceRouterRequestSchema
> {
  static readonly delivery = marketoAudienceDelivery;

  // Filled by transformEvents before super.transformEvents reads it, keyed by the input object
  // the framework passes to both. The framework builds one instance per destination group, so
  // these fields never cross requests.
  private rows = new Map<MarketoAudienceRouterRequest, PreparedRow>();

  private token = '';

  // `Cache` does not store a failed fetch, so the pending request is held here: a bad credential
  // costs one identity call per router request, not one per row.
  private tokenRequest?: Promise<unknown>;

  // Every row of one call belongs to this.destination: the transformer groups router input by
  // destination ID before the framework runs. Connections differ per row, so each row reads its
  // own (`this.connection` is only the first row's).
  async transformEvents(
    inputs: MarketoAudienceRouterRequest[],
    reqMetadata?: NonNullable<unknown>,
  ): Promise<TransformResult<MarketoAudiencePayload>> {
    this.rows = new Map(inputs.map((input) => [input, prepareRow(input)]));
    const pending = [...this.rows].filter(
      (entry): entry is [MarketoAudienceRouterRequest, PendingRow] => entry[1].kind !== 'failed',
    );
    if (pending.length > 0) {
      const token = await this.fetchToken();
      if (token instanceof Error) {
        pending.forEach(([input]) => this.rows.set(input, failed(token)));
      } else {
        this.token = token;
        await this.resolveEmails(pending);
        this.failConflicts();
      }
    }
    return super.transformEvents(inputs, reqMetadata);
  }

  transformEvent(input: MarketoAudienceRouterRequest): TransformedEvent<MarketoAudiencePayload> {
    const row = this.rows.get(input);
    if (row?.kind === 'failed') {
      throw row.error;
    }
    if (row?.kind !== 'lead') {
      throw new PlatformError(ROW_NOT_PREPARED);
    }
    return {
      body: { id: row.leadId },
      endpoint: `${baseUrl(this.destination.Config.accountId)}/rest/v1/lists/${row.listId}/leads.json`,
      endpointPath: MEMBERSHIP_ENDPOINT_PATH,
      method: row.operation === 'remove' ? 'DELETE' : 'POST',
      // Set at transform time: the proxy re-sends the stored headers and `prepareRequest` cannot
      // fetch a token. secretPaths.json masks it in Live Events.
      headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
    };
  }

  // Endpoint (list ID) and method (add or remove) are already part of the grouping key, so one
  // request never mixes lists or operations.
  getBatchStrategy(): BatchStrategy<MarketoAudiencePayload> {
    return new ChunkBatchStrategy<MarketoAudiencePayload>({
      maxItems: MAX_LEAD_IDS,
      wrapBody: (bodies) => ({ input: bodies }),
    });
  }

  getInputSchema() {
    return MarketoAudienceRouterRequestSchema;
  }

  private async fetchToken(): Promise<string | Error> {
    const { ID, WorkspaceID, Config } = this.destination;
    this.tokenRequest ??= getAuthToken(
      authCache,
      { ID, ...Config },
      { destinationId: ID, workspaceId: WorkspaceID },
    );
    try {
      const token = await this.tokenRequest;
      return typeof token === 'string' && token !== ''
        ? token
        : new RetryableError(TOKEN_UNAVAILABLE);
    } catch (error) {
      if (!(error instanceof BaseError)) {
        return new RetryableError(TOKEN_UNAVAILABLE);
      }
      // getAuthToken attaches the identity response, which holds the access token when Marketo
      // answers `expires_in: 0`, and the row error would print it. Keep status and tags only.
      return new BaseError(error.message, error.status, error.statTags);
    }
  }

  private async resolveEmails(pending: [MarketoAudienceRouterRequest, PendingRow][]) {
    const emailRows = pending.filter(
      (entry): entry is [MarketoAudienceRouterRequest, Extract<PendingRow, { kind: 'email' }>] =>
        entry[1].kind === 'email',
    );
    if (emailRows.length === 0) {
      return;
    }
    const { ID, WorkspaceID, Config } = this.destination;
    const outcomes = await lookupLeadsByEmail({
      accountId: Config.accountId,
      token: this.token,
      destinationId: ID,
      workspaceId: WorkspaceID,
      emails: emailRows.map(([, row]) => row.email),
    });
    emailRows.forEach(([input, row]) =>
      this.rows.set(input, applyLookup(row, outcomes.get(row.email))),
    );
  }

  // An add and a remove of one lead on one list cannot both be right, and sending both would leave
  // the membership to request order. Every row involved fails instead.
  private failConflicts() {
    const byLead = new Map<
      string,
      { inputs: MarketoAudienceRouterRequest[]; ops: Set<Operation> }
    >();
    this.rows.forEach((row, input) => {
      if (row.kind === 'lead') {
        const key = `${row.listId}:${row.leadId}`;
        const lead = byLead.get(key) ?? { inputs: [], ops: new Set<Operation>() };
        lead.inputs.push(input);
        lead.ops.add(row.operation);
        byLead.set(key, lead);
      }
    });
    byLead.forEach(({ inputs, ops }) => {
      if (ops.size > 1) {
        inputs.forEach((input) =>
          this.rows.set(input, failed(new InstrumentationError(CONFLICTING_MEMBERSHIP))),
        );
      }
    });
  }
}

export const Integration = MarketoAudienceIntegration;

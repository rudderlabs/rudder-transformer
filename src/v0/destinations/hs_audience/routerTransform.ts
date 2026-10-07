import type { z } from 'zod';
import { InstrumentationError, RetryableError } from '@rudderstack/integrations-lib';
import {
  ChunkBatchStrategy,
  DestinationIntegration,
  type TransformResult,
  type TransformedEvent,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import type { BatchStrategy } from '../../../services/destination/destinationIntegration/types';
import {
  ACCESS_TOKEN_REQUIRED,
  CONFLICTING_MEMBERSHIP,
  CONTACT_NOT_FOUND,
  LOOKUP_UNCORRELATED,
  MAX_MEMBERSHIP_BATCH_SIZE,
  MEMBERSHIP_ENDPOINT_PATH,
  NO_IDENTIFIER_MAPPED,
  REMOVAL_UNCONFIRMED,
  UNSUPPORTED_RECORD_ACTION,
} from './config';
import { hubSpotAudienceDelivery } from './delivery';
import { lookupDistinctEmails, toLookupError, type EmailLookupResult } from './lookup';
import {
  HubSpotAudienceRouterRequestSchema,
  type HubSpotAudiencePayload,
  type MembershipOperation,
} from './types';
import {
  JSON_HEADERS,
  membershipEndpoint,
  membershipOperation,
  readAccessToken,
  readListId,
  resolveIdentifier,
  wrapMembershipBody,
} from './utils';

type RouterInput = z.infer<typeof HubSpotAudienceRouterRequestSchema>;

type PreparedRow = {
  error?: Error;
  event?: TransformedEvent<HubSpotAudiencePayload>;
  credential?: string;
  listId?: string;
  recordId?: string;
  operation?: MembershipOperation;
  email?: string;
};

type EmailWork = {
  input: RouterInput;
  email: string;
  credential: string;
};

function readMetadata(input: object): unknown {
  if ('metadata' in input) {
    return input.metadata;
  }
  return undefined;
}

function rowError(message: string): InstrumentationError {
  return new InstrumentationError(message);
}

class HubSpotAudienceIntegration extends DestinationIntegration<
  HubSpotAudiencePayload,
  typeof HubSpotAudienceRouterRequestSchema
> {
  static readonly delivery = hubSpotAudienceDelivery;

  // Dropped at the end of each call. This instance is reused for the batch,
  // and the next batch must not inherit these contacts.
  private rowResults = new Map<object, PreparedRow>();

  // The framework passes the first row's connection. Later rows name their
  // own lists, so construction must succeed when no connection is present
  // and must not treat that first connection as the list for every row.

  async transformEvents(
    inputs: RouterInput[],
    reqMetadata?: NonNullable<unknown>,
  ): Promise<TransformResult<HubSpotAudiencePayload>> {
    this.rowResults = new Map();
    try {
      const emailWork = this.prepareRows(inputs);
      await this.resolveLookups(emailWork);
      this.applyConflicts();
      this.buildEvents();
      // Awaited so `finally` runs after transformEvent has read this map.
      // Returning the promise alone would clear the map first.
      return await super.transformEvents(inputs, reqMetadata);
    } finally {
      this.rowResults.clear();
    }
  }

  transformEvent(input: RouterInput): TransformedEvent<HubSpotAudiencePayload> {
    const prepared = this.rowResults.get(input);
    if (prepared?.error) {
      throw prepared.error;
    }
    if (!prepared?.event) {
      throw rowError(NO_IDENTIFIER_MAPPED);
    }
    return prepared.event;
  }

  // Grouping already used the row endpoint and `internalGroupKey`. The
  // instance connection is not a list id.
  getBatchStrategy(): BatchStrategy<HubSpotAudiencePayload> {
    return new ChunkBatchStrategy<HubSpotAudiencePayload>({
      maxItems: MAX_MEMBERSHIP_BATCH_SIZE,
      wrapBody: (bodies) => wrapMembershipBody(bodies),
    });
  }

  getInputSchema() {
    return HubSpotAudienceRouterRequestSchema;
  }

  private prepareRows(inputs: RouterInput[]): EmailWork[] {
    const emailWork: EmailWork[] = [];
    inputs.forEach((input) => {
      const prepared = this.classifyRow(input);
      this.rowResults.set(input, prepared);
      if (prepared.email && prepared.credential && !prepared.error) {
        emailWork.push({
          input,
          email: prepared.email,
          credential: prepared.credential,
        });
      }
    });
    return emailWork;
  }

  private classifyRow(input: RouterInput): PreparedRow {
    const credential = readAccessToken(input.destination?.Config);
    if (!credential) {
      return { error: rowError(ACCESS_TOKEN_REQUIRED) };
    }
    const list = readListId(input.connection);
    if (!list.ok) {
      return { error: rowError(list.message), credential };
    }
    const operation = membershipOperation(input.message?.action);
    if (!operation) {
      return { error: rowError(UNSUPPORTED_RECORD_ACTION), credential, listId: list.listId };
    }
    const identifier = resolveIdentifier(input.message?.identifiers);
    if (identifier.kind === 'error') {
      return {
        error: rowError(identifier.message),
        credential,
        listId: list.listId,
        operation,
      };
    }
    if (identifier.kind === 'id') {
      return { credential, listId: list.listId, operation, recordId: identifier.recordId };
    }
    return { credential, listId: list.listId, operation, email: identifier.email };
  }

  private async resolveLookups(emailWork: EmailWork[]): Promise<void> {
    const byCredential = new Map<string, EmailWork[]>();
    emailWork.forEach((item) => {
      const bucket = byCredential.get(item.credential) ?? [];
      bucket.push(item);
      byCredential.set(item.credential, bucket);
    });
    for (const [credential, items] of byCredential) {
      // A credential failure is stored on its own rows. Other credentials and
      // direct-id rows already prepared stay deliverable.
      // eslint-disable-next-line no-await-in-loop
      await this.resolveCredential(credential, items);
    }
  }

  private async resolveCredential(credential: string, items: EmailWork[]): Promise<void> {
    let lookedUp: Map<string, EmailLookupResult>;
    try {
      lookedUp = await lookupDistinctEmails(
        credential,
        items.map((item) => item.email),
        items.map((item) => readMetadata(item.input)),
      );
    } catch (error) {
      const classified = toLookupError(error);
      items.forEach((item) => this.applyLookupError(item, classified));
      return;
    }
    items.forEach((item) => this.applyLookupResult(item, lookedUp.get(item.email)));
  }

  private applyLookupError(item: EmailWork, error: Error): void {
    const prepared = this.rowResults.get(item.input);
    if (!prepared || prepared.error) {
      return;
    }
    this.rowResults.set(item.input, { ...prepared, error });
  }

  private applyLookupResult(item: EmailWork, outcome: EmailLookupResult | undefined): void {
    const prepared = this.rowResults.get(item.input);
    if (!prepared || prepared.error) {
      return;
    }
    if (!outcome || outcome.kind === 'error') {
      const error =
        outcome?.kind === 'error' ? outcome.error : new RetryableError(LOOKUP_UNCORRELATED, 500);
      this.rowResults.set(item.input, { ...prepared, error });
      return;
    }
    if (outcome.kind === 'miss') {
      const message = prepared.operation === 'remove' ? REMOVAL_UNCONFIRMED : CONTACT_NOT_FOUND;
      this.rowResults.set(item.input, { ...prepared, error: rowError(message) });
      return;
    }
    this.rowResults.set(item.input, { ...prepared, recordId: outcome.recordId });
  }

  private applyConflicts(): void {
    const groups = new Map<string, Map<string, Map<string, RouterInput[]>>>();
    this.rowResults.forEach((prepared, input) => {
      this.collectConflictMember(groups, input as RouterInput, prepared);
    });
    groups.forEach((byList) => {
      byList.forEach((byContact) => {
        byContact.forEach((members) => this.failConflictingMembers(members));
      });
    });
  }

  private collectConflictMember(
    groups: Map<string, Map<string, Map<string, RouterInput[]>>>,
    input: RouterInput,
    prepared: PreparedRow,
  ): void {
    if (
      prepared.error ||
      !prepared.credential ||
      !prepared.listId ||
      !prepared.recordId ||
      !prepared.operation
    ) {
      return;
    }
    const byList = groups.get(prepared.credential) ?? new Map<string, Map<string, RouterInput[]>>();
    const byContact = byList.get(prepared.listId) ?? new Map<string, RouterInput[]>();
    const members = byContact.get(prepared.recordId) ?? [];
    members.push(input);
    byContact.set(prepared.recordId, members);
    byList.set(prepared.listId, byContact);
    groups.set(prepared.credential, byList);
  }

  private failConflictingMembers(members: RouterInput[]): void {
    const operations = new Set(members.map((input) => this.rowResults.get(input)?.operation));
    if (!operations.has('add') || !operations.has('remove')) {
      return;
    }
    members.forEach((input) => {
      const prepared = this.rowResults.get(input);
      if (prepared) {
        this.rowResults.set(input, { ...prepared, error: rowError(CONFLICTING_MEMBERSHIP) });
      }
    });
  }

  private buildEvents(): void {
    this.rowResults.forEach((prepared, input) => {
      if (prepared.error || !prepared.recordId || !prepared.listId || !prepared.operation) {
        return;
      }
      this.rowResults.set(input, {
        ...prepared,
        event: {
          body: { operation: prepared.operation, recordId: prepared.recordId },
          endpoint: membershipEndpoint(prepared.listId),
          endpointPath: MEMBERSHIP_ENDPOINT_PATH,
          method: 'PUT',
          internalGroupKey: prepared.operation,
          headers: { ...JSON_HEADERS },
        },
      });
    });
  }
}

export const Integration = HubSpotAudienceIntegration;

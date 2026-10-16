import type { z } from 'zod';
import {
  ConfigurationError,
  InstrumentationError,
  RetryableError,
} from '@rudderstack/integrations-lib';
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
  LIST_ID_INVALID,
  LIST_ID_REQUIRED,
  LOOKUP_UNCORRELATED,
  MAX_MEMBERSHIP_BATCH_SIZE,
  MEMBERSHIP_ENDPOINT_PATH,
  NO_IDENTIFIER_MAPPED,
  REMOVAL_UNCONFIRMED,
  UNSUPPORTED_RECORD_ACTION,
  isSafeListId,
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
  resolveIdentifier,
  wrapMembershipBody,
} from './utils';

type RouterInput = z.infer<typeof HubSpotAudienceRouterRequestSchema>;

type PreparedRow = {
  error?: Error;
  event?: TransformedEvent<HubSpotAudiencePayload>;
  recordId?: string;
  operation?: MembershipOperation;
  email?: string;
};

type EmailWork = {
  input: RouterInput;
  email: string;
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

  private readonly accessToken: string;

  private readonly listId: string;

  private readonly headers: Record<string, string>;

  constructor(...args: ConstructorParameters<typeof DestinationIntegration>) {
    super(...args);
    // Construction precedes schema validation. All rows share this connection.
    const accessToken = this.destination.Config?.accessToken;
    if (typeof accessToken !== 'string' || !accessToken.trim()) {
      throw new ConfigurationError(ACCESS_TOKEN_REQUIRED);
    }
    const audienceId = this.connection?.config?.destination?.audienceId;
    if (typeof audienceId !== 'string' || !audienceId.trim()) {
      throw new ConfigurationError(LIST_ID_REQUIRED);
    }
    this.listId = audienceId.trim();
    if (!isSafeListId(this.listId)) {
      throw new ConfigurationError(LIST_ID_INVALID);
    }
    this.accessToken = accessToken.trim();
    this.headers = { ...JSON_HEADERS, Authorization: `Bearer ${this.accessToken}` };
  }

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
      if (prepared.email && !prepared.error) {
        emailWork.push({
          input,
          email: prepared.email,
        });
      }
    });
    return emailWork;
  }

  private classifyRow(input: RouterInput): PreparedRow {
    const operation = membershipOperation(input.message?.action);
    if (!operation) {
      return { error: rowError(UNSUPPORTED_RECORD_ACTION) };
    }
    const identifier = resolveIdentifier(input.message?.identifiers);
    if (identifier.kind === 'error') {
      return {
        error: rowError(identifier.message),
        operation,
      };
    }
    if (identifier.kind === 'id') {
      return { operation, recordId: identifier.recordId };
    }
    return { operation, email: identifier.email };
  }

  private async resolveLookups(emailWork: EmailWork[]): Promise<void> {
    let lookedUp: Map<string, EmailLookupResult>;
    try {
      lookedUp = await lookupDistinctEmails(
        this.accessToken,
        emailWork.map((item) => item.email),
        emailWork.map((item) => readMetadata(item.input)),
      );
    } catch (error) {
      const classified = toLookupError(error);
      emailWork.forEach((item) => this.applyLookupError(item, classified));
      return;
    }
    emailWork.forEach((item) => this.applyLookupResult(item, lookedUp.get(item.email)));
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
    const groups = new Map<string, RouterInput[]>();
    this.rowResults.forEach((prepared, input) => {
      this.collectConflictMember(groups, input as RouterInput, prepared);
    });
    groups.forEach((members) => this.failConflictingMembers(members));
  }

  private collectConflictMember(
    groups: Map<string, RouterInput[]>,
    input: RouterInput,
    prepared: PreparedRow,
  ): void {
    if (prepared.error || !prepared.recordId || !prepared.operation) {
      return;
    }
    const members = groups.get(prepared.recordId) ?? [];
    members.push(input);
    groups.set(prepared.recordId, members);
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
      if (prepared.error || !prepared.recordId || !prepared.operation) {
        return;
      }
      this.rowResults.set(input, {
        ...prepared,
        event: {
          body: { operation: prepared.operation, recordId: prepared.recordId },
          endpoint: membershipEndpoint(this.listId),
          endpointPath: MEMBERSHIP_ENDPOINT_PATH,
          method: 'PUT',
          internalGroupKey: prepared.operation,
          headers: this.headers,
        },
      });
    });
  }
}

export const Integration = HubSpotAudienceIntegration;

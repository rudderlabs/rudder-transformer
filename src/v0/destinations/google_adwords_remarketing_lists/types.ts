import type { Destination, Metadata } from '../../../types';

export interface GARLDestinationConfig {
  customerId: string;
  audienceId: string;
  loginCustomerId?: string;
  subAccount?: boolean;
  typeOfList: string;
  userSchema: string[];
  isHashRequired: boolean;
  userDataConsent?: string;
  personalizationConsent?: string;
}

export type GARLDestination = Destination<GARLDestinationConfig>;

export interface RecordEventContext {
  message: unknown;
  destination: GARLDestination;
  accessToken: string;
  audienceId: string;
  typeOfList: string;
  userSchema?: string[];
  isHashRequired: boolean;
  userDataConsent?: unknown;
  personalizationConsent?: unknown;
}

export interface Message {
  properties: { listData: Record<string, Record<string, unknown>[]> };
  type: string;
  [key: string]: unknown;
}

export interface RecordInput {
  message: {
    type?: string;
    action?: string;
    fields: Record<string, unknown>;
    identifiers?: Record<string, string | number>;
  };
  metadata: Metadata;
  destination: GARLDestination;
  connection: {
    config: {
      destination: GARLDestinationConfig;
    };
  };
}

export interface OfflineDataJobPayload {
  operations: Array<{
    create?: { userIdentifiers: Record<string, unknown>[] };
    remove?: { userIdentifiers: Record<string, unknown>[] };
  }>;
}

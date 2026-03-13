import type { Destination } from '../../../types';

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

export interface RecordEventContext {
  message: unknown;
  destination: { Config: GARLDestinationConfig };
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
  metadata: Record<string, unknown>;
  destination: {
    Config: GARLDestinationConfig;
  };
  connection: {
    config: {
      destination: GARLDestinationConfig;
    };
  };
}

export type GARLDestination = Destination<GARLDestinationConfig>;

export interface OfflineDataJobPayload {
  operations: Array<{
    create?: { userIdentifiers: Record<string, unknown>[] };
    remove?: { userIdentifiers: Record<string, unknown>[] };
  }>;
}


import { Metadata } from '../../../../types';

export type RegionKeys = 'US' | 'AU' | 'EU' | 'IN' | 'CN' | 'JP' | 'CA';

export type TransformedResponseToBeBatched = {
  upsertData: unknown[];
  deletionData: string[];
  upsertSuccessMetadata: Metadata[];
  deletionSuccessMetadata: Metadata[];
};

export type DestConfig = {
  trigger?: string;
  addDefaultDuplicateCheck?: boolean;
  multiSelectFieldLevelDecision?: Array<{ from: string; to: string }>;
  object: string;
  identifierMappings: Array<{ from: string; to: string }>;
};

export type ConnectionConfig = {
  destination: DestConfig;
};

export type ZohoMetadata = Metadata & {
  secret: {
    accessToken: string;
  };
};

export type Message = {
  fields?: Record<string, unknown>;
  action?: string;
  identifiers?: Record<string, unknown>;
};

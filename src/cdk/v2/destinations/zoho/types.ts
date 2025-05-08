import { Metadata } from '../../../../types';

export interface ZohoConfig {
  MAX_BATCH_SIZE: number;
}

export interface ZohoConDestConfig {
  object: string;
  trigger: string;
  addDefaultDuplicateCheck: boolean;
  identifierMappings: Array<{ to: string }>;
  multiSelectFieldLevelDecision?: Array<{ from: string; to: string }>;
}

export type ZohoDestiantionConfig = {
  region?: string;
};

export type ZohoDeliveryAccount = {
  options: {
    region: string;
  };
};

export interface TransformedResponse {
  upsertData: Record<string, any>[];
  upsertSuccessMetadata: Metadata[];
  deletionData: Record<string, any>[];
  deletionSuccessMetadata: Metadata[];
}

export interface BatchResponse {
  upsertResponseArray: Record<string, any>[];
  upsertmetadataChunks: { items: Metadata[][] };
  deletionResponseArray: Record<string, any>[];
  deletionmetadataChunks: { items: Metadata[][] };
}

export type SearchResponse =
  | {
      erroneous: true;
      code?: string;
      message: { code: string };
    }
  | {
      erroneous: false;
      code?: string;
      message: Record<string, unknown>[];
    };

export interface ModuleInfo {
  operationModuleType: string;
  upsertEndPoint: string;
  identifierType: string[];
}

export interface DeliveryAccount {
  options?: {
    region?: string;
  };
}

export interface ValidationResult {
  status: boolean;
  missingField: string[];
}

export interface SearchResult {
  erroneous: boolean;
  code?: string;
  message: Record<string, unknown>[];
}

export interface SearchParams {
  identifiers: Record<string, any> | undefined;
  metadata: Metadata;
  Config: {
    region?: string;
  };
  deliveryAccount?: DeliveryAccount;
  destConfig: ZohoConDestConfig;
}

export interface ZohoMessage {
  action?: string;
  context?: Record<string, unknown>;
  recordId?: string;
  rudderId?: string;
  fields?: Record<string, unknown>;
  identifiers?: Record<string, unknown>;
  type?: string;
}

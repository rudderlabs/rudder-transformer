import { Metadata, RecordAction } from '../../../types/rudderEvents';

export type ProjectType = 'email_based' | 'hybrid' | 'userid_based';

export type SyncMode = 'upsert' | 'mirror';

export interface IterableAudienceMessage {
  type: 'record';
  action: RecordAction;
  identifiers: {
    email?: string;
    userId?: string;
  };
}

export interface IterableAudienceRouterRequest {
  message: IterableAudienceMessage;
  metadata: Metadata;
  destination: {
    ID: string;
    Config: {
      apiKey?: string;
      dataCenter?: 'USDC' | 'EUDC';
      projectType?: ProjectType;
    };
  };
  connection: {
    config: {
      destination: {
        audienceId: string | number;
        syncMode?: SyncMode;
        identifierMappings?: { from?: string; to?: 'email' | 'userId' }[];
      };
    };
  };
}

export interface Subscriber {
  email?: string;
  userId?: string;
}

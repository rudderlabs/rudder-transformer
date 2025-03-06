export interface Message {
  type: string;
  event?: string;
  traits?: Record<string, any>;
  groupId?: string;
  context?: {
    traits?: Record<string, any>;
  };
  integrations?: {
    EMARSYS?: {
      customIdentifierId?: number;
      contactListId?: string;
    };
  };
}

export interface FieldMapping {
  rudderProperty: string;
  emersysProperty: string;
}

export interface Destination {
  fieldMapping?: FieldMapping[];
  defaultContactList?: string;
  Config?: {
    emersysCustomIdentifier?: string;
    defaultContactList?: string;
    fieldMapping?: FieldMapping[];
  };
  emersysCustomIdentifier?: string;
  eventsMapping?: Array<{
    from: string;
    to: string;
  }>;
}

export interface DestConfig {
  emersysUsername: string;
  emersysUserSecret: string;
  fieldMapping?: FieldMapping[];
  emersysCustomIdentifier?: string;
  discardEmptyProperties?: boolean;
  defaultContactList?: string;
  eventsMapping?: EventsMapping[];
}

export interface EventsMapping {
  from: string;
  to: string;
}

export interface IntegrationObject {
  customIdentifierId?: string;
  contactListId?: string;
  trigger_id?: string;
}

export interface BatchConstants {
  version: string;
  type: string;
  headers: Record<string, string>;
  destination: any;
}

export interface Batch {
  endpoint: string;
  payload: any;
  metadata: any[];
}

export interface SuccessfulEvent {
  message: [
    {
      version: string;
      type: string;
      headers: Record<string, string>;
      body: {
        JSON: {
          eventType: string;
          destinationPayload: any;
        };
      };
      endpoint?: string;
    },
  ];
  destination: any;
  metadata: any;
}

export interface IdentifyPayload {
  key_id: string | number;
  contacts: any[];
  contact_list_id: string;
}

export interface GroupPayload {
  key_id: string | number;
  external_ids: string[];
}

export interface BatchedRequest {
  batchedRequest: {
    body: {
      JSON: any;
      JSON_ARRAY: Record<string, any>;
      XML: Record<string, any>;
      FORM: Record<string, any>;
    };
    version: string;
    type: string;
    method: string;
    endpoint: string;
    headers: Record<string, string>;
    params: Record<string, any>;
    files: Record<string, any>;
  };
  metadata: any[];
  batched: boolean;
  statusCode: number;
  destination: any;
}

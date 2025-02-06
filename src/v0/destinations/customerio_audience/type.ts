import { Connection, Destination, Metadata, RouterTransformationRequestData } from '../../../types';

// Basic response type for audience list operations
export type RespList = {
  payload: {
    ids: (string | number)[];
  };
  metadata: Metadata;
};

// Types for API request components
export type SegmentationPayloadType = {
  ids: (string | number)[];
};

export type SegmentationParamType = {
  id_type: string;
};

export type SegmentationHeadersType = {
  'Content-Type': string;
  Authorization: string;
};

// CustomerIO specific configuration types
type CustomerIODestinationConfig = {
  apiKey: string;
  appApiKey: string;
  siteId: string;
  [key: string]: any;
};

type CustomerIOConnectionConfig = {
  destination: {
    audienceId: string | number;
    identifierMappings: {
      from: string;
      to: string;
    }[];
  };
};

// Message type specific to CustomerIO
export type CustomerIOMessageType = {
  action: string;
  identifiers: Record<string, string | number>;
  [key: string]: any;
};

// Final exported types using generics from base types
export type CustomerIODestinationType = Destination<CustomerIODestinationConfig>;
export type CustomerIOConnectionType = Connection & {
  config: CustomerIOConnectionConfig;
};

export type CustomerIORouterRequestType = RouterTransformationRequestData<
  CustomerIOMessageType,
  CustomerIODestinationType,
  CustomerIOConnectionType
>;

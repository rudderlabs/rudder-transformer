import { Connection, Destination, Metadata } from '../../../types';
import { FixMe } from '../../../util/types';

export type RespList = {
  payload: {
    ids: (string | number)[];
  };
  metadata: CustomerIOMetadataType;
};

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

type CIOConnectionConfigType = {
  destination: {
    audienceId: string | number;
    identifierMappings: {
      from: string;
      to: string;
    }[];
    [key: string]: any;
  };
  [key: string]: any;
};

type CIODestinationConfigType = {
  apiKey: string;
  appApiKey: string;
  siteId: string;
  [key: string]: any;
};

type GenericRouterRequestData<
  CIOMessage = object,
  CIODestination = Destination,
  CIOConnection = Connection,
> = {
  message: CIOMessage;
  metadata: Metadata;
  destination: CIODestination;
  connection: CIOConnection;
  [key: string]: any;
};

type CIODestination<CIODestinationConfig = FixMe> = {
  Config: CIODestinationConfig;
  [key: string]: any;
};

type CIOConnection<CIOConnectionConfig = Record<string, unknown>> = {
  config: CIOConnectionConfig;
  [key: string]: any;
};

export type CustomerIOMessageType = {
  action: string;
  identifiers: Record<string, string | number>;
  [key: string]: any;
};

export type CustomerIOMetadataType = Metadata;

export type CustomerIODestinationType = CIODestination<CIODestinationConfigType>;

export type CustomerIOConnectionType = CIOConnection<CIOConnectionConfigType>;

export type CustomerIORouterRequestType = GenericRouterRequestData<
  CustomerIOMessageType,
  CustomerIODestinationType,
  CustomerIOConnectionType
>;

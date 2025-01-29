export type RespList = {
  payload: {
    ids: (string | number)[];
  };
  metadata: Record<string, unknown>;
};

export type EventStructure = {
  message: {
    action: string;
    identifiers: Record<string, string | number>;
  };
  metadata: Record<string, unknown>;
  destination: DestinationStructure;
  connection: ConnectionStructure;
};

export type ConnectionStructure = {
  config: {
    destination: {
      audienceId: string | number;
      identifierMappings: {
        from: string;
        to: string;
      }[];
    };
  };
};

export type DestinationStructure = {
  Config: {
    apiKey: string;
    appApiKey: string;
    siteId: string;
  };
};

export type CustomerSearchPayloadType = {
  filter: {
    or: {
      attribute: {
        field: string;
        operator: string;
        value: string | number;
      };
    }[];
  };
};

export type CustomerSearchResponseType = {
  identifiers: {
    cio_id: string;
    id: string;
    email: string;
  }[];
  ids: string[];
  next: string;
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

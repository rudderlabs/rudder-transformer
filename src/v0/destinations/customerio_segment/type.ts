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
  config: {
    apiKey: string;
    appApiKey: string;
    siteId: string;
  };
};

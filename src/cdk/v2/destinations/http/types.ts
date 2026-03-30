export interface Mapping {
  from: string;
}

export interface PathParam {
  path: string;
}

export interface BatchEvent {
  batchedRequest: {
    body: {
      JSON: Record<string, unknown>;
    };
    method: string;
    endpoint: string;
    headers: Record<string, string>;
    params: Record<string, unknown>;
  };
  metadata: unknown[];
  destination: unknown;
}

export type RedisConfig = Partial<{
  address: string;
  database: string;
  prefix: string;
  useJSONModule: boolean;
}>;

type RedisJSONOutput = {
  message: Record<string, any>;
  userId: string;
};

export enum TraitsLocation {
  ContextTraits = 'context.traits',
  Traits = 'traits',
}
export enum SupportedEventTypes {
  Identify = 'identify',
}

export type RedisTc = {
  description: string;
  destId?: string;
  workspaceId?: string;
  destinationConfig: RedisConfig;
  traitsLocation: TraitsLocation;
  traits: Record<string, any>;
  eventType: SupportedEventTypes;
  userId?: string;
  expectedResponse: RedisJSONOutput;
  expectedStatusCode: number;
  profilesContext?: {
    sources: {
      profiles_entity: string;
      profiles_id_type: string;
      profiles_model: string;
    };
  };
};

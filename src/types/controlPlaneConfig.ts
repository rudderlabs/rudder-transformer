// import type { FixMe } from '../util/types';
import type { UserTransformationInput } from './userTransformation';

export type DestinationDefinition = {
  ID: string;
  Name: string;
  DisplayName: string;
  Config: Record<string, unknown>;
  ResponseRules?: Record<string, unknown> | null;
};

export type AccountDefinitionConfig = { refreshOAuthToken?: string };

export type AccountDefinition<Config = AccountDefinitionConfig> = {
  name: string;
  config: Config | null;
  authenticationType: string;
};
export type Account<
  OptionsT = Record<string, unknown> | null,
  SecretT = Record<string, unknown> | null,
  AccountDefinitionT = AccountDefinition | null,
> = {
  id: string;
  options: OptionsT;
  secret: SecretT;
  accountDefinition?: AccountDefinitionT;
  accountDefinitionName: string;
};

export type Destination<
  DestinationConfig = Record<string, unknown>,
  DeliveryAccountT = Account | null,
  DeleteAccountT = Account | null,
> = {
  ID: string;
  Name: string;
  DestinationDefinition: DestinationDefinition;
  Config: DestinationConfig;
  Enabled: boolean;
  WorkspaceID: string;
  Transformations: UserTransformationInput[];
  RevisionID?: string;
  IsProcessorEnabled?: boolean;
  IsConnectionEnabled?: boolean;
  deliveryAccount?: DeliveryAccountT;
  deleteAccount?: DeleteAccountT;
  hasDynamicConfig?: boolean; // Flag indicating whether the destination config contains dynamic config patterns
};

export type DestinationConnectionConfig<T> = {
  destination: T;
};

export type Connection<T = Record<string, unknown>> = {
  sourceId: string;
  destinationId: string;
  enabled: boolean;
  config: T;
  processorEnabled?: boolean;
};

export type SourceDefinition = {
  ID: string;
  Name: string;
  Category: string;
  Type: string;
};

export type Source = {
  ID: string;
  OriginalID: string;
  Name: string;
  SourceDefinition: SourceDefinition;
  Config: object;
  Enabled: boolean;
  WorkspaceID: string;
  WriteKey: string;
  Transformations?: UserTransformationInput[];
  RevisionID?: string;
  Destinations?: Destination[];
  Transient: boolean;
  EventSchemasEnabled: boolean;
  DgSourceTrackingPlanConfig: object;
};

export type UserTransformationLibrary = {
  VersionID: string;
};

export type Credential = {
  id: string;
  key: string;
  value: string;
  isSecret: boolean;
};

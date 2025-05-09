// import type { FixMe } from '../util/types';
import type { UserTransformationInput } from './userTransformation';

export type DestinationDefinition = {
  ID: string;
  Name: string;
  DisplayName: string;
  Config: Record<string, unknown>;
};

export type AccountDefinition<Config = { refreshOAuthToken?: string }> = {
  Name: string;
  Config: Config;
  AuthenticationType: string;
};
export type AccountWithDefinition<
  OptionsT = Record<string, unknown>,
  SecretT = Record<string, unknown>,
  AccountDefinitionT = AccountDefinition,
> = {
  ID: string;
  Options: OptionsT;
  Secret: SecretT;
  AccountDefinition: AccountDefinitionT;
};

export type Destination<
  DestinationConfig = Record<string, unknown>,
  DeliveryAccountT = AccountWithDefinition,
  DeleteAccountT = AccountWithDefinition,
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
  DeliveryAccount?: DeliveryAccountT;
  DeleteAccount?: DeleteAccountT;
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

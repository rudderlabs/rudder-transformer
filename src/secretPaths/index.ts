import secretPathsArtifact from './secretPaths.json';

export type SecretPaths = Record<string, string[] | null>;

export const secretPaths: SecretPaths = secretPathsArtifact;

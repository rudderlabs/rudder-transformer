import secretPathsArtifact from './secretPaths.json';

export type SecretPaths = Record<string, string[]>;

export const secretPaths: SecretPaths = secretPathsArtifact;

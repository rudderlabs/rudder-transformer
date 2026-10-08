import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export type SecretPaths = Record<string, string[] | null>;

/**
 * Loads the build-time artifact once. Absence is supported for mixed-version deployments and
 * deliberately omits the feature; artifact shape is owned and validated by the generator.
 */
export const loadSecretPaths = (
  artifactPath = join(__dirname, 'secretPaths.json'),
): SecretPaths | undefined => {
  if (!existsSync(artifactPath)) return undefined;
  return JSON.parse(readFileSync(artifactPath, 'utf8')) as SecretPaths;
};

export const secretPaths = loadSecretPaths();

/**
 * Reads `secretKeys` off the destination definitions - the source of truth for what counts as a
 * credential. A production build would consume the published definitions instead of a local
 * checkout.
 */
import fs from 'fs';
import { join } from 'path';
import { getIntegrations } from '../../routes/utils';

export const integrationsConfigPath = (configuredPath?: string): string =>
  configuredPath ||
  join(__dirname, '../../../../rudder-integrations-config/src/configurations/destinations');

const DEFINITION_ALIASES: Record<string, string> = {
  rudder_test: 'test_destination',
  salesforce_oauth_sandbox: 'salesforce_oauth',
};

interface Definition {
  name: string;
  secretKeys: string[];
  config: Record<string, unknown>;
}

const loadDefinitions = (root: string): Map<string, Definition> => {
  if (!fs.existsSync(root)) {
    throw new Error(
      `integrations-config not found at ${root}. Set SECRET_PATHS_INTEGRATIONS_CONFIG=<path>.`,
    );
  }

  const definitions = new Map<string, Definition>();
  const addIdentity = (identity: string, definition: Definition): void => {
    const key = identity.toLowerCase();
    const existing = definitions.get(key);
    if (existing && existing.name !== definition.name) {
      throw new Error(
        `Destination definition identity '${identity}' is ambiguous (${existing.name}, ${definition.name})`,
      );
    }
    definitions.set(key, definition);
  };

  const configuredIntegrations = getIntegrations(root)
    .sort()
    .filter((dir) => fs.existsSync(join(root, dir, 'db-config.json')));
  for (const dir of configuredIntegrations) {
    const file = join(root, dir, 'db-config.json');
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8')) as {
      name?: unknown;
      config?: Record<string, unknown>;
    };
    if (typeof parsed.name !== 'string' || !parsed.config) {
      throw new Error(`Invalid destination definition: ${file}`);
    }
    const declared = parsed.config.secretKeys;
    if (declared !== undefined && !Array.isArray(declared)) {
      throw new Error(`config.secretKeys must be an array: ${file}`);
    }
    const definition: Definition = {
      name: parsed.name,
      secretKeys: (declared as unknown[] | undefined)?.map(String) ?? [],
      config: parsed.config,
    };
    addIdentity(dir, definition);
    addIdentity(parsed.name, definition);
  }
  return definitions;
};

const definitionsByRoot = new Map<string, Map<string, Definition>>();

const definitionsForRun = (configuredPath?: string): Map<string, Definition> => {
  const root = integrationsConfigPath(configuredPath);
  if (!definitionsByRoot.has(root)) definitionsByRoot.set(root, loadDefinitions(root));
  return definitionsByRoot.get(root)!;
};

const definitionFor = (destination: string, configuredPath?: string): Definition | undefined =>
  definitionsForRun(configuredPath).get(
    (DEFINITION_ALIASES[destination.toLowerCase()] ?? destination).toLowerCase(),
  );

/**
 * Every destination the transformer implements, sorted. A destination lives under v0 or cdk/v2,
 * never both. Shared so the generator's manifest and this lookup enumerate the same set.
 */
export const implementedDestinations = (): string[] =>
  [
    ...new Set([
      ...getIntegrations(join(__dirname, '../../v0/destinations')),
      ...getIntegrations(join(__dirname, '../../cdk/v2/destinations')),
    ]),
  ].sort();

export const loadDeclaredSecretKeys = (
  only?: string[],
  configuredPath?: string,
): Record<string, string[]> => {
  const destinations = only ?? implementedDestinations();
  const out: Record<string, string[]> = {};
  const missing: string[] = [];
  for (const destination of [...new Set(destinations.map((name) => name.toLowerCase()))].sort()) {
    const definition = definitionFor(destination, configuredPath);
    if (!definition) missing.push(destination);
    else out[destination] = definition.secretKeys;
  }
  if (missing.length > 0) {
    throw new Error(`No integrations-config definition for: ${missing.join(', ')}`);
  }
  return out;
};

/** Every config key a destination declares, filled with a distinctive dummy, for probing. */
export const probeConfigFor = (
  destination: string,
  configuredPath?: string,
): Record<string, string> => {
  const declared = definitionFor(destination, configuredPath)?.config;
  if (!declared) return {};
  const config: Record<string, string> = {};
  for (const group of Object.values((declared.destConfig as Record<string, unknown>) ?? {})) {
    if (Array.isArray(group)) {
      group.forEach((key) => {
        config[String(key)] = `probe-${key}`;
      });
    }
  }
  ((declared.secretKeys as string[]) ?? []).forEach((key) => {
    config[key] = `probe-${key}`;
  });
  return config;
};

/* eslint-disable no-continue */
/**
 * Reads `secretKeys` off the destination definitions - the source of truth for what counts as a
 * credential. Shared by the generator and the validator so both agree on what they are looking
 * for. A production build would consume the published definitions instead of a local checkout.
 */
import fs from 'fs';
import { join } from 'path';
import { getIntegrations } from '../../src/routes/utils';
import { argOf } from './args';

export const integrationsConfigPath = (): string =>
  argOf('integrations-config') ||
  join(__dirname, '../../../rudder-integrations-config/src/configurations/destinations');

const DEFINITION_ALIASES: Record<string, string> = {
  rudder_test: 'test_destination',
  salesforce_oauth_sandbox: 'salesforce_oauth',
};

interface Definition {
  name: string;
  secretKeys: string[];
  config: Record<string, unknown>;
}

const loadDefinitions = (): Map<string, Definition> => {
  const root = integrationsConfigPath();
  if (!fs.existsSync(root)) {
    throw new Error(`integrations-config not found at ${root}. Pass --integrations-config=<path>.`);
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

  for (const dir of getIntegrations(root).sort()) {
    const file = join(root, dir, 'db-config.json');
    if (!fs.existsSync(file)) continue;
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

let definitions: Map<string, Definition> | undefined;

const definitionsForRun = (): Map<string, Definition> => {
  definitions ??= loadDefinitions();
  return definitions;
};

const definitionFor = (destination: string): Definition | undefined =>
  definitionsForRun().get(
    (DEFINITION_ALIASES[destination.toLowerCase()] ?? destination).toLowerCase(),
  );

export const loadDeclaredSecretKeys = (only?: string[]): Record<string, string[]> => {
  const destinations = only ?? [
    ...getIntegrations(join(__dirname, '../../src/v0/destinations')),
    ...getIntegrations(join(__dirname, '../../src/cdk/v2/destinations')),
  ];
  const out: Record<string, string[]> = {};
  const missing: string[] = [];
  for (const destination of [...new Set(destinations.map((name) => name.toLowerCase()))].sort()) {
    const definition = definitionFor(destination);
    if (!definition) missing.push(destination);
    else out[destination] = definition.secretKeys;
  }
  if (missing.length > 0) {
    throw new Error(`No integrations-config definition for: ${missing.join(', ')}`);
  }
  return out;
};

/** Every config key a destination declares, filled with a distinctive dummy, for probing. */
export const probeConfigFor = (destination: string): Record<string, string> => {
  const declared = definitionFor(destination)?.config;
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

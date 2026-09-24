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

const INTEGRATIONS_CONFIG =
  argOf('integrations-config') ||
  join(__dirname, '../../../rudder-integrations-config/src/configurations/destinations');

export const loadDeclaredSecretKeys = (only?: string[]): Record<string, string[] | undefined> => {
  const out: Record<string, string[] | undefined> = {};
  if (!fs.existsSync(INTEGRATIONS_CONFIG)) {
    throw new Error(
      `integrations-config not found at ${INTEGRATIONS_CONFIG}. Pass --integrations-config=<path>.`,
    );
  }
  for (const dir of getIntegrations(INTEGRATIONS_CONFIG)) {
    if (only && !only.includes(dir.toLowerCase())) continue;
    const file = join(INTEGRATIONS_CONFIG, dir, 'db-config.json');
    // A definition that cannot be read is recorded as `undefined`, not skipped.
    //
    // Skipping made "no definition" indistinguishable from "definition says no secrets", and the
    // second is a positive claim that publishes an empty list. SALESFORCE_OAUTH_SANDBOX has no
    // definition in the checkout and was being published as having nothing to mask on that
    // basis. The caller fails those closed instead.
    if (!fs.existsSync(file)) {
      out[dir.toLowerCase()] = undefined;
      continue;
    }
    try {
      const declared = JSON.parse(fs.readFileSync(file, 'utf8'))?.config?.secretKeys;
      out[dir.toLowerCase()] = Array.isArray(declared) && declared.length > 0 ? declared : [];
    } catch {
      out[dir.toLowerCase()] = undefined;
    }
  }
  return out;
};

/** Every config key a destination declares, filled with a distinctive dummy, for probing. */
export const probeConfigFor = (destination: string): Record<string, string> => {
  const file = join(INTEGRATIONS_CONFIG, destination, 'db-config.json');
  if (!fs.existsSync(file)) return {};
  const config: Record<string, string> = {};
  try {
    const declared = JSON.parse(fs.readFileSync(file, 'utf8'))?.config ?? {};
    for (const group of Object.values(declared.destConfig ?? {})) {
      if (Array.isArray(group))
        group.forEach((key) => {
          config[String(key)] = `probe-${key}`;
        });
    }
    (declared.secretKeys ?? []).forEach((key: string) => {
      config[key] = `probe-${key}`;
    });
  } catch {
    // an unreadable definition simply yields no probe config
  }
  return config;
};

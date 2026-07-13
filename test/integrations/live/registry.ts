// Live-test framework — destination discovery.
//
// Scans destinations/<dest>/live.ts|js for enabled specs (optionally narrowed by a
// comma-separated filter). Enrollment is by presence of the file — no central list.

import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { EnrolledDestination, LiveSpec } from './types';

const DESTINATIONS_DIR = join(__dirname, '..', 'destinations');

// Dynamically require a spec module (discovered at runtime, not statically imported). A spec may be
// exported as `live` or as the default export. Returns undefined if missing or not enabled.
function loadSpec(destination: string): LiveSpec | undefined {
  const specPathTs = join(DESTINATIONS_DIR, destination, 'live.ts');
  const specPathJs = join(DESTINATIONS_DIR, destination, 'live.js');
  if (!existsSync(specPathTs) && !existsSync(specPathJs)) {
    return undefined;
  }
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const mod = require(join(DESTINATIONS_DIR, destination, 'live'));
  const spec: LiveSpec | undefined = mod.live || mod.default;
  return spec && spec.enabled ? spec : undefined;
}

export function getEnrolledDestinations(filter?: string): EnrolledDestination[] {
  if (!existsSync(DESTINATIONS_DIR)) {
    return [];
  }
  // `--destination=a,b` narrows the run to those destinations; absent = run all enabled.
  const wanted = filter
    ? new Set(
        filter
          .split(',')
          .map((d) => d.trim())
          .filter(Boolean),
      )
    : undefined;

  return readdirSync(DESTINATIONS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()
    .flatMap((destination) => {
      if (wanted && !wanted.has(destination)) {
        return [];
      }
      const spec = loadSpec(destination);
      if (!spec) {
        return [];
      }
      return [{ destination, spec }];
    });
}

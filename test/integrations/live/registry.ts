import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { EnrolledDestination, LiveSpec } from './types';

const DESTINATIONS_DIR = join(__dirname, '..', 'destinations');

// Dynamically require a spec module (discovered at runtime, not statically imported). A spec may be
// exported as `live` or as the default export. Returns undefined if missing or not enabled.
function loadSpec(destination: string): LiveSpec | undefined {
  const specPath = join(DESTINATIONS_DIR, destination, 'live.ts');
  if (!existsSync(specPath)) {
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

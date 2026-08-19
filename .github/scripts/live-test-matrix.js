// Builds the live-integration-tests CI matrix from the live specs on disk, so destinations are never
// enumerated by hand in the workflow. A destination is any directory under
// test/integrations/destinations/ that contains a live.ts. Each entry carries an `oauth` flag
// (authType: 'oauth'); the workflow uses it to wildcard-import the rudder-auth app credentials and
// to start rudder-auth, so no per-destination secret names live here.
//
// AFFECTED_DESTINATIONS optionally narrows the discovered live destinations for feature PRs:
// unset/empty/all => every live destination, none => empty matrix, comma-list => live destinations
// present in that list.
//
// Emits `matrix=<json>` and `has_work=<true|false>` on stdout for "$GITHUB_OUTPUT"; the matrix value
// is { include: [{ destination, oauth }] }.
const { readdirSync, readFileSync, existsSync } = require('fs');
const { join } = require('path');

const DEST_DIR = 'test/integrations/destinations';

const isOAuth = (specPath) => /authType:\s*['"]oauth['"]/.test(readFileSync(specPath, 'utf8'));

const include = readdirSync(DEST_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()
  .flatMap((destination) => {
    const specPath = join(DEST_DIR, destination, 'live.ts');
    if (!existsSync(specPath)) {
      return [];
    }
    return [{ destination, oauth: isOAuth(specPath) }];
  });

if (include.length === 0) {
  throw new Error(`No live specs found under ${DEST_DIR}/*/live.ts`);
}

const affectedDestinations = (process.env.AFFECTED_DESTINATIONS || '').trim();
const affectedMode = affectedDestinations.toLowerCase();

let filteredInclude = include;
if (affectedMode === 'none') {
  filteredInclude = [];
} else if (affectedDestinations && affectedMode !== 'all') {
  const affectedSet = new Set(
    affectedDestinations
      .split(',')
      .map((destination) => destination.trim())
      .filter(Boolean),
  );
  filteredInclude = include.filter(({ destination }) => affectedSet.has(destination));
}

process.stdout.write(`matrix=${JSON.stringify({ include: filteredInclude })}\n`);
process.stdout.write(`has_work=${filteredInclude.length > 0}\n`);

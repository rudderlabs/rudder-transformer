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

// Drop `/* */` and `//` comments before looking for the declaration. A live spec documents its own
// wiring at length, and `oauth: true` is not a cosmetic flag — it grants the job a WILDCARD Vault
// import of control-plane/data/external-services plus an ECR login. A destination must earn that by
// declaring `authType: 'oauth'`, never by mentioning it in prose.
//
// The line pass tracks quoting rather than taking the first `//`, so a URL in a string literal
// ('https://…') doesn't truncate the line and cost a real declaration sharing it.
const stripLineComment = (line) => {
  let quote = null;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (quote) {
      if (char === '\\') {
        i += 1; // escaped character, never a closing quote
      } else if (char === quote) {
        quote = null;
      }
    } else if (char === '"' || char === "'" || char === '`') {
      quote = char;
    } else if (char === '/' && line[i + 1] === '/') {
      return line.slice(0, i);
    }
  }
  return line;
};

const stripComments = (source) =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map(stripLineComment)
    .join('\n');

// A non-trivial spec lives in a `live/` module folder with `live.ts` reduced to a one-line
// re-export, so `authType` is declared in `live/spec.ts` and not in `live.ts` at all. Both are
// checked: reading only `live.ts` would report an OAuth destination using the recommended layout as
// non-OAuth, and the job would then skip the Vault cred import, the ECR login and rudder-auth.
const isOAuth = (destinationDir) =>
  [join(destinationDir, 'live.ts'), join(destinationDir, 'live', 'spec.ts')]
    .filter((path) => existsSync(path))
    .some((path) => /authType:\s*['"]oauth['"]/.test(stripComments(readFileSync(path, 'utf8'))));

const include = readdirSync(DEST_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()
  .flatMap((destination) => {
    const destinationDir = join(DEST_DIR, destination);
    if (!existsSync(join(destinationDir, 'live.ts'))) {
      return [];
    }
    return [{ destination, oauth: isOAuth(destinationDir) }];
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

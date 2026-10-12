/**
 * Jest entry point for `generate.ts`, launched only by the secret-path npm scripts through an
 * explicit `--testMatch`.
 *
 * Deliberately not named `.test.ts`: the default Jest suite collects that suffix, and normal
 * `npm test` must not run the full derivation or require an integrations-config checkout.
 */
import { getTestData } from '../../../test/integrations/testUtils';
import { main } from './generate';
import { fixturesByDestination } from './harness';

const check = process.env.SECRET_PATHS_CHECK === 'true';
// Parsed once and shared by the preload below and `main`, so both cover the same destinations.
const destinations = process.env.SECRET_PATHS_DESTINATION?.split(',').map((name) =>
  name.trim().toLowerCase(),
);
const integrationsConfig = process.env.SECRET_PATHS_INTEGRATIONS_CONFIG;

// Fixture modules are normally loaded while Jest defines the component suite. Some of them
// register cleanup hooks at module scope, so preload them during this entry point's definition
// phase too; the generator then reads the already-cached exports from inside the test. Only the
// requested destinations' fixtures, so a single-destination run does not load the whole corpus.
for (const [name, fixturePaths] of fixturesByDestination()) {
  if (!destinations || destinations.includes(name.toLowerCase())) fixturePaths.forEach(getTestData);
}

jest.setTimeout(30 * 60 * 1000);

it('derives the secret paths', async () => {
  await main({
    check,
    destinations,
    integrationsConfig,
  });
});

import { getTestData } from '../../../test/integrations/testUtils';
import { main } from './generate';
import { fixturesByDestination } from './harness';

const check = process.env.SECRET_PATHS_CHECK === 'true';
const destination = process.env.SECRET_PATHS_DESTINATION;
const integrationsConfig = process.env.SECRET_PATHS_INTEGRATIONS_CONFIG;

// Fixture modules are normally loaded while Jest defines the component suite. Some of them
// register cleanup hooks at module scope, so preload them during this entry point's definition
// phase too; the generator then reads the already-cached exports from inside the test.
for (const fixturePaths of fixturesByDestination().values()) {
  for (const fixturePath of fixturePaths) {
    getTestData(fixturePath);
  }
}

jest.setTimeout(30 * 60 * 1000);

it('derives the secret paths', async () => {
  await main({
    check,
    destinations: destination?.split(','),
    integrationsConfig,
  });
});

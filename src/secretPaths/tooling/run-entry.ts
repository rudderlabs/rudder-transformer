import { getTestData } from '../../../test/integrations/testUtils';
import { main } from './generate';
import { fixturesByDestination } from './harness';

interface RunOptions {
  check?: boolean;
  destination?: string;
  integrationsConfig?: string;
}

const options = JSON.parse(process.env.SECRET_PATHS_RUN_OPTIONS ?? '{}') as RunOptions;

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
    check: options.check,
    destinations: options.destination?.split(','),
    integrationsConfig: options.integrationsConfig,
  });
});

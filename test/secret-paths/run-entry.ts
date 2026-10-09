import secretPaths from '../../src/secretPaths/secretPaths.json';
import { loadDeclaredSecretKeys } from './declared';
import { main } from './generate';
import { fixturesByDestination } from './harness';
import { validate } from './validate';

interface RunOptions {
  check?: boolean;
  destination?: string;
  integrationsConfig?: string;
  validate?: boolean;
}

const options = JSON.parse(process.env.SECRET_PATHS_RUN_OPTIONS ?? '{}') as RunOptions;

// Fixture modules are normally loaded while Jest defines the component suite. Some of them
// register cleanup hooks at module scope, so preload them during this entry point's definition
// phase too; the generator then reads the already-cached exports from inside the test.
for (const fixturePaths of fixturesByDestination().values()) {
  for (const fixturePath of fixturePaths) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, import/no-dynamic-require
    require(fixturePath);
  }
}

jest.setTimeout(30 * 60 * 1000);

it(
  options.validate ? 'validates the committed secret paths' : 'derives the secret paths',
  async () => {
    if (options.validate) {
      await validate(secretPaths, loadDeclaredSecretKeys(undefined, options.integrationsConfig));
      return;
    }

    await main({
      check: options.check,
      destinations: options.destination?.split(','),
      integrationsConfig: options.integrationsConfig,
    });
  },
);

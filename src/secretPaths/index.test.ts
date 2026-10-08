import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { loadSecretPaths } from '.';

const tempDir = join(__dirname, '.test-artifacts');
const artifact = join(tempDir, 'secretPaths.json');

describe('loadSecretPaths', () => {
  afterEach(() => {
    if (existsSync(tempDir)) rmSync(tempDir, { recursive: true });
  });

  it('loads the artifact map directly', () => {
    mkdirSync(tempDir);
    writeFileSync(artifact, '{"TEST":["headers.Authorization"]}');

    expect(loadSecretPaths(artifact)).toEqual({ TEST: ['headers.Authorization'] });
  });

  it('returns undefined when the artifact is unavailable', () => {
    expect(loadSecretPaths(artifact)).toBeUndefined();
  });
});

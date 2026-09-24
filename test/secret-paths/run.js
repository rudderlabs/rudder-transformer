/* eslint-disable */
/**
 * Runner for generate.ts.
 *
 * Transpiles TypeScript in-process with esbuild (already a dependency) so the generator can
 * be run without adding ts-node. Modules keep their real paths, which matters because some
 * destinations load mapping JSON relative to __dirname at import time.
 *
 *   node test/secret-paths/run.js --destination=klaviyo,ga4 --integrations-config=<path>
 *   node test/secret-paths/run.js --validate --integrations-config=<path>
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const esbuild = require('esbuild');

// Destinations using custom mappings (HTTP, CUSTOM_AUDIENCE) call into an esbuild sandbox bundle
// at transform time. Without it every one of their cases 500s, and a destination whose cases all
// fail is indistinguishable from one that builds no request - which published "nothing to mask"
// for a destination that sends an Authorization header. `npm test` prefixes this build for the
// same reason; so must we.
const SANDBOX_BUNDLE = path.join(__dirname, '../../dist/mappingsSandbox.bundle.js');
if (!fs.existsSync(SANDBOX_BUNDLE)) {
  process.stdout.write('building esbuild sandboxes ... ');
  execFileSync('npm', ['run', 'build:sandboxes'], {
    cwd: path.join(__dirname, '../..'),
    stdio: 'ignore',
  });
  process.stdout.write('done\n');
}

require.extensions['.ts'] = (mod, filename) => {
  const { code } = esbuild.transformSync(fs.readFileSync(filename, 'utf8'), {
    loader: 'ts',
    format: 'cjs',
    target: 'node18',
    sourcefile: filename,
  });
  mod._compile(code, filename);
};

/**
 * Minimal `jest` shim.
 *
 * Fixture `mockFns` are written for the component suite, and the ones this generator needs
 * mostly pin the clock (`jest.spyOn(Date, 'now')`, `useFakeTimers().setSystemTime`) — exactly
 * the determinism the derivation wants. This covers the surface the corpus actually uses:
 * spyOn (with the mockReturnValue/mockImplementation/...Once setters), replaceProperty,
 * useFakeTimers, setSystemTime, mock, requireActual and fn.
 *
 * Anything outside that surface throws, and the generator records the destination as
 * unresolved rather than silently deriving from a half-applied fixture. Do not add no-op
 * members to quieten a failure — a no-op turns a countable gap into a wrong answer.
 */

// Keyed by target+property so re-spying the same site replaces rather than appends. The
// generator restores after every case, which mirrors the component suite resetting between
// tests; an unbounded append-only list would also retain every spied object for the whole run.
const originals = new Map();

const remember = (obj, prop, isOwn) => {
  const key = `${obj === globalThis ? 'global' : obj.constructor?.name || 'obj'}:${prop}`;
  if (!originals.has(key)) originals.set(key, { obj, prop, value: obj[prop], isOwn });
};

const install = (obj, prop) => (impl) => {
  remember(obj, prop, Object.prototype.hasOwnProperty.call(obj, prop));
  obj[prop] = impl;
};

const mockApi = (apply) => {
  const api = {
    mockReturnValue: (value) => (apply(() => value), api),
    mockImplementation: (impl) => (apply(impl), api),
    // Treated as the permanent form. Derivation only needs the transform to complete and to be
    // deterministic across runs; a one-shot stub would make run 2 differ from run 1 and read as
    // non-determinism. Fixtures using these would otherwise throw and fail the destination closed.
    mockReturnValueOnce: (value) => api.mockReturnValue(value),
    mockResolvedValue: (value) => api.mockReturnValue(Promise.resolve(value)),
    mockResolvedValueOnce: (value) => api.mockReturnValue(Promise.resolve(value)),
  };
  return api;
};

global.jest = {
  fn: (impl = () => undefined) => {
    const f = (...args) => f._impl(...args);
    f._impl = impl;
    Object.assign(
      f,
      mockApi((next) => {
        f._impl = next;
      }),
    );
    return f;
  },
  spyOn: (obj, method) => mockApi(install(obj, method)),
  // Fixtures use this to pin non-function properties (e.g. a module's exported constant).
  replaceProperty: (obj, prop, value) => {
    remember(obj, prop, Object.prototype.hasOwnProperty.call(obj, prop));
    obj[prop] = value;
    return { restore: () => {} };
  },
  useFakeTimers: () => global.jest,
  setSystemTime: (when) => {
    const fixed = when instanceof Date ? when.valueOf() : Number(when);
    install(Date, 'now')(() => fixed);
  },
  mock: () => {},
  requireActual: (m) => require(m),
  /** Called by the generator between fixture cases so spy state cannot leak across them. */
  restoreAllMocks: () => {
    for (const { obj, prop, value } of originals.values()) obj[prop] = value;
    originals.clear();
  },
};

/**
 * Jest lifecycle and assertion globals, as no-ops.
 *
 * Fixture modules reference these at import time - `afterAll(...)` at module scope, or
 * `expect.any(String)` embedded in expected-output data. Nothing here is ever called during
 * derivation: only the `input` half of a fixture is used, and assertions belong to the component
 * suite. But an unresolved reference throws while loading the file, and one unloadable file used
 * to fail its whole destination closed - MP, POSTSCRIPT and THE_TRADE_DESK were all lost that way,
 * two of them to fixtures in dataDelivery/ that the derivation never reads.
 */
const asymmetric = (label) => ({ asymmetricMatch: () => true, toString: () => label });
global.expect = Object.assign(
  () => new Proxy({}, { get: () => () => undefined }),
  {
    any: () => asymmetric('any'),
    anything: () => asymmetric('anything'),
    objectContaining: (v) => v,
    arrayContaining: (v) => v,
    stringContaining: (v) => asymmetric(String(v)),
    stringMatching: (v) => asymmetric(String(v)),
    extend: () => {},
  },
);
global.afterAll = () => {};
global.beforeAll = () => {};
global.afterEach = () => {};
global.beforeEach = () => {};
global.describe = () => {};
global.it = () => {};
global.test = () => {};

// The component suite's environment, which jest applies via `setupFiles` and this runner
// otherwise would not. Read off the jest config rather than naming `test/setup.ts` here, so a
// file added to `setupFiles` is picked up instead of silently not applying.
//
// Placed here, after the `jest` shim and before the first module that reads what these files set.
// Both halves of that matter: a setup file doing anything ordinary for a jest setupFile
// (`jest.setTimeout`, `expect.extend`) would throw if the shim were not installed yet, and the
// files' own contract is that they run before the modules which read their variables.
//
// Same failure mode as the missing sandbox bundle above if this is skipped, and just as quiet:
// without GOOGLE_ADS_DEVELOPER_TOKEN every GOOGLE_ADWORDS_OFFLINE_CONVERSIONS case returned a 400
// from `getDeveloperToken`, the destination produced no request in any fixture, and it was
// published as `[]` - nothing to mask - while sending `Authorization: Bearer <token>`.
const ROOT = path.join(__dirname, '../..');
const { setupFiles = [] } = require(path.join(ROOT, 'jest.config.js'));
setupFiles.forEach((file) =>
  require(
    file.startsWith('<rootDir>') ? path.join(ROOT, file.slice('<rootDir>'.length)) : path.resolve(ROOT, file),
  ),
);

const { hasFlag } = require('./args.ts');

if (hasFlag('validate')) {
  const { validate } = require('./validate.ts');
  const { loadDeclaredSecretKeys } = require('./declared.ts');
  // Imported rather than re-read, so the validator checks exactly the map /features serves -
  // and the boot-time integrity checks in that module run before it starts.
  const { secretPaths } = require('../../src/secretPaths');
  validate(secretPaths, loadDeclaredSecretKeys()).catch((e) => {
    console.error(e);
    process.exit(1);
  });
} else {
  require('./generate.ts');
}

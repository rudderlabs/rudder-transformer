import fs from 'fs';
import path from 'path';
import {
  DestHandlerMap,
  WhitelistOnlyDestinationAliases,
  destinationRegistry,
  getDestinationHandlerName,
  isValidDestination,
} from '../destinationCanonicalNames';

const getDestinationDirectories = () => {
  const srcRoot = path.resolve(__dirname, '..', '..');
  return ['v0/destinations', 'v1/destinations', 'cdk/v2/destinations'].flatMap((destinationRoot) =>
    fs
      .readdirSync(path.join(srcRoot, destinationRoot), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name.toLowerCase()),
  );
};

describe('destinationCanonicalNames', () => {
  it('derives valid destination names from destination directories and aliases', () => {
    const expectedDestinations = new Set([
      ...getDestinationDirectories(),
      ...Object.keys(DestHandlerMap),
      ...Object.keys(WhitelistOnlyDestinationAliases),
    ]);

    expect(Object.keys(destinationRegistry).sort()).toEqual([...expectedDestinations].sort());
  });

  it('preserves handler aliases accepted by dynamic loading boundaries', () => {
    expect(isValidDestination('salesforce_oauth')).toBe(true);
    expect(getDestinationHandlerName('salesforce_oauth_sandbox')).toBe('salesforce');
  });

  it('keeps whitelist-only aliases out of handler resolution', () => {
    expect(isValidDestination('__rudder_test__')).toBe(true);
    expect(isValidDestination('WEBHOOK_V2')).toBe(true);
    expect(getDestinationHandlerName('__rudder_test__')).toBe('__rudder_test__');
    expect(getDestinationHandlerName('WEBHOOK_V2')).toBe('webhook_v2');
  });

  it('rejects unknown destination names', () => {
    expect(isValidDestination('../salesforce')).toBe(false);
    expect(isValidDestination('not_a_destination')).toBe(false);
    expect(isValidDestination('constructor')).toBe(false);
    expect(isValidDestination('__proto__')).toBe(false);
  });
});

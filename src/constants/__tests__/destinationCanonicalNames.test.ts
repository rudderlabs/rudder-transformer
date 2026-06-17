import fs from 'fs';
import path from 'path';
import {
  DestHandlerMap,
  destinationRegistry,
  getBatchingFrameworkGaDestinations,
  getDestinationHandlerName,
  getRegulationDestinations,
  getRouterTransformDestinations,
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
  it('derives valid destination names from destination directories and handler aliases', () => {
    const expectedDestinations = new Set([
      ...getDestinationDirectories(),
      ...Object.keys(DestHandlerMap),
    ]);

    expect(Object.keys(destinationRegistry).sort()).toEqual([...expectedDestinations].sort());
  });

  it('preserves handler aliases accepted by dynamic loading boundaries', () => {
    expect(isValidDestination('salesforce_oauth')).toBe(true);
    expect(getDestinationHandlerName('salesforce_oauth_sandbox')).toBe('salesforce');
    expect(getDestinationHandlerName('__rudder_test__')).toBe('rudder_test');
    expect(getDestinationHandlerName('WEBHOOK_V2')).toBe('webhook');
  });

  it('rejects unknown destination names', () => {
    expect(isValidDestination('../salesforce')).toBe(false);
    expect(isValidDestination('not_a_destination')).toBe(false);
    expect(isValidDestination('constructor')).toBe(false);
    expect(isValidDestination('__proto__')).toBe(false);
  });

  it('derives legacy capability outputs from the consolidated registry', () => {
    expect(getRouterTransformDestinations()).toMatchObject({
      SALESFORCE_OAUTH: true,
      SALESFORCE_OAUTH_SANDBOX: true,
      CUSTOM_AUDIENCE: true,
    });
    expect(getRegulationDestinations()).toEqual(
      expect.arrayContaining(['BRAZE', 'AM', 'INTERCOM', 'CLEVERTAP']),
    );
    expect(getBatchingFrameworkGaDestinations()).toEqual({
      POSTHOG: true,
      CUSTOM_AUDIENCE: true,
      ITERABLE_AUDIENCE: true,
    });
  });
});

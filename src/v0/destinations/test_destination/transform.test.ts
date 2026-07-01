import { ConfigurationError } from '@rudderstack/integrations-lib';
import { process } from './transform';
import { TestDestinationProcessorRequest } from './type';

const message = {
  type: 'track',
  event: 'Test Event',
  userId: 'user-1',
  properties: { plan: 'pro' },
} as unknown as TestDestinationProcessorRequest['message'];

const buildEvent = (version: number | undefined): TestDestinationProcessorRequest =>
  ({
    message,
    destination: { version, Config: { restApiKey: 'v1-secret-key', dataCenter: 'eu' } },
  }) as unknown as TestDestinationProcessorRequest;

const v1Response = {
  version: '1',
  type: 'REST',
  method: 'POST',
  endpoint: 'https://eu.test-destination.invalid/v1/events',
  headers: { 'Content-Type': 'application/json', 'X-Api-Key': 'v1-secret-key' },
  params: {},
  body: { JSON: message, JSON_ARRAY: {}, XML: {}, FORM: {} },
  files: {},
};

describe('test_destination process — integration-major dispatch', () => {
  // getDestinationVersion normalizes the major (0 / undefined / non-numeric -> 1), so 0 / undefined / 1
  // all run the v1 path (< V2_MAJOR)
  const v1Cases: { name: string; version: number | undefined }[] = [
    { name: 'version 1', version: 1 },
    { name: 'version 0', version: 0 },
    { name: 'version undefined', version: undefined },
  ];
  it.each(v1Cases)('routes $name to the v1 branch', ({ version }) => {
    expect(process(buildEvent(version))).toEqual(v1Response);
  });

  it('throws on v2 since only v1 is implemented', () => {
    expect(() => process(buildEvent(2))).toThrow(ConfigurationError);
    expect(() => process(buildEvent(2))).toThrow('v2 transformation is not yet implemented');
  });
});

import { DestHandlerMap, WhitelistOnlyDestinationAliases } from '../destinationCanonicalNames';

describe('destinationCanonicalNames', () => {
  it('keeps handler-resolution aliases limited to existing production aliases', () => {
    expect(DestHandlerMap).toEqual({
      ga360: 'ga',
      salesforce_oauth: 'salesforce',
      salesforce_oauth_sandbox: 'salesforce',
    });
  });

  it('keeps whitelist-only aliases separate from handler resolution aliases', () => {
    expect(WhitelistOnlyDestinationAliases).toEqual({
      __rudder_test__: 'rudder_test',
      webhook_v2: 'webhook',
    });
  });
});

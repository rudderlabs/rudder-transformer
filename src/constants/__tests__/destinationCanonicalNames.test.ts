import { DestHandlerMap } from '../destinationCanonicalNames';

describe('destinationCanonicalNames', () => {
  it('keeps handler-resolution aliases limited to existing production aliases', () => {
    expect(DestHandlerMap).toEqual({
      ga360: 'ga',
      salesforce_oauth: 'salesforce',
      salesforce_oauth_sandbox: 'salesforce',
    });
  });
});

import { DestHandlerMap } from '../../constants/destinationCanonicalNames';
import { MiscService } from '../misc';

describe('Misc tests', () => {
  test('should return the right transform', async () => {
    const version = 'v0';

    Object.keys(DestHandlerMap).forEach((key) => {
      expect(MiscService.getDestHandler(key, version)).toEqual(
        require(`../../${version}/destinations/${DestHandlerMap[key]}/transform`),
      );
    });

    expect(MiscService.getDestHandler('am', version)).toEqual(
      require(`../../${version}/destinations/am/transform`),
    );

    expect(MiscService.getSourceHandler('shopify', version)).toEqual(
      require(`../../${version}/sources/shopify/transform`),
    );

    expect(MiscService.getDeletionHandler('intercom', version)).toEqual(
      require(`../../${version}/destinations/intercom/deleteUsers`),
    );
  });
});

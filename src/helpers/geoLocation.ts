import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import { FixMe } from '../util/types';

export default class GeoLocationHelper {
  public static getGeoLocationData(contextObj: Record<string, FixMe>): Record<string, FixMe> {
    const context = cloneDeep(contextObj || {});
    const isEnrichmentDoneOnContext = !isEmpty(context.geo);
    if (!isEnrichmentDoneOnContext) {
      // geo-location data was not sent
      return {};
    }
    const address = context?.address ? cloneDeep(context?.address) : {};
    const addressFieldMapping = {
      city: 'city',
      country: 'country',
      postalCode: 'postal',
      state: 'region',
    };

    const mappedAddress = Object.entries(addressFieldMapping).reduce(
      (agg, [identifyAddressKey, geoKey]) => {
        if (!address?.[identifyAddressKey] && context.geo?.[geoKey]) {
          return { [identifyAddressKey]: context.geo[geoKey], ...agg };
        }
        return agg;
      },
      {},
    );

    context.address = {
      ...context.address,
      ...mappedAddress,
    };
    return context;
  }
}

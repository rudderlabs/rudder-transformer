import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import set from 'set-value';
import { FixMe } from '../util/types';
import { getKeyAndValueFromMessage } from '../v0/util';
import * as GenericFieldMappingJson from '../v0/util/data/GenericFieldMapping.json';

export default class GeoLocationHelper {
  public static getGeoLocationData(message: Record<string, FixMe>): Record<string, FixMe> {
    const msg = cloneDeep(message || {});
    if (isEmpty(msg.context.geo)) {
      // geo-location data was not sent
      return {};
    }
    const { value: address, key: foundKey } =
      getKeyAndValueFromMessage(message, GenericFieldMappingJson.address) || {};
    let addressKey = foundKey;
    if (!foundKey) {
      [addressKey] = GenericFieldMappingJson.address;
    }
    const addressFieldMapping = {
      city: 'city',
      country: 'country',
      postalCode: 'postal',
      state: 'region',
    };

    const mappedAddress = Object.entries(addressFieldMapping).reduce(
      (agg, [identifyAddressKey, geoKey]) => {
        if (!address?.[identifyAddressKey] && msg?.context?.geo?.[geoKey]) {
          return { [identifyAddressKey]: msg.context.geo[geoKey], ...agg };
        }
        return agg;
      },
      {},
    );
    set(msg, addressKey, { ...address, ...mappedAddress });
    return msg;
  }
}

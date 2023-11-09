import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import set from 'set-value';
import { FixMe } from '../util/types';
import { getFirstMatchingKeyAndValue } from '../v0/util';
import * as GenericFieldMappingJson from '../v0/util/data/GenericFieldMapping.json';

export default class GeoLocationHelper {
  public static getAddressKeyAndValue(message: Record<string, FixMe>): {
    key: string;
    value: Record<string, FixMe>;
  } {
    const { value, key: foundKey } = getFirstMatchingKeyAndValue(
      message,
      GenericFieldMappingJson.address,
    );
    const { key: traitsKey } = getFirstMatchingKeyAndValue(message, GenericFieldMappingJson.traits);
    const addressKey =
      foundKey || (traitsKey ? `${traitsKey}.address` : GenericFieldMappingJson.address[0]);
    return { key: addressKey, value };
  }

  public static getMessageWithGeoLocationData(
    message: Record<string, FixMe>,
  ): Record<string, FixMe> {
    const msg = cloneDeep(message || {});
    if (isEmpty(msg?.context?.geo || {})) {
      // geo-location data was not sent
      return {};
    }
    const { value: address, key: addressKey } = GeoLocationHelper.getAddressKeyAndValue(message);
    const addressFieldToGeoFieldMap = {
      city: 'city',
      country: 'country',
      postalCode: 'postal',
      state: 'region',
    };

    const mappedAddress = Object.entries(addressFieldToGeoFieldMap).reduce(
      (agg, [addressFieldKey, geoFieldKey]) => {
        if (!address?.[addressFieldKey] && msg?.context?.geo?.[geoFieldKey]) {
          return { [addressFieldKey]: msg.context.geo[geoFieldKey], ...agg };
        }
        return agg;
      },
      {},
    );
    if (!isEmpty(address) || !isEmpty(mappedAddress)) {
      set(msg, addressKey, { ...address, ...mappedAddress });
    }
    return msg;
  }
}

import cloneDeep from 'lodash/cloneDeep';
import { ProcessorTransformationRequest, RouterTransformationRequestData } from '../types/index';
import { FixMe } from './types';

/* eslint-disable no-param-reassign */
const get = require('get-value');
const unset = require('unset-value');

export default class DynamicConfigParser {
  private static getDynamicConfigValue(
    event: ProcessorTransformationRequest | RouterTransformationRequestData,
    value: FixMe,
  ) {
    // this regex checks for pattern  "only spaces {{ path || defaultvalue }}  only spaces" .
    //  " {{message.traits.key  ||   \"email\" }} "
    //  " {{ message.traits.key || 1233 }} "
    const defFormat =
      /^\s*{{\s*(?<path>[A-Z_a-z](\w*\.[A-Z_a-z]\w*)+)+\s*\|\|\s*(?<defaultVal>.*)\s*}}\s*$/;
    const matResult = value.match(defFormat);
    if (matResult) {
      // Support "event.<obj1>.<key>" alias for "message.<obj1>.<key>"
      const fieldPath = matResult.groups.path.replace(/^event\.(.*)$/, 'message.$1');
      const pathVal = get(event, fieldPath);
      if (pathVal) {
        value = pathVal;
        unset(event, fieldPath);
      } else {
        value = matResult.groups.defaultVal.replace(/"/g, '').trim();
      }
      return value;
    }
    /** var format2 = /<some other regex>/;
        matResult = value.match(format2);
        if (matResult) {
          <more logic here>
          return value
        } */
    return value;
  }

  private static configureVal(
    value: FixMe,
    event: ProcessorTransformationRequest | RouterTransformationRequestData,
  ) {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((key, index) => {
          value[index] = this.configureVal(key, event);
        });
      } else if (typeof value === 'object') {
        Object.keys(value).forEach((obj) => {
          value[obj] = this.configureVal(value[obj], event);
        });
      } else if (typeof value === 'string') {
        value = this.getDynamicConfigValue(event, value);
      }
    }
    return value;
  }

  private static getDynamicConfig(
    event: ProcessorTransformationRequest | RouterTransformationRequestData,
  ) {
    const resultantEvent = cloneDeep(event);
    const { Config } = event.destination;
    resultantEvent.destination.Config = this.configureVal(Config, event);
    return resultantEvent;
  }

  public static process(
    events: ProcessorTransformationRequest[] | RouterTransformationRequestData[],
  ) {
    const eventRespArr = events.map(
      (e: ProcessorTransformationRequest | RouterTransformationRequestData) =>
        this.getDynamicConfig(e),
    );
    return eventRespArr;
  }
}

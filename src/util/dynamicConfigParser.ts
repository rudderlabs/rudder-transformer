import cloneDeep from 'lodash/cloneDeep';
import { ProcessorTransformationRequest, RouterTransformationRequestData, FixMe } from '../types';

/* eslint-disable no-param-reassign */
const get = require('get-value');

export class DynamicConfigParser {
  /**
   * Extracts dynamic configuration value from a string template
   *
   * @param event The event containing values to substitute in the template
   * @param value The template string to process
   * @returns The processed value
   */
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
        // Note: We're not using unset(event, fieldPath) anymore to avoid modifying the original event
        // This is a change from the original implementation
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

  /**
   * Recursively processes dynamic configuration values in an object, array, or string
   *
   * @param value The value to process (object, array, or string)
   * @param event The event containing values to substitute in templates
   * @returns The processed value
   */
  private static configureVal(
    value: FixMe,
    event: ProcessorTransformationRequest | RouterTransformationRequestData,
  ) {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((key, index) => {
          value[index] = DynamicConfigParser.configureVal(key, event);
        });
      } else if (typeof value === 'object') {
        Object.keys(value).forEach((obj) => {
          value[obj] = DynamicConfigParser.configureVal(value[obj], event);
        });
      } else if (typeof value === 'string') {
        value = DynamicConfigParser.getDynamicConfigValue(event, value);
      }
    }
    return value;
  }

  /**
   * Processes dynamic configuration in the event
   * Creates a shallow copy of the event and destination, but deep clones only the Config
   * This is more efficient than deep cloning the entire event
   *
   * @param event The event to process
   * @returns A new event object with processed dynamic configuration
   */
  private static getDynamicConfig(
    event: ProcessorTransformationRequest | RouterTransformationRequestData,
  ) {
    // Create a shallow copy of the event
    const resultantEvent = { ...event };

    // Create a shallow copy of the destination
    resultantEvent.destination = { ...event.destination };

    // Get the Config from the original event
    const { Config } = event.destination;

    // Deep clone only the Config
    const configCopy = cloneDeep(Config);

    // Process the Config and set it on the copied destination
    resultantEvent.destination.Config = DynamicConfigParser.configureVal(
      configCopy,
      resultantEvent,
    );

    return resultantEvent;
  }

  public static process(
    events: ProcessorTransformationRequest[] | RouterTransformationRequestData[],
  ) {
    const eventRespArr = events.map(
      (e: ProcessorTransformationRequest | RouterTransformationRequestData) => {
        // Only skip processing if hasDynamicConfig is explicitly false
        // For undefined (older server versions), process the event
        if (e.destination?.hasDynamicConfig === false) {
          return e;
        }
        return DynamicConfigParser.getDynamicConfig(e);
      },
    );
    return eventRespArr;
  }
}

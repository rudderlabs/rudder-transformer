import cloneDeep from 'lodash/cloneDeep';
import { ProcessorTransformationRequest, RouterTransformationRequestData, FixMe } from '../types';

/* eslint-disable no-param-reassign */
const get = require('get-value');
const unset = require('unset-value');

export class DynamicConfigParser {
  /**
   * Gets the current value of the USE_HAS_DYNAMIC_CONFIG_FLAG environment variable.
   * This is a getter function to allow for easier testing by reading the env var each time.
   *
   * @returns true if the hasDynamicConfig flag should be used, false for legacy behavior
   */
  private static get useHasDynamicConfigFlag(): boolean {
    return process.env.USE_HAS_DYNAMIC_CONFIG_FLAG !== 'false';
  }

  /**
   * Utility function to check if dynamic config processing should be skipped
   * based on the USE_HAS_DYNAMIC_CONFIG_FLAG environment variable and the hasDynamicConfig flag.
   *
   * @param destination - The destination object containing the hasDynamicConfig flag
   * @returns true if processing should be skipped, false otherwise
   */
  public static shouldSkipDynamicConfigProcessing(destination: any): boolean {
    // Only skip processing if we're using the hasDynamicConfig flag and it's explicitly false
    return this.useHasDynamicConfigFlag && destination?.hasDynamicConfig === false;
  }

  /**
   * Utility function to check if events should be grouped by destination config
   * based on the USE_HAS_DYNAMIC_CONFIG_FLAG environment variable and the hasDynamicConfig flag.
   *
   * @param destination - The destination object containing the hasDynamicConfig flag
   * @returns true if events should be grouped by destination config, false otherwise
   */
  public static shouldGroupByDestinationConfig(destination: any): boolean {
    if (!this.useHasDynamicConfigFlag) {
      // If not using the flag, always group by config (legacy behavior)
      return true;
    }

    // If using the flag, check the hasDynamicConfig value
    // If undefined (older server versions), process all events as if they might have dynamic config
    // Only skip grouping by config if the flag is explicitly false
    return destination?.hasDynamicConfig !== false;
  }

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
   * Creates a deep copy of the event to avoid modifying the original when using unset operations
   *
   * @param event The event to process
   * @returns A new event object with processed dynamic configuration
   */
  private static getDynamicConfig(
    event: ProcessorTransformationRequest | RouterTransformationRequestData,
  ) {
    // Create a deep copy of the event to avoid modifying the original
    // This is necessary because the unset operation modifies the event object
    const resultantEvent = cloneDeep(event);

    // Process the Config and set it on the copied destination
    resultantEvent.destination.Config = DynamicConfigParser.configureVal(
      resultantEvent.destination.Config,
      resultantEvent,
    );

    return resultantEvent;
  }

  public static process(
    events: ProcessorTransformationRequest[] | RouterTransformationRequestData[],
  ) {
    const eventRespArr = events.map(
      (e: ProcessorTransformationRequest | RouterTransformationRequestData) => {
        // Check if we should skip processing using the static method
        if (DynamicConfigParser.shouldSkipDynamicConfigProcessing(e.destination)) {
          return e;
        }
        // Process the event
        return DynamicConfigParser.getDynamicConfig(e);
      },
    );
    return eventRespArr;
  }
}

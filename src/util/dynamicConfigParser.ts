/* eslint-disable unicorn/no-for-loop */
import cloneDeep from 'lodash/cloneDeep';
import { ProcessorTransformationRequest, RouterTransformationRequestData } from '../types';
import { shouldSkipDynamicConfigProcessing } from './utils';

/* eslint-disable no-param-reassign */
const get = require('get-value');
const unset = require('unset-value');

export class DynamicConfigParser {
  // Pre-compiled regex patterns for better performance
  private static readonly QUOTE_REGEX = /"/g;

  private static readonly PATH_VALIDATION_REGEX = /^[A-Z_a-z]\w*(\.[A-Z_a-z]\w*)*$/;

  /**
   * Parses a dynamic config template string without regex to avoid backtracking issues
   * Expected format: {{ path || defaultValue }}
   *
   * @param value The template string to parse
   * @returns Parsed components or null if not a valid template
   */
  private static parseDynamicTemplate(value: string): { path: string; defaultVal: string } | null {
    const trimmed = value.trim();

    // Quick checks for template format
    if (!trimmed.startsWith('{{') || !trimmed.endsWith('}}')) {
      return null;
    }

    // Extract content between {{ and }}
    const content = trimmed.slice(2, -2).trim();

    // Find the || separator
    const separatorIndex = content.indexOf('||');
    if (separatorIndex === -1) {
      return null;
    }

    const path = content.slice(0, separatorIndex).trim();
    const defaultVal = content.slice(separatorIndex + 2).trim();

    // Validate path format (must start with letter/underscore, contain only word chars and dots)
    if (!path || !DynamicConfigParser.PATH_VALIDATION_REGEX.test(path)) {
      return null;
    }

    return { path, defaultVal };
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
    value: string,
  ): any {
    // Early exit: check if string contains template pattern
    if (!value.includes('{{')) {
      return value;
    }

    // Parse template using string operations instead of regex
    const parsed = DynamicConfigParser.parseDynamicTemplate(value);
    if (!parsed) {
      return value;
    }

    const { path, defaultVal } = parsed;

    // Optimized path replacement - avoid regex when not needed
    let fieldPath: string;
    if (path.startsWith('event.')) {
      // Manual replacement is faster than regex for simple cases
      fieldPath = `message.${path.slice(6)}`;
    } else {
      fieldPath = path;
    }

    const pathVal = get(event, fieldPath);
    if (pathVal !== undefined && pathVal !== null) {
      unset(event, fieldPath);
      return pathVal;
    }

    // Optimized default value processing
    return defaultVal.replace(DynamicConfigParser.QUOTE_REGEX, '').trim();
  }

  /**
   * Recursively processes dynamic configuration values in an object, array, or string
   * Optimized for performance with early exits and efficient iteration
   *
   * @param value The value to process (object, array, or string)
   * @param event The event containing values to substitute in templates
   * @returns The processed value
   */
  private static configureVal(
    value: Record<string, any> | any[] | string | number | boolean | null | undefined,
    event: ProcessorTransformationRequest | RouterTransformationRequestData,
  ): any {
    // Early exit for null/undefined values
    if (value == null) {
      return value;
    }

    // Handle different value types with optimized approaches
    if (typeof value === 'string') {
      // Direct string processing - most common case
      return DynamicConfigParser.getDynamicConfigValue(event, value);
    }

    if (Array.isArray(value)) {
      // Optimized array processing using traditional for loop for maximum performance
      const { length } = value;
      for (let i = 0; i < length; i += 1) {
        value[i] = DynamicConfigParser.configureVal(value[i], event);
      }
      return value;
    }

    if (typeof value === 'object') {
      // Optimized object processing - using traditional for loop for maximum performance
      const keys = Object.keys(value);
      const { length } = keys;
      for (let i = 0; i < length; i += 1) {
        const key = keys[i];
        value[key] = DynamicConfigParser.configureVal(value[key], event);
      }
      return value;
    }

    // For primitive types (number, boolean), return as-is
    return value;
  }

  /**
   * Processes dynamic configuration in the event
   * Creates a shallow copy of the event and deep copy of destination config to avoid modifying the original
   *
   * @param event The event to process
   * @returns A new event object with processed dynamic configuration
   */
  private static getDynamicConfig(
    event: ProcessorTransformationRequest | RouterTransformationRequestData,
  ) {
    // Create a shallow copy of the event and deep copy only the destination config
    // This is more performant than cloning the entire event since only the config gets mutated
    const resultantEvent = {
      ...event,
      destination: {
        ...event.destination,
        Config: cloneDeep(event.destination.Config),
      },
    };

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
    // Optimized batch processing using traditional for loop for maximum performance
    const { length } = events;
    const eventRespArr = new Array(length);

    for (let i = 0; i < length; i += 1) {
      const event = events[i];
      // Check if we should skip processing using the imported function
      if (shouldSkipDynamicConfigProcessing(event.destination)) {
        eventRespArr[i] = event;
      } else {
        // Process the event
        eventRespArr[i] = DynamicConfigParser.getDynamicConfig(event);
      }
    }

    return eventRespArr;
  }
}

/* eslint-disable no-restricted-syntax */
const path = require('path');
const fs = require('fs');

const mapping = JSON.parse(fs.readFileSync(path.resolve(__dirname, './mapping.json'), 'utf-8'));

/**
 * Converts a Slack timestamp to RudderStack's standard timestamp format - ISO 8601 date string.
 * The Slack timestamp is a string that represents unix timestamp (seconds since the Unix Epoch)
 * with fractional seconds for millisecond precision.
 * If the timestamp is not provided, the function returns the current date and time in ISO 8601 format.
 *
 * @param {string} [slackTs] - The Slack timestamp to be converted.
 * @returns {string} The ISO 8601 formatted date string corresponding to the given Slack timestamp
 * or the current date and time if no timestamp is provided.
 *
 * @example
 * // Convert a Slack timestamp to an ISO 8601 date string
 * const slackTimestamp = "1609459200.123000";
 * const isoDate = tsToISODate(slackTimestamp);
 * console.log(isoDate); // Output: "2021-01-01T00:00:00.123Z" (depending on your timezone)
 */
function tsToISODate(slackTs) {
  // Default to current date if slackTs is not provided
  if (!slackTs) return new Date().toISOString();

  // Convert slackTs string into unix timestamp in milliseconds
  const msTimestamp = parseFloat(slackTs) * 1000;
  // Convert to a date object
  if (Number.isNaN(msTimestamp)) {
    // If timestamp was not a valid float, the parser will return NaN, stop processing the timestamp further and return null
    return null;
  }
  const date = new Date(msTimestamp);

  // Return the date in ISO 8601 format
  return date.toISOString();
}

/**
 * Converts an event name from snake_case to a RudderStack format - space-separated string with each word capitalized.
 * @param {string} evtName - The event name in snake_case format to be normalized.
 * @returns {string} The normalized event name with spaces between words and each word capitalized.
 *
 * @example
 * // Convert a slack event name to RudderStack format
 * const eventName = "member_joined_channel";
 * const normalizedEventName = normalizeEventName(eventName);
 * console.log(normalizedEventName); // Output: "Member Joined Channel"
 */
function normalizeEventName(evtName) {
  try {
    return evtName
      .split('_')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');
  } catch (e) {
    return 'undefined';
  }
}

module.exports = { mapping, tsToISODate, normalizeEventName };

function convertToMicroseconds(input) {
  const timestamp = Date.parse(input);

  if (!Number.isNaN(timestamp)) {
    // If the input is a valid date string, timestamp will be a number
    if (input.includes('Z')) {
      // ISO 8601 date string with milliseconds
      return timestamp * 1000;
    }
    // to handle case of "2022-11-17T00:22:02.903+05:30" strings
    return timestamp.toString().length === 13 ? timestamp * 1000 : timestamp * 1000000;
  }

  if (/^\d+$/.test(input)) {
    // If the input is a numeric string (assume microseconds or milliseconds)
    if (input.length === 13) {
      // equal to 13 indicates milliseconds
      return parseInt(input, 10) * 1000;
    }

    if (input.length === 10) {
      // equal to 10 indicates seconds
      return parseInt(input, 10) * 1000000;
    }
    // Otherwise, assume microseconds
    return parseInt(input, 10);
  }
  return timestamp;
}

module.exports = {
  convertToMicroseconds,
};

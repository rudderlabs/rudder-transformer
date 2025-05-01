/**
 * User Deletion Handler for Dummy Destination
 * This file demonstrates how to implement user deletion functionality
 */

const { ConfigurationError } = require('@rudderstack/integrations-lib');
const { defaultRequestConfig, defaultPostRequestConfig } = require('../../util');
const { ENDPOINT } = require('./config');
const { JSON_MIME_TYPE } = require('../../util/constant');

/**
 * Process user deletion request
 * @param {Object} message - The user deletion message
 * @param {Object} destination - The destination configuration
 * @returns {Object} The response object
 */
function process(message, destination) {
  // Validate inputs
  if (!message || !message.userId) {
    throw new ConfigurationError('Missing userId in the request payload');
  }

  if (!destination || !destination.Config || !destination.Config.apiKey) {
    throw new ConfigurationError('Missing API key in destination config');
  }

  // Create the request configuration
  const response = defaultRequestConfig();

  // Set endpoint
  response.endpoint = `${ENDPOINT}/users/delete`;

  // Set headers
  response.headers = {
    'Content-Type': JSON_MIME_TYPE,
    'X-Api-Key': destination.Config.apiKey,
    'X-Dummy-Destination': 'true',
  };

  // Set method
  response.method = defaultPostRequestConfig.requestMethod;

  // Set body
  response.body.JSON = {
    userId: message.userId,
    anonymousId: message.anonymousId,
    regulation: message.regulation || 'GDPR',
    timestamp: message.timestamp || new Date().toISOString(),
  };

  // Set status code
  response.statusCode = 200;

  return response;
}

/**
 * Process batch user deletion requests
 * @param {Array} inputs - Array of user deletion requests
 * @returns {Array} Array of responses
 */
function processUserDeletionBatch(inputs) {
  if (!Array.isArray(inputs) || inputs.length === 0) {
    throw new ConfigurationError('Invalid or empty input array');
  }

  const responses = [];
  const { destination } = inputs[0];

  // Process each input
  inputs.forEach((input) => {
    try {
      const response = process(input.message, destination);
      responses.push({
        status: 200,
        response,
      });
    } catch (error) {
      responses.push({
        status: error.status || 400,
        error: error.message || 'Unknown error',
      });
    }
  });

  return responses;
}

module.exports = { process, processUserDeletionBatch };
